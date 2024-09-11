import { getHaveCheckList } from "@/actions/userActions";
import DayCheckList from "@/components/checklist/DayCheckList";
import NothingCheckList from "@/components/checklist/NothingCheckList";
import SimpleSpinner from "@/components/ui/SimpleSpinner";
import { Skeleton } from "@/components/ui/skeleton";
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
  const result = await getHaveCheckList(memberId);

  return (
    <Suspense fallback={<SimpleSpinner />}>
      <DayCheckList nowDate={nowDate} memberId={memberId}>
        {result.haveCheckList ? (
          <section className="px-6 flex flex-col gap-5">
            <Skeleton className="relative left-1/2 -translate-x-1/2 top-20 w-full h-[60px] rounded-full" />
            <Skeleton className="relative left-1/2 -translate-x-1/2 top-20 w-full h-[60px] rounded-full" />
            <Skeleton className="relative left-1/2 -translate-x-1/2 top-20 w-full h-[60px] rounded-full" />
            <Skeleton className="relative left-1/2 -translate-x-1/2 top-20 w-full h-[60px] rounded-full" />
          </section>
        ) : (
          <NothingCheckList />
        )}
      </DayCheckList>
    </Suspense>
  );
}
