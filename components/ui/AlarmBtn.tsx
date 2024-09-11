"use client";

import { saveFCMToken } from "@/actions/userActions";
import { fetchToken } from "@/firebase";
import Image from "next/image";
import bell from "@/public/assets/bell.svg";
import grayBell from "@/public/assets/grayBell.svg";
import { useEffect, useState } from "react";

type AlarmBtnProps = {
  memberId: string;
};

export default function AlarmBtn({ memberId }: AlarmBtnProps) {
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
            alert("12시, 18시, 22시에 알림을 보내드릴게요.");
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        alert("이미 알림을 받고 있어요.");
      }
    } else {
      console.log("window is undefined");
    }
  };
  return (
    <button onClick={clickPushHandler}>
      {notificationPermission === "granted" ||
      notificationPermission === "denied" ? (
        <Image src={grayBell} width={26} alt="알림 허용했거나 거부함" />
      ) : (
        <Image src={bell} width={26} alt="알림 허용 묻지 않음" />
      )}
    </button>
  );
}
