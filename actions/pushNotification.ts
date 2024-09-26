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

    console.log("[saveFCMToken] Saving fcm token success: ", data);
  } catch (error) {
    console.error("[saveFCMToken] Error: ", error);
  }
};

export const saveScheduledNotification = async (
  notificationTime: string,
  title: string,
  body: string,
  repeatOption: string | null,
  pathname: string,
  otherId: number
) => {
  try {
    const {
      data: { user },
    } = await createClient().auth.getUser();

    if (!user) throw new Error("Not allowed access.");

    const memberId = user.id;
    const isStorage = pathname === "/storage" ? true : false;

    const scheduledNotification = await getScheduledNotificationByOtherId(
      otherId,
      isStorage
    );

    if (scheduledNotification) {
      const { error } = await supabaseClient
        .from("scheduled_notifications")
        .update({
          notification_time: notificationTime,
          body: body,
          is_sent: false,
        })
        .eq("id", scheduledNotification.id)
        .eq("member_id", memberId);

      if (error) throw error;
    } else {
      const { error } = await supabaseClient
        .from("scheduled_notifications")
        .insert([
          {
            member_id: memberId,
            notification_time: notificationTime,
            title: title,
            body: body,
            repeat_option: repeatOption,
            path: pathname,
            other_id: otherId,
          },
        ]);

      if (error) throw error;
    }

    console.log("[saveScheduledNotification] Success");
    return true;
  } catch (e) {
    console.error("[saveScheduledNotification] Error: ", e);
    return false;
  }
};

export const getScheduledNotificationByOtherId = async (
  otherId: number,
  isStorage: boolean
) => {
  try {
    const {
      data: { user },
    } = await createClient().auth.getUser();

    if (!user) throw new Error("Not allowed access.");

    const memberId = user.id;
    const path = isStorage ? "/storage" : "/main";
    const { data, error } = await supabaseClient
      .from("scheduled_notifications")
      .select("*")
      .eq("member_id", memberId)
      .eq("other_id", otherId)
      .eq("path", path)
      .single<ScheduledNotification>();

    if (error) throw error;

    console.log("[getScheduledNotificationByOtherId] Success: ", data);
    return data;
  } catch (e) {
    console.error("[getScheduledNotificationByOtherId] Error: ", e);
    return null;
  }
};
