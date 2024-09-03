"use server";

import { getStartDateAndEndDate } from "@/lib/dateTranslator";
import { supabaseClient } from "@/lib/getSupabaseClient";
import { Todo } from "@/utils/types";
import { SupabaseCheckList } from "./todoList";

export async function postWeeklyCheckList(todoList: Todo[], memberId: string) {
  const { startDate, endDate } = getStartDateAndEndDate();

  try {
    const { data, error } = await supabaseClient.from("check_list").insert([
      {
        start_date: startDate,
        end_date: endDate,
        todo_list: todoList,
        member_id: memberId,
        delayed_date: startDate,
      },
    ]);

    if (error) throw error;

    console.log("Data inserted successfully:", data);
    return data;
  } catch (error) {
    console.error("Error inserting data:", error);
    throw error;
  }
}

export async function getAllRecentTodoListEachMember() {
  try {
    const { data: recentData, error: recentError } = await supabaseClient.rpc(
      "get_recent_check_list"
    );

    if (recentError) throw recentError;

    if (!recentData) {
      return null;
    }

    console.log(
      "[getAllRecentTodoListEachMember] Get all recent check_list each member success"
    );
    return recentData;
  } catch (error) {
    console.error("[getAllRecentTodoListEachMember] Error:", error);
    return null;
  }
}
