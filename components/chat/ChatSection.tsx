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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <section className="px-7 py-[110px]">
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
      />
    </section>
  );
}
