"use client";

import { insertYoutubes } from "@/actions/youtube";
import { useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";

export type Youtube = {
  videoId: string;
  contents: { [key: number]: string };
};

export default function AddYoutube() {
  const [youtubes, setYoutubes] = useState<Youtube[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const updatedYoutubes = [...youtubes];

    if (name === "videoId") {
      updatedYoutubes[index].videoId = value;
    } else if (name.startsWith("content")) {
      const contentIndex = parseInt(name.split("-")[1]);
      updatedYoutubes[index].contents[contentIndex] = value;
    }

    setYoutubes(updatedYoutubes);
  };

  const handleAddYoutube = () => {
    setYoutubes([...youtubes, { videoId: "", contents: {} }]);
  };

  const handleAddContent = (index: number) => {
    const updatedYoutubes = [...youtubes];
    const newContentIndex =
      Object.keys(updatedYoutubes[index].contents).length + 1;
    updatedYoutubes[index].contents[newContentIndex] = "";
    setYoutubes(updatedYoutubes);
  };

  const handleDeleteYoutube = (index: number) => {
    const updatedYoutubes = youtubes.filter((_, i) => i !== index);
    setYoutubes(updatedYoutubes);
  };

  const handleDeleteContent = (youtubeIndex: number, contentIndex: number) => {
    const updatedYoutubes = [...youtubes];
    delete updatedYoutubes[youtubeIndex].contents[contentIndex];

    const updatedContents: { [key: number]: string } = {};
    let newIndex = 1;
    for (let key in updatedYoutubes[youtubeIndex].contents) {
      updatedContents[newIndex] = updatedYoutubes[youtubeIndex].contents[key];
      newIndex++;
    }
    updatedYoutubes[youtubeIndex].contents = updatedContents;

    setYoutubes(updatedYoutubes);
  };

  const handleSave = async () => {
    console.log("Saving youtubes:", youtubes);
    const result = await insertYoutubes(youtubes);
    if (!result) {
      alert("저장 실패");
    } else {
      alert("저장 성공");
    }
  };

  const opts: YouTubeProps["opts"] = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 0, //1이면 자동재생
    },
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">YouTube 데이터 추가</h1>
      <p>
        video id는 유튜브 링크에서 https://www.youtube.com/watch?v= 뒤에 있는
        문자입니다.
      </p>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        {youtubes.map((youtube, index) => (
          <div key={index} className="p-4 border rounded shadow-md">
            <label className="block mb-2 font-bold">Video ID</label>
            <input
              className="w-full p-2 border rounded mb-4"
              name="videoId"
              value={youtube.videoId}
              onChange={(e) => handleInputChange(e, index)}
            />
            <div className="aspect-video">
              <YouTube
                videoId={youtube.videoId}
                opts={opts}
                className="w-full h-full"
              />
            </div>
            <label className="block my-2 font-bold">루틴</label>
            {Object.entries(youtube.contents).map(([contentIndex, content]) => (
              <div key={contentIndex} className="flex items-center mb-2">
                <input
                  className="flex-1 p-2 border rounded"
                  name={`content-${contentIndex}`}
                  value={content}
                  onChange={(e) => handleInputChange(e, index)}
                />
                <button
                  type="button"
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={() =>
                    handleDeleteContent(index, parseInt(contentIndex))
                  }
                >
                  삭제
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
              onClick={() => handleAddContent(index)}
            >
              루틴 추가
            </button>
            <button
              type="button"
              className="mt-2 bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
              onClick={() => handleDeleteYoutube(index)}
            >
              영상 삭제
            </button>
          </div>
        ))}
        <button
          type="button"
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          onClick={handleAddYoutube}
        >
          영상 추가
        </button>
        <button
          type="button"
          className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600"
          onClick={handleSave}
        >
          저장
        </button>
      </form>
    </div>
  );
}
