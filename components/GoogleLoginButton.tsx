"use client";

import { googleLogin } from "@/lib/googleLogin";
import GoogleLogo from "./icons/GoogleLogo";

const GoogleLoginButton = () => {
  return (
    <div className="w-[354px] h-[60px] rounded-full items-center border-solid border-[#DADADA] border-2">
      <GoogleLogo className="relative top-[50%] translate-y-[-50%] left-[15%]" />
      <button
        className="relative bottom-[50%] translate-y-[60%] text-[20px] left-[50%] translate-x-[-50%]"
        onClick={() => googleLogin()}
      >
        구글로 로그인하기
      </button>
    </div>
  );
};

export default GoogleLoginButton;
