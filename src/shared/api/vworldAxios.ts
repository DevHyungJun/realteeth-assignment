import axios from "axios";

// 개발 환경에서는 프록시를 통해 호출, 프로덕션에서는 직접 호출
const isDevelopment = import.meta.env.DEV;
const baseURL = isDevelopment
  ? "/api/vworld" // Vite 프록시 사용
  : "https://api.vworld.kr/req"; // 프로덕션에서는 직접 호출

const vworldAxios = axios.create({
  baseURL,
  timeout: 10000,
});

export default vworldAxios;

