"use client";

import { getSearchResult, SupabaseYoutube } from "@/actions/search";
import { useState } from "react";
import YoutubeImbed from "../youtube/YoutubeImbed";
import YoutubeRoutines from "../youtube/YoutubeRoutines";
import SearchIcon from "../icons/SearchIcon";

export default function Search() {
  const [searchWord, setSearchWord] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<SupabaseYoutube[] | null>();

  const handleSearchBtn = async () => {
    if (searchWord) {
      const response = await getSearchResult(searchWord);

      if (!response) console.error("Error fetching video data");
      setSearchResult(response);
    }
  };

  return (
    <div>
      <div className="z-10 fixed top-14 left-[50%] right-0 -translate-x-[50%] bg-[#F4F6F6] rounded-full w-[92%] h-[40px] flex flex-row justify-between pr-2 pl-6 gap-1">
        <input
          onChange={(e) => setSearchWord(e.target.value)}
          placeholder="검색어를 입력하세요."
          className="flex-grow bg-[#F4F6F6] bg-transparent focus:outline-none"
        />
        <button
          className="w-[40px] flex justify-center items-center"
          onClick={handleSearchBtn}
        >
          <SearchIcon />
        </button>
      </div>
      <div className="mt-28 flex flex-col gap-[25px] items-center">
        {searchResult ? (
          searchResult.map((result, resultIdx) => (
            <YoutubeImbed key={resultIdx} videoId={result.video_id}>
              <YoutubeRoutines routines={result.contents} />
            </YoutubeImbed>
          ))
        ) : (
          <div>검색 결과가 없습니다.</div>
        )}
      </div>
    </div>
  );
}
