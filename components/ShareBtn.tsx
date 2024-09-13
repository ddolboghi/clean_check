"use client";

import Image from "next/image";
import cleanFreeLogo2png from "@/public/assets/cleanfreeLogo2.png";
import { useEffect, useState } from "react";

export default function ShareBtn() {
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/assets/cleanfreeLogo2.png`);
    }
  }, []);

  const shareData = {
    title: "인스타그램 스토리 공유",
    text: "이 이미지를 확인해보세요!",
    url: shareUrl!,
  };

  const shareContent = () => {
    try {
      if (
        typeof window !== "undefined" &&
        typeof window.navigator !== "undefined" &&
        shareUrl &&
        navigator.canShare(shareData)
      ) {
        window.navigator.share(shareData);
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
