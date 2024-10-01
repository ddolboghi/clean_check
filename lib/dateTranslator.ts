export const getKSTDateString = (): string => {
  const kstDate = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );
  console.log(kstDate);
  const year = kstDate.getFullYear();
  const month = String(kstDate.getMonth() + 1).padStart(2, "0");
  const day = String(kstDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getNextDayDates = (
  days: string[],
  hour: number,
  minute: number
): Date[] => {
  const selectedDate = new Date();
  const nextDayDates: Date[] = [];

  days.forEach((day) => {
    const dayIndex = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"].indexOf(
      day
    );
    const nextDayDate = new Date(selectedDate);
    nextDayDate.setDate(
      selectedDate.getDate() + ((dayIndex + 7 - selectedDate.getDay()) % 7)
    );
    nextDayDate.setHours(hour);
    nextDayDate.setMinutes(minute);
    nextDayDates.push(nextDayDate);
  });

  return nextDayDates;
};
