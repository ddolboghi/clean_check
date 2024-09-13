"use client";

import { saveFCMToken } from "@/actions/userActions";
import { fetchToken } from "@/firebase";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type AlarmPopUpProps = {
  memberId: string;
  handleClickBell: () => void;
  setIsAllowed: Dispatch<SetStateAction<boolean>>;
};

export default function AlarmPopUp({
  memberId,
  handleClickBell,
  setIsAllowed,
}: AlarmPopUpProps) {
  const [notificationPermission, setNotificationPermission] =
    useState<string>();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof window.navigator !== "undefined" &&
      typeof Notification !== "undefined"
    ) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const clickPushHandler = () => {
    if (
      typeof window !== "undefined" &&
      typeof window.navigator !== "undefined" &&
      typeof Notification !== "undefined"
    ) {
      if (notificationPermission !== "granted") {
        Notification.requestPermission()
          .then((permission) => {
            if (permission === "granted") {
              setNotificationPermission("granted");
              return fetchToken();
            } else {
              setNotificationPermission("denied");
              throw new Error("Notification permission not granted.");
            }
          })
          .then((token) => {
            const userAgent = navigator.userAgent;
            if (token) return saveFCMToken(memberId, userAgent, token);
          })
          .then(() => {
            setIsAllowed(true);
            alert("12시, 18시, 22시에 알림을 보내드릴게요.");
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } else {
      console.log("window is undefined");
    }
  };
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-20 flex justify-center items-center">
      <div className="w-full max-w-[500px] transform transition-transform duration-300 scale-100 opacity-100 items-center">
        <div className="bg-white text-sm font-semibold tracking-tight rounded-3xl scale-80 opacity-0 transition-all duration-300 ease-in-out animate-grow mx-7">
          {notificationPermission === "granted" ? (
            <div
              className="relative flex flex-col justify-center items-center pt-5 rounded-none"
              onClick={handleClickBell}
            >
              <h2 className="text-xl tracking-tight leading-tight text-[#191919]">
                이미 알림을 받고 있어요.
              </h2>
              <p className="relative mt-3.5 mb-5 font-light leading-5 text-center text-[#6B6B6B]">
                알림 해제 기능은 준비 중이에요.
              </p>
            </div>
          ) : notificationPermission !== "denied" ? (
            <div className="h-[200px] flex flex-col items-center justify-between">
              <div className="pt-12 text-center">
                <h2 className="text-2xl tracking-tight leading-tight text-[#191919]">
                  알림을 받으시겠어요?
                </h2>
                <p className="relative mt-3.5 mb-5 font-light text-[14px] leading-5 text-center text-[#6B6B6B]">
                  잊지 않고 관리할 수 있도록 도와드릴게요.
                </p>
              </div>
              <div className="flex relative justify-around items-center w-full h-[50px] leading-loose text-center whitespace-nowrap font-medium">
                <button
                  className="self-stretch w-full bg-[#F6F6F6] rounded-bl-3xl text-[#AFAFAF]"
                  onClick={handleClickBell}
                >
                  괜찮아요
                </button>
                <button
                  className="self-stretch w-full bg-[#24E6C1] rounded-br-3xl text-[#077A65]"
                  onClick={clickPushHandler}
                >
                  알림 받기
                </button>
              </div>
            </div>
          ) : (
            <div
              className="relative flex flex-col justify-center items-center pt-5 rounded-none"
              onClick={handleClickBell}
            >
              <h2 className="text-xl tracking-tight leading-tight text-[#191919]">
                알림을 받고 싶으신가요?
              </h2>
              <p className="relative mt-3.5 mb-5 font-light leading-5 text-center text-[#6B6B6B]">
                기기 알림 권한을 허용하려면 앱을 삭제하고 다시 깔아주세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
