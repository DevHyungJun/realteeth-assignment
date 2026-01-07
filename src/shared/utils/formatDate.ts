const formatDate = (timestamp: number, timezoneOffset: number) => {
  // UTC 시간으로 날짜를 생성하고 타임존 오프셋을 적용
  const utcTime = timestamp * 1000;
  const localTime = utcTime + timezoneOffset * 1000;
  const date = new Date(localTime);
  
  // UTC로 날짜를 포맷팅하여 타임존 변환 문제를 방지
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    timeZone: "UTC",
  });
};

export default formatDate;

