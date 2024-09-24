import { getMainRoutines } from "@/actions/routine";
import Routines from "@/components/routine/Routines";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function page() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (!user) redirect("/login");

  const routines = await getMainRoutines(user.id);

  return (
    <main>
      <h1 className="z-10 sticky top-0 h-[80px] bg-white text-center text-[20px] text-[#191919] font-normal pt-2">
        나의 루틴
      </h1>
      {!routines || routines.length === 0 ? (
        <div className="relative top-10 text-center w-full">
          루틴을 추가해보세요!
        </div>
      ) : (
        <Routines routines={routines} />
      )}
    </main>
  );
}
