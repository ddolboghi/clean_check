"use client";

import { useState } from "react";
import AlarmPopUp from "./AlarmPopUp";
import NotAllowedBell from "../icons/NotAllowedBell";
import AllowedBell from "../icons/AllowedBell";

type AlarmBtnProps = {
  memberId: string;
};

export default function AlarmBtn({ memberId }: AlarmBtnProps) {
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);

  const handleClickBell = () => {
    setShowPopUp(!showPopUp);
  };

  return (
    <div className="flex items-center" onClick={handleClickBell}>
      {isAllowed ? <AllowedBell /> : <NotAllowedBell />}
      {showPopUp && (
        <AlarmPopUp
          memberId={memberId}
          handleClickBell={handleClickBell}
          setIsAllowed={setIsAllowed}
        />
      )}
    </div>
  );
}
