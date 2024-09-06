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
      <div className="bg-white min-w-[300px]">
        <h3>앱 설치하기</h3>
        <button>홈화면에 앱 추가</button>
        {isIOS ? (
          <p>
            기기에 앱을 설치하려면 공유 버튼을 누르세요.
            <span role="img" aria-label="share icon">
              {" "}
              ⎋{" "}
            </span>
            그리고 "홈화면에 추가"를 누르세요.
            <span role="img" aria-label="plus icon">
              {" "}
              ➕{" "}
            </span>
            .
          </p>
        ) : (
          //안드로이드 설치 유도 수정하기
          <p>주소창에서 다운로드 버튼을 클릭하세요.</p>
        )}
      </div>
    </div>
  );
}
