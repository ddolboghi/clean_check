"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";

export async function deleteFCMToken(memberId: string, userAgent: string) {
  try {
    console.log(userAgent);
    const { data, error } = await supabaseClient
      .from("fcm_tokens")
      .delete()
      .match({
        member_id: memberId,
        user_agent: userAgent,
      });

    if (error) throw error;
    console.log("[deleteFCMToken] Success");
    return true;
  } catch (error) {
    console.error("[deleteFCMToken] Error:", error);
    return false;
  }
}

type FCMToken = {
  member_Id: string;
  token: string;
  user_agent: string;
};

export async function getAllowedFCMDevice(memberId: string, userAgent: string) {
  try {
    const { data, error } = await supabaseClient
      .from("fcm_tokens")
      .select("*")
      .eq("member_id", memberId)
      .eq("user_agent", userAgent)
      .returns<FCMToken[]>();

    if (error) throw error;

    console.log("[getAllowedFCMDevice] Success");
    let devices: string[] = [];
    if (data.length > 0) {
      devices = data.map((fcmToken) => fcmToken.user_agent);
    }
    return devices;
  } catch (error) {
    console.error("[getAllowedFCMDevice] Error: ", error);
    return [];
  }
}

export async function saveFCMToken(
  memberId: string,
  userAgent: string,
  token: string
) {
  try {
    await deleteFCMToken(memberId, userAgent);
    const { data, error } = await supabaseClient.from("fcm_tokens").insert([
      {
        member_id: memberId,
        token: token,
        user_agent: userAgent,
      },
    ]);

    if (error) throw new Error("Saving token faild.");

    console.log("[saveFCMToken] Saving fcm token success: ", data);
  } catch (error) {
    console.error("[saveFCMToken] Error: ", error);
  }
}
