import axios from "axios";

const baseAxios = axios.create({
  baseURL: import.meta.env.VITE_OPEN_WEATHER_BASE_URL,
  timeout: 5000,
});

export default baseAxios;
