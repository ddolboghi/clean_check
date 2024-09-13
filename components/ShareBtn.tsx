"use client";

type ShareBtnProps = {
  shareUrl: string;
};

export default function ShareBtn({ shareUrl }: ShareBtnProps) {
  const shareContent = async () => {
    try {
      const shareData = {
        title: "피부 성격 테스트",
        text: "내 피부는 어떤 성격일까요? 지금 확인해보세요!",
        url: shareUrl,
      };

      if (
        typeof window !== "undefined" &&
        typeof window.navigator !== "undefined" &&
        typeof navigator.share !== "undefined" &&
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
      <button onClick={shareContent}>공유하기</button>
    </div>
  );
}
