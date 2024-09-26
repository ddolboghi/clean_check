"use client";

import {
  saveFCMToken,
  saveScheduledNotification,
} from "@/actions/pushNotification";
import { fetchToken } from "@/firebase";
import { useEffect, useState } from "react";
import SimpleSpinner from "../ui/SimpleSpinner";
import { usePathname } from "next/navigation";
import { RepeatOption } from "@/utils/types";

type CustomAlarmPopUpProps = {
  otherId: number;
  handleAlarmBtn: () => void;
  setOffset: (value: React.SetStateAction<number>) => void;
  alarmContent: string;
  setIsSetAlarm: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CustomAlarmPopUp({
  otherId,
  handleAlarmBtn,
  setOffset,
  alarmContent,
  setIsSetAlarm,
}: CustomAlarmPopUpProps) {
  const [notificationPermission, setNotificationPermission] =
    useState<string>();
  const [loading, setLoading] = useState(false);
  const [notificationTime, setNotificationTime] = useState("");
  const [repeatOption, setRepeatOption] = useState<RepeatOption>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof window.navigator !== "undefined" &&
      typeof Notification !== "undefined"
    ) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleNotificationPermission = () => {
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
              setLoading(true);
              return fetchToken();
            } else {
              setNotificationPermission("denied");
              throw new Error("Notification permission not granted.");
            }
          })
          .then((token) => {
            const userAgent = navigator.userAgent;
            if (token) return saveFCMToken(userAgent, token);
          })
          .then(() => {
            setLoading(false);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } else {
      console.log("window is undefined");
    }
  };

  const handleCancleBtn = () => {
    handleAlarmBtn();
    setOffset(0);
  };

  const handleSaveButton = async () => {
    handleNotificationPermission();
    if (!notificationTime) {
      return new Error("notification time is required");
    }

    const time = new Date(notificationTime);

    if (isNaN(time.getTime())) {
      return new Error("Invalid time value");
    }
    const title = pathname === "/storage" ? "보관함" : "나의 루틴";
    const body = alarmContent;
    const saveResponse = await saveScheduledNotification(
      time.toISOString(),
      title,
      body,
      repeatOption,
      pathname,
      otherId
    );
    if (!saveResponse) {
      alert("알람 설정에 문제가 발생했어요. 다시 시도해주세요.");
    } else {
      const host =
        process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
      const registerFcmResponse = await fetch(
        `${host}/api/send-scheduled-fcm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}`,
          },
        }
      );
      if (!registerFcmResponse.ok) {
        throw new Error(`Error: ${registerFcmResponse.status}`);
      }
    }
    setIsSetAlarm(true);
    handleCancleBtn();
  };

  const handleRepeatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRepeatOption(event.target.value as "daily" | "weekly");
  };

  const handleCancelRepeatOption = () => {
    setRepeatOption(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {loading ? (
        <div className="text-center">
          <p className="text-white">
            알림 설정 중이에요. 앱을 종료하지 말아주세요.
          </p>
          <p className="text-white">이 과정은 앱 설치 후 한 번만 실행되요.</p>
          <SimpleSpinner />
        </div>
      ) : (
        <div className="m-5 flex flex-col justify-between p-5 bg-white min-w-[200px] w-[364px] rounded-[23px] text-center h-[181px]">
          <input
            className="pt-10 outline-none"
            type="datetime-local"
            value={notificationTime}
            onChange={(e) => setNotificationTime(e.target.value)}
            required
          />
          <div className="flex justify-center items-center gap-2">
            <label>
              <input
                type="radio"
                value="daily"
                checked={repeatOption === "daily"}
                onChange={handleRepeatChange}
              />
              매일
            </label>
            <label>
              <input
                type="radio"
                value="weekly"
                checked={repeatOption === "weekly"}
                onChange={handleRepeatChange}
              />
              매주
            </label>
          </div>
          <div className="flex justify-end w-full gap-2">
            <button
              className="text-[12px] font-medium leading-loose text-center text-[#698388]"
              type="button"
              onClick={handleCancelRepeatOption}
            >
              반복 취소
            </button>
            <button
              className="h-[32px] w-[63px] text-[12px] font-medium leading-loose text-center text-[#698388] rounded-full"
              onClick={handleCancleBtn}
            >
              취소
            </button>
            <button
              className={`${
                notificationTime.length > 0 ? "bg-[#6AC7D7]" : "bg-[#C9DDE1]"
              } h-[32px] w-[63px] text-[12px] font-medium leading-loose text-center text-white rounded-full`}
              onClick={handleSaveButton}
            >
              저장
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
