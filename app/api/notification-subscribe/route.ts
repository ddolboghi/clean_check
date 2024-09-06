import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { memberId, pushSubscription } = await req.json();
    const supabase = createClient();

    const { data, error } = await supabase
      .from("push_notification")
      .insert([
        {
          member_id: memberId,
          created_at: new Date().toISOString(),
          push_subscription: pushSubscription,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    } else {
      return NextResponse.json(
        { message: "success", id: data[0].id },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
