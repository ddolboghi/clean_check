"use server";

import { FormattedTodo } from "@/components/AddCheckList";
import { supabaseClient } from "@/lib/getSupabaseClient";

type Checks = { [key: number]: boolean };

type CheckList = {
  todoId: number;
  checks: Checks;
};

function createCheckList(todoList: FormattedTodo[]): CheckList[] {
  return todoList.map((todo) => {
    const checks: Checks = {};
    todo.days.forEach((day) => {
      checks[day] = false;
    });

    return {
      todoId: todo.todoId,
      checks: checks,
    };
  });
}

export async function postWeeklyCheckList(
  todoList: FormattedTodo[],
  memberId: string
) {
  const today = new Date();
  const startDate = today.toISOString().split("T")[0];
  today.setDate(today.getDate() + 7);
  const endDate = today.toISOString().split("T")[0]; // 'YYYY-MM-DD' 형식으로 변환

  const checkList = createCheckList(todoList);

  try {
    const { data, error } = await supabaseClient.from("check_list").insert([
      {
        start_date: startDate,
        end_date: endDate,
        todo_list: todoList,
        check_list: checkList,
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
