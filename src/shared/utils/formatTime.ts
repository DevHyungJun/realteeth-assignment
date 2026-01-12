const formatTime = (timestamp: number, timezoneOffset: number) => {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default formatTime;

