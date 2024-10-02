"use server";

import { Youtube } from "@/components/youtube/AddYoutube";
import { supabaseClient } from "@/lib/getSupabaseClient";
import OpenAI from "openai";
import { SupabaseYoutube } from "./search";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string;
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export const insertYoutubes = async (youtubes: Youtube[]) => {
  try {
    for (let youtube of youtubes) {
      const video = await getVideoData(youtube.videoId);
      if (!video) throw new Error("Video not exist.");

      const title = video.snippet.title;
      const channelId = video.snippet.channelId;

      const channel = await getChannelData(channelId);
      if (!channel) throw new Error("Channel not exist.");

      const channelName = channel.snippet.title;

      let inputText =
        channelName +
        " " +
        title +
        " " +
        Object.values(youtube.contents).join(" ");
      inputText = inputText.replace(/[^a-zA-Z0-9가-힣\s]/g, "");

      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: inputText,
        encoding_format: "float",
        dimensions: 512,
      });

      const embedding = response.data[0].embedding;

      const { data, error } = await supabaseClient.from("youtube").insert([
        {
          video_id: youtube.videoId,
          title: title,
          contents: youtube.contents,
          embedding: embedding,
        },
      ]);

      if (error) throw error;
    }
    return true;
  } catch (error) {
    console.error("Error inserting youtube data:", error);
    return false;
  }
};

export const getVideoData = async (videoId: string) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${API_KEY}&part=snippet,statistics`
    );
    const data = await response.json();

    if (data.items.length > 0) {
      return data.items[0];
    } else {
      throw new Error("Video data not exist.");
    }
  } catch (error) {
    console.error("Error fetching video data:", error);
    return null;
  }
};

export const getChannelData = async (channelId: string) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?id=${channelId}&key=${API_KEY}&part=snippet,statistics`
    );
    const data = await response.json();
    if (data.items.length > 0) {
      return data.items[0];
    } else {
      throw new Error("Channel data not exist.");
    }
  } catch (error) {
    console.error("Error fetching channel data:", error);
    return null;
  }
};

export const getAllYoutubes = async () => {
  try {
    const { data, error } = await supabaseClient
      .from("youtube")
      .select("*")
      .returns<SupabaseYoutube[]>();

    if (error) throw error;
    if (!data) throw new Error("Data is null");
    console.log("[getAllYoutubes] success.");
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const deleteSavedYoutube = async (youtubeId: number) => {
  try {
    const { error } = await supabaseClient
      .from("youtube")
      .delete()
      .eq("id", youtubeId);

    if (error) throw error;
    console.log("[deleteSavedYoutube] Success.");
    return true;
  } catch (e) {
    console.error("[deleteSavedYoutube] Error: ", e);
    return false;
  }
};
