import AddBtn from "../ui/AddBtn";

type YoutubeRoutinesProps = {
  routines: { [key: number]: string };
};

export default function YoutubeRoutines({ routines }: YoutubeRoutinesProps) {
  return (
    <section>
      <h1 className="text-[13px] text-[#6AC7D7] font-semibold mb-2">Routine</h1>
      {Object.entries(routines).map(([routineId, content]) => (
        <div
          key={routineId}
          className="flex flex-row items-center justify-between text-[12px] text-[#626262] py-1"
        >
          <p>{content}</p>
          <AddBtn />
        </div>
      ))}
    </section>
  );
}
