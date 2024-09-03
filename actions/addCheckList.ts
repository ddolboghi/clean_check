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
    const { data, error } = await supabaseClient.rpc("get_recent_check_list");

    if (error) throw error;

    if (!data) {
      return null;
    }

    const checkLists: SupabaseCheckList[] = data;

    const todosMap: { [key: string]: Todo[] } = {};
    checkLists.forEach((checkList) => {
      todosMap[checkList.member_id] = checkList.todo_list;
    });

    console.log(
      "[getAllRecentTodoListEachMember] Get all recent check_list each member success"
    );
    return todosMap;
  } catch (error) {
    console.error("[getAllRecentTodoListEachMember] Error:", error);
    return null;
  }
}
