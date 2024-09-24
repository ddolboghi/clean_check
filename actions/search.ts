"use server";

import { supabaseClient } from "@/lib/getSupabaseClient";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export interface SupabaseYoutube {
  id: number;
  video_id: string;
  title: string;
  contents: { [key: number]: string };
  rank: number;
}

export const getSearchResult = async (searchWord: string) => {
  const words = searchWord.split(/[\s,]+/);
  words.push(searchWord);
  const formattedWords = words.map((word) => `'${word}'`).join(" | ");
  try {
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: searchWord,
      encoding_format: "float",
      dimensions: 512,
    });

    const [{ embedding }] = embeddingResponse.data;

    const { data, error } = await supabaseClient.rpc("hybrid_search", {
      query_text: searchWord,
      query_embedding: embedding,
      match_threshold: 0.5, // choose an appropriate threshold for your data
      match_count: 10, // choose the number of matches
    });

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Search result not exist.");

    // console.log(data);
    return data;
  } catch (error) {
    console.error("[getSearchResult] Error:", error);
    return null;
  }
};
