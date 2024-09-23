"use client";

import { formatNumber, formatTimeDifference } from "@/lib/youtube";
import Image from "next/image";
import { useEffect, useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import SpreadArrowDown from "../ui/SpreadArrowDown";
import SpreadArrowUp from "../ui/SpreadArrowUp";
import { getChannelData, getVideoData } from "@/actions/youtube";

type YoutubeImbedProps = {
  videoId: string;
  children: React.ReactNode;
};

export default function YoutubeImbed({ videoId, children }: YoutubeImbedProps) {
  const [videoData, setVideoData] = useState(null);
  const [channelData, setChannelData] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchYoutubeData = async () => {
      const video = await getVideoData(videoId);

      if (!video) console.error("Error fetching video data");
      setVideoData(video);
      const channel = await getChannelData(video.snippet.channelId);
      if (!channel) console.error("Error fetching channel data");
      setChannelData(channel);
    };

    fetchYoutubeData();
  }, [videoId]);

  const opts: YouTubeProps["opts"] = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 0, //1이면 자동재생
    },
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!videoData || !channelData) return <div>Loading...</div>;

  return (
    <div className="mx-auto w-full max-w-4xl px-5">
      <div
        className={`relative h-[456px] flex flex-col border border-[#DEDEDE] rounded-[15px] ${
          isExpanded ? "h-auto" : "overflow-hidden"
        }`}
      >
        <div className="px-3">
          <div className="flex flex-row justify-between mt-3 mb-1">
            <div className="flex flex-row gap-1">
              <Image
                src={channelData.snippet.thumbnails.default.url}
                width={33}
                height={33}
                className="rounded-full aspect-square"
                alt="채널 썸네일"
              />
              <div className="flex flex-col">
                <span className="text-[#707070] text-[12px] font-semibold">
                  {channelData.snippet.title}
                </span>
                <span className="text-[#747474] text-[9px]">
                  구독자 {formatNumber(channelData.statistics.subscriberCount)}
                  명
                </span>
              </div>
            </div>
            <div>
              <span className="text-[#9D9D9D] text-[10px] pr-[7px]">
                조회수 {formatNumber(videoData["statistics"]["viewCount"])}
              </span>
              <span className="text-[#9D9D9D] text-[10px]">
                {formatTimeDifference(
                  new Date(videoData["snippet"]["publishedAt"])
                )}
              </span>
            </div>
          </div>
          <div className="aspect-video">
            <YouTube videoId={videoId} opts={opts} className="w-full h-full" />
          </div>
          <h1 className="text-[11px] text-[#5C5C5C] mb-4">
            {videoData["snippet"]["title"]}
          </h1>
          <div className={`mb-6 ${isExpanded ? "" : "overflow-hidden"}`}>
            {children}
          </div>
          <button
            onClick={toggleExpand}
            className="absolute bg-white w-full flex items-center justify-center bottom-0 py-2 left-0 rounded-b-[15px]"
          >
            {isExpanded ? <SpreadArrowUp /> : <SpreadArrowDown />}
          </button>
        </div>
      </div>
    </div>
  );
}
