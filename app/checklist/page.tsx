import { getAlloewdFCMDevices } from "@/actions/userActions";
import DayCheckList from "@/components/checklist/DayCheckList";
import SimpleSpinner from "@/components/ui/SimpleSpinner";
import { getKSTDateString } from "@/lib/dateTranslator";
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
  const memberId = user.id;
  const nowDate = getKSTDateString();
  const allowedDevices = await getAlloewdFCMDevices(memberId);

  return (
    <Suspense fallback={<SimpleSpinner />}>
      <DayCheckList
        nowDate={nowDate}
        memberId={memberId}
        allowedDevices={allowedDevices}
      />
    </Suspense>
  );
}
