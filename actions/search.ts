"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";

export interface SupabaseYoutube {
  id: number;
  video_id: string;
  title: string;
  contents: { [key: number]: string };
  rank: number;
}

export const getSearchResult = async (searchWord: string) => {
  const words = searchWord.split(/[\s,]+/);
  const formattedWords = words.map((word) => `'${word}'`).join(" | ");
  try {
    // const { data, error } = await supabaseClient
    //   .rpc("search_youtube", {
    //     search_word: formattedWords,
    //   })
    //   .returns<SupabaseYoutube[]>();

    const { data, error } = await supabaseClient
      .from("youtube")
      .select("*")
      .textSearch("fts", formattedWords)
      .returns<SupabaseYoutube[]>();

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Search result not exist.");

    console.log(data, data[0].rank);
    return data;
  } catch (error) {
    console.error("[getSearchResult] Error:", error);
    return null;
  }
};
