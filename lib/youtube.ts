export const formatNumber = (num: number) => {
  if (num >= 1000000000) {
    return `${Math.floor(num / 100000000)}억`;
  } else if (num >= 10000) {
    const tensOfThousands = (num / 10000).toString();
    const [integerPart, decimalPart] = tensOfThousands.split(".");
    return decimalPart
      ? `${integerPart}.${decimalPart.charAt(0)}만`
      : `${integerPart}만`;
  } else if (num >= 1000) {
    return `${Math.floor(num / 1000)}천`;
  }
  return num.toString();
};

export const formatTimeDifference = (date: Date): string => {
  const translatedDate = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );
  const diffInMilliseconds = now.getTime() - translatedDate.getTime();

  const seconds = Math.floor(diffInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (hours < 24) {
    return `${hours}시간 전`;
  } else if (days < 30) {
    return `${days}일 전`;
  } else if (months < 12) {
    return `${months}개월 전`;
  } else {
    return `${years}년 전`;
  }
};
