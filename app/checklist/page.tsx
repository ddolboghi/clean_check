import { getHaveCheckList } from "@/actions/userActions";
import DayCheckList from "@/components/checklist/DayCheckList";
import NothingCheckList from "@/components/checklist/NothingCheckList";
import { getKSTDateString } from "@/lib/dateTranslator";
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
  const haveCheckList = await getHaveCheckList(memberId);

  return (
    <main>
      {haveCheckList ? (
        <DayCheckList nowDate={nowDate} memberId={memberId} />
      ) : (
        <NothingCheckList />
      )}
    </main>
  );
}
