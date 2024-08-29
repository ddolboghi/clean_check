import { getTodoListByDate, updateTodoDaysToDelay } from "@/actions/todoList";
import DayCheckList from "@/components/checklist/DayCheckList";
import SplashScreen from "@/components/SplashScreen";
import { getKSTDateString } from "@/lib/dateTranslator";
import { getUniqueTopic } from "@/lib/todoListlib";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function page() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (!user) {
    redirect("/login");
  }
  const memberId = user.id;
  const nowDate = getKSTDateString();

  return <DayCheckList nowDate={nowDate} memberId={memberId} />;
}
