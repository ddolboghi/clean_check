import { getHaveCheckList } from "@/actions/userActions";
import Chatbot from "@/components/chat/Chatbot";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function page() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const result = await getHaveCheckList(user.id);
  if (!result) redirect("/checklist");

  return (
    <Chatbot
      haveCheckList={result.haveCheckList}
      initialMessage={result.initialMessage}
    />
  );
}
