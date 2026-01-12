/**
 * API 캐싱 시간 상수 (밀리초)
 * 
 * OpenWeatherMap API는 일반적으로 10분마다 업데이트되므로
 * 날씨 데이터는 10분으로 설정합니다.
 * 
 * VWorld API (지오코딩)는 주소 정보이므로 자주 변경되지 않아
 * 1시간으로 설정합니다.
 */

// 날씨 데이터 캐싱 시간: 10분 (OpenWeatherMap 업데이트 주기)
export const WEATHER_CACHE_TIME = 1000 * 60 * 10; // 10분

// 지오코딩 캐싱 시간: 1시간 (주소는 자주 변경되지 않음)
export const GEOCODE_CACHE_TIME = 1000 * 60 * 60; // 1시간

// 역지오코딩 캐싱 시간: 1시간 (주소는 자주 변경되지 않음)
export const REVERSE_GEOCODE_CACHE_TIME = 1000 * 60 * 60; // 1시간

