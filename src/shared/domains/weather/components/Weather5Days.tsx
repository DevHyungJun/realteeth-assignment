import type { Forecast5DayResponse } from "../../../types";
import { getWeatherIconUrl, process5DayForecast } from "../../../utils";

type Weather5DaysProps = {
  forecastData: Forecast5DayResponse | undefined;
};

const Weather5Days = ({
  forecastData,
}: Weather5DaysProps) => {
  const dailyForecasts = process5DayForecast(forecastData);

  if (dailyForecasts.length === 0) return null;

  const forecastsWithIconUrl = dailyForecasts.map((forecast) => ({
    ...forecast,
    weatherIconUrl: forecast.weather.icon
      ? getWeatherIconUrl(forecast.weather.icon)
      : null,
  }));

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        5일간의 일기예보
      </h3>
      {/* 모바일: 가로 스크롤 */}
      <div className="sm:hidden overflow-x-auto hide-scrollbar">
        <div className="flex gap-4 min-w-max pb-2">
          {forecastsWithIconUrl.map(
            ({ date, dateLabel, weather, temperature, weatherIconUrl }) => {
              return (
                <div
                  key={date}
                  className="bg-gray-50 rounded-lg p-4 flex flex-col items-center gap-2 min-w-[100px]"
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
      {/* 데스크톱: 그리드 레이아웃 */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
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
