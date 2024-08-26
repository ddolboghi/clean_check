"use client";

import { useState } from "react";
import { postWeeklyCheckList } from "@/actions/postWeeklyCheckList";
import { Todo } from "@/utils/types";

const TodoItem = ({
  todo,
  onTodoChange,
  onDurationChange,
  onDelete,
}: {
  todo: Todo;
  onTodoChange: (todoId: number, value: string) => void;
  onDurationChange: (todoId: number, days: number[]) => void;
  onDelete: (todoId: number) => void;
}) => {
  const allDays = ["일", "월", "화", "수", "목", "금", "토"];
  const isEveryDay = todo.days.length === 7;

  const handleDayChange = (day: string) => {
    const dayIndex = allDays.indexOf(day);
    let newDays: number[];
    if (day === "매일") {
      newDays = isEveryDay ? [] : [0, 1, 2, 3, 4, 5, 6];
    } else {
      newDays = todo.days.includes(dayIndex)
        ? todo.days.filter((d) => d !== dayIndex)
        : [...todo.days, dayIndex].sort((a, b) => a - b);
    }
    onDurationChange(todo.todoId, newDays);
  };

  return (
    <section>
      <label className="block font-semibold">할 일</label>
      <input
        className="border border-gray-300 rounded p-2 w-full"
        value={todo.todo}
        onChange={(e) => onTodoChange(todo.todoId, e.target.value)}
      />
      <label className="block font-semibold mt-4">주기</label>
      <div className="flex flex-wrap">
        {["매일", ...allDays].map((day) => (
          <div key={day} className="flex items-center mr-4">
            <input
              type="checkbox"
              checked={
                day === "매일"
                  ? isEveryDay
                  : todo.days.includes(allDays.indexOf(day))
              }
              onChange={() => handleDayChange(day)}
              className="mr-2"
            />
            <label>{day}</label>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onDelete(todo.todoId)}
        className="mt-4 bg-red-500 text-white rounded p-2 hover:bg-red-600"
      >
        todo 삭제
      </button>
    </section>
  );
};

export default function AddCheckList() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([
    { topic: "", todoId: 1, todo: "", days: [] },
  ]);
  const [memberId, setMemberId] = useState<string>("");

  const handleButtonClick = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await postWeeklyCheckList(todos, memberId);
      setSuccess("체크리스트가 성공적으로 생성되었습니다.");
    } catch {
      setError("체크리스트 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleTopicChange = (todoId: number, value: string) => {
    setTodos((todos) =>
      todos.map((todo) =>
        todo.todoId === todoId ? { ...todo, topic: value } : todo
      )
    );
  };

  const handleTodoChange = (todoId: number, value: string) => {
    setTodos((todos) =>
      todos.map((todo) =>
        todo.todoId === todoId ? { ...todo, todo: value } : todo
      )
    );
  };

  const handleDurationChange = (todoId: number, days: number[]) => {
    setTodos((todos) =>
      todos.map((todo) => (todo.todoId === todoId ? { ...todo, days } : todo))
    );
  };

  const deleteTodo = (todoId: number) => {
    setTodos((todos) => {
      const updatedTodos = todos.filter((todo) => todo.todoId !== todoId);
      return updatedTodos.map((todo, index) => ({
        ...todo,
        todoId: index + 1,
      }));
    });
  };

  const addTodo = () => {
    setTodos((todos) => {
      const newTodoId = todos.length + 1;
      return [
        ...todos,
        {
          topic: todos[todos.length - 1]?.topic || "",
          todoId: newTodoId,
          todo: "",
          days: [],
        },
      ];
    });
  };
  console.log("check_items:", todos);

  return (
    <form
      onSubmit={handleButtonClick}
      className="max-w-lg mx-auto p-6 bg-white rounded shadow-md"
    >
      <label className="block font-semibold">회원 ID</label>
      <input
        value={memberId}
        onChange={(e) => setMemberId(e.target.value)}
        className="border border-gray-300 rounded p-2 w-full mb-4"
      />
      {todos.map((todo) => (
        <div
          key={todo.todoId}
          className="mb-6 border border-gray-300 rounded p-2"
        >
          <label className="block font-semibold">피부 주제</label>
          <input
            value={todo.topic}
            onChange={(e) => handleTopicChange(todo.todoId, e.target.value)}
            className="border border-gray-300 rounded p-2 w-full mb-2"
          />
          <TodoItem
            todo={todo}
            onTodoChange={handleTodoChange}
            onDurationChange={handleDurationChange}
            onDelete={deleteTodo}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addTodo}
        className="mb-4 bg-green-500 text-white rounded p-2 hover:bg-green-600"
      >
        todo 추가
      </button>
      <button
        type="submit"
        disabled={loading}
        className={`w-full rounded p-2 ${
          loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
        } text-white`}
      >
        {loading ? "생성 중..." : "체크리스트 생성"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </form>
  );
}
