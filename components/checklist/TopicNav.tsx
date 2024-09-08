type TopicNavProps = {
  topicList: string[];
  clickedTopic: string;
  handleTopic: (btnTopic: string) => void;
};

export default function TopicNav({
  topicList,
  clickedTopic,
  handleTopic,
}: TopicNavProps) {
  return (
    <nav className="min-h-7 px-6 pb-4 bg-white flex justify-start flex-row space-x-2 overflow-x-auto">
      {topicList.map((topic, topicIdx) => (
        <button
          key={topicIdx}
          onClick={() => handleTopic(topic)}
          className="text-sm tracking-tight leading-loose text-center whitespace-nowrap rounded-3xl scrollbar-hide"
        >
          <div
            className={`px-5 rounded-3xl text-center ${
              topic === clickedTopic
                ? "bg-[#565656] text-white"
                : "bg-gray-200 bg-opacity-80 text-zinc-500"
            }`}
          >
            {topic}
          </div>
        </button>
      ))}
    </nav>
  );
}
