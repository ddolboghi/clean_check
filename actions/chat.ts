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
  apiKey: process.env.NEXT_PUBLIC_OPENAI_AIP_KEY,
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
    console.log("isOverConversations: ", isOverConversations);
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

/**
 * Create a todo list message and parse it into JSON.
 * @param chatMessages
 * @returns
 */
export async function createTodoList(chatMessages: Message[]) {
  try {
    const checklistMessage = await createCheckListByGPT(chatMessages);

    if (!checklistMessage) {
      throw new Error("Error in getCheckListByGPT");
    }

    const checklistWithNumberDays = await parseGPTJson(checklistMessage);

    if (!checklistWithNumberDays) {
      throw new Error("Error in parseGPTJson");
    }

    const checklist: Todo[] = [];

    checklistWithNumberDays.forEach((checkEle) => {
      const todoEle: Todo = {
        todoId: checkEle.todoId,
        topic: checkEle.topic,
        todo: checkEle.todo,
        days: getDaysFromDayGap(checkEle.dayNum),
      };
      checklist.push(todoEle);
    });

    return checklist;
  } catch (error) {
    console.error("[saveChecklist] Error: ", error);
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
  } catch (error) {
    console.error("[saveChecklist] Error inserting data:", error);
  }
}
