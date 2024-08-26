export const getDayOfWeek = (dateString: string) => {
  const date = new Date(dateString);
  const dayIndex = date.getDay();
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[dayIndex];
};

export const getNumberOfDay = (day: string): number => {
  const dayMap: { [key: string]: number } = {
    일: 0,
    월: 1,
    화: 2,
    수: 3,
    목: 4,
    금: 5,
    토: 6,
  };
  return dayMap[day];
};
