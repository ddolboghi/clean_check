"use client";

import "@/style/popUpAnimation.css";
import LogoutButton from "../LogoutButton";
import { useEffect, useState } from "react";
import { fetchToken } from "@/firebase";
import {
  deleteFCMToken,
  getAllowedFCMDevice,
  saveFCMToken,
} from "@/actions/userActions";

type SettingPopUpProps = {
  onClickSettingBtn: () => void;
  memberId: string;
};

export default function SettingPopUp({
  onClickSettingBtn,
  memberId,
}: SettingPopUpProps) {
  const [notificationAllow, setNotificationAllow] = useState<boolean>(false);

  useEffect(() => {
    async function getAllowedDevices() {
      if (
        typeof window !== "undefined" &&
        typeof window.navigator !== "undefined"
      ) {
        const userAgent = navigator.userAgent;
        const allowedDevices = await getAllowedFCMDevice(memberId, userAgent);
        const isAllowedDevice = allowedDevices
          ? allowedDevices.devices.some((device) => device === userAgent)
          : false;
        setNotificationAllow(isAllowedDevice);
      }
    }

    getAllowedDevices();
  }, []);

  const clickPushHandler = () => {
    if (
      typeof window !== "undefined" &&
      typeof window.navigator !== "undefined"
    ) {
      Notification.requestPermission()
        .then((permission) => {
          if (permission === "granted") {
            return fetchToken();
          } else {
            throw new Error("Notification permission not granted.");
          }
        })
        .then((token) => {
          const userAgent = navigator.userAgent;
          if (token)
            return saveFCMToken(notificationAllow, memberId, userAgent, token);
        })
        .then(() => {
          setNotificationAllow(true);
        })
        .catch((error) => {
          console.error(error);
          setNotificationAllow(false);
        });
    } else {
      console.log("window is undefined");
      setNotificationAllow(false);
    }
  };

  const clickDenyPush = async () => {
    if (
      typeof window !== "undefined" &&
      typeof window.navigator !== "undefined"
    ) {
      const userAgent = navigator.userAgent;
      const isDeleted = await deleteFCMToken(memberId, userAgent);
      setNotificationAllow(!isDeleted);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="transform transition-transform duration-300 scale-100 opacity-100">
        <div className="pt-5 bg-white h-[200px] flex flex-col justify-between text-sm font-semibold tracking-tight w-[364px] rounded-[23px] scale-80 opacity-0 transition-all duration-300 ease-in-out animate-grow">
          {notificationAllow ? (
            <div className="flex flex-col items-center gap-5">
              <button onClick={clickPushHandler}>
                12시, 18시, 22시에 알림이 오지 않으면 여기를 눌러주세요.
              </button>
              <button onClick={clickDenyPush}>
                알림을 받기 싫다면 여기를 눌러주세요
              </button>
            </div>
          ) : (
            <button onClick={clickPushHandler}>
              알림 받기(12시, 18시, 22시)
            </button>
          )}
          <LogoutButton />
          <button
            className="bg-[#24E6C1] w-full h-[49px] leading-loose text-center text-white rounded-b-[23px]"
            onClick={onClickSettingBtn}
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
