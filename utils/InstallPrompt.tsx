"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (isStandalone) {
    return null; //설치하지 않은 사람들에게만 보여주기
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-5 bg-white min-w-[200px] max-w-[364px] rounded-[23px] text-center h-[181px]">
        <h1 className="font-medium text-[24px] pb-5">앱 설치하기</h1>
        {isIOS ? (
          <p className="text-[14px] text-[#4A7069]">
            공유 버튼을 누른 후<br />
            '홈화면에 추가'를 누르세요.
          </p>
        ) : (
          <p className="text-[14px] text-[#4A7069]">
            주소창에서 다운로드 버튼을 클릭하세요.
          </p>
        )}
      </div>
    </div>
  );
}
