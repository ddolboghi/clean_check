"use client";

import KakaoLogo from "./icons/KakaoLogo";
import { kakaoLogin } from "@/lib/kakaoLogin";

const KakaoLoginButton = () => {
  return (
    <div className="bg-[#FFED46] w-[300px] h-[60px] rounded-full flex items-center">
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
