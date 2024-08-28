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
      Object.keys(todo.days).includes(date.toString())
    );

    const startDate = recentData.start_date;
    const endDate = recentData.end_date;

    console.log("[getTodoListByDate] Get todo_list by date success");
    return { checkListId, filteredTodos, startDate, endDate };
  } catch (error) {
    console.error("[getTodoListByDate] Error getTodoListByDay:", error);
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

    console.log("[updateDaysOfTodo] Data updated successfully:", data);
    return data;
  } catch (error) {
    console.error("[updateDaysOfTodo] Error updatedDaysOfTodo:", error);
    return null;
  }
}

export async function updateTodoDaysToDelay(
  checkListId: number,
  memberId: string,
  todayKey: string
) {
  try {
    const today = new Date(todayKey);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split("T")[0];

    const { data: selectData, error: selectError } = await supabaseClient
      .from("check_list")
      .select("*")
      .eq("member_id", memberId)
      .eq("id", checkListId)
      .single<SupabaseCheckList>();

    if (selectError) throw selectError;

    console.log(
      "[updateTodoDaysToDelay] Get check_list by checkListId and memberId success"
    );
    const newTodoList = selectData.todo_list.map((todo) => {
      const newTodo = { ...todo, days: { ...todo.days } };
      const days = newTodo.days;

      if (days.hasOwnProperty(yesterdayKey) && days[yesterdayKey] === false) {
        if (days.hasOwnProperty(todayKey)) {
          delete days[yesterdayKey];
        } else {
          days[todayKey] = days[yesterdayKey];
          delete days[yesterdayKey];
        }
      }
      return newTodo;
    });

    const { data: updateData, error: updateError } = await supabaseClient
      .from("check_list")
      .update({ todo_list: newTodoList })
      .eq("member_id", memberId)
      .eq("id", checkListId);

    if (updateError) throw updateError;

    console.log("[updateTodoDaysToDelay]: Update delayed todo success");
    return updateData;
  } catch (error) {
    console.error(
      "[updateTodoDaysToDelay]: Error in updateTodoDaysToDelay:",
      error
    );
    return null;
  }
}
