"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import BotMessage from "./BotMessage";
import UserMessage from "./UserMessage";
import ChatInput from "./ChatInput";
import { chatCompletion, createTodoList } from "@/actions/chat";
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
    {
      role: "assistant",
      content:
        "안녕하세요. 상담을 시작할게요.😊 먼저, 피부에 어떤 문제가 있는지 구체적으로 말씀해 주실 수 있을까요? 예를 들어, 발진, 여드름, 건조함, 가려움증 등 어떤 증상이 있는지 알려주세요.🧐",
    },
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

        const todoList = await createTodoList(newChatMessages);

        if (!todoList) {
          throw new Error("Fail to create todo list.");
        }

        const saveResponse = await fetch(
          `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/save-todolist`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ todoList }),
          }
        );

        const saveData = await saveResponse.json();
        let isSaved = null;
        if (saveResponse.ok) {
          isSaved = saveData;
        } else {
          throw saveData.error;
        }

        if (isSaved) {
          setGeneratingCheckList(!isSaved);
          route.push("/checklist");
        } else {
          throw new Error("Fail to save todo list.");
        }
      }
    } catch (error) {
      alert("체크리스트 생성 중 문제가 발생했어요. 상담 페이지로 돌아갈게요.");
      route.refresh();
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

  //스크롤 자동 이동
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <main>
      {/* 체크리스트 생성 모달로 띄워야 렌더링되면서 함수가 실행된다. */}
      {!generatingCheckList && (
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
      <section className="px-7 py-[110px]">
        <div className="flex flex-col gap-4 overflow-y-auto flex-grow">
          {messages &&
            messages.map((m, i) => {
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
    </main>
  );
}
