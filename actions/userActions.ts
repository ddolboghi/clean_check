"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";
import { SupabaseCheckList } from "./todoList";
import { getIsBeforeToday } from "@/lib/dateTranslator";
import { SupabaseProfile } from "./profile";

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
    if (!recentCheckListData)
      throw new Error("[getHaveCheckList] Not found check_list data.");

    const isBeforeToday = getIsBeforeToday(recentCheckListData.end_date);
    if (!isBeforeToday) {
      console.log("[getHaveCheckList] The week has not yet passed.");
      return true;
    }

    console.log("[getHaveCheckList] The week has passed.");
    return false;
  } catch (error) {
    console.error("[getHaveCheckList] Error: ", error);
    return null;
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
