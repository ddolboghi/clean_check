import Image from "next/image";
import bell from "@/public/assets/bell.svg";
import alarmPoint from "@/public/assets/alarmPoint.svg";

export default function LoadingAllowedBell() {
  return (
    <div className="absolute top-[4px] right-[90px]">
      <Image src={bell} width={19} alt="알림 버튼" />
      <div className="absolute top-[10px] left-0 w-full h-full animate-spin-around">
        <Image
          src={alarmPoint}
          width={9}
          alt="알림 허용 안됨"
          className="absolute top-0 left-1/2 transform -translate-x-1/2"
        />
      </div>
    </div>
  );
}
