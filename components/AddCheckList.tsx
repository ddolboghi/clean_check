"use client";

import { useState } from "react";
import { postWeeklyCheckList } from "@/actions/postWeeklyCheckList";
import { Todo } from "@/utils/types";
import { getDates } from "@/lib/dateTranslator";

const TodoItem = ({
  todo,
  onTodoChange,
  onDurationChange,
  onDelete,
  allDays,
}: {
  todo: Todo;
  onTodoChange: (todoId: number, value: string) => void;
  onDurationChange: (todoId: number, days: { [key: string]: boolean }) => void;
  onDelete: (todoId: number) => void;
  allDays: string[];
}) => {
  const isEveryDay = Object.keys(todo.days).length === allDays.length;

  const handleDayChange = (day: string) => {
    let newDays = { ...todo.days };
    if (day === "매일") {
      if (isEveryDay) {
        newDays = {};
      } else {
        allDays.forEach((d) => (newDays[d] = false));
      }
    } else {
      if (day in newDays) {
        delete newDays[day];
      } else {
        newDays[day] = false;
      }
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
              checked={day === "매일" ? isEveryDay : day in todo.days}
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
    { timeOrder: 1, todoId: 1, todo: "", days: {} },
  ]);
  const [memberId, setMemberId] = useState<string>("");

  const today = new Date();
  const startDate = today.toISOString().split("T")[0];
  today.setDate(today.getDate() + 6);
  const endDate = today.toISOString().split("T")[0];
  const allDays = getDates(startDate, endDate);

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

  const handleDurationChange = (
    todoId: number,
    days: { [key: string]: boolean }
  ) => {
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
          timeOrder: todos[todos.length - 1]?.timeOrder || 1,
          todoId: newTodoId,
          todo: "",
          days: {},
        },
      ];
    });
  };

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
          <label className="block font-semibold">
            아침(1)/오전(2)/오후(3)/저녁(4)/공통(5)
          </label>
          <input
            value={todo.timeOrder}
            onChange={(e) => handleTopicChange(todo.todoId, e.target.value)}
            className="border border-gray-300 rounded p-2 w-full mb-2"
          />
          <TodoItem
            todo={todo}
            onTodoChange={handleTodoChange}
            onDurationChange={handleDurationChange}
            onDelete={deleteTodo}
            allDays={allDays}
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
