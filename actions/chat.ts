"use server";

import { Message } from "@/components/chat/Chatbot";
import OpenAI from "openai";
import { getIsOverQuestion } from "@/lib/chatLib";
import { getKSTDateString } from "@/lib/dateTranslator";
import { Todo } from "@/utils/types";
import { supabaseClient } from "@/lib/getSupabaseClient";
import { createClient } from "@/utils/supabase/server";

const openAI = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

/**
 * Chat Completion
 * @param chatMessages
 * @returns
 */
export async function chatCompletion(chatMessages: Message[]) {
  try {
    const chatPrompt = process.env.NEXT_PUBLIC_CHAT_PROMPT as string;

    let chat: Message[] = [
      { role: "system", content: chatPrompt },
      ...chatMessages,
    ];

    const isOverConversations = getIsOverQuestion(chat);
    if (isOverConversations) {
      return {
        role: "assistant",
        content: "이제 상담 내용을 바탕으로 체크리스트를 만들게요.",
      } as Message;
    }

    const completion = await openAI.chat.completions.create({
      messages: chat as OpenAI.ChatCompletionMessageParam[],
      model: "gpt-4o-mini",
    });

    if (!completion) {
      throw new Error("Invalid response from OPENAI API!");
    }

    // Bot Message
    const assistantMessage = completion.choices[0].message?.content;

    if (!assistantMessage) {
      throw new Error("No message from OPENAI API");
    }

    return { role: "assistant", content: assistantMessage } as Message;
  } catch (error) {
    console.log("[chatCompletion] Error: ", error);
    return {
      role: "assistant",
      content: "문제가 발생했어요. 나중에 다시 시도해 주세요.",
    } as Message;
  }
}

/**
 * @param todoList @type Todo[]
 */
export async function saveTodolist(todoList: Todo[]) {
  const startDate = getKSTDateString();
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const endYear = end.getFullYear();
  const endMonth = String(end.getMonth() + 1).padStart(2, "0");
  const endDay = String(end.getDate()).padStart(2, "0");
  const endDate = `${endYear}-${endMonth}-${endDay}`;

  try {
    const {
      data: { user },
      error: userError,
    } = await createClient().auth.getUser();

    if (!user) {
      throw userError;
    }

    const { data, error } = await supabaseClient.from("check_list").insert([
      {
        start_date: startDate,
        end_date: endDate,
        todo_list: todoList,
        member_id: user.id,
      },
    ]);

    if (error) throw error;

    console.log("[saveChecklist] Data inserted successfully: ", data);
    return true;
  } catch (error) {
    console.error("[saveChecklist] Error inserting data:", error);
    return false;
  }
}

/**
 * 오늘 상담 기록을 저장한다.
 * @param messages - typeof Message[]. 'assistant'와 'user' role인 message만 추출한다.
 */
export async function saveChat(messages: Message[]) {
  //member_id: user.id
  //chat_history<jsonb>: messages
  //
}
