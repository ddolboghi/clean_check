import Image from "next/image";
import bell from "@/public/assets/bell.svg";

export default function AllowedBell() {
  return (
    <div className="absolute top-[4px] right-[90px]">
      <Image src={bell} width={19} alt="알림 버튼" />
    </div>
  );
}
