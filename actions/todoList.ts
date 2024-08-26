"use server";

import { getNumberOfDay } from "@/lib/dateTranslator";
import { supabaseClient } from "@/lib/getSupabaseClient";
import { Completion, Todo } from "@/utils/types";

interface SupabaseCheckList {
  id: number;
  created_at: string;
  member_id: string;
  todo_list: Todo[];
  completions: Completion[];
}

export async function getTodoListByDay(day: string, memberId: string) {
  const numberOfDay = getNumberOfDay(day);
  try {
    // 가장 최근의 created_at을 가진 레코드 가져오기
    const { data: recentData, error: recentError } = await supabaseClient
      .from("check_list")
      .select("*")
      .eq("member_id", memberId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single<SupabaseCheckList>();

    if (recentError) throw recentError;

    if (!recentData || !recentData.todo_list) {
      return null;
    }

    const checkListId: number = recentData.id;

    const filteredTodos: Todo[] = recentData.todo_list.filter((todo) =>
      todo.days.includes(numberOfDay)
    );

    const filteredCompletions: Completion[] = recentData.completions.filter(
      (completion) =>
        filteredTodos.some((todo) => todo.todoId === completion.todoId)
    );

    return { checkListId, filteredTodos, filteredCompletions };
  } catch (error) {
    console.error("Error getTodoListByDay:", error);
    return null;
  }
}

export async function updateCompletionOfTodo(
  checkListId: number,
  updatedCompletions: Completion[]
) {
  console.log(updatedCompletions);
  try {
    const { data, error } = await supabaseClient
      .from("check_list")
      .update({ completions: updatedCompletions })
      .match({ id: checkListId });

    if (error) throw error;

    console.log("Data updated successfully:", data);
    return data;
  } catch (error) {
    console.error("Error updateCompletionOfTodo:", error);
    return null;
  }
}
