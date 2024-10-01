"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";
import { createClient } from "@/utils/supabase/server";
import { FCMToken, ScheduledNotification } from "@/utils/types";

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
