"use client";

import { formatNumber, formatTimeDifference } from "@/lib/youtube";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import SpreadArrowDown from "../icons/SpreadArrowDown";
import SpreadArrowUp from "../icons/SpreadArrowUp";
import { getChannelData, getVideoData } from "@/actions/youtube";
import SimpleSpinner from "../ui/SimpleSpinner";

type YoutubeImbedProps = {
  videoId: string;
  children: React.ReactNode;
};

export default function YoutubeImbed({ videoId, children }: YoutubeImbedProps) {
  const [videoData, setVideoData] = useState<any>(null);
  const [channelData, setChannelData] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const childrenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchYoutubeData = async () => {
      const video = await getVideoData(videoId);

      if (!video) {
        console.error("Error fetching video data");
        return;
      }
      setVideoData(video);
      const channel = await getChannelData(video.snippet.channelId);
      if (!channel) {
        console.error("Error fetching channel data");
        return;
      }
      setChannelData(channel);
    };

    fetchYoutubeData();
  }, [videoId]);

  useEffect(() => {
    if (childrenRef.current) {
      const childrenHeight = childrenRef.current.scrollHeight;
      setShowToggle(childrenHeight > 106);
    }
  }, [videoData, channelData]);

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

  if (!videoData || !channelData) return <SimpleSpinner />;

  return (
    <div className="mx-auto w-full max-w-4xl px-5">
      <div
        className={`relative border border-[#DEDEDE] rounded-[15px] ${
          isExpanded ? "h-auto" : "max-h-[456px] overflow-hidden"
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
                  구독자 {formatNumber(channelData.statistics.subscriberCount)}{" "}
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
            <YouTube
              videoId={videoId}
              opts={opts}
              className="w-full h-full"
              iframeClassName="rounded-[12px]"
            />
          </div>
          <h1 className="text-[11px] text-[#5C5C5C] mt-2 mb-4">
            {videoData["snippet"]["title"]}
          </h1>
          <div
            ref={childrenRef}
            className={`mb-4 ${
              isExpanded ? "" : "max-h-[105.5px] overflow-hidden"
            }`}
          >
            {children}
          </div>
          {showToggle && (
            <button
              onClick={toggleExpand}
              className="absolute bg-white w-full flex items-center justify-center bottom-0 py-2 left-0 rounded-b-[15px]"
            >
              {isExpanded ? <SpreadArrowUp /> : <SpreadArrowDown />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
