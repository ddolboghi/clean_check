import { getDaysFromDayGap } from "@/lib/dateTranslator";
import { Todo } from "@/utils/types";
import { NextRequest, NextResponse } from "next/server";

type ParsedCheckList =
  | {
      todoId: number;
      topic: string;
      todo: string;
      dayNum: number;
    }[]
  | null;

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const { chatMessages } = await request.json();
    console.log("[create-todolist] chatMessages: ", chatMessages);

    //gpt에 상담내역 주고 체크리스트 만들기
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

    console.log("gptCheckListMessageResponse: ", gptCheckListMessageResponse);
    const gptCheckListMessageData = await gptCheckListMessageResponse.json();
    let checklistMessage = null;
    if (gptCheckListMessageResponse.ok) {
      checklistMessage = gptCheckListMessageData.checklistMessage;
    } else {
      throw gptCheckListMessageData.error;
    }

    if (!checklistMessage) throw new Error("Generate checklist failed.");

    //gpt가 만든 체크리스트를 json으로 파싱하기
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
    let parsedCheckList: ParsedCheckList = null;
    if (parseCheckListResponse.ok) {
      parsedCheckList = parseCheckListData.parsedCheckList;
    } else {
      throw parseCheckListData.error;
    }

    if (!parsedCheckList) throw new Error("Parse checklist failed.");

    const todoList: Todo[] = [];

    parsedCheckList.forEach((checkEle) => {
      const todoEle: Todo = {
        todoId: checkEle.todoId,
        topic: checkEle.topic,
        todo: checkEle.todo,
        days: getDaysFromDayGap(checkEle.dayNum),
      };
      todoList.push(todoEle);
    });

    if (todoList.length === 0) throw new Error("Todolist conversion failed.");

    return NextResponse.json({ todoList });
  } catch (error) {
    console.error("[API] Error: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
