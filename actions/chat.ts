"use server";

import { Message } from "@/components/chat/Chatbot";
import OpenAI from "openai";
import { number, z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { getIsOverQuestion } from "@/lib/chatLib";
import { getDaysFromDayGap, getKSTDateString } from "@/lib/dateTranslator";
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

async function createCheckListByGPT(chatMessages: Message[]) {
  const checkListPrompt = process.env.NEXT_PUBLIC_CHEKLIST_PROMPT as string;
  const chat = [{ role: "system", content: checkListPrompt }, ...chatMessages];

  try {
    const completion = await openAI.chat.completions.create({
      messages: chat as OpenAI.ChatCompletionMessageParam[],
      model: "gpt-4o-mini",
    });

    if (!completion) {
      throw new Error("Fail to generate Checklist");
    }

    const checklistMessage = completion.choices[0].message?.content;

    if (!checklistMessage) {
      throw new Error("No checklist");
    }

    return checklistMessage;
  } catch (error) {
    console.error("[getCheckListByGPT] Error: ", error);
    return null;
  }
}

const todoSchema = z.object({
  dayNum: z.number(),
  todoId: z.number(),
  todo: z.string(),
  topic: z.string(),
});

const checkList = z.object({ checkList: z.array(todoSchema) });

async function parseGPTJson(checklistMessage: string) {
  const jsonParsingPrompt = process.env
    .NEXT_PUBLIC_JSON_PARSING_PROMPT as string;

  try {
    const completion = await openAI.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: jsonParsingPrompt },
        { role: "user", content: checklistMessage },
      ],
      response_format: zodResponseFormat(checkList, "checkList"),
    });

    if (!completion) {
      throw new Error("Invalid response from OPENAI API!");
    }

    const jsonResponse = completion.choices[0].message.parsed;

    if (!jsonResponse || !jsonResponse.checkList) {
      throw new Error("No message from OPENAI API");
    }

    return jsonResponse.checkList;
  } catch (error) {
    console.log("[parseGPTJson] Error: ", error);
    return null;
  }
}

type ParsedCheckList =
  | {
      todoId: number;
      topic: string;
      todo: string;
      dayNum: number;
    }[]
  | null;

/**
 * Create a todo list message and parse it into JSON.
 * @param chatMessages
 * @returns
 */
export async function createTodoList(chatMessages: Message[]) {
  try {
    const gptCheckListMessageResponse = await fetch(
      `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/create-checklist-by-gpt`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatMessages }),
      }
    );

    const gptCheckListMessageData = await gptCheckListMessageResponse.json();
    let checklistMessage = null;
    if (gptCheckListMessageResponse.ok) {
      checklistMessage = gptCheckListMessageData.checklistMessage;
    } else {
      throw gptCheckListMessageData.error;
    }

    if (!checklistMessage) {
      throw new Error("checklistMessage is empty.");
    }

    const parseCheckListResponse = await fetch(
      `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/parse-gpt-checklist`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ checklistMessage }),
      }
    );

    const parseCheckListData = await parseCheckListResponse.json();
    let parsedTodoList: ParsedCheckList = null;
    if (parseCheckListResponse.ok) {
      parsedTodoList = parseCheckListData.parsedCheckList;
    } else {
      throw parseCheckListData.error;
    }

    if (!parsedTodoList) {
      throw new Error("Error in parseGPTJson");
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

    console.log("[createTodolist] Create todo_list success.");
    return todoList;
  } catch (error) {
    console.error("[createTodolist] Error: ", error);
    return null;
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
