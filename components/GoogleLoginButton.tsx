"use client";

import { googleLogin } from "@/lib/googleLogin";
import GoogleLogo from "./icons/GoogleLogo";

const GoogleLoginButton = () => {
  return (
    <div className="w-[354px] h-[60px] rounded-full border-solid border-[#F1F1F1] border-2 flex items-center">
      <GoogleLogo className="ml-14" />
      <button
        className="ml-[-50px] text-[20px] flex-grow text-center"
        onClick={() => googleLogin()}
      >
        구글로 로그인하기
      </button>
    </div>
  );
};

export default GoogleLoginButton;
