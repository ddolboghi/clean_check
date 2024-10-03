"use client";

import {
  saveFCMToken,
  saveScheduledNotification,
} from "@/actions/pushNotification";
import { fetchToken } from "@/firebase";
import { useEffect, useState } from "react";
import SimpleSpinner from "./ui/SimpleSpinner";
import { usePathname } from "next/navigation";
import { daysOfWeek, week } from "@/data/date";
import { getNextDayDates } from "@/lib/dateTranslator";
import { ScheduledNotification } from "@/utils/types";
import CloseIcon from "./icons/CloseIcon";

type CustomAlarmPopUpProps = {
  otherId: number;
  handleAlarmBtn: () => void;
  setOffset: (value: React.SetStateAction<number>) => void;
  alarmContent: string;
  setIsSetAlarm: React.Dispatch<React.SetStateAction<boolean>>;
  notificationTimes: ScheduledNotification[];
};

export default function CustomAlarmPopUp({
  otherId,
  handleAlarmBtn,
  setOffset,
  alarmContent,
  setIsSetAlarm,
  notificationTimes,
}: CustomAlarmPopUpProps) {
  const [notificationPermission, setNotificationPermission] =
    useState<string>();
  const [loading, setLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([
    week[new Date().getDay()],
  ]);
  const [selectedHour, setSelectedHour] = useState<number>(
    new Date().getHours()
  );
  const [selectedMinute, setSelectedMinute] = useState<number>(
    new Date().getMinutes()
  );
  const pathname = usePathname();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof window.navigator !== "undefined" &&
      typeof Notification !== "undefined"
    ) {
      setNotificationPermission(Notification.permission);
    }

    if (notificationTimes.length !== 0) {
      const notifiactionHour = new Date(
        notificationTimes[0].notification_time
      ).getHours();
      const notificationMinute = new Date(
        notificationTimes[0].notification_time
      ).getMinutes();
      setSelectedHour(notifiactionHour);
      setSelectedMinute(notificationMinute);
      const initialSelectedDays = notificationTimes.map((notification) => {
        return week[new Date(notification.notification_time).getDay()];
      });
      setSelectedDays(initialSelectedDays);
    }
  }, []);

  const handleNotificationPermission = () => {
    if (
      typeof window !== "undefined" &&
      typeof window.navigator !== "undefined" &&
      typeof Notification !== "undefined"
    ) {
      if (notificationPermission !== "granted") {
        setLoading(true);
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
            if (token) return saveFCMToken(userAgent, token);
          })
          .then(() => {
            setLoading(false);
          })
          .catch((error) => {
            console.error(error);
            setLoading(false);
          });
        setLoading(false);
      }
    } else {
      console.log("window is undefined");
    }
  };

  const handleCancleBtn = () => {
    handleAlarmBtn();
    setOffset(0);
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  const handleSubmit = async () => {
    handleNotificationPermission();
    if (selectedDays.length === 0) {
      return;
    }
    const nextDayDates = getNextDayDates(
      selectedDays,
      selectedHour,
      selectedMinute
    );
    const title = pathname === "/storage" ? "보관함" : "나의 루틴";
    const body = alarmContent;
    const saveResponse = await saveScheduledNotification(
      nextDayDates,
      title,
      body,
      pathname,
      otherId
    );
    if (!saveResponse) {
      alert("알람 설정에 문제가 발생했어요. 다시 시도해주세요.");
    }
    setIsSetAlarm(true);
    handleCancleBtn();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="m-5 flex flex-col justify-between p-[30px] bg-white min-w-[200px] w-[364px] rounded-[23px] h-auto">
        <button
          className="flex flex-row justify-end items-center"
          onClick={handleCancleBtn}
        >
          <CloseIcon />
        </button>
        <p className="text-center">알림 기능은 아직 준비중이에요.</p>
      </div>
      {/* {loading ? (
        <div className="text-center">
          <p className="text-white">
            알림 설정 중이에요. 앱을 종료하지 말아주세요.
          </p>
          <p className="text-white">이 과정은 앱 설치 후 한 번만 실행되요.</p>
          <SimpleSpinner />
        </div>
      ) : (
        <div className="m-5 flex flex-col justify-between p-[30px] bg-white min-w-[200px] w-[364px] rounded-[23px] h-auto">
          <h1 className="text-[12px] text-[#AEAEAE] mb-[14px]">실천 요일</h1>
          <div className="flex flex-row items-center justify-between">
            {daysOfWeek.map((day) => (
              <button
                key={day.value}
                onClick={() => toggleDay(day.value)}
                className={`${
                  selectedDays.includes(day.value)
                    ? "bg-[#A6E0EB] text-[#2F6771]"
                    : "bg-[#EDF2F5] text-[#737373]"
                } border-none cursor-pointer rounded-[10px] w-[31px] h-[31px] text-center text-[12px]`}
              >
                {day.label}
              </button>
            ))}
          </div>
          <h1 className="text-[12px] text-[#AEAEAE] mt-[33px] mb-[14px]">
            시간
          </h1>
          <div className="flex flex-row justify-start items-center gap-[16px] mb-[29px]">
            <select
              onChange={(e) => setSelectedHour(parseInt(e.target.value))}
              className="w-[116px] h-[24px] outline-none border-[#CDCDCD] border-b-[1px] text-[#737373] font-medium"
              disabled={selectedDays.length === 0}
              value={selectedHour}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {i.toString().padStart(2, "0")}시
                </option>
              ))}
            </select>
            <select
              onChange={(e) => setSelectedMinute(parseInt(e.target.value))}
              className="w-[116px] h-[24px] outline-none border-[#CDCDCD] border-b-[1px] text-[#737373] font-medium"
              disabled={selectedDays.length === 0}
              value={selectedMinute}
            >
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={i}>
                  {i.toString().padStart(2, "0")}분
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end w-full gap-2">
            <button
              className="h-[32px] w-[63px] text-[12px] font-medium leading-loose text-center text-[#698388] rounded-full"
              onClick={handleCancleBtn}
            >
              취소
            </button>
            <button
              className={`${
                selectedDays.length > 0 ? "bg-[#6AC7D7]" : "bg-[#C9DDE1]"
              } h-[32px] w-[63px] text-[12px] font-medium leading-loose text-center text-white rounded-full`}
              onClick={handleSubmit}
            >
              저장
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
}
