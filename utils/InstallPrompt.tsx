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

  if (!isStandalone) {
    return null; //설치하지 않은 사람들에게만 보여주기
  }

  return (
    <div>
      <h3>앱 설치하기</h3>
      <button>홈화면에 앱 추가</button>
      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button ios
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
      )}
    </div>
  );
}
