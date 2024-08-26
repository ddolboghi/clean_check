"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";
import { createClient } from "@/utils/supabase/server";

type CheckItem = {
  id: number;
  description: string;
};

type DailyCompletions = {
  [key: number]: {
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
  };
};

export async function postWeeklyCheckList() {
  const checkItems: CheckItem[] = [
    { id: 1, description: "test1" },
    { id: 2, description: "test2" },
    { id: 3, description: "test3" },
  ];
  const dailyCompletions: DailyCompletions = {};

  checkItems.forEach((item) => {
    dailyCompletions[item.id] = {
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
    };
  });

  const today = new Date();
  const startDate = today.toISOString().split("T")[0];
  today.setDate(today.getDate() + 7);
  const endDate = today.toISOString().split("T")[0]; // 'YYYY-MM-DD' 형식으로 변환

  const {
    data: { user },
  } = await createClient().auth.getUser();

  try {
    const { data, error } = await supabaseClient.from("check_list").insert([
      {
        start_date: startDate,
        end_date: endDate,
        check_items: checkItems,
        daily_completions: dailyCompletions,
        member_id: user && user.id,
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
