"use client";

import Image from "next/image";
import cleanFreeLogo2png from "@/public/assets/cleanfreeLogo2.png";

export default function ShareBtn() {
  const shareContent = async () => {
    try {
      if (
        typeof window !== "undefined" &&
        typeof window.navigator !== "undefined"
      ) {
        await navigator.share({
          title: "인스타그램 스토리 공유",
          text: "이 이미지를 확인해보세요!",
          url: `${location.origin}${cleanFreeLogo2png}`,
        });
      }
    } catch (error) {
      console.error("공유 실패:", error);
    }
  };
  return (
    <div>
      <Image src={cleanFreeLogo2png} alt="Preview" width={500} height={400} />
      <button onClick={shareContent}>인스타그램 스토리에 공유하기</button>
    </div>
  );
}
