"use client";

import { useState } from "react";
import SlideContent from "./SlideContent";
import { MainRoutine } from "@/utils/types";

type RoutinesProps = {
  routines: MainRoutine[];
};

export default function Routines({ routines }: RoutinesProps) {
  const [newRoutines, setNewRoutines] = useState(routines);

  const handleDeleteContent = async (index: number) => {
    const updatedRoutines = [...newRoutines];
    updatedRoutines.splice(index, 1);
    setNewRoutines(updatedRoutines);
    try {
      await simulateServerAction();
      console.log("서버에서 원소 삭제 성공");
    } catch (error) {
      console.error("서버에서 원소 삭제 실패:", error);
      setNewRoutines(newRoutines);
    }
  };

  // 비동기 시뮬레이션
  const simulateServerAction = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        //서버 응답으로 예외처리
        const success = true;
        if (success) {
          resolve("삭제 완료");
        } else {
          reject(new Error("삭제 실패"));
        }
      }, 2000);
    });
  };

  return (
    <div className="flex flex-col gap-4 items-center w-full pb-[100px]">
      {newRoutines.map((routine, routineIdx) => (
        <SlideContent
          key={routine.id}
          index={routineIdx}
          content={routine.content}
          handleDeleteContent={handleDeleteContent}
        />
      ))}
    </div>
  );
}
