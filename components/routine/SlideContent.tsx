"use client";

import React, { useState } from "react";
import Swipe from "react-easy-swipe";
import SavePopUp from "./SavePopUp";
import EditPopUp from "./EditPopUp";
import FolderIconWhite from "../icons/FolderIconWhite";
import EditIconWhite from "../icons/EditIconWhite";
import TrashcanIconWhite from "../icons/TrashcanIconWhite";
import AlarmPopUp from "./AlarmPopUp";

type SlideContentProps = {
  routineId: number;
  index: number;
  content: string;
  handleDeleteContent: (index: number) => void;
};

export default function SlideContent({
  routineId,
  index,
  content,
  handleDeleteContent,
}: SlideContentProps) {
  const [offset, setOffset] = useState(0);
  const [showSavePopUp, setShowSavePopUp] = useState(false);
  const [showEditPopUp, setShowEditPopUp] = useState(false);
  const [showAlarmPopUp, setShowAlarmPopUp] = useState(false);
  const [editedContent, setEditedContent] = useState<string>(content);

  const onSwipeMove = (position: { x: number }) => {
    const newOffset = Math.min(120, Math.max(-120, position.x));
    setOffset(newOffset);
  };

  const onSwipeEnd = () => {
    if (offset > 60) {
      setOffset(56); // 왼쪽 메뉴
    } else if (offset < -60) {
      setOffset(-160); // 오른쪽 메뉴
    } else {
      setOffset(0);
    }
  };

  const handleAlarmBtn = () => {
    setShowAlarmPopUp(!showAlarmPopUp);
  };

  const handleSaveBtn = () => {
    setShowSavePopUp(!showSavePopUp);
  };

  const handleEditBtn = (updatedContent?: string) => {
    setShowEditPopUp(!showEditPopUp);
    if (updatedContent) {
      setEditedContent(updatedContent);
    }
  };

  return (
    <>
      {showAlarmPopUp && (
        <AlarmPopUp handleAlarmBtn={handleAlarmBtn} setOffset={setOffset} />
      )}
      {showSavePopUp && (
        <SavePopUp handleSaveBtn={handleSaveBtn} setOffset={setOffset} />
      )}
      {showEditPopUp && (
        <EditPopUp
          routineId={routineId}
          content={editedContent}
          handleEditBtn={handleEditBtn}
          setOffset={setOffset}
        />
      )}
      <Swipe
        onSwipeMove={onSwipeMove}
        onSwipeEnd={onSwipeEnd}
        tolerance={1}
        className="w-full overflow-hidden px-4"
      >
        <div className="relative flex items-center w-full h-14">
          <div className="absolute right-1 flex h-full w-[205px]">
            <button
              className="flex justify-end items-center px-4 py-2 text-white bg-[#40B4C8] w-full"
              onClick={handleSaveBtn}
            >
              <FolderIconWhite />
            </button>
            <button
              className="flex justify-center items-center px-4 py-2 text-white bg-[#88D6E4] w-[67px]"
              onClick={() => handleEditBtn()}
            >
              <EditIconWhite />
            </button>
            <button
              className="flex justify-center items-center px-4 py-2 text-white bg-[#D5E6E9] rounded-r-[10px] w-[67px]"
              onClick={() => handleDeleteContent(index)}
            >
              <TrashcanIconWhite />
            </button>
          </div>
          <div className="absolute left-1 h-full">
            <button
              className="px-4 py-2 bg-blue-300 text-white h-full w-full rounded-l-[10px]"
              onClick={handleAlarmBtn}
            >
              알림
            </button>
          </div>
          <div
            className="flex items-center justify-center h-full w-full bg-[#EBF5F6] text-[#2F6771] rounded-[10px] transition-transform duration-300 ease-out"
            style={{ transform: `translateX(${offset}px)` }}
          >
            <p>{editedContent}</p>
          </div>
        </div>
      </Swipe>
    </>
  );
}
