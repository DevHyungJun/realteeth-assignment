import axios from "axios";

const baseAxios = axios.create({
  baseURL: `${process.env.OPEN_WHETHER_BASE_URL}?appid=${process.env.OPEN_WEATHER_MAP_API_KEY}`,
  timeout: 5000,
});

export default baseAxios;
