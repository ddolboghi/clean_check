"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import BotMessage from "./BotMessage";
import UserMessage from "./UserMessage";
import ChatInput from "./ChatInput";
import { chatCompletion, saveTodolist } from "@/actions/chat";
import { getIsOverQuestion } from "@/lib/chatLib";
import { useRouter } from "next/navigation";
import GeneratingCheckList from "./GeneratingCheckList";
import ResetChatPopUp from "../ui/ResetChatPopUp";
import ChatHeader from "./ChatHeader";
import ChatLoading from "../ui/ChatLoading";
import { getDaysFromDayGap } from "@/lib/dateTranslator";
import {
  ChatGptMessage,
  GeneratingCheckListType,
  ParsedCheckList,
  Todo,
} from "@/utils/types";

export default function Chatbot() {
  const [userMessage, setUserMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatGptMessage[]>([
    {
      role: "assistant",
      content:
        "안녕하세요. 상담을 시작할게요.😊 최근 피부에 어떤 문제가 있는지 구체적으로 말씀해 주실 수 있을까요? 예를 들어, 발진, 여드름, 건조함, 가려움증 등 어떤 증상이 있는지 알려주세요.🧐",
    },
  ]);
  const [generatingCheckList, setGeneratingCheckList] =
    useState<GeneratingCheckListType>({
      disableChatInput: false,
      generateTodoListMessageStart: false,
      generateParsedTodoListStart: false,
      saveCheckListStart: false,
      savedCheckList: false,
    });
  const [closeResetPopup, setCloseResetPopup] = useState<boolean>(true);
  const [percentage, setPercentage] = useState<number>(0);

  const route = useRouter();

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();

    if (!userMessage) return;

    // Create new message object
    const newMessage: ChatGptMessage = { role: "user", content: userMessage };

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
        setGeneratingCheckList({
          ...generatingCheckList,
          disableChatInput: true,
          generateTodoListMessageStart: true,
        });
        setPercentage(25);

        const gptTodoListMessageResponse = await fetch(
          `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/create-checklist-by-gpt`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ chatMessages: chatMessages }),
          }
        );

        if (!gptTodoListMessageResponse.ok) {
          throw new Error(
            `gptCheckListMessageResponse status: ${gptTodoListMessageResponse.status}`
          );
        }

        const gptCheckListMessageData = await gptTodoListMessageResponse.json();
        let checklistMessage = null;
        if (gptTodoListMessageResponse.ok) {
          checklistMessage = gptCheckListMessageData.checklistMessage;
        } else {
          throw gptCheckListMessageData.error;
        }

        if (!checklistMessage) {
          console.log("Error checklistMessage: ", checklistMessage);
          throw new Error("checklistMessage is empty.");
        }

        setGeneratingCheckList({
          ...generatingCheckList,
          disableChatInput: true,
          generateTodoListMessageStart: true,
          generateParsedTodoListStart: true,
        });
        setPercentage(50);

        const parseCheckListResponse = await fetch(
          `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/parse-gpt-checklist`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ checklistMessage: checklistMessage }),
          }
        );

        if (!parseCheckListResponse.ok)
          throw new Error(
            `parseCheckListResponse status: ${parseCheckListResponse.status}`
          );

        const parseCheckListData = await parseCheckListResponse.json();
        let parsedTodoList: ParsedCheckList = null;
        if (parseCheckListResponse.ok) {
          parsedTodoList = parseCheckListData.parsedCheckList;
        } else {
          throw parseCheckListData.error;
        }

        if (!parsedTodoList) {
          console.log("Error parsedTodoList: ", parsedTodoList);
          throw new Error(`Error in parseGPTJson: ${parseCheckListResponse}`);
        }

        const todoList: Todo[] = [];

        parsedTodoList.forEach((parsedTodo) => {
          const todoEle: Todo = {
            todoId: parsedTodo.todoId,
            topic: parsedTodo.topic,
            todo: parsedTodo.todo,
            days: getDaysFromDayGap(parsedTodo.dayNum),
          };
          todoList.push(todoEle);
        });

        if (!todoList || todoList.length === 0) {
          throw new Error("Fail to create todo list.");
        }

        setGeneratingCheckList({
          ...generatingCheckList,
          disableChatInput: true,
          generateTodoListMessageStart: true,
          generateParsedTodoListStart: true,
          saveCheckListStart: true,
        });
        setPercentage(75);

        const isSaved = await saveTodolist(todoList);

        if (isSaved) {
          setGeneratingCheckList({
            disableChatInput: true,
            generateTodoListMessageStart: true,
            generateParsedTodoListStart: true,
            saveCheckListStart: true,
            savedCheckList: true,
          });
          setPercentage(100);
          route.push("/checklist");
        } else {
          throw new Error("Fail to save todo list.");
        }
      }
    } catch (error) {
      alert("체크리스트 생성 중 문제가 발생했어요. 상담 페이지로 돌아갈게요.");
      setGeneratingCheckList({
        disableChatInput: false,
        generateTodoListMessageStart: false,
        generateParsedTodoListStart: false,
        saveCheckListStart: false,
        savedCheckList: false,
      });
      const resetMessages = messages.slice(0, 1);
      setMessages(resetMessages);
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
      {generatingCheckList.disableChatInput && (
        <GeneratingCheckList
          generateCheckList={generatingCheckList}
          percentage={percentage}
        />
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
          disableChatInput={generatingCheckList.disableChatInput}
        />
      </section>
    </main>
  );
}
