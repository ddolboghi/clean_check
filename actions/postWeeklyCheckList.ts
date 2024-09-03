"use server";

import { getKSTDateString } from "@/lib/dateTranslator";
import { supabaseClient } from "@/lib/getSupabaseClient";
import { Todo } from "@/utils/types";

export async function postWeeklyCheckList(todoList: Todo[], memberId: string) {
  const startDate = getKSTDateString();
  const today = new Date(startDate);
  today.setDate(today.getDate() + 6);
  const endDateYear = today.getFullYear();
  const endDateMonth = String(today.getMonth() + 1).padStart(2, "0");
  const endDateDay = String(today.getDate()).padStart(2, "0");
  const endDate = `${endDateYear}-${endDateMonth}-${endDateDay}`;

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
