import { Skeleton } from "./skeleton";

export default function SearchSkeleton() {
  return (
    <div className="h-[400px] w-full px-5">
      <div className="flex flex-col items-center justify-center gap-2 px-3 border border-[#DEDEDE] rounded-[15px]">
        <Skeleton className="w-full h-[33px] mt-3" />
        <Skeleton className="w-full h-[206.4px]" />
        <Skeleton className="w-full h-[16.5px]" />
        <Skeleton className="w-full h-[105.5px] mb-4" />
      </div>
    </div>
  );
}
