"use client";

import { useEffect, useState } from "react";
import AlarmPopUp from "./AlarmPopUp";
import NotAllowedBell from "../icons/NotAllowedBell";
import AllowedBell from "../icons/AllowedBell";
import LoadingAllowedBell from "../icons/LoadingAllowedBell";

type AlarmBtnProps = {
  memberId: string;
};

export default function AlarmBtn({ memberId }: AlarmBtnProps) {
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [alarmLoading, setAlarmLoading] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem(`isAllowed_${memberId}`);
    if (saved !== null) {
      setIsAllowed(JSON.parse(saved));
    }
  }, [memberId]);

  const handleClickBell = () => {
    setShowPopUp(!showPopUp);
  };

  useEffect(() => {
    localStorage.setItem(`isAllowed_${memberId}`, JSON.stringify(isAllowed));
  }, [isAllowed, memberId]);

  return (
    <div className="flex items-center" onClick={handleClickBell}>
      {isAllowed ? (
        <AllowedBell />
      ) : alarmLoading ? (
        <div>
          <LoadingAllowedBell />
          <p className="relative right-8 text-sm text-[#7B7B7B]">
            알림 설정 중이니 앱을 종료하지 마세요.
          </p>
        </div>
      ) : (
        <NotAllowedBell />
      )}
      {showPopUp && (
        <AlarmPopUp
          memberId={memberId}
          handleClickBell={handleClickBell}
          setIsAllowed={setIsAllowed}
          setLoading={setAlarmLoading}
        />
      )}
    </div>
  );
}
