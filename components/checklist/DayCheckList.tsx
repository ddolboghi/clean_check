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
import CompletionAllTodoPopUp from "../ui/CompletionAllTodoPopUp";
import { excuteConfetti } from "@/lib/confettiCustom";
import SimpleSpinner from "../ui/SimpleSpinner";
import { updateTodayDone } from "@/actions/userActions";
import urlBase64ToUint8Array from "@/lib/urlBase64ToUint8Array";
import { getUniqueTopic } from "@/lib/todoListlib";
import WeekNav from "./WeekNav";
import TopicNav from "./TopicNav";
import NothingCheckList from "./NothingCheckList";
import TodoSection from "./TodoSection";

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
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );

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
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });
        const sub = await registration.pushManager.getSubscription();
        setSubscription(sub);
      }
    }

    registerServiceWorker();
  }, []);

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

  async function subscribeToPush() {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Notification permission not granted");
      }
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });
      setSubscription(sub);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/notification-subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            memberId: memberId,
            pushSubscription: sub,
          }),
        }
      );

      if (!res.ok) throw new Error("Insert pushSubscription failed.");
    } catch (error) {
      console.error(error);
    }
  }

  const handleDeleteSubscription = () => {
    setSubscription(null);
  };

  if (loading) return <SimpleSpinner />;

  return (
    <>
      {isCompletedAllTodo && (
        <CompletionAllTodoPopUp onClickHomeBtn={onClickHomeBtn} />
      )}
      <div className="flex flex-col h-screen">
        {!subscription && <button onClick={subscribeToPush}>알림 받기</button>}
        <CheckListHead
          memberId={memberId}
          subscription={subscription}
          handleDeleteSubscription={handleDeleteSubscription}
        />
        {todoList ? (
          <section>
            <div className="sticky top-0">
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
          <NothingCheckList />
        )}
      </div>
    </>
  );
}
