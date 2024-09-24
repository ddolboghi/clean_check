"use client";

import { usePathname } from "next/navigation";
import SearchIcon from "./icons/SearchIcon";
import HomeIcon from "./icons/HomeIcon";
import StorageIcon from "./icons/StorageIcon";
import SearchIconColor from "./icons/SearchIconColor";
import HomeIconColor from "./icons/HomeIconColor";
import StorageIconColor from "./icons/StorageIconColor";
import Link from "next/link";

export default function Menu() {
  const pathname = usePathname();
  console.log(pathname);

  return (
    <nav className="fixed z-10 bottom-0 w-full h-[80px] bg-white flex flex-row justify-between items-center px-[60px]">
      <Link href="/main" className="flex flex-col items-center">
        {pathname === "/main" ? <HomeIconColor /> : <HomeIcon />}
        <span
          className={`pt-1 text-[8px] ${
            pathname === "/main" ? "text-[#6AC7D7]" : "text-[#8C8C8C]"
          }`}
        >
          홈
        </span>
      </Link>
      <Link href="/search" className="flex flex-col items-center">
        {pathname === "/search" ? <SearchIconColor /> : <SearchIcon />}
        <span
          className={`pt-1 text-[8px] ${
            pathname === "/search" ? "text-[#6AC7D7]" : "text-[#8C8C8C]"
          }`}
        >
          검색
        </span>
      </Link>
      <Link href="/storage" className="flex flex-col items-center">
        {pathname === "/storage" ? <StorageIconColor /> : <StorageIcon />}
        <span
          className={`pt-1 text-[8px] ${
            pathname === "/storage" ? "text-[#6AC7D7]" : "text-[#8C8C8C]"
          }`}
        >
          보관함
        </span>
      </Link>
    </nav>
  );
}
