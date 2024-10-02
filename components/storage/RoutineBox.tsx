"use client";

import { useState } from "react";
import AddIconColor from "../icons/AddIconColor";
import { MainRoutine } from "@/utils/types";
import { moveRoutineToMain } from "@/actions/storage";

type RoutineBoxProps = {
  folderId: number;
  initRoutines: MainRoutine[];
  handleRoutinesforNumber: (updatedRoutines: MainRoutine[]) => void;
};

export default function RoutineBox({
  folderId,
  initRoutines,
  handleRoutinesforNumber,
}: RoutineBoxProps) {
  const [routines, setRoutines] = useState<MainRoutine[]>(initRoutines);

  const handleMoveToMain = async (routineId: number) => {
    const updatedRoutines = routines.filter(
      (routine) => routine.id !== routineId
    );
    setRoutines(updatedRoutines);
    handleRoutinesforNumber(updatedRoutines);
    const response = await moveRoutineToMain(
      folderId,
      routineId,
      updatedRoutines
    );

    if (!response) {
      alert("다시 시도해주세요.");
      setRoutines(routines);
      handleRoutinesforNumber(routines);
    }
  };

  return (
    <section>
      <h1 className="text-[13px] text-[#6AC7D7] font-semibold mb-2">Routine</h1>
      {routines.map((routine) => (
        <div
          key={routine.id}
          className="flex flex-row items-center justify-between text-[14px] text-[#626262] py-1"
        >
          <p>{routine.content}</p>
          <button onClick={() => handleMoveToMain(routine.id)}>
            <AddIconColor />
          </button>
        </div>
      ))}
    </section>
  );
}
