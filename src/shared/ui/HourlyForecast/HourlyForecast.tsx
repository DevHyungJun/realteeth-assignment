import type { Forecast5DayResponse } from "../../types";
import { getTemperature, getWeatherIconUrl } from "../../utils";

type HourlyForecastProps = {
  forecastData: Forecast5DayResponse | undefined;
  currentDateTimestamp: number;
  timezone: number;
};

const HourlyForecast = ({
  forecastData,
  currentDateTimestamp,
  timezone,
}: HourlyForecastProps) => {
  if (!forecastData || !forecastData.list) {
    return null;
  }

  // 현재 날짜의 시작 시간 (자정)
  const currentDate = new Date((currentDateTimestamp + timezone) * 1000);
  const currentDateStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const currentDateEnd = new Date(currentDateStart);
  currentDateEnd.setDate(currentDateEnd.getDate() + 1);

  // 오늘 날짜의 예보만 필터링 (최대 24시간)
  const todayForecasts = forecastData.list
    .filter((item) => {
      const itemDate = new Date((item.dt + timezone) * 1000);
      return itemDate >= currentDateStart && itemDate < currentDateEnd;
    })
    .slice(0, 8); // 최대 8개 (24시간을 3시간 간격으로)

  if (todayForecasts.length === 0) {
    return null;
  }

  const formatHour = (timestamp: number) => {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        오늘 시간대별 일기예보
      </h3>
      <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-max pb-2">
          {todayForecasts.map((forecast) => {
            const weatherIcon = forecast.weather[0]?.icon;
            const weatherDescription = forecast.weather[0]?.description || "";

            return (
              <div
                key={forecast.dt}
                className="bg-gray-50 rounded-lg p-4 flex flex-col items-center gap-2 min-w-[100px]"
              >
                <div className="text-sm font-medium text-gray-700 text-center">
                  {formatHour(forecast.dt)}
                </div>
                {weatherIcon && (
                  <img
                    src={getWeatherIconUrl(weatherIcon)}
                    alt={weatherDescription}
                    className="w-10 h-10"
                  />
                )}
                <div className="text-lg font-semibold text-gray-800">
                  {getTemperature(forecast.main.temp)}°
                </div>
                <div className="text-xs text-gray-600 text-center">
                  {weatherDescription}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;
