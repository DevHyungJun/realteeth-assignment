// 공통 타입
export interface Coord {
  lon: number;
  lat: number;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface Clouds {
  all: number;
}

export interface Rain {
  /** 지난 1시간 강수량 (mm) */
  "1h"?: number;
  /** 지난 3시간 강수량 (mm) – 일부 계정/플랜에서만 올 수 있음 */
  "3h"?: number;
}

export interface Snow {
  "1h"?: number;
  "3h"?: number;
}

export interface Sys {
  type?: number;
  id?: number;
  country: string;
  sunrise: number; // unix UTC
  sunset: number; // unix UTC
}

// 최상위 Response 타입
export interface CurrentWeatherResponse {
  coord: Coord;
  weather: Weather[];
  base: string;
  main: Main;
  visibility?: number;
  wind: Wind;
  clouds: Clouds;
  rain?: Rain;
  snow?: Snow;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}
