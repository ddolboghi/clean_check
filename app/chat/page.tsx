import { getHaveCheckList } from "@/actions/userActions";
import Chatbot from "@/components/chat/Chatbot";
import { redirect } from "next/navigation";

export default async function page() {
  const haveCheckList = await getHaveCheckList();

  if (haveCheckList) {
    redirect("/checklist");
  }

  return <Chatbot />;
}
