import type { CurrentWeatherResponse } from "../../shared/types";
import { getTemperature, formatTime, getWindDirection } from "../../shared/utils";

type WeatherDetailItemConfig = {
  label: string;
  getValue: (data: CurrentWeatherResponse) => string | null;
  valueColor?: string;
  size?: "sm" | "md" | "lg" | "xl";
};

const MAIN_GRID_ITEMS: WeatherDetailItemConfig[] = [
  {
    label: "체감 온도",
    getValue: (data) => `${getTemperature(data.main.feels_like)}°`,
    size: "xl",
  },
  {
    label: "최저 온도",
    getValue: (data) => `${getTemperature(data.main.temp_min)}°`,
    valueColor: "text-blue-600",
    size: "xl",
  },
  {
    label: "최고 온도",
    getValue: (data) => `${getTemperature(data.main.temp_max)}°`,
    valueColor: "text-red-600",
    size: "xl",
  },
  {
    label: "습도",
    getValue: (data) => `${data.main.humidity}%`,
    size: "xl",
  },
  {
    label: "기압",
    getValue: (data) => `${data.main.pressure} hPa`,
    size: "xl",
  },
  {
    label: "가시거리",
    getValue: (data) =>
      data.visibility ? `${(data.visibility / 1000).toFixed(1)} km` : null,
    size: "xl",
  },
];

const WIND_ITEMS: WeatherDetailItemConfig[] = [
  {
    label: "풍속",
    getValue: (data) => `${data.wind.speed.toFixed(1)} m/s`,
  },
  {
    label: "풍향",
    getValue: (data) =>
      `${getWindDirection(data.wind.deg)} (${data.wind.deg}°)`,
  },
  {
    label: "돌풍",
    getValue: (data) =>
      data.wind.gust ? `${data.wind.gust.toFixed(1)} m/s` : null,
  },
];

const PRECIPITATION_ITEMS: WeatherDetailItemConfig[] = [
  {
    label: "지난 1시간",
    getValue: (data) =>
      data.rain?.["1h"] !== undefined ? `${data.rain["1h"]} mm` : null,
  },
  {
    label: "지난 3시간",
    getValue: (data) =>
      data.rain?.["3h"] !== undefined ? `${data.rain["3h"]} mm` : null,
  },
  {
    label: "적설 (1시간)",
    getValue: (data) =>
      data.snow?.["1h"] !== undefined ? `${data.snow["1h"]} mm` : null,
  },
  {
    label: "적설 (3시간)",
    getValue: (data) =>
      data.snow?.["3h"] !== undefined ? `${data.snow["3h"]} mm` : null,
  },
];

const SUNRISE_SUNSET_ITEMS: WeatherDetailItemConfig[] = [
  {
    label: "일출",
    getValue: (data) => formatTime(data.sys.sunrise, data.timezone),
  },
  {
    label: "일몰",
    getValue: (data) => formatTime(data.sys.sunset, data.timezone),
  },
];

const ADDITIONAL_INFO_ITEMS: WeatherDetailItemConfig[] = [
  {
    label: "좌표",
    getValue: (data) =>
      `${data.coord.lat.toFixed(2)}, ${data.coord.lon.toFixed(2)}`,
    size: "sm",
  },
  {
    label: "국가",
    getValue: (data) => data.sys.country,
    size: "sm",
  },
  {
    label: "해수면 기압",
    getValue: (data) =>
      data.main.sea_level ? `${data.main.sea_level} hPa` : null,
    size: "sm",
  },
  {
    label: "지면 기압",
    getValue: (data) =>
      data.main.grnd_level ? `${data.main.grnd_level} hPa` : null,
    size: "sm",
  },
];

export {
  MAIN_GRID_ITEMS,
  WIND_ITEMS,
  PRECIPITATION_ITEMS,
  SUNRISE_SUNSET_ITEMS,
  ADDITIONAL_INFO_ITEMS,
};

