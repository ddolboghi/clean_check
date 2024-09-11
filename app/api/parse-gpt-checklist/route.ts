import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

const openAI = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const todoSchema = z.object({
  dayNum: z.number(),
  todoId: z.number(),
  todo: z.string(),
  topic: z.string(),
});

const checkList = z.object({ checkList: z.array(todoSchema) });

export async function POST(req: NextRequest) {
  try {
    const { checklistMessage } = await req.json();
    const jsonParsingPrompt = process.env
      .NEXT_PUBLIC_JSON_PARSING_PROMPT as string;

    const completion = await openAI.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: jsonParsingPrompt },
        { role: "user", content: checklistMessage },
      ],
      response_format: zodResponseFormat(checkList, "checkList"),
    });

    if (!completion) {
      throw new Error("Fail to parse Checklist");
    }

    const jsonResponse = completion.choices[0].message.parsed;

    if (!jsonResponse || !jsonResponse.checkList) {
      throw new Error("No message from OPENAI API");
    }

    const parsedCheckList = jsonResponse.checkList;

    return NextResponse.json({ parsedCheckList });
  } catch (error) {
    console.error("[parsingCheckListByGPT] Error: ", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
