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
  temp_kf?: number; // 5일 예보에서만 사용 (항상 포함되지만 일부 항목에서는 0)
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
  /** 지난 1시간 강수량 (mm) - 현재 날씨에서만 사용 */
  "1h"?: number;
  /** 지난 3시간 강수량 (mm) */
  "3h"?: number;
}

export interface Snow {
  /** 지난 1시간 강설량 (mm) - 현재 날씨에서만 사용 */
  "1h"?: number;
  /** 지난 3시간 강설량 (mm) */
  "3h"?: number;
}

// 현재 날씨용 Sys 타입
export interface CurrentWeatherSys {
  type?: number;
  id?: number;
  country: string;
  sunrise: number; // unix UTC
  sunset: number; // unix UTC
}

// 5일 예보용 Sys 타입
export interface ForecastSys {
  pod: "n" | "d";
}

// 현재 날씨 Response 타입
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
  sys: CurrentWeatherSys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

// 5일 예보 관련 타입
export interface ForecastItem {
  dt: number;
  main: Main;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  rain?: Rain;
  snow?: Snow;
  sys: ForecastSys;
  dt_txt: string;
}

export interface City {
  id: number;
  name: string;
  coord: Coord;
  country: string;
  population?: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export interface Forecast5DayResponse {
  cod: string;
  message?: number;
  cnt: number;
  list: ForecastItem[];
  city: City;
}
