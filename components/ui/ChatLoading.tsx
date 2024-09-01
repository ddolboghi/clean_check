import CleanFreeLogoGrad from "../icons/CleanFreeLogoGrad";

export default function ChatLoading() {
  return (
    <div className="flex flex-row max-w-[283px] items-start">
      <div className="flex justify-center items-center rounded-full w-[40px] h-[40px] border-[#D2D2D2] border-[0.1px] flex-shrink-0">
        <CleanFreeLogoGrad width="25" height="25" />
      </div>
      <div className="flex flex-col justify-center bg-[#EEEEEE] max-w-[283px] min-w-[107px] min-h-[45px] rounded-b-[20px] rounded-tr-[20px] rounded-tl-[5px] ml-4 mt-[20px]">
        <div className="flex flex-row justify-center gap-[14px]">
          <div className="w-[7px] h-[7px] bg-[#528A80] rounded-full animate-wave"></div>
          <div className="w-[7px] h-[7px] bg-[#528A80] rounded-full animate-wave animation-delay-200"></div>
          <div className="w-[7px] h-[7px] bg-[#528A80] rounded-full animate-wave animation-delay-400"></div>
        </div>
      </div>
    </div>
  );
}
