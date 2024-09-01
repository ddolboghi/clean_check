import React from "react";
import BackIcon from "../icons/BackIcon";
import RestartIcon from "../icons/RestartIcon";

type ChatHeaderProps = {
  routeBack: () => void;
  handleResetPopup: () => void;
};

export default function ChatHeader({
  routeBack,
  handleResetPopup,
}: ChatHeaderProps) {
  return (
    <header className="px-4 mt-[60px] mb-4 flex flex-row justify-between items-center">
      <button
        onClick={() => routeBack()}
        className="w-[30px] h-[30px] flex justify-center items-center"
      >
        <BackIcon />
      </button>
      <p className="font-semibold text-[15px]">상담 중</p>
      <button
        onClick={() => handleResetPopup()}
        className="w-[30px] h-[30px] flex justify-center items-center"
      >
        <RestartIcon />
      </button>
    </header>
  );
}
