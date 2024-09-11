"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";
import { SupabaseCheckList } from "./todoList";
import { getIsBeforeToday } from "@/lib/dateTranslator";
import { SupabaseProfile } from "./profile";
import {
  initialMessageForCreating,
  initialMessageForUpdating,
} from "@/data/chat";

export async function getHaveCheckList(memberId: string) {
  try {
    const { data: recentCheckListData, error: recentCheckListError } =
      await supabaseClient
        .from("check_list")
        .select("*")
        .eq("member_id", memberId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single<SupabaseCheckList>();

    if (recentCheckListError) throw recentCheckListError;

    //체크리스트가 없으면 새로 생성
    if (!recentCheckListData) {
      console.log("[getHaveCheckList] Not found check_list data.");
      return {
        haveCheckList: false,
        initialMessage: initialMessageForCreating,
      };
    }

    //마지막 날이 지났으면 새로 생성
    const isBeforeToday = getIsBeforeToday(recentCheckListData.end_date);
    if (isBeforeToday) {
      console.log("[getHaveCheckList] The week has passed.");
      return {
        haveCheckList: false,
        initialMessage: initialMessageForCreating,
      };
    }

    console.log("[getHaveCheckList] The week has not yet passed.");
    return { haveCheckList: true, initialMessage: initialMessageForUpdating };
  } catch (error) {
    console.error("[getHaveCheckList] Error: ", error);
    return { haveCheckList: false, initialMessage: initialMessageForCreating };
  }
}

interface SupabaseUserAction {
  id: number;
  created_at: string;
  member_id: string;
  recent_done_times: Date[];
}

export async function updateTodayDone(memberId: string) {
  try {
    const { data: profilesData, error: profilesError } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", memberId)
      .single<SupabaseProfile>();

    if (profilesError || !profilesData) throw profilesError;

    const { data: userActionData, error: userActionError } =
      await supabaseClient
        .from("user_action")
        .select("*")
        .eq("member_id", memberId)
        .single<SupabaseUserAction>();

    const utcDate = new Date();
    const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);

    if (!userActionData || userActionError) {
      const { data: insertData, error: insertError } = await supabaseClient
        .from("user_action")
        .insert([
          {
            member_id: memberId,
            recent_done_times: [kstDate],
            member_name: profilesData.full_name,
          },
        ]);

      if (insertError) throw insertError;
    }

    if (userActionData) {
      const { data: updateData, error: updateError } = await supabaseClient
        .from("user_action")
        .update({
          recent_done_times: [...userActionData.recent_done_times, kstDate],
        })
        .eq("member_id", memberId);
      if (updateError) throw updateError;
    }

    console.log("[updateTodayDone] Update user_action success");
    return userActionData;
  } catch (error) {
    console.error("[updateTodayDone] Error update user_action:", error);
    return null;
  }
}

export async function deleteFCMToken(memberId: string, userAgent: string) {
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
}

export async function saveFCMToken(
  notificationAllow: boolean,
  memberId: string,
  userAgent: string,
  token: string
) {
  if (notificationAllow) {
    deleteFCMToken(memberId, userAgent);
  }

  try {
    const { data, error } = await supabaseClient.from("fcm_tokens").insert([
      {
        member_id: memberId,
        token: token,
        user_agent: userAgent,
      },
    ]);

    if (error) throw new Error("Saving token faild.");

    console.log("[saveFCMToken] Success: ", data);
  } catch (error) {
    console.error("[saveFCMToken] Error: ", error);
  }
}

type FCMToken = {
  member_Id: string;
  token: string;
  user_agent: string;
};

export async function getAllowedFCMDevice(memberId: string, userAgent: string) {
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
    return { devices: devices };
  } catch (error) {
    console.error("[getAllowedFCMDevice] Error: ", error);
    return null;
  }
}
