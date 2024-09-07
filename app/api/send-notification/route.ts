import { createClient } from "@/utils/supabase/server";
import { PushNofiticationType, PushSubscriptionType } from "@/utils/types";
import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

export async function POST(req: NextRequest) {
  try {
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

    if (data && data.length > 0) {
      const notificationPayload = {
        title: "✅ 지금 피부 루틴을 체크하세요!",
        body: "지킨 항목들을 체크해주세요.",
      };

      const options = {
        vapidDetails: {
          subject: "mailto:example@skin-check.vercel.app",
          publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
          privateKey: process.env.VAPID_PRIVATE_KEY!,
        },
        TTL: 60,
      };

      const results = await Promise.all(
        data.map(async (pushNotification) => {
          const rawPushSubscription = pushNotification.push_subscription;

          const pushSubscription: PushSubscriptionType = {
            endpoint: rawPushSubscription.endpoint,
            keys: {
              p256dh: rawPushSubscription.keys.p256dh,
              auth: rawPushSubscription.keys.auth,
            },
            expirationTime: null,
          };

          try {
            const res = await webpush.sendNotification(
              pushSubscription,
              JSON.stringify(notificationPayload),
              options
            );
            return { success: true, response: res };
          } catch (error) {
            console.error("webpush error: ", error);
            return { success: false, error: error };
          }
        })
      );

      const successCount = results.filter((r) => r.success).length;
      const failCount = results.length - successCount;

      return NextResponse.json(
        {
          message: "Notifications sent",
          successCount,
          failCount,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "No push notifications to send" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred", error: error },
      { status: 500 }
    );
  }
}
