import React from "react";
import CheckListHead from "../ui/CheckListHead";
import KakaoLogo from "../icons/KakaoLogo";
import Link from "next/link";

export default function NothingCheckList() {
  return (
    <>
      <div className="bg-[#24E6C1] pb-[55px]">
        <CheckListHead />
      </div>
      <div className="h-screen translate-y-[20%] text-center text-[20px]">
        <p>체크리스트 생성 중이에요.</p>
        <p>완성되면 알림을 보내드릴게요!</p>
        <div className="mt-[10px] mx-auto rounded-3xl flex flex-row items-center justify-center gap-2 border-solid border-2 w-[250px]">
          <KakaoLogo />
          <Link href="http://pf.kakao.com/_xhpqxgG/chat">
            카톡 채널에서 상담하기
          </Link>
        </div>
      </div>
    </>
  );
}
