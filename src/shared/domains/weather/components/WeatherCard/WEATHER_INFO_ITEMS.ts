import type { Main, Wind } from "../../../../types";
import { getTemperature } from "../../../../utils";

type WeatherInfoItemConfig = {
  label: string;
  valueColor?: string;
  getValue: (main: Main, wind: Wind) => string;
};

const WEATHER_INFO_ITEMS: WeatherInfoItemConfig[] = [
  {
    label: "최저",
    valueColor: "text-blue-600",
    getValue: (main) => `${getTemperature(main.temp_min)}°`,
  },
  {
    label: "최고",
    valueColor: "text-red-600",
    getValue: (main) => `${getTemperature(main.temp_max)}°`,
  },
  {
    label: "체감",
    getValue: (main) => `${getTemperature(main.feels_like)}°`,
  },
  {
    label: "습도",
    getValue: (main) => `${main.humidity}%`,
  },
  {
    label: "풍속",
    getValue: (_, wind) => `${wind.speed.toFixed(1)}m/s`,
  },
];

export default WEATHER_INFO_ITEMS;
