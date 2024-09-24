"use client";

import { useState } from "react";
import SlideContent from "./SlideContent";
import { MainRoutine } from "@/utils/types";
import GlobalAddBtn from "../GlobalAddBtn";
import MainRoutineAddPopUp from "../MainRoutineAddPopUp";

type RoutinesProps = {
  routines: MainRoutine[] | null;
};

export default function Routines({ routines }: RoutinesProps) {
  const initialRoutines = routines ? routines : [];
  const [newRoutines, setNewRoutines] = useState(initialRoutines);
  const [showMainPopUp, setShowMainPopUp] = useState(false);

  const handleGlobalAddBtn = async (content?: string) => {
    setShowMainPopUp(!showMainPopUp);
    if (content) {
      let updatedRoutines = [...newRoutines];
      let newId = 1;
      if (updatedRoutines.length > 0) {
        const lastRoutine = updatedRoutines[updatedRoutines.length - 1];
        newId = lastRoutine.id + 1;
      }
      const newRoutine = { id: newId, content: content };
      setNewRoutines([...updatedRoutines, newRoutine]);
    }
  };

  const handleDeleteContent = async (index: number) => {
    if (newRoutines) {
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
      {!newRoutines || newRoutines.length === 0 ? (
        <div className="text-center w-full pt-10">루틴을 추가해보세요!</div>
      ) : (
        newRoutines.map((routine, routineIdx) => (
          <SlideContent
            key={routine.id}
            index={routineIdx}
            content={routine.content}
            handleDeleteContent={handleDeleteContent}
          />
        ))
      )}
      <GlobalAddBtn handleBtn={handleGlobalAddBtn}>
        {showMainPopUp && (
          <MainRoutineAddPopUp handleBtn={handleGlobalAddBtn} />
        )}
      </GlobalAddBtn>
    </div>
  );
}
