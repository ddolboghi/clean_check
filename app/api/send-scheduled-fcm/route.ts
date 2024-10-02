import { createClient } from "@/utils/supabase/server";
import { FCMToken, ScheduledNotification } from "@/utils/types";
import admin, { ServiceAccount } from "firebase-admin";
import { Message } from "firebase-admin/lib/messaging/messaging-api";
import { NextRequest, NextResponse } from "next/server";
import schedule from "node-schedule";

export const maxDuration = 30;

const jobs: { [key: string]: schedule.Job } = {};

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
  const supabase = createClient();

  const { data: fcmData, error: fcmError } = await supabase
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
      await supabase
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

const scheduleNotifications = async () => {
  const supabase = createClient();

  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  const { data: notifications, error } = await supabase
    .from("scheduled_notifications")
    .select("*")
    .eq("is_deleted", false)
    .gte("notification_time", fiveMinutesAgo.toISOString())
    .lte("notification_time", oneHourLater.toISOString())
    .returns<ScheduledNotification[]>();

  if (error || !notifications) {
    throw error || new Error("No notifications found");
  }

  for (const notification of notifications) {
    if (jobs[notification.id]) {
      continue;
    }

    const notificationTime = new Date(notification.notification_time);
    console.log(notificationTime);
    const job = schedule.scheduleJob(notificationTime, async () => {
      console.log("before sendNotification");
      await sendNotification(notification);
    });

    jobs[notification.id] = job;
  }
  return Object.keys(jobs).length;
};

export async function POST(req: NextRequest) {
  try {
    if (
      req.headers.get("Authorization") !==
      `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}`
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const scheduledCount = await scheduleNotifications();

    return NextResponse.json(
      {
        message: "Notifications scheduled successfully",
        scheduledCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An unexpected error occurred", error: error },
      { status: 500 }
    );
  }
}
