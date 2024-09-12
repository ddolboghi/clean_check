import { getHaveCheckList } from "@/actions/userActions";
import Chatbot from "@/components/chat/Chatbot";
import SimpleSpinner from "@/components/ui/SimpleSpinner";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function page() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const result = await getHaveCheckList(user.id);

  return (
    <Suspense fallback={<SimpleSpinner />}>
      <Chatbot initialMessage={result.initialMessage} />
    </Suspense>
  );
}
