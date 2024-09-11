export const getKSTDateString = (): string => {
  const kstDate = new Date().toLocaleString("sv");
  const year = kstDate.slice(0, 4);
  const month = kstDate.slice(5, 7);
  const day = kstDate.slice(8, 10);
  return `${year}-${month}-${day}`;
};

export const getDates = (
  startDate: Date | string,
  endDate: Date | string
): string[] => {
  const dates = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
    const formattedDate = date.toISOString().split("T")[0];
    dates.push(formattedDate);
  }

  return dates;
};

export const getDateAndDay = (
  startDate: Date | string,
  endDate: Date | string
) => {
  const dates: { [key: string]: string } = {};
  const start = new Date(startDate);
  const end = new Date(endDate);

  for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
    const formattedDate = date.toISOString().split("T")[0];
    const dayOfWeek = date.toLocaleDateString("ko-KR", { weekday: "short" });
    dates[formattedDate] = dayOfWeek;
  }

  return dates;
};

export type Days = {
  [key: string]: boolean;
};

export const getDaysFromDayGap = (dayGap: number) => {
  const startDate = getKSTDateString();
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const days: Days = {};

  for (let date = start; date <= end; date.setDate(date.getDate() + dayGap)) {
    const formattedDate = date.toISOString().split("T")[0];
    days[formattedDate] = false;
  }

  return days;
};

export const getIsBeforeToday = (targetDate: Date) => {
  const target = new Date(targetDate);
  const kstToday = new Date(getKSTDateString());

  return target < kstToday; //오늘보다 이전이면 true
};

export const getStartDateAndEndDate = () => {
  const startDate = getKSTDateString();
  const today = new Date(startDate);
  today.setDate(today.getDate() + 6);
  const endDateYear = today.getFullYear();
  const endDateMonth = String(today.getMonth() + 1).padStart(2, "0");
  const endDateDay = String(today.getDate()).padStart(2, "0");
  const endDate = `${endDateYear}-${endDateMonth}-${endDateDay}`;
  return { startDate, endDate };
};

export const formatDateString = (dateString: Date): string => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더해줌
  const day = date.getDate();

  return `${month}월 ${day}일`;
};
