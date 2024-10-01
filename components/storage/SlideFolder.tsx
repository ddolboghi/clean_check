"use client";

import React, { useEffect, useState } from "react";
import Swipe from "react-easy-swipe";
import EditIconWhite from "../icons/EditIconWhite";
import TrashcanIconWhite from "../icons/TrashcanIconWhite";
import { MainRoutine, ScheduledNotification } from "@/utils/types";
import SpreadArrowUp from "../icons/SpreadArrowUp";
import SpreadArrowDown from "../icons/SpreadArrowDown";
import RoutineBox from "./RoutineBox";
import { deleteFolder, getRoutinesByFolderId } from "@/actions/storage";
import EditPopUp from "./EditPopUp";
import CustomAlarmPopUp from "../routine/CustomAlarmPopUp";
import SetBell from "../icons/SetBell";
import UnSetBell from "../icons/UnSetBell";
import { getScheduledNotificationByOtherId } from "@/actions/pushNotification";

type SlideFolderProps = {
  folderId: number;
  initName: string;
  initRoutines: MainRoutine[];
  handleUpdateFolders: (deletedFolderId: number) => void;
};

export default function SlideFolder({
  folderId,
  initName,
  initRoutines,
  handleUpdateFolders,
}: SlideFolderProps) {
  const [offset, setOffset] = useState(0);
  const [showEditPopUp, setShowEditPopUp] = useState(false);
  const [showAlarmPopUp, setShowAlarmPopUp] = useState(false);
  const [name, setName] = useState<string>(initName);
  const [routines, setRoutines] = useState<MainRoutine[]>(initRoutines);
  const [showRoutines, setShowRoutines] = useState(false);
  const [isSetAlarm, setIsSetAlarm] = useState(false);
  const [notificationTimes, setNotificationTimes] = useState<
    ScheduledNotification[]
  >([]);

  useEffect(() => {
    const getRoutinesAndNotification = async () => {
      const response = await getRoutinesByFolderId(folderId);
      if (response) {
        setRoutines(response);
      }

      const scheduledNotifications = await getScheduledNotificationByOtherId(
        folderId,
        "/storage"
      );
      if (scheduledNotifications && scheduledNotifications.length !== 0) {
        setIsSetAlarm(true);
        setNotificationTimes(scheduledNotifications);
      }
    };
    getRoutinesAndNotification();
  }, [showRoutines]);

  const onSwipeMove = (position: { x: number }) => {
    const newOffset = Math.min(120, Math.max(-120, position.x));
    setOffset(newOffset);
  };

  const onSwipeEnd = () => {
    if (offset > 60) {
      setOffset(53); // 왼쪽 메뉴
    } else if (offset < -60) {
      setOffset(-132); // 오른쪽 메뉴
    } else {
      setOffset(0);
    }
  };

  const handleAlarmBtn = () => {
    setShowAlarmPopUp(!showAlarmPopUp);
  };

  const handleEditBtn = (updatedName?: string) => {
    setShowEditPopUp(!showEditPopUp);
    if (updatedName) {
      setName(updatedName);
    }
  };

  const handleDeleteBtn = async () => {
    handleUpdateFolders(folderId);
    const response = await deleteFolder(folderId);
    if (!response) {
      throw new Error("Bad request.");
    }
  };

  const handleShowRoutines = () => {
    if (routines.length !== 0) {
      setShowRoutines(!showRoutines);
    }
  };

  const handleRoutinesforNumber = (updatedRoutines: MainRoutine[]) => {
    setRoutines(updatedRoutines);
    if (updatedRoutines.length === 0) {
      setShowRoutines(!showRoutines);
    }
  };

  return (
    <>
      {showAlarmPopUp && (
        <CustomAlarmPopUp
          handleAlarmBtn={handleAlarmBtn}
          setOffset={setOffset}
          alarmContent={name}
          setIsSetAlarm={setIsSetAlarm}
          otherId={folderId}
          notificationTimes={notificationTimes}
        />
      )}
      {showEditPopUp && (
        <EditPopUp
          folderId={folderId}
          name={name}
          handleEditBtn={handleEditBtn}
          setOffset={setOffset}
        />
      )}
      <Swipe
        onSwipeMove={onSwipeMove}
        onSwipeEnd={onSwipeEnd}
        tolerance={1}
        className="w-full overflow-hidden px-8"
      >
        <div className="relative flex items-center w-full h-14">
          <div className="absolute right-1 flex h-full w-[134px]">
            <button
              className="flex justify-center items-center px-4 py-2 text-white bg-[#88D6E4] w-[67px]"
              onClick={() => handleEditBtn()}
            >
              <EditIconWhite />
            </button>
            <button
              className="flex justify-center items-center px-4 py-2 text-white bg-[#D5E6E9] rounded-r-[10px] w-[67px]"
              onClick={handleDeleteBtn}
            >
              <TrashcanIconWhite />
            </button>
          </div>
          <div className="absolute left-1 h-full">
            <button
              className="px-4 py-2 bg-[#D4D4D4] text-white h-full w-full rounded-l-[10px]"
              onClick={handleAlarmBtn}
            >
              {isSetAlarm ? <SetBell /> : <UnSetBell />}
            </button>
          </div>
          <div
            className={`${
              showRoutines ? "rounded-t-[10px]" : "rounded-[10px]"
            } flex items-center justify-between pl-[30px] pr-[20px] h-full w-full bg-white transition-transform duration-300 ease-out`}
            style={{ transform: `translateX(${offset}px)` }}
          >
            <p className="text-[#898989] text-[18px]">{name}</p>
            <div className="flex justify-between items-center gap-[18px]">
              <span className="text-[#C1C1C1] text-[20px]">
                {routines.length}
              </span>
              <button onClick={handleShowRoutines}>
                {showRoutines ? (
                  <SpreadArrowUp width="10" height="4" />
                ) : (
                  <SpreadArrowDown width="10" height="4" />
                )}
              </button>
            </div>
          </div>
        </div>
        {showRoutines && (
          <div className="w-full pt-[19px] pb-[45px] px-[30px] bg-white rounded-b-[10px]">
            <RoutineBox
              folderId={folderId}
              initRoutines={routines}
              handleRoutinesforNumber={handleRoutinesforNumber}
            />
          </div>
        )}
      </Swipe>
    </>
  );
}
