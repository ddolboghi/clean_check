"use client";

import { FormEvent, useState } from "react";
import BotMessage from "./BotMessage";
import UserMessage from "./UserMessage";
import ChatInput from "./ChatInput";
import { chatCompletion, createTodoList, saveTodolist } from "@/actions/chat";
import { getIsOverQuestion } from "@/lib/chatLib";
import { useRouter } from "next/navigation";
import GeneratingCheckList from "./GeneratingCheckList";
import ResetChatPopUp from "../ui/ResetChatPopUp";
import ChatHeader from "./ChatHeader";
import ChatLoading from "../ui/ChatLoading";

export type Message = {
  content: string;
  role: "user" | "assistant" | "system" | "final";
};

export default function Chatbot() {
  const [userMessage, setUserMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "안녕하세요, 스킨체크입니다." },
  ]);
  const [disableChatInput, setDisableChatInput] = useState<boolean>(false);
  const [generatingCheckList, setGeneratingCheckList] =
    useState<boolean>(false);
  const [closeResetPopup, setCloseResetPopup] = useState<boolean>(true);
  const route = useRouter();

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
      console.log(isOverQuestion);
      if (!isOverQuestion) {
        setMessages((prevMessages) => [...prevMessages, res]);
      } else {
        setGeneratingCheckList(true);
        setDisableChatInput(true);
        const todoList = await createTodoList(messages);

        if (!todoList) {
          throw new Error("Fail to create todo list.");
        }

        const isSaved = await saveTodolist(todoList);

        if (isSaved) {
          setGeneratingCheckList(!isSaved);
          setTimeout(() => {
            route.push("/checklist");
          }, 1000);
        } else {
          alert(
            "체크리스트 생성 중 문제가 발생했어요. 상담 페이지로 돌아갈게요."
          );
        }
      }
    } catch (error) {
      console.log("API Error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPopup = () => {
    setCloseResetPopup(!closeResetPopup);
  };

  const handleResetChat = () => {
    const resetMessages = messages.slice(0, 1);
    setMessages(resetMessages);
    setCloseResetPopup(!closeResetPopup);
  };

  return (
    <>
      {/* 체크리스트 생성 모달로 띄워야 렌더링되면서 함수가 실행된다. */}
      {generatingCheckList && (
        <GeneratingCheckList isGenerateCheckList={generatingCheckList} />
      )}
      {!closeResetPopup && (
        <ResetChatPopUp
          handleResetPopup={() => handleResetPopup()}
          handleResetChat={() => handleResetChat()}
        />
      )}
      <ChatHeader
        routeBack={() => route.back()}
        handleResetPopup={handleResetPopup}
      />
      <section className="px-7">
        <div className="flex flex-col gap-4">
          {messages &&
            messages.map((m, i) => {
              return m.role === "assistant" ? (
                <BotMessage {...m} key={i} />
              ) : (
                <UserMessage {...m} key={i} />
              );
            })}
          {loading && <ChatLoading />}
        </div>
        <ChatInput
          userMessage={userMessage}
          setUserMessage={setUserMessage}
          handleSendMessage={handleSendMessage}
          disableChatInput={disableChatInput}
        />
      </section>
    </>
  );
}
