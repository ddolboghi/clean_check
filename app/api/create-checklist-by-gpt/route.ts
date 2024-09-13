import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

const openAI = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { analyzedConversation }: { analyzedConversation: string } =
      await req.json();
    const checkListPrompt = process.env.NEXT_PUBLIC_CHEKLIST_PROMPT as string;

    const completion = await openAI.chat.completions.create({
      messages: [
        { role: "system", content: checkListPrompt },
        { role: "user", content: analyzedConversation },
      ],
      model: "gpt-4o-mini",
    });

    if (!completion) {
      throw new Error("Fail to generate Checklist");
    }

    const checklistMessage = completion.choices[0].message?.content;

    if (!checklistMessage) {
      throw new Error("No checklist");
    }

    console.log("[create-checklist] Success");
    return NextResponse.json({ checklistMessage });
  } catch (error) {
    console.error("[create-checklist] Error: ", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
