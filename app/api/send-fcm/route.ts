import { createClient } from "@/utils/supabase/server";
import admin, { ServiceAccount } from "firebase-admin";
import { MulticastMessage } from "firebase-admin/lib/messaging/messaging-api";
import { NextRequest, NextResponse } from "next/server";

type FcmTokens = {
  token: string;
}[];

const sendFCMNotification = async () => {
  // Firebase Admin SDK 초기화
  const serviceAccount: ServiceAccount = {
    projectId: process.env.NEXT_PUBLIC_FCM_PROJECT_ID,
    privateKey: process.env.NEXT_PUBLIC_FCM_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.NEXT_PUBLIC_FCM_CLIENT_EMAIL,
  };

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  const supabase = createClient();
  const { data: tokenData, error: tokenError } = await supabase
    .from("fcm_tokens")
    .select("*")
    .returns<FcmTokens>();

  if (!tokenData || tokenError) {
    throw tokenError;
  }

  const tokens = tokenData.map((data) => data.token);

  const messages: MulticastMessage = {
    data: {
      title: "✅지금 피부 루틴을 체크하세요!",
      body: "지킨 항목들을 체크해주세요.",
      click_action:
        `${process.env.NEXT_PUBLIC_SITE_URL!}/checklist` ||
        `${process.env.NEXT_PUBLIC_VERCEL_URL!}/checklist`,
    },
    tokens: tokens,
  };

  const res = await admin.messaging().sendEachForMulticast(messages);
  return res;
};

export async function POST(req: NextRequest) {
  try {
    if (
      req.headers.get("Authorization") !==
      `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}`
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const res = await sendFCMNotification();

    if (res) {
      return NextResponse.json(
        {
          message: "FCM notifications sent",
          successCount: res.successCount,
          failCount: res.failureCount,
          responses: res.responses,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An unexpected error occurred", error: error },
      { status: 500 }
    );
  }
}
