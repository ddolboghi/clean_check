"use server";

import { Youtube } from "@/components/youtube/AddYoutube";
import { supabaseClient } from "@/lib/getSupabaseClient";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string;

export const insertYoutubes = async (youtubes: Youtube[]) => {
  try {
    for (let youtube of youtubes) {
      const video = await getVideoData(youtube.videoId);

      if (!video) throw new Error("Video not exist.");

      const title = video.snippet.title;
      const { data, error } = await supabaseClient.from("youtube").insert([
        {
          video_id: youtube.videoId,
          title: title,
          contents: youtube.contents,
        },
      ]);

      if (error) throw error;
    }
    console.log("Youtube data inserted successfully.");
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
