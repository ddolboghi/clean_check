import { createClient } from "@/utils/supabase/server";
import { PushNofiticationType, RequestDataType } from "@/utils/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("[notification-subscribe] start");
    const { memberId, pushSubscription }: RequestDataType = await req.json();
    const supabase = createClient();

    const { data: selectData, error: selectError } = await supabase
      .from("push_notification")
      .select("push_subscription")
      .eq("member_id", memberId)
      .returns<PushNofiticationType>();

    if (selectError) throw selectError;

    const isExistedAuth = selectData.some(
      (data) => data.push_subscription.keys.auth === pushSubscription.keys.auth
    );

    if (isExistedAuth) {
      console.log(
        "[notification-subscribe] push_subscription keys.auth existed."
      );
      return NextResponse.json(
        { message: "The subscription already exists." },
        { status: 200 }
      );
    }

    const { data: insertData, error: insertError } = await supabase
      .from("push_notification")
      .insert([
        {
          member_id: memberId,
          created_at: new Date().toISOString(),
          push_subscription: pushSubscription,
        },
      ]);

    if (insertError) {
      return NextResponse.json(
        { message: insertError.message },
        { status: 400 }
      );
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
