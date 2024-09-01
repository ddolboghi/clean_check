import CleanFreeLogoGrad from "../icons/CleanFreeLogoGrad";
import { Message } from "./Chatbot";

export default function BotMessage({ role, content }: Message) {
  return (
    <div className="flex flex-row max-w-[283px] items-start">
      <div className="flex justify-center items-center rounded-full w-[40px] h-[40px] border-[#D2D2D2] border-[0.1px] flex-shrink-0">
        <CleanFreeLogoGrad width="25" height="25" />
      </div>
      <div className="flex flex-col justify-center bg-[#EEEEEE] max-w-[283px] min-h-[60px] rounded-b-[20px] rounded-tr-[20px] rounded-tl-[5px] ml-4 mt-[20px]">
        <p className="my-4 px-[18px]">{content}</p>
      </div>
    </div>
  );
}
