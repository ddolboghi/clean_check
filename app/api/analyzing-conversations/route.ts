import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

const openAI = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { chatMessages } = await req.json();
    const checkListPrompt = process.env.NEXT_PUBLIC_ANALYZE_PROMPT as string;
    const chat = [
      { role: "system", content: checkListPrompt },
      ...chatMessages,
    ];

    const completion = await openAI.chat.completions.create({
      messages: chat as OpenAI.ChatCompletionMessageParam[],
      model: "gpt-4o-mini",
    });

    if (!completion) {
      throw new Error("Fail to generate analyzed conversations");
    }

    const analyzedConversation = completion.choices[0].message?.content;

    if (!analyzedConversation) {
      throw new Error("No analyzed conversation");
    }

    console.log("[analyzing-conversation] success.");
    return NextResponse.json({ analyzedConversation });
  } catch (error) {
    console.error("[analyzing-conversation] Error: ", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
