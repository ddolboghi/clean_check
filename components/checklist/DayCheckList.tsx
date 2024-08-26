"use client";

import { getTodoListByDay, updateCompletionOfTodo } from "@/actions/todoList";
import { week } from "@/data/date";
import { Completion, Todo } from "@/utils/types";
import { useState } from "react";
import FillCheckBox from "../icons/FillCheckBox";
import { getNumberOfDay } from "@/lib/dateTranslator";
import EmptyCheckBox from "../icons/EmptyCheckBox";

type DayCheckList = {
  checkListId: number | null | undefined;
  todayOfWeek: string;
  todoListOfDay: Todo[] | null | undefined;
  completionsOfDay: Completion[] | null | undefined;
  memberId: string;
  todayTopics: string[];
};

export default function DayCheckList({
  checkListId,
  todayOfWeek,
  todoListOfDay,
  completionsOfDay,
  memberId,
  todayTopics,
}: DayCheckList) {
  const [dayOfWeek, setDayOfWeek] = useState<string>(todayOfWeek);
  const [todoList, setTodoList] = useState<Todo[] | null | undefined>(
    todoListOfDay
  );
  const [clickedTopic, setClickedTopic] = useState<string>("전체");
  const [topicList, setTopicList] = useState<string[]>(todayTopics);
  const [completionList, setCompletionList] = useState<
    Completion[] | null | undefined
  >(completionsOfDay);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handleDayOfWeek = async (day: string) => {
    setDayOfWeek(day);
    const newCheckListOfDay = await getTodoListByDay(day, memberId);
    if (newCheckListOfDay) {
      const newTodoListOfDay = newCheckListOfDay.filteredTodos;
      setTodoList(newTodoListOfDay);

      const newCompletionListOfDay = newCheckListOfDay.filteredCompletions;
      setCompletionList(newCompletionListOfDay);

      const newTopicList = newTodoListOfDay.map((todo) => todo.topic);
      setTopicList(["전체", ...newTopicList]);
    }
    setClickedTopic("전체");
  };

  const handleTopic = (btnTopic: string) => {
    setClickedTopic(btnTopic);
  };

  const handleTodoClick = async (todo: Todo) => {
    const numberOfDay = getNumberOfDay(dayOfWeek);
    if (checkListId && completionList) {
      const updatedCompletionList = completionList.map((completion) => {
        if (completion.todoId === todo.todoId) {
          const currentComplete = completion.complete[numberOfDay];
          return {
            ...completion,
            complete: {
              ...completion.complete,
              [numberOfDay]: !currentComplete,
            },
          };
        }
        return completion;
      });

      setCompletionList(updatedCompletionList);

      // 서버에 updateCompletionList 저장
      await updateCompletionOfTodo(checkListId, updatedCompletionList);
    }
  };

  return (
    <main className="px-6">
      <header>
        {/* nav section */}
        <nav className="flex justify-center py-2 items-center text-base font-light tracking-tight text-center whitespace-nowrap text-neutral-400">
          {week.map((day, dayIdx) => (
            <button
              key={dayIdx}
              onClick={() => handleDayOfWeek(day)}
              className={`self-stretch px-3 py-1.5 w-[53px] h-[53px] ${
                dayOfWeek === day &&
                "font-medium text-teal-800 bg-[#AEEFE2] rounded-[15px]"
              }`}
            >
              {day}
            </button>
          ))}
        </nav>

        {/* topic section */}
        <nav className="flex justify-start flex-row py-4 gap-2">
          {topicList.map((topic, topicIdx) => (
            <button
              key={topicIdx}
              onClick={() => handleTopic(topic)}
              className="text-sm tracking-tight leading-loose text-center whitespace-nowrap rounded-3xl max-w-[65px]"
            >
              <span
                className={`px-5 py-2 rounded-3xl ${
                  topic === clickedTopic
                    ? "bg-[#565656] text-white"
                    : "bg-gray-200 bg-opacity-80 text-zinc-500"
                }`}
              >
                {topic}
              </span>
            </button>
          ))}
        </nav>
      </header>

      {/* todo section */}
      <div className="flex flex-col gap-5">
        {todoList
          ?.filter(
            (todo) => clickedTopic === "전체" || todo.topic === clickedTopic
          )
          .map((todo) => {
            const isCompleted = completionList?.some(
              (completion) =>
                completion.todoId === todo.todoId &&
                completion.complete[getNumberOfDay(dayOfWeek)]
            );

            return (
              <button
                className={`flex justify-between items-center px-6 py-4 w-full rounded-3xl border-2 border-solid ${
                  isCompleted
                    ? "bg-white bg-opacity-80 border-zinc-100 text-[#B2B2B2]"
                    : "bg-[#AEEFE2] border-[#AEEFE2] text-[#146556]"
                }`}
                key={todo.todoId}
                onClick={() => handleTodoClick(todo)}
              >
                <p>{todo.todo}</p>
                {isCompleted ? <FillCheckBox /> : <EmptyCheckBox />}
              </button>
            );
          })}
      </div>
    </main>
  );
}
