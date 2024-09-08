"use client";

import Link from "next/link";
import ChatbotReversedIcon from "../icons/ChatbotReversedIcon";
import CleanFreeLogoWhite from "../icons/CleanFreeLogoWhite";
import LogoutButton from "../LogoutButton";
import ProgressBar from "../ui/ProgressBar";
import { Todo } from "@/utils/types";
import { useEffect, useState } from "react";
import { getNumOfTodoList } from "@/actions/todoList";
import { ProgressText } from "../ui/ProgressText";

type CheckListHeadProps = {
  todoList: Todo[] | null;
  memberId: string;
  subscription?: PushSubscription | null;
  handleDeleteSubscription?: () => void;
};

export default function CheckListHead({
  todoList,
  memberId,
  subscription,
  handleDeleteSubscription,
}: CheckListHeadProps) {
  //추후 필요 시 알림 받지 않는 기능 추가하기
  const [progressValue, setProgressValue] = useState<number>(0);

  useEffect(() => {
    async function fetchNumOfTodoList() {
      const numOfTodoList = await getNumOfTodoList(memberId);
      if (numOfTodoList) {
        const numberOfDoneTodos = numOfTodoList.numberOfDoneTodos;
        const numberOfTodos = numOfTodoList.numberOfTodos;
        const value =
          numberOfDoneTodos &&
          numberOfTodos &&
          Math.floor((numberOfDoneTodos / numberOfTodos) * 100);

        setProgressValue(value);
      }
    }

    fetchNumOfTodoList();
  }, [todoList]);

  return (
    <section className="bg-[#24E6C1] px-9 mb-[-55px]">
      <div className="mb-[53px] flex flex-col justify-between">
        <h1 className="font-semibold text-[20px] py-2 leading-tight">
          <ProgressText value={progressValue} />
        </h1>
        {todoList && <ProgressBar value={progressValue} />}
      </div>
    </section>
  );
}
