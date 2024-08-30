"use client";

import { FormEvent, useState } from "react";
import BotMessage from "./BotMessage";
import UserMessage from "./UserMessage";
import ChatInput from "./ChatInput";
import { chatCompletion, createTodoList, saveTodolist } from "@/actions/chat";
import { getIsOverQuestion } from "@/lib/chatLib";

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

    try {
      const chatMessages = messages.slice(1);
      const newChatMessages = [...chatMessages, newMessage];

      const res = await chatCompletion(newChatMessages);

      const isOverQuestion = getIsOverQuestion(newChatMessages);
      if (!isOverQuestion) {
        setMessages((prevMessages) => [...prevMessages, res]);
      } else {
        setDisableChatInput(true);
        setLastResponse(res);

        // 로딩 컴포넌트 띄우기
        const todoList = await createTodoList(messages);

        if (!todoList) {
          throw new Error("Fail to create todo list.");
        }

        await saveTodolist(todoList);

        //checklist 페이지로 이동하기
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
