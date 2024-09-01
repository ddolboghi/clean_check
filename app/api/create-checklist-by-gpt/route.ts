import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const openAI = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { chatMessages } = await req.json();
    const checkListPrompt = process.env.NEXT_PUBLIC_CHEKLIST_PROMPT as string;
    const chat = [
      { role: "system", content: checkListPrompt },
      ...chatMessages,
    ];

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

    console.log("[createCheckListByGPT] checklistMessage create success.");
    return NextResponse.json({ checklistMessage });
  } catch (error) {
    console.error("[createCheckListByGPT] Error: ", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
