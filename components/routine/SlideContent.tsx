"use client";

import React, { useState } from "react";
import Swipe from "react-easy-swipe";
import SavePopUp from "./SavePopUp";
import EditPopUp from "./EditPopUp";

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
  const [editedContent, setEditedContent] = useState<string>(content);

  const onSwipeMove = (position: { x: number }) => {
    const newOffset = Math.min(0, Math.max(-120, position.x));
    setOffset(newOffset);
  };

  const onSwipeEnd = () => {
    if (offset > -60) {
      setOffset(0); // 메뉴 감춤
    } else {
      setOffset(-200); // 메뉴 보여줌
    }
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
              className="px-4 py-2 text-white bg-[#40B4C8] w-full"
              onClick={handleSaveBtn}
            >
              보관
            </button>
            <button
              className="px-4 py-2 text-white bg-[#88D6E4] w-full"
              onClick={() => handleEditBtn()}
            >
              편집
            </button>
            <button
              className="px-4 py-2 text-white bg-[#D5E6E9] rounded-r-[10px] w-full"
              onClick={() => handleDeleteContent(index)}
            >
              삭제
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
