import { FormEvent } from "react";
import AfterSend from "../icons/AfterSend";
import BeforeSend from "../icons/BeforeSend";
import { MAX_LENGTH_INPUT_MESSAGE } from "@/utils/constant";

type ChatProps = {
  userMessage: string;
  setUserMessage: (value: string) => void;
  handleSendMessage: (e: FormEvent) => void;
  disableChatInput: boolean;
};

export default function ChatInput({
  userMessage,
  setUserMessage,
  handleSendMessage,
  disableChatInput,
}: ChatProps) {
  return (
    <form
      className="fixed bottom-8 left-[50%] translate-x-[-50%] w-[370px] h-[56px] flex gap-2.5 justify-between items-center text-center text-base tracking-tight bg-white rounded-[30px] shadow-[5px_4px_20px_rgba(0,0,0,0.13)]"
      onSubmit={handleSendMessage}
    >
      <label htmlFor="userChatInput" className="sr-only">
        User Chat Input
      </label>
      <input
        id="userChatInput"
        type="text"
        value={userMessage}
        onChange={(e) => {
          if (e.target.value.length <= MAX_LENGTH_INPUT_MESSAGE) {
            setUserMessage(e.target.value);
          }
        }}
        placeholder="무엇이든 물어보세요."
        maxLength={MAX_LENGTH_INPUT_MESSAGE}
        disabled={disableChatInput}
        className="pl-[24px] w-full z-0 my-auto bg-transparent border-none outline-none"
      />
      <div className="pr-[24px] items-center flex flex-row gap-2 justify-center">
        <span className="font-thin">{userMessage.length}/500</span>
        <button type="submit" disabled={userMessage.length === 0}>
          {userMessage.length === 0 ? <BeforeSend /> : <AfterSend />}
        </button>
      </div>
    </form>
  );
}
