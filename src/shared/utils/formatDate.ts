const formatDate = (timestamp: number, timezoneOffset: number) => {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};

export default formatDate;

