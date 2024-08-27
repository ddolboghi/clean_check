import { getTodoListByDay } from "@/actions/todoList";
import DayCheckList from "@/components/checklist/DayCheckList";
import SplashScreen from "@/components/SplashScreen";
import { getDayOfWeek } from "@/lib/dateTranslator";
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

  const today = new Date().toString();
  const todayOfWeek = getDayOfWeek(today);

  const checkListOfDay = await getTodoListByDay(todayOfWeek, memberId);
  const todayTopics = checkListOfDay
    ? checkListOfDay.filteredTodos.map((todo) => todo.topic)
    : [];

  return (
    <>
      {checkListOfDay ? (
        <DayCheckList
          checkListId={checkListOfDay.checkListId}
          todayOfWeek={todayOfWeek}
          todoListOfDay={checkListOfDay.filteredTodos}
          completionsOfDay={checkListOfDay.filteredCompletions}
          memberId={memberId}
          todayTopics={["전체", ...todayTopics]}
        />
      ) : (
        <SplashScreen />
      )}
    </>
  );
}
