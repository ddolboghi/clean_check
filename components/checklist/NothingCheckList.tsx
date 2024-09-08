import Link from "next/link";
import CleanFreeLogoGrad from "../icons/CleanFreeLogoGrad";

export default function NothingCheckList() {
  return (
    <section className="flex-grow translate-y-5 bg-white flex flex-col gap-4 justify-center items-center text-center text-[20px] rounded-t-[40px]">
      <CleanFreeLogoGrad />
      <p className="leading-relaxed">
        현재 체크리스트가 없어요.
        <br />
        AI 상담으로 내 피부에 꼭 맞는
        <br />
        주간 체크리스트를 받아 볼 수 있어요.
      </p>
      <div className="text-white mt-[10px] mx-auto rounded-3xl flex flex-row items-center justify-center gap-2 bg-[#24E6C1] w-[165px] h-[45px]">
        <Link href="/chat">상담하러 가기</Link>
      </div>
    </section>
  );
}
