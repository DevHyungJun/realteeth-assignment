const WIND_DIRECTIONS = [
  "북",
  "북동",
  "동",
  "남동",
  "남",
  "남서",
  "서",
  "북서",
];

const getWindDirection = (deg: number) =>
  WIND_DIRECTIONS[Math.round(deg / 45) % 8];

export default getWindDirection;
