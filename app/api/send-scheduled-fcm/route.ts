import { scheduleNotifications } from "@/actions/pushNotification";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    if (
      req.headers.get("Authorization") !==
      `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}`
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const scheduledJobs = await scheduleNotifications();

    return NextResponse.json(
      {
        message: "Notifications scheduled successfully",
        scheduledJobs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An unexpected error occurred", error: error },
      { status: 500 }
    );
  }
}
