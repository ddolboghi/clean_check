"use client";

import Image from "next/image";
import { useState } from "react";
import bellWithPoint from "@/public/assets/bellWithPoint.png";
import AlarmPopUp from "./AlarmPopUp";

type AlarmBtnProps = {
  memberId: string;
};

export default function AlarmBtn({ memberId }: AlarmBtnProps) {
  const [showPopUp, setShowPopUp] = useState<boolean>(false);

  const handleClickBell = () => {
    setShowPopUp(!showPopUp);
  };

  return (
    <div onClick={handleClickBell}>
      <Image src={bellWithPoint} width={28} alt="알림 팝업 버튼" />
      {showPopUp && (
        <AlarmPopUp memberId={memberId} handleClickBell={handleClickBell} />
      )}
    </div>
  );
}
