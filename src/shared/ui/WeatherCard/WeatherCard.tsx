import type { CurrentWeatherResponse } from "../../types";
import WEATHER_INFO_ITEMS from "./WEATHER_INFO_ITEMS";
import { getTemperature, getWeatherIconUrl } from "../../utils";

type WeatherInfoItemProps = {
  label: string;
  value: string | number;
  valueColor?: string;
  showDivider?: boolean;
};

const WeatherInfoItem = ({
  label,
  value,
  valueColor = "text-gray-800",
  showDivider = true,
}: WeatherInfoItemProps) => {
  return (
    <>
      <div className="flex items-center gap-1">
        <span className="text-gray-500 text-xs">{label}</span>
        <span className={`text-sm font-semibold ${valueColor}`}>{value}</span>
      </div>
      {showDivider && <div className="w-px h-4 bg-gray-300" />}
    </>
  );
};

const WeatherCard = ({
  data,
  isCurrentWeather,
}: {
  data: CurrentWeatherResponse;
  isCurrentWeather: boolean;
}) => {
  const { main, weather, name, wind } = data;
  const weatherIcon = weather[0]?.icon;
  const weatherDescription = weather[0]?.description || "";

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      {isCurrentWeather && (
        <h2 className="text-lg font-medium mb-3 text-gray-500">현재 위치</h2>
      )}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {weatherIcon && (
            <img
              src={getWeatherIconUrl(weatherIcon)}
              alt={weatherDescription}
              className="w-12 h-12"
            />
          )}
          <div className="text-3xl text-gray-800 font-light">
            {getTemperature(main.temp)}°
          </div>
        </div>
        <h2 className="text-xl font-bold">{name}</h2>
      </div>

      {weatherDescription && (
        <p className="text-sm text-gray-600 capitalize ml-auto mb-3">
          {weatherDescription}
        </p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        {WEATHER_INFO_ITEMS.map((item, index) => (
          <WeatherInfoItem
            key={item.label}
            label={item.label}
            value={item.getValue(main, wind)}
            valueColor={item.valueColor}
            showDivider={index !== WEATHER_INFO_ITEMS.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default WeatherCard;
