"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";

export interface SupabaseProfile {
  id: string;
  full_name: string;
  email: string;
}

export async function getAllProfiles(): Promise<SupabaseProfile[]> {
  try {
    const { data: profilesData, error: profilesError } = await supabaseClient
      .from("profiles")
      .select("*");

    if (profilesError) throw profilesError;

    if (!profilesData) {
      return [];
    }

    console.log("[getAllProfiles] Get all profiles success", profilesData);
    return profilesData;
  } catch (error) {
    console.error("[getAllProfiles] ErrorgetAllProfiles:", error);
    return [];
  }
}
