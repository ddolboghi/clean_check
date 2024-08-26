"use server";
import { Message } from "@/components/Chatbot";
import { NUMBER_OF_MAX_QUESTION } from "@/utils/constant";
import OpenAI from "openai";

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
    // Chat to be send to OPEN AI
    console.log(`Reaching out to OPENAI API...`);
    const prompt = process.env.NEXT_PUBLIC_PROMPT;
    const checkListPrompt = process.env.NEXT_PUBLIC_CHEKLIST_PROMPT;
    let chat = [{ role: "system", content: prompt }, ...chatMessages];

    if (chat.length > NUMBER_OF_MAX_QUESTION) {
      chat = [{ role: "system", content: checkListPrompt }, ...chatMessages];
    }

    const completion = await openAI.chat.completions.create({
      messages: chat as OpenAI.ChatCompletionMessageParam[],
      model: "gpt-4o-mini",
    });

    if (!completion) {
      throw new Error("Invalid response from OPENAI API!");
    }

    // Bot/Assistant Message
    const assistantMessage = completion.choices[0].message?.content;

    if (!assistantMessage) {
      throw new Error("No message from OPENAI API");
    }

    console.log("COMPLETION");
    return { role: "assistant", content: assistantMessage } as Message;
  } catch (error) {
    console.log(error);
    return {
      role: "assistant",
      content: "죄송합니다. 문제가 발생했어요. 나중에 다시 시도해 주세요.",
    } as Message;
  }
}
