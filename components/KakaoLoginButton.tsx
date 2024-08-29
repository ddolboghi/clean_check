"use client";

import KakaoLogo from "./icons/KakaoLogo";
import { kakaoLogin } from "@/lib/kakaoLogin";

const KakaoLoginButton = () => {
  return (
    <div className="w-[354px] h-[60px] rounded-full border-solid border-[#F1F1F1] border-2 flex items-center">
      <div className="ml-[55px]">
        <KakaoLogo />
      </div>
      <button
        className="ml-[-50px] text-[20px] flex-grow text-center"
        onClick={() => kakaoLogin()}
      >
        카카오로 로그인하기
      </button>
    </div>
  );
};

export default KakaoLoginButton;
