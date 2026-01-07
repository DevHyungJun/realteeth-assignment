import type { Forecast5DayResponse } from "../../types";
import { getWeatherIconUrl } from "../../utils";
import { process5DayForecast } from "../../utils/process5DayForecast";

type Weather5DaysProps = {
  forecastData: Forecast5DayResponse | undefined;
  currentDateTimestamp: number;
};

const Weather5Days = ({
  forecastData,
  currentDateTimestamp,
}: Weather5DaysProps) => {
  const dailyForecasts = process5DayForecast(
    forecastData,
    currentDateTimestamp
  );

  if (dailyForecasts.length === 0) return null;

  const forecastsWithIconUrl = dailyForecasts.map((forecast) => ({
    ...forecast,
    weatherIconUrl: forecast.weather.icon
      ? getWeatherIconUrl(forecast.weather.icon)
      : null,
  }));

  return (
    <div className="pt-6 border-t-4 border-gray-400">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">5일 예보</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {forecastsWithIconUrl.map(
          ({ date, dateLabel, weather, temperature, weatherIconUrl }) => {
            return (
              <div
                key={date}
                className="bg-gray-50 rounded-lg p-4 flex flex-col items-center gap-2"
              >
                <div className="text-sm font-medium text-gray-700 text-center">
                  {dateLabel}
                </div>
                {weatherIconUrl && (
                  <img
                    src={weatherIconUrl}
                    alt={weather.description}
                    className="w-12 h-12"
                  />
                )}
                <div className="text-xl font-semibold text-gray-800">
                  {temperature.current}°
                </div>
                <div className="text-xs text-gray-600 text-center">
                  {weather.description}
                </div>
                <div className="flex gap-2 text-xs text-gray-500 mt-1">
                  <span>최고 {temperature.max}°</span>
                  <span>/</span>
                  <span>최저 {temperature.min}°</span>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default Weather5Days;
