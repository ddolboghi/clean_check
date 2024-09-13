"use client";

import {
  getTodoListByDate,
  updateDaysOfTodo,
  updateTodoDaysToDelay,
} from "@/actions/todoList";
import { Todo } from "@/utils/types";
import { useEffect, useState } from "react";
import { getDateAndDay } from "@/lib/dateTranslator";
import CheckListHead from "./CheckListHead";
import CompletionAllTodoPopUp from "../ui/CompletionAllTodoPopUp";
import { excuteConfetti } from "@/lib/confettiCustom";
import { updateTodayDone } from "@/actions/userActions";
import { getUniqueTopic } from "@/lib/todoListlib";
import WeekNav from "./WeekNav";
import TopicNav from "./TopicNav";
import TodoSection from "./TodoSection";
import ChatbotReversedIcon from "../icons/ChatbotReversedIcon";
import Link from "next/link";
import AlarmBtn from "../ui/AlarmBtn";
import CleanFreeLogoWhite from "../icons/CleanFreeLogoWhite";

type DayCheckList = {
  nowDate: string;
  memberId: string;
  children: React.ReactNode;
};

type ExtraData = {
  checkListId: number;
  startDate: Date;
  endDate: Date;
};

export default function DayCheckList({
  nowDate,
  memberId,
  children,
}: DayCheckList) {
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
      try {
        const checkListOfDay = await getTodoListByDate(nowDate, memberId);

        if (checkListOfDay) {
          setTodoList(checkListOfDay.filteredTodos);
          const todayTopicList = getUniqueTopic(checkListOfDay.filteredTodos);
          setTopicList(todayTopicList);
          setExtraData({
            checkListId: checkListOfDay.checkListId,
            startDate: checkListOfDay.startDate,
            endDate: checkListOfDay.endDate,
          });

          if (checkListOfDay.delayedDate !== nowDate) {
            await updateTodoDaysToDelay(
              checkListOfDay.checkListId,
              memberId,
              nowDate,
              checkListOfDay.delayedDate
            );
          }
        }
      } catch (err) {
        console.error("Error fetching todo list:");
      }
    }

    fetchAndUpdateTodoList();
  }, [nowDate, memberId]);

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
      await updateTodayDone(memberId);
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
      <main className="flex flex-col min-h-screen">
        <header className="px-9 bg-[#24E6C1] py-1 flex flex-row items-center justify-between sticky top-0 z-20">
          <CleanFreeLogoWhite />
          <div className="flex flex-row">
            <AlarmBtn memberId={memberId} />
            <Link href="/chat" className="pl-5">
              <ChatbotReversedIcon />
            </Link>
          </div>
        </header>
        <CheckListHead
          todoList={todoList}
          memberId={memberId}
          startDate={extraData.startDate}
          endDate={extraData.endDate}
        />
        {todoList ? (
          <section>
            <div className="sticky top-[31px] transition-all duration-300">
              <div className="relative left-1/2 -translate-x-1/2 top-3 w-[80px] h-[4px] bg-[#DADADA]"></div>
              <WeekNav
                week={week}
                handleDayOfWeek={handleDayOfWeek}
                clickedDate={clickedDate}
              />
              <TopicNav
                topicList={topicList}
                clickedTopic={clickedTopic}
                handleTopic={handleTopic}
              />
            </div>
            <TodoSection
              todoList={todoList}
              clickedTopic={clickedTopic}
              clickedDate={clickedDate}
              handleTodoClick={handleTodoClick}
            />
          </section>
        ) : (
          children
        )}
      </main>
    </>
  );
}
