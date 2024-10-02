"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";
import { createClient } from "@/utils/supabase/server";
import { FCMToken, ScheduledNotification } from "@/utils/types";
import admin, { ServiceAccount } from "firebase-admin";
import { Message } from "firebase-admin/lib/messaging/messaging-api";
import schedule from "node-schedule";

export const deleteFCMToken = async (memberId: string, userAgent: string) => {
  try {
    console.log(userAgent);
    const { data, error } = await supabaseClient
      .from("fcm_tokens")
      .delete()
      .match({
        member_id: memberId,
        user_agent: userAgent,
      });

    if (error) throw error;
    console.log("[deleteFCMToken] Success");
    return true;
  } catch (error) {
    console.error("[deleteFCMToken] Error:", error);
    return false;
  }
};

export const getAllowedFCMDevice = async (
  memberId: string,
  userAgent: string
) => {
  try {
    const { data, error } = await supabaseClient
      .from("fcm_tokens")
      .select("*")
      .eq("member_id", memberId)
      .eq("user_agent", userAgent)
      .returns<FCMToken[]>();

    if (error) throw error;

    console.log("[getAllowedFCMDevice] Success");
    let devices: string[] = [];
    if (data.length > 0) {
      devices = data.map((fcmToken) => fcmToken.user_agent);
    }
    return devices;
  } catch (error) {
    console.error("[getAllowedFCMDevice] Error: ", error);
    return [];
  }
};

export const saveFCMToken = async (userAgent: string, token: string) => {
  try {
    const {
      data: { user },
    } = await createClient().auth.getUser();

    if (!user) throw new Error("Not allowed access.");

    const memberId = user.id;

    await deleteFCMToken(memberId, userAgent);
    const { data, error } = await supabaseClient.from("fcm_tokens").insert([
      {
        member_id: memberId,
        token: token,
        user_agent: userAgent,
      },
    ]);

    if (error) throw new Error("Saving token faild.");
  } catch (error) {
    console.error("[saveFCMToken] Error: ", error);
  }
};

export const saveScheduledNotification = async (
  notificationTimes: Date[],
  title: string,
  body: string,
  pathname: string,
  otherId: number
) => {
  try {
    const {
      data: { user },
    } = await createClient().auth.getUser();

    if (!user) throw new Error("Not allowed access.");

    const memberId = user.id;

    const { error: updateError } = await supabaseClient
      .from("scheduled_notifications")
      .update({
        is_deleted: true,
      })
      .eq("path", pathname)
      .eq("other_id", otherId)
      .eq("member_id", memberId);

    if (updateError) throw updateError;

    const insertData = notificationTimes.map((notificationTime) => {
      return {
        member_id: memberId,
        notification_time: notificationTime,
        title: title,
        body: body,
        path: pathname,
        other_id: otherId,
      };
    });

    const { error: insertError } = await supabaseClient
      .from("scheduled_notifications")
      .insert(insertData);

    if (insertError) throw insertError;
    return true;
  } catch (e) {
    console.error("[saveScheduledNotification] Error: ", e);
    return false;
  }
};

export const getScheduledNotificationByOtherId = async (
  otherId: number,
  pathname: string
) => {
  try {
    const {
      data: { user },
    } = await createClient().auth.getUser();

    if (!user) throw new Error("Not allowed access.");

    const memberId = user.id;
    const { data, error } = await supabaseClient
      .from("scheduled_notifications")
      .select("notification_time")
      .eq("member_id", memberId)
      .eq("other_id", otherId)
      .eq("path", pathname)
      .eq("is_deleted", false)
      .returns<ScheduledNotification[]>();

    if (error || !data) throw error;
    return data;
  } catch (e) {
    console.error("[getScheduledNotificationByOtherId] Error: ", e);
    return null;
  }
};

const initializeFirebaseAdmin = () => {
  if (!admin.apps.length) {
    const serviceAccount: ServiceAccount = {
      projectId: process.env.NEXT_PUBLIC_FCM_PROJECT_ID,
      privateKey: process.env.NEXT_PUBLIC_FCM_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n"
      ),
      clientEmail: process.env.NEXT_PUBLIC_FCM_CLIENT_EMAIL,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  return admin;
};

const sendNotification = async (notification: ScheduledNotification) => {
  const firebaseAdmin = initializeFirebaseAdmin();

  const { data: fcmData, error: fcmError } = await supabaseClient
    .from("fcm_tokens")
    .select("token")
    .eq("member_id", notification.member_id)
    .returns<FCMToken[]>();

  if (fcmError || !fcmData) {
    console.error(
      `Failed to fetch token for user ${notification.member_id}:`,
      fcmError
    );
    return { success: false, notificationId: notification.id };
  }

  for (const fcm of fcmData) {
    const message: Message = {
      data: {
        title: notification.title,
        body: notification.body,
        path: notification.path,
      },
      token: fcm.token,
    };

    try {
      await firebaseAdmin.messaging().send(message);
      const notificationTime = new Date(notification.notification_time);
      const afterOneWeek = new Date(
        notificationTime.getTime() + 7 * 24 * 60 * 60 * 1000
      );
      await supabaseClient
        .from("scheduled_notifications")
        .update({ notification_time: afterOneWeek })
        .eq("id", notification.id);
      return { success: true, notificationId: notification.id };
    } catch (error) {
      console.error(`Failed to send notification ${notification.id}:`, error);
      return { success: false, notificationId: notification.id };
    }
  }
};

const jobs: { [key: string]: schedule.Job } = {};

export const scheduleNotifications = async () => {
  const now = new Date();
  const after = new Date(now.getTime() + 20 * 1000);

  try {
    const { data: notifications, error } = await supabaseClient
      .from("scheduled_notifications")
      .select("*")
      .eq("is_deleted", false)
      .gte("notification_time", new Date().toISOString())
      .lte("notification_time", after.toISOString())
      .returns<ScheduledNotification[]>();

    if (error || !notifications) {
      throw error || new Error("No notifications found");
    }

    let responses: (
      | { success: boolean; notificationId: string }
      | undefined
    )[] = [];

    const jobPromises: Promise<void>[] = [];

    for (const notification of notifications) {
      if (jobs[notification.id]) {
        continue;
      }

      const notificationTime = new Date(notification.notification_time);
      const jobPromise = new Promise<void>((resolve) => {
        const job = schedule.scheduleJob(notificationTime, async () => {
          const response = await sendNotification(notification);
          responses.push(response);
          resolve();
        });

        jobs[notification.id] = job;
      });

      jobPromises.push(jobPromise);
    }

    await Promise.all(jobPromises);

    return { registeredJobs: Object.keys(jobs).length, responses: responses };
  } catch (e) {
    return { registeredJobs: Object.keys(jobs).length, responses: null };
  }
};
