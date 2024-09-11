type WeekNavProps = {
  week: { [key: string]: string };
  handleDayOfWeek: (date: string) => Promise<void>;
  clickedDate: string;
};

export default function WeekNav({
  week,
  handleDayOfWeek,
  clickedDate,
}: WeekNavProps) {
  return (
    <nav className="py-6 px-4 rounded-t-[40px] bg-white flex justify-center items-center text-base font-light tracking-tight text-center whitespace-nowrap text-[#B2B2B2]">
      {Object.entries(week).map(([date, day]) => (
        <button
          key={date}
          onClick={() => handleDayOfWeek(date)}
          className={`self-stretch px-3 py-1.5 w-[53px] h-[63px] ${
            clickedDate === date &&
            "font-light text-[#B2B2B2] bg-[#DFF4F0] rounded-[15px]"
          }`}
        >
          <div className="pb-1">{day}</div>
          <div className="pb-0.5 text-xs">
            {date.split("-")[2].replace(/^0/, "")}
          </div>
        </button>
      ))}
    </nav>
  );
}
