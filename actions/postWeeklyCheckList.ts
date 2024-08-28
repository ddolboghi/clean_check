"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";
import { Todo } from "@/utils/types";

export async function postWeeklyCheckList(todoList: Todo[], memberId: string) {
  const today = new Date();
  const startDate = today.toISOString().split("T")[0];
  today.setDate(today.getDate() + 6);
  const endDate = today.toISOString().split("T")[0]; // 'YYYY-MM-DD' 형식으로 변환

  try {
    const { data, error } = await supabaseClient.from("check_list").insert([
      {
        start_date: startDate,
        end_date: endDate,
        todo_list: todoList,
        member_id: memberId,
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
