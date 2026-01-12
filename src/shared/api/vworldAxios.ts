import axios from "axios";

// 개발 환경과 preview 모드에서는 프록시를 통해 호출
// 프로덕션 빌드 배포 시에는 백엔드 서버에서 프록시 설정 필요
const baseURL = "/api/vworld"; // Vite 프록시 사용 (개발 및 preview 모드)

const vworldAxios = axios.create({
  baseURL,
  timeout: 10000,
});

export default vworldAxios;

