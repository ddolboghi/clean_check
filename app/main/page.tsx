import { getMainRoutines } from "@/actions/routine";
import { countAeccessMainPage } from "@/actions/userActions";

import Routines from "@/components/routine/Routines";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function page() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (!user) redirect("/login");

  const routines = await getMainRoutines(user.id);
  await countAeccessMainPage(user);
  return (
    <main>
      <h1 className="z-10 sticky top-0 h-[80px] bg-white text-center text-[20px] text-[#191919] font-normal pt-2">
        나의 루틴
      </h1>
      <Routines routines={routines} />
    </main>
  );
}
