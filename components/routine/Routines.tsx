"use client";

import { useState } from "react";
import SlideContent from "./SlideContent";
import { MainRoutine } from "@/utils/types";
import GlobalAddBtn from "../GlobalAddBtn";
import MainRoutineAddPopUp from "../MainRoutineAddPopUp";
import { deleteMainRoutine } from "@/actions/routine";

type RoutinesProps = {
  routines: MainRoutine[] | null;
};

export default function Routines({ routines }: RoutinesProps) {
  const initialRoutines = routines ? routines : [];
  const [newRoutines, setNewRoutines] = useState(initialRoutines);
  const [showMainPopUp, setShowMainPopUp] = useState(false);

  const handleGlobalAddBtn = (content?: string) => {
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

  const handleDeleteContent = async (routineIdx: number, routineId: number) => {
    if (newRoutines.length > 0) {
      const updatedRoutines = [...newRoutines];
      updatedRoutines.splice(routineIdx, 1);
      setNewRoutines(updatedRoutines);
      const response = await deleteMainRoutine(routineId);
      if (!response) throw new Error("Bad request.");
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center w-full pb-[100px]">
      {!newRoutines || newRoutines.length === 0 ? (
        <div className="text-center w-full pt-10">루틴을 추가해보세요!</div>
      ) : (
        newRoutines.map((routine, routineIdx) => (
          <SlideContent
            key={routine.id}
            routineId={routine.id}
            index={routineIdx}
            content={routine.content}
            handleDeleteContent={() =>
              handleDeleteContent(routineIdx, routine.id)
            }
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
