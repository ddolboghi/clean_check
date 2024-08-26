"use client";

import React, { FormEvent, useState } from "react";
import BotMessage from "./ui/BotMessage";
import UserMessage from "./ui/UserMessage";
import ChatInput from "./ui/ChatInput";
import { chatCompletion } from "@/actions/chatCompletion";
import { NUMBER_OF_MAX_QUESTION } from "@/utils/constant";

export type Message = {
  content: string;
  role: "user" | "assistant" | "system";
};

export default function Chatbot() {
  const [userMessage, setUserMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "피부고민을 말해보세요." },
  ]);
  const [disableChatInput, setDisableChatInput] = useState<boolean>(false);
  const [lastResponse, setLastResponse] = useState<Message>();

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();

    if (!userMessage) return;

    // Create new message object
    const newMessage: Message = { role: "user", content: userMessage };

    // Update the message state
    setMessages((prevMessage) => [...prevMessage, newMessage]);
    setLoading(true);
    setUserMessage("");

    // Request to OPENAI
    try {
      // copy of messages
      const chatMessages = messages.slice(1);
      const newChatMessages = [...chatMessages, newMessage];

      // Call the chat completion API
      const res = await chatCompletion(newChatMessages);

      if (newChatMessages.length < NUMBER_OF_MAX_QUESTION) {
        setMessages((prevMessages) => [...prevMessages, res]);
      } else {
        //마지막 json답변을 supabase에 저장해야함
        console.log("마지막 답변:", res);
        setDisableChatInput(true);
        setLastResponse({
          role: "assistant",
          content: "이제 상담 내용을 바탕으로 체크리스트를 만들게요.",
        });
      }
    } catch (error) {
      console.log("API Error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        {messages &&
          messages.map((m, i) => {
            return m.role === "assistant" ? (
              <BotMessage {...m} key={i} />
            ) : (
              <UserMessage {...m} key={i} />
            );
          })}
        {disableChatInput && lastResponse && <BotMessage {...lastResponse} />}
        {loading && <div>로딩 중...</div>}
      </div>
      <ChatInput
        userMessage={userMessage}
        setUserMessage={setUserMessage}
        handleSendMessage={handleSendMessage}
        disableChatInput={disableChatInput}
      />
    </div>
  );
}
