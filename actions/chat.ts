"use server";

import OpenAI from "openai";
import { getKSTDateString } from "@/lib/dateTranslator";
import { ChatGptMessage, Todo } from "@/utils/types";
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
export async function chatCompletionForCreating(
  chatMessages: ChatGptMessage[]
) {
  try {
    const chatPrompt = process.env.NEXT_PUBLIC_CHAT_PROMPT as string;

    let chat: ChatGptMessage[] = [
      { role: "system", content: chatPrompt },
      ...chatMessages,
    ];

    // const isOverConversations = getIsOverQuestion(chat);
    // if (isOverConversations) {
    //   return {
    //     role: "assistant",
    //     content: "이제 상담 내용을 바탕으로 체크리스트를 만들게요.",
    //   } as ChatGptMessage;
    // }

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

    return { role: "assistant", content: assistantMessage } as ChatGptMessage;
  } catch (error) {
    console.log("[chatCompletion] Error: ", error);
    return {
      role: "assistant",
      content: "문제가 발생했어요. 나중에 다시 시도해 주세요.",
    } as ChatGptMessage;
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

    const { data, error } = await supabaseClient
      .from("check_list")
      .insert([
        {
          start_date: startDate,
          end_date: endDate,
          todo_list: todoList,
          member_id: user.id,
        },
      ])
      .select("id, member_id");

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Data not exist");

    console.log("[saveChecklist] Data inserted successfully: ", data);
    return {
      isSaved: true,
      memberId: data[0].member_id,
      checkListId: data[0].id,
    };
  } catch (error) {
    console.error("[saveChecklist] Error inserting data:", error);
    return { isSaved: false, memberId: null, checkListId: null };
  }
}

/**
 * 채팅 내용을 저장합니다.
 * @param memberId: OAuth user.id
 * @param checkListId: 체크리스트 저장 후 반환 받은 id
 * @param messages: analyzing-conversations API에 넘겨주는 messages'
 */
export async function saveChat(
  memberId: string,
  checkListId: number,
  messages: ChatGptMessage[]
) {
  try {
    const { data, error } = await supabaseClient.from("chat_history").insert([
      {
        member_id: memberId,
        check_list_id: checkListId,
        chat: messages,
      },
    ]);

    if (error) throw error;
    console.log("[saveChat] Success: ", data);
  } catch (error) {
    console.error("[saveChat] Error: ", error);
  }
}
