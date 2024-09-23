import YoutubeImbed from "@/components/youtube/YoutubeImbed";
import YoutubeRoutines from "@/components/youtube/YoutubeRoutines";

export default function page() {
  const youtubes = [
    {
      videoId: "qJaZahuXcn4",
      routines: {
        1: "1번째",
        2: "2번째",
        3: "3번째",
        4: "4번째",
        5: "5번째",
        6: "6번째",
        7: "7번째",
        8: "8번째",
        9: "9번째",
        10: "10번째",
        11: "11번째",
        12: "12번째",
        13: "13번째",
        14: "14번째",
      },
    },
  ];

  return (
    <main>
      {youtubes.map((youtube, youtubeIdx) => (
        <YoutubeImbed key={youtubeIdx} videoId={youtube.videoId}>
          <YoutubeRoutines routines={youtube.routines} />
        </YoutubeImbed>
      ))}
    </main>
  );
}
