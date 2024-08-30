"use server";

import { getKSTDateString } from "@/lib/dateTranslator";
import { supabaseClient } from "@/lib/getSupabaseClient";
import { Todo } from "@/utils/types";

export async function postWeeklyCheckList(todoList: Todo[], memberId: string) {
  const startDate = getKSTDateString();
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const endYear = end.getFullYear();
  const endMonth = String(end.getMonth() + 1).padStart(2, "0");
  const endDay = String(end.getDate()).padStart(2, "0");
  const endDate = `${endYear}-${endMonth}-${endDay}`;

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
