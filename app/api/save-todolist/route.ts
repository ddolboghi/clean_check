import { getKSTDateString } from "@/lib/dateTranslator";
import { supabaseClient } from "@/lib/getSupabaseClient";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const startDate = getKSTDateString();
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const endYear = end.getFullYear();
  const endMonth = String(end.getMonth() + 1).padStart(2, "0");
  const endDay = String(end.getDate()).padStart(2, "0");
  const endDate = `${endYear}-${endMonth}-${endDay}`;

  try {
    const { todoList } = await req.json();

    const {
      data: { user },
      error: userError,
    } = await createClient().auth.getUser();

    if (!user) {
      throw userError;
    }

    const { data, error } = await supabaseClient.from("check_list").insert([
      {
        start_date: startDate,
        end_date: endDate,
        todo_list: todoList,
        member_id: user.id,
      },
    ]);

    if (error) throw error;

    console.log("[saveChecklist] Data inserted successfully: ", data);
    return NextResponse.json(true);
  } catch (error) {
    console.error("[saveChecklist] Error inserting data:", error);
    return NextResponse.json(false);
  }
}
