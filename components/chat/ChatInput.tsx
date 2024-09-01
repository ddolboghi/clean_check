import { FormEvent, useRef, useEffect } from "react";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [userMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_LENGTH_INPUT_MESSAGE) {
      setUserMessage(e.target.value);
    }
  };

  return (
    <form
      className="fixed bottom-8 left-[50%] translate-x-[-50%] w-[370px] flex flex-row gap-2.5 justify-between items-center text-center text-base tracking-tight bg-white rounded-[30px] shadow-[5px_4px_20px_rgba(0,0,0,0.13)] overflow-hidden"
      onSubmit={handleSendMessage}
    >
      <div className="w-full flex-grow flex items-center overflow-y-auto">
        <label htmlFor="userChatInput" className="sr-only">
          User Chat Input
        </label>
        <textarea
          ref={textareaRef}
          id="userChatInput"
          value={userMessage}
          onChange={handleChange}
          placeholder="무엇이든 물어보세요."
          maxLength={MAX_LENGTH_INPUT_MESSAGE}
          disabled={disableChatInput}
          className="py-3 pl-[24px] w-full min-h-[36px] max-h-[150px] z-0 bg-transparent border-none outline-none resize-none overflow-y-auto"
        />
      </div>
      <div className="pr-[24px] py-2 flex items-center justify-end bg-white">
        <span className="font-thin pr-2">{userMessage.length}/500</span>
        <button type="submit" disabled={userMessage.length === 0}>
          {userMessage.length === 0 ? <BeforeSend /> : <AfterSend />}
        </button>
      </div>
    </form>
  );
}
