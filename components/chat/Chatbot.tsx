"use client";

import { FormEvent, useState } from "react";
import { chatCompletionForCreating, saveTodolist } from "@/actions/chat";
import { getIsOverQuestion } from "@/lib/chatLib";
import { useRouter } from "next/navigation";
import GeneratingCheckList from "./GeneratingCheckList";
import ResetChatPopUp from "../ui/ResetChatPopUp";
import ChatHeader from "./ChatHeader";
import { getDaysFromDayGap } from "@/lib/dateTranslator";
import {
  ChatGptMessage,
  GeneratingCheckListType,
  ParsedCheckList,
  Todo,
} from "@/utils/types";
import ChatSection from "./ChatSection";
import { initialMessageForCreating } from "@/data/chat";

export default function Chatbot() {
  const [userMessage, setUserMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatGptMessage[]>([
    {
      role: "assistant",
      content: initialMessageForCreating,
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

      const res = await chatCompletionForCreating(newChatMessages);

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
      <ChatSection
        messages={messages}
        loading={loading}
        handleSendMessage={handleSendMessage}
        disableChatInput={generatingCheckList.disableChatInput}
      />
    </main>
  );
}
