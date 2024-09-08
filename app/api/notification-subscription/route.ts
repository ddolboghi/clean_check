import { createClient } from "@/utils/supabase/server";
import { PushNofiticationType } from "@/utils/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;
    const memberId = pathname.split("/").pop();
    const supabase = createClient();

    const { data, error } = await supabase
      .from("push_notification")
      .select("push_subscription")
      .eq("member_id", memberId)
      .returns<PushNofiticationType>();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { data: null, message: error.message },
        { status: 400 }
      );
    }

    if (data)
      return NextResponse.json(
        { data: data, message: "success" },
        { status: 200 }
      );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { data: null, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
