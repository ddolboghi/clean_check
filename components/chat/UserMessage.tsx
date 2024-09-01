import { Message } from "./Chatbot";

export default function UserMessage({ role, content }: Message) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="flex flex-col justify-center bg-[#E1F5F1] max-w-[283px] min-h-[60px] rounded-b-[20px] rounded-tl-[20px] rounded-tr-[5px]">
          <p className="my-4 px-[18px]">{content}</p>
        </div>
      </div>
    );
  }
}
