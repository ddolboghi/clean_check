"use server";

import { createClient } from "@/utils/supabase/server";

export async function logout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error logout: ", error);
    return false;
  }
  return true;
}
