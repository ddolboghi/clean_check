import { getAlloewdFCMDevices } from "@/actions/userActions";
import DayCheckList from "@/components/checklist/DayCheckList";
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
  const allowedDevices = await getAlloewdFCMDevices(memberId);

  return (
    <DayCheckList
      nowDate={nowDate}
      memberId={memberId}
      allowedDevices={allowedDevices}
    />
  );
}
