"use client";

import {
  getTodoListByDate,
  updateDaysOfTodo,
  updateTodoDaysToDelay,
} from "@/actions/todoList";
import { Todo } from "@/utils/types";
import { useEffect, useRef, useState } from "react";
import { getDateAndDay } from "@/lib/dateTranslator";
import CheckListHead from "./CheckListHead";
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
import LogoutButton from "../LogoutButton";
import CleanFreeLogoWhite from "../icons/CleanFreeLogoWhite";
import ChatbotReversedIcon from "../icons/ChatbotReversedIcon";
import Link from "next/link";

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
  const [navTranslateY, setNavTranslateY] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    const nav = navRef.current;
    const section = sectionRef.current;

    if (!header || !nav || !section) return;

    const headerHeight = header.offsetHeight;
    const sectionHeight = section.offsetHeight;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 0) {
        setNavTranslateY(-118);
      } else {
        setNavTranslateY(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
      <main className="flex flex-col min-h-screen">
        {!subscription && <button onClick={subscribeToPush}>알림 받기</button>}
        <header
          ref={headerRef}
          className="px-9 bg-[#24E6C1] pt-10 pb-1 flex flex-row justify-between sticky top-0 z-20"
        >
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
          subscription={subscription}
          handleDeleteSubscription={handleDeleteSubscription}
        />
        {todoList ? (
          <div
            ref={navRef}
            className="transition-transform duration-300"
            style={{ transform: `translateY(${navTranslateY}px)` }}
          >
            <div className="sticky top-[204px]">
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
            <section ref={sectionRef}>
              <TodoSection
                todoList={todoList}
                clickedTopic={clickedTopic}
                clickedDate={clickedDate}
                handleTodoClick={handleTodoClick}
              />
            </section>
          </div>
        ) : (
          <NothingCheckList />
        )}
      </main>
    </>
  );
}
