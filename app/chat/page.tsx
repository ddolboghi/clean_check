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
  const haveCheckList = await getHaveCheckList(user.id);

  if (haveCheckList) {
    redirect("/checklist");
  }

  return <Chatbot />;
}
