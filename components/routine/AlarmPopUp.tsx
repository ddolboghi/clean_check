"use client";

type AlarmPopUpProps = {
  handleAlarmBtn: () => void;
  setOffset: (value: React.SetStateAction<number>) => void;
};

export default function AlarmPopUp({
  handleAlarmBtn,
  setOffset,
}: AlarmPopUpProps) {
  const handleCancleBtn = () => {
    handleAlarmBtn();
    setOffset(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="m-5 flex flex-col justify-center p-5 bg-white min-w-[200px] w-[364px] rounded-[23px] text-center h-[181px]">
        <button onClick={handleAlarmBtn}>저장</button>
        <button onClick={handleCancleBtn}>취소</button>
      </div>
    </div>
  );
}
