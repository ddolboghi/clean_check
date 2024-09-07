import { createClient } from "@/utils/supabase/server";
import { RequestDataType } from "@/utils/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { memberId, pushSubscription }: RequestDataType = await req.json();
    const supabase = createClient();

    const { error } = await supabase
      .from("push_notification")
      .delete()
      .eq("member_id", memberId)
      .eq("push_subscription", JSON.stringify(pushSubscription));

    if (error) {
      console.log(error);
      return NextResponse.json({ message: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ message: "success" }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
