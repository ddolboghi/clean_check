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

  const copyImageToClipboard = async () => {
    const img = document.createElement("img");
    img.src = cleanFreeLogo2png.src;

    img.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(async (blob) => {
          if (blob) {
            await navigator.clipboard.write([
              new ClipboardItem({
                [blob.type]: blob,
              }),
            ]);
            shareContent(blob);
          }
        });
      }
    };
  };

  const shareContent = async (blob: Blob) => {
    try {
      const file = new File([blob], "image.png", { type: blob.type });
      const shareData = {
        title: "인스타그램 스토리 공유",
        text: "이 이미지를 확인해보세요!",
        files: [file],
      };

      if (
        typeof window !== "undefined" &&
        typeof window.navigator !== "undefined" &&
        typeof navigator.share !== "undefined" &&
        shareUrl &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
      } else {
        throw new Error("This browser doesn't support sharing.");
      }
    } catch (error) {
      alert(`공유 실패: ${error}`);
    }
  };
  return (
    <div>
      <Image src={cleanFreeLogo2png} alt="Preview" width={500} height={400} />
      <button onClick={copyImageToClipboard}>
        인스타그램 스토리에 공유하기
      </button>
    </div>
  );
}
