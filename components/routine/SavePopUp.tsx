"use client";

type SavePopUpProps = {
  handleSaveBtn: () => void;
  setOffset: (value: React.SetStateAction<number>) => void;
};

export default function SavePopUp({
  handleSaveBtn,
  setOffset,
}: SavePopUpProps) {
  const handleCancleBtn = () => {
    handleSaveBtn();
    setOffset(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="m-5 flex flex-col justify-center p-5 bg-white min-w-[200px] w-[364px] rounded-[23px] text-center h-[181px]">
        <button onClick={handleSaveBtn}>보관하기</button>
        <button onClick={handleCancleBtn}>취소</button>
      </div>
    </div>
  );
}
