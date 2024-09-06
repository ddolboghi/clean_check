import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

type PushSubscriptionType = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  expirationTime: null;
};

type PushNofiticationType = {
  id: number;
  push_subscription: PushSubscriptionType;
  member_id: string;
}[];

webpush.setVapidDetails(
  "mailto:example@skin-check.vercel.app",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // vercel cron jobs
    if (
      req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const supabase = createClient();

    const { data, error } = await supabase
      .from("push_notification")
      .select("push_subscription")
      .returns<PushNofiticationType>();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    if (data) {
      const notificationPayload = {
        title: "✅ 지금 피부 루틴을 체크하세요!",
        body: "지킨 항목들을 체크해주세요.",
      };

      data.forEach(async (pushNotification) => {
        const rawPushSubscription = pushNotification.push_subscription;

        const pushSubscription: PushSubscriptionType = {
          endpoint: rawPushSubscription.endpoint,
          keys: {
            p256dh: rawPushSubscription.keys.p256dh,
            auth: rawPushSubscription.keys.auth,
          },
          expirationTime: null,
        };

        await webpush.sendNotification(
          pushSubscription,
          JSON.stringify(notificationPayload)
        );
      });

      return NextResponse.json({ message: "success" }, { status: 200 });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred", error: error },
      { status: 500 }
    );
  }
}
