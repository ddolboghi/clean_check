"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const googleLogin = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: { access_type: "offline", prompt: "consent" },
      redirectTo: `${process.env.NEXT_PUBLIC_LOCALHOST}/auth/callback`,
    },
  });

  await createClient().auth.getUser();

  if (error) {
    console.log("error:", error);
    redirect("/error");
  }

  if (data.url) {
    redirect(data.url);
  }
};
