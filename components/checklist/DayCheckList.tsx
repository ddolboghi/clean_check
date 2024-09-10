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
import SimpleSpinner from "../ui/SimpleSpinner";
import { saveFCMToken, updateTodayDone } from "@/actions/userActions";
import { getUniqueTopic } from "@/lib/todoListlib";
import WeekNav from "./WeekNav";
import TopicNav from "./TopicNav";
import NothingCheckList from "./NothingCheckList";
import TodoSection from "./TodoSection";
import LogoutButton from "../LogoutButton";
import CleanFreeLogoWhite from "../icons/CleanFreeLogoWhite";
import ChatbotReversedIcon from "../icons/ChatbotReversedIcon";
import Link from "next/link";
import { getMessaging, getToken } from "firebase/messaging";
import { app } from "@/firebase";

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
  const [showNotificationPermissionBtn, setShowNotificationPermissionBtn] =
    useState<boolean>(true);

  useEffect(() => {
    async function fetchAndUpdateTodoList() {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
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

  useEffect(() => {
    async function registerServiceWorker() {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
          {
            scope: "/",
            updateViaCache: "none",
          }
        );
        const sub = await registration.pushManager.getSubscription();
      }
    }

    registerServiceWorker();
  }, []);

  const clickPushHandler = async () => {
    try {
      if (
        typeof window !== "undefined" &&
        typeof window.navigator !== "undefined"
      ) {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          throw new Error("Notification permission not granted.");
        } else {
          alert("Notification permission granted.");
          const messaging = getMessaging(app);
          alert(`messging object: ${JSON.stringify(messaging)}`);
          const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FCM_VAPID_KEY,
          });
          alert(`token: ${token}`);
          await saveFCMToken(memberId, token);
          setShowNotificationPermissionBtn(false);
        }
      } else {
        throw new Error("window is undefined");
      }
    } catch (error) {
      console.error(error);
      setShowNotificationPermissionBtn(true);
      alert("문제가 발생했어요. 잠시 후 다시 시도해주세요.");
    }
  };

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

  if (loading) return <SimpleSpinner />;

  return (
    <>
      {isCompletedAllTodo && (
        <CompletionAllTodoPopUp onClickHomeBtn={onClickHomeBtn} />
      )}
      <main className="flex flex-col min-h-screen">
        {showNotificationPermissionBtn && (
          <button onClick={clickPushHandler}>알림 받기</button>
        )}
        <header className="px-9 bg-[#24E6C1] pt-10 pb-1 flex flex-row justify-between sticky top-0 z-20">
          <LogoutButton>
            <CleanFreeLogoWhite />
          </LogoutButton>
          <Link href="/chat">
            <ChatbotReversedIcon />
          </Link>
        </header>
        <CheckListHead
          todoList={todoList}
          memberId={memberId}
          startDate={extraData.startDate}
          endDate={extraData.endDate}
        />
        {todoList ? (
          <>
            <div className="sticky top-[87px] transition-all duration-300">
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
          </>
        ) : (
          <NothingCheckList />
        )}
      </main>
    </>
  );
}
