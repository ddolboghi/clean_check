"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";
import { Todo } from "@/utils/types";

interface SupabaseCheckList {
  id: number;
  created_at: string;
  start_date: Date;
  end_date: Date;
  member_id: string;
  todo_list: Todo[];
}

export async function getTodoListByDate(date: Date | string, memberId: string) {
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
    console.log("넘겨받은 date:", date.toString());

    const filteredTodos: Todo[] = recentData.todo_list.filter((todo) =>
      Object.keys(todo.days).includes(date.toString())
    );

    const startDate = recentData.start_date;
    const endDate = recentData.end_date;

    return { checkListId, filteredTodos, startDate, endDate };
  } catch (error) {
    console.error("Error getTodoListByDay:", error);
    return null;
  }
}

export async function updateDaysOfTodo(
  checkListId: number,
  updatedTodo: Todo[]
) {
  try {
    const { data, error } = await supabaseClient.rpc("update_todo_days", {
      p_check_list_id: checkListId,
      p_updated_todos: updatedTodo,
    });

    if (error) throw error;

    console.log("Data updated successfully:", data);
    return data;
  } catch (error) {
    console.error("Error updatedDaysOfTodo:", error);
    return null;
  }
}

export async function updateCheckListToDelay(
  checkListId: number,
  memberId: string
) {
  try {
    const { data: recentData, error: recentError } = await supabaseClient
      .from("check_list")
      .select("*")
      .eq("member_id", memberId)
      .eq("id", checkListId)
      .single<SupabaseCheckList>();

    if (recentError) throw recentError;

    if (!recentData) {
      return null;
    }

    const startDate = recentData.start_date;
    const startDay = new Date(startDate).getDay();

    const todoList = recentData.todo_list;

    const todayOfWeek = new Date().getDay();
    const yesterdayOfWeek = todayOfWeek - 1 < 0 ? 6 : todayOfWeek - 1;
    console.log("yesterdayOfWeek:", yesterdayOfWeek);
  } catch (error) {
    console.error("Error getTodoListByDay:", error);
    return null;
  }
}
