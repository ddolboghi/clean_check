"use client";

import Image from "next/image";
import { useState } from "react";
import cleanFreeLogo2png from "@/public/assets/cleanfreeLogo2.png";

export default function ShareBtn() {
  const [imageUrl, setImageUrl] = useState("");

  const shareToInstagram = () => {
    // 인스타그램 공유 링크로 이동
    window.open(
      `https://www.instagram.com/create/story/?url=${cleanFreeLogo2png}`,
      "_blank"
    );
  };
  return (
    <div>
      <Image src={cleanFreeLogo2png} alt="Preview" width={500} height={400} />
      <button onClick={shareToInstagram}>인스타그램 스토리에 공유하기</button>
    </div>
  );
}
