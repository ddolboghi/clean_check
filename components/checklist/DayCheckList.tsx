"use client";

import {
  getTodoListByDate,
  updateDaysOfTodo,
  updateTodoDaysToDelay,
} from "@/actions/todoList";
import { Todo } from "@/utils/types";
import { useEffect, useState } from "react";
import { getDateAndDay } from "@/lib/dateTranslator";
import CheckListHead from "../ui/CheckListHead";
import { getUniqueTopic } from "@/lib/todoListlib";
import CompletionAllTodoPopUp from "../ui/CompletionAllTodoPopUp";
import { excuteConfetti } from "@/lib/confettiCustom";
import fillCheckBox from "@/assets/fillCheckbox.svg";
import emptyCheckBox from "@/assets/emptyCheckBox.svg";
import Image from "next/image";
import NothingCheckList from "./NothingCheckList";
import SimpleSpinner from "../ui/SimpleSpinner";

type DayCheckList = {
  nowDate: string;
  memberId: string;
};

type ExtraData = {
  checkListId: number;
  startDate: Date;
  endDate: Date;
};

export default function DayCheckList({ nowDate, memberId }: DayCheckList) {
  const [loading, setLoading] = useState<boolean>(true);
  const [clickedDate, setClickedDate] = useState<string>(nowDate);
  const [todoList, setTodoList] = useState<Todo[] | null>(null);
  const [clickedTopic, setClickedTopic] = useState<string>("전체");
  const [topicList, setTopicList] = useState<string[]>([]);
  const [isCompletedAllTodo, setIsCompletedAllTodo] = useState<boolean>(false);
  const [extraData, setExtraData] = useState<ExtraData>({
    checkListId: 0,
    startDate: new Date(),
    endDate: new Date(),
  });

  useEffect(() => {
    async function fetchAndUpdateTodoList() {
      const checkListOfDay = await getTodoListByDate(nowDate, memberId);
      if (!checkListOfDay) setLoading(false);
      if (checkListOfDay) {
        setTodoList(checkListOfDay.filteredTodos);
        const todayTopicList = getUniqueTopic(checkListOfDay.filteredTodos);
        setTopicList(todayTopicList);
        setExtraData({
          checkListId: checkListOfDay.checkListId,
          startDate: checkListOfDay.startDate,
          endDate: checkListOfDay.endDate,
        });
      }

      if (checkListOfDay && checkListOfDay.delayedDate !== nowDate) {
        await updateTodoDaysToDelay(
          checkListOfDay.checkListId,
          memberId,
          nowDate
        );
      }
    }
    fetchAndUpdateTodoList();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isCompletedAllTodo) {
      const startConfetti = excuteConfetti();
      startConfetti();
    }
  }, [isCompletedAllTodo]);

  const week = getDateAndDay(extraData.startDate, extraData.endDate);

  const handleDayOfWeek = async (date: string) => {
    setClickedDate(date);
    if (memberId) {
      const newCheckListOfDay = await getTodoListByDate(date, memberId);
      if (newCheckListOfDay) {
        const newTodoListOfDay = newCheckListOfDay.filteredTodos;
        setTodoList(newTodoListOfDay);

        const newTopicList = getUniqueTopic(newTodoListOfDay);
        setTopicList(newTopicList);
      }
      setClickedTopic("전체");
    }
  };

  const handleTopic = (btnTopic: string) => {
    setClickedTopic(btnTopic);
  };

  const handleTodoClick = async (clickedTodo: Todo) => {
    if (extraData.checkListId && todoList) {
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
      await updateDaysOfTodo(extraData.checkListId, updatedTodo);
    }
  };

  const onClickHomeBtn = () => {
    setIsCompletedAllTodo(!isCompletedAllTodo);
  };
  console.log("체크리스트 컴포넌트의 loading", loading);
  return (
    <>
      {isCompletedAllTodo && (
        <CompletionAllTodoPopUp onClickHomeBtn={onClickHomeBtn} />
      )}
      {!todoList ? (
        loading ? (
          <SimpleSpinner />
        ) : (
          <NothingCheckList />
        )
      ) : (
        <div className="flex flex-col h-screen">
          <CheckListHead />
          {/* nav section */}
          <nav className="py-6 px-4 rounded-t-[40px] bg-white flex justify-center items-center text-base font-light tracking-tight text-center whitespace-nowrap text-[#B2B2B2]">
            {Object.entries(week).map(([date, day]) => (
              <button
                key={date}
                onClick={() => handleDayOfWeek(date)}
                className={`self-stretch px-3 py-1.5 w-[53px] h-[63px] ${
                  clickedDate === date &&
                  "font-light text-[#B2B2B2] bg-[#DFF4F0] rounded-[15px]"
                }`}
              >
                <div className="pb-1">{day}</div>
                <div className="pb-0.5 text-xs">
                  {date.split("-")[2].replace(/^0/, "")}
                </div>
              </button>
            ))}
          </nav>

          {/* topic section */}
          <nav className="min-h-7 px-6 mb-[24px] bg-white flex justify-start flex-row space-x-2 overflow-x-auto">
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
          <section
            className={`px-6 bg-white flex flex-col gap-5 overflow-y-scroll scrollbar-hide`}
          >
            {todoList &&
              todoList
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
                      <p className="whitespace-normal mr-2">{btnTodo.todo}</p>
                      <Image
                        src={isCompleted ? fillCheckBox : emptyCheckBox}
                        width={18}
                        height={18}
                        alt={isCompleted ? "완료" : "미완료"}
                      />
                    </button>
                  );
                })}
          </section>
        </div>
      )}
    </>
  );
}
