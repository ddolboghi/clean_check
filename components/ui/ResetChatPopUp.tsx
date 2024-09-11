import "@/style/popUpAnimation.css";

type ResetChatPopUpProps = {
  handleResetPopup: () => void;
  handleResetChat: () => void;
};

export default function ResetChatPopUp({
  handleResetPopup,
  handleResetChat,
}: ResetChatPopUpProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-20 flex justify-center items-center">
      <div className="w-full max-w-[500px] transform transition-transform duration-300 scale-100 opacity-100 items-center">
        <div className="bg-white text-sm font-semibold tracking-tight rounded-3xl scale-80 opacity-0 transition-all duration-300 ease-in-out animate-grow mx-7">
          <div className="relative flex flex-col justify-center items-center pt-5 rounded-none">
            <h2 className="text-xl tracking-tight leading-tight text-[#191919]">
              상담 새로 시작하기
            </h2>
            <p className="relative mt-3.5 mb-5 font-light leading-5 text-center text-[#6B6B6B]">
              다시 시작하시겠어요?
              <br />
              지금까지의 상담은 초기화 돼요.
            </p>
          </div>
          <div className="flex relative justify-around items-center w-full h-[45px] leading-loose text-center whitespace-nowrap text-[#528A80] font-medium border-[#BABABA] border-t-[0.4px]">
            <button className="self-stretch w-full" onClick={handleResetPopup}>
              돌아가기
            </button>
            <span className="border-[#BABABA] border-l-[0.1px] h-full"></span>
            <button className="self-stretch w-full" onClick={handleResetChat}>
              시작하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
