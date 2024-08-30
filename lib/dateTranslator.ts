export const getKSTDateString = (): string => {
  const utcDate = new Date();
  const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
  const year = kstDate.getFullYear();
  const month = String(kstDate.getMonth() + 1).padStart(2, "0");
  const day = String(kstDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getKSTPreviousDateString = () => {
  const utcDate = new Date();
  const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
  kstDate.setDate(kstDate.getDate() - 1);

  const year = kstDate.getFullYear();
  const month = String(kstDate.getMonth() + 1).padStart(2, "0");
  const day = String(kstDate.getDate()).padStart(2, "0");

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
