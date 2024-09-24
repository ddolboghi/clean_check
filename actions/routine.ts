"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";
import { MainRoutine } from "@/utils/types";

export const addMainRoutine = async (content: string, memberId: string) => {
  try {
    const { data, error } = await supabaseClient.from("routine").insert([
      {
        member_id: memberId,
        content: content,
        is_main: true,
        is_deleted: false,
      },
    ]);

    if (error) throw error;
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const getMainRoutines = async (memberId: string) => {
  try {
    const { data, error } = await supabaseClient
      .from("routine")
      .select("*")
      .eq("member_id", memberId)
      .eq("is_main", true)
      .eq("is_deleted", false)
      .returns<MainRoutine[]>();

    if (error) throw error;

    console.log(data);
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
};
