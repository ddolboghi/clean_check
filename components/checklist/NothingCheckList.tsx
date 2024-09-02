import React from "react";
import CheckListHead from "../ui/CheckListHead";
import KakaoLogo from "../icons/KakaoLogo";
import Link from "next/link";
import CleanFreeLogoGrad from "../icons/CleanFreeLogoGrad";

export default function NothingCheckList() {
  return (
    <>
      <div className="h-screen bg-[#24E6C1] flex flex-col overflow-hidden">
        <CheckListHead />
        <div className="flex-grow translate-y-5 bg-white flex flex-col gap-4 justify-center items-center text-center text-[20px] rounded-t-[40px]">
          <CleanFreeLogoGrad />
          <p className="leading-relaxed">
            체크리스트 생성 중이에요.
            <br />
            완성되면 알림을 보내드릴게요!
          </p>
          <div className="text-black text-[14px] mt-[10px] mx-auto rounded-3xl flex flex-row items-center justify-center gap-2 bg-[#FFE812] w-[200px] h-[45px]">
            <KakaoLogo />
            <Link href="http://pf.kakao.com/_xhpqxgG/chat">
              카톡 채널에서 상담하기
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
