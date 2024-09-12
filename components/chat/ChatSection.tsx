import { ChatGptMessage } from "@/utils/types";
import ChatLoading from "../ui/ChatLoading";
import BotMessage from "./BotMessage";
import ChatInput from "./ChatInput";
import UserMessage from "./UserMessage";
import { FormEvent, useEffect, useRef } from "react";

type ChatSectionProps = {
  userMessage: string;
  setUserMessage: (value: string) => void;
  messages: ChatGptMessage[];
  loading: boolean;
  handleSendMessage: (e: FormEvent) => Promise<void>;
  disableChatInput: boolean;
};

export default function ChatSection({
  userMessage,
  setUserMessage,
  messages,
  loading,
  handleSendMessage,
  disableChatInput,
}: ChatSectionProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const assistantResponseLength = messages.filter(
    (c) => c.role === "assistant"
  ).length;
  const numberOfMaxQuestion =
    Number(process.env.NEXT_PUBLIC_NUMBER_OF_MAX_QUESTION as string) + 2;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <section className="px-7 pt-10 pb-[110px]">
      <div className="flex flex-col gap-4 overflow-y-auto flex-grow">
        {messages.map((m, i) => {
          return m.role === "assistant" ? (
            <BotMessage {...m} key={i} />
          ) : (
            <UserMessage {...m} key={i} />
          );
        })}
        {loading && <ChatLoading />}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput
        userMessage={userMessage}
        setUserMessage={setUserMessage}
        handleSendMessage={handleSendMessage}
        disableChatInput={disableChatInput}
      >
        <span className="font-light text-[14px] text-[#808080] text-right pr-8">
          남은 질문 횟수: {assistantResponseLength}/{numberOfMaxQuestion}
        </span>
      </ChatInput>
    </section>
  );
}
