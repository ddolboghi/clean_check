import { getFolders } from "@/actions/storage";
import Storages from "@/components/storage/Storages";

export default async function page() {
  const folders = await getFolders();

  return (
    <main className="bg-[#F6F9F9] h-screen">
      <h1 className="z-10 fixed top-0 left-0 right-0 text-center text-[20px] text-[#191919] font-normal pt-2">
        보관함
      </h1>
      <Storages initFolders={folders} />
    </main>
  );
}
