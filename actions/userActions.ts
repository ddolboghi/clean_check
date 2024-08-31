"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";
import { createClient } from "@/utils/supabase/server";
import { SupabaseCheckList } from "./todoList";
import { getIsBeforeToday } from "@/lib/dateTranslator";

type UserAction = {
  memberId: string;
  haveCheckList: boolean;
  todayDone: boolean;
};

export async function getHaveCheckList() {
  try {
    const {
      data: { user },
      error: userError,
    } = await createClient().auth.getUser();

    if (!user) {
      throw userError;
    }
    const memberId = user.id;

    const { data: recentCheckListData, error: recentCheckListError } =
      await supabaseClient
        .from("check_list")
        .select("end_date")
        .eq("member_id", memberId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single<SupabaseCheckList>();

    if (recentCheckListError) throw recentCheckListError;
    if (!recentCheckListData) throw new Error("Not found check_list data.");

    const isBeforeToday = getIsBeforeToday(recentCheckListData.end_date);
    if (!isBeforeToday) {
      console.log("The week has not yet passed.");
      return true;
    }

    console.log("The week has passed.");
    return false;
  } catch (error) {
    console.error("Error inserting data:", error);
    return null;
  }
}
