import Image from "next/image";
import bell from "@/public/assets/bell.svg";
import alarmPoint from "@/public/assets/alarmPoint.svg";

export default function NotAllowedBell() {
  return (
    <div className="absolute top-[4px] right-[90px]">
      <Image src={bell} width={19} alt="알림 버튼" />
      <Image
        src={alarmPoint}
        width={9}
        alt="알림 허용 안됨"
        className="relative bottom-[11.5px] left-[11.5px]"
      />
    </div>
  );
}
