"use client";

import { getTodoListByDate, updateDaysOfTodo } from "@/actions/todoList";
import { Todo } from "@/utils/types";
import { useState } from "react";
import FillCheckBox from "../icons/FillCheckBox";
import { getDateAndDay } from "@/lib/dateTranslator";
import EmptyCheckBox from "../icons/EmptyCheckBox";
import CheckListHead from "../ui/CheckListHead";
import { getUniqueTopic } from "@/lib/todoListlib";
import CompletionAllTodoPopUp from "../ui/CompletionAllTodoPopUp";

type DayCheckList = {
  checkListId: number | null | undefined;
  nowDate: string;
  todoListOfDay: Todo[];
  memberId: string;
  todayTopics: string[];
  startDate: Date;
  endDate: Date;
};

export default function DayCheckList({
  checkListId,
  nowDate,
  todoListOfDay,
  memberId,
  todayTopics,
  startDate,
  endDate,
}: DayCheckList) {
  const [clickedDate, setClickedDate] = useState<string>(nowDate);
  const [todoList, setTodoList] = useState<Todo[]>(todoListOfDay);
  const [clickedTopic, setClickedTopic] = useState<string>("전체");
  const [topicList, setTopicList] = useState<string[]>(todayTopics);
  const [isCompletedAllTodo, setIsCompletedAllTodo] = useState<boolean>(false);

  const week = getDateAndDay(startDate, endDate);

  const handleDayOfWeek = async (date: string) => {
    setClickedDate(date);
    const newCheckListOfDay = await getTodoListByDate(date, memberId);
    if (newCheckListOfDay) {
      const newTodoListOfDay = newCheckListOfDay.filteredTodos;
      setTodoList(newTodoListOfDay);

      const newTopicList = getUniqueTopic(newTodoListOfDay);
      setTopicList(newTopicList);
    }
    setClickedTopic("전체");
  };

  const handleTopic = (btnTopic: string) => {
    setClickedTopic(btnTopic);
  };

  const handleTodoClick = async (clickedTodo: Todo) => {
    if (checkListId) {
      const updatedTodo = todoList.map((todo) => {
        if (todo.todoId === clickedTodo.todoId) {
          const currentComplete = todo.days[clickedDate];
          return {
            ...todo,
            days: {
              ...todo.days,
              [clickedDate]: !currentComplete,
            },
          };
        }
        return todo;
      });

      const isCompleteAll = updatedTodo.every(
        (todo) => todo.days[clickedDate] === true
      );
      setIsCompletedAllTodo(isCompleteAll);

      setTodoList(updatedTodo);

      await updateDaysOfTodo(checkListId, updatedTodo);
    }
  };

  const onClickHomeBtn = () => {
    setIsCompletedAllTodo(!isCompletedAllTodo);
  };

  return (
    <>
      {isCompletedAllTodo && (
        <CompletionAllTodoPopUp onClickHomeBtn={onClickHomeBtn} />
      )}
      <div className="flex flex-col h-screen">
        <CheckListHead />
        {/* nav section */}
        <nav className="py-6 px-4 rounded-t-[40px] bg-white flex justify-center items-center text-base font-light tracking-tight text-center whitespace-nowrap text-[#B2B2B2]">
          {Object.entries(week).map(([date, day]) => (
            <button
              key={date}
              onClick={() => handleDayOfWeek(date)}
              className={`self-stretch px-3 py-1.5 w-[53px] h-[53px] ${
                clickedDate === date &&
                "font-medium text-[#B2B2B2] bg-[#DFF4F0] rounded-[15px]"
              }`}
            >
              <div>{day}</div>
              <div className="text-xs">
                {date.split("-")[2].replace(/^0/, "")}
              </div>
            </button>
          ))}
        </nav>

        {/* topic section */}
        <nav className="pb-4 px-6 bg-white flex justify-start flex-row space-x-2 overflow-x-auto">
          {topicList.map((topic, topicIdx) => (
            <button
              key={topicIdx}
              onClick={() => handleTopic(topic)}
              className="text-sm tracking-tight leading-loose text-center whitespace-nowrap rounded-3xl scrollbar-hide"
            >
              <div
                className={`px-5 rounded-3xl text-center ${
                  topic === clickedTopic
                    ? "bg-[#565656] text-white"
                    : "bg-gray-200 bg-opacity-80 text-zinc-500"
                }`}
              >
                {topic}
              </div>
            </button>
          ))}
        </nav>

        {/* todo section */}
        <div
          className={`px-6 mt-4 bg-white flex flex-col gap-5 overflow-y-scroll scrollbar-hide`}
        >
          {todoList
            .filter(
              (btnTodo) =>
                clickedTopic === "전체" || btnTodo.topic === clickedTopic
            )
            .map((btnTodo) => {
              const isCompleted = btnTodo.days[clickedDate];

              return (
                <button
                  className={`flex justify-between items-center px-6 py-4 w-full rounded-3xl border-2 border-solid ${
                    isCompleted
                      ? "bg-white bg-opacity-80 border-zinc-100 text-[#B2B2B2]"
                      : "bg-[#E1F5F1] border-[#E1F5F1] text-[#528A80]"
                  }`}
                  key={btnTodo.todoId}
                  onClick={() => handleTodoClick(btnTodo)}
                >
                  <p>{btnTodo.todo}</p>
                  {isCompleted ? <FillCheckBox /> : <EmptyCheckBox />}
                </button>
              );
            })}
        </div>
      </div>
    </>
  );
}
