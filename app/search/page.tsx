import Search from "@/components/search/Search";

export default function page() {
  return (
    <main>
      <h1 className="z-10 fixed top-0 left-0 right-0 h-[96px] bg-white text-center text-[20px] text-[#191919] font-normal pt-2">
        루틴 검색
      </h1>
      <Search />
    </main>
  );
}
