import GoogleLoginButton from "@/components/GoogleLoginButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Login() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (user) {
    redirect("/checklist");
  }

  return (
    <div className="flex flex-col flex-1 p-4 w-full items-center">
      <GoogleLoginButton />
    </div>
  );
}
