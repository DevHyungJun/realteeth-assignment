import type { Forecast5DayResponse } from "../../../../types";
import { getTemperature, getWeatherIconUrl } from "../../../../utils";
import { useDragScroll } from "../../../../hooks/useDragScroll";
import { useKeyboardScroll } from "../../../../hooks/useKeyboardScroll";

interface HourlyForecastProps {
  forecastData: Forecast5DayResponse | undefined;
  timezone: number;
}

const HourlyForecast = ({ forecastData, timezone }: HourlyForecastProps) => {
  const { scrollContainerRef, dragHandlers } = useDragScroll();
  const { handleKeyDown } = useKeyboardScroll(scrollContainerRef);

  if (!forecastData || !forecastData.list) return null;

  const nowTimestamp = Math.floor(Date.now() / 1000);

  const nowLocal = new Date((nowTimestamp + timezone) * 1000);

  const todayStartLocal = new Date(
    nowLocal.getFullYear(),
    nowLocal.getMonth(),
    nowLocal.getDate()
  );

  const todayStartTimestamp =
    Math.floor(todayStartLocal.getTime() / 1000) - timezone;
  const todayEndTimestamp = todayStartTimestamp + 24 * 60 * 60;

  const todayForecasts = forecastData.list
    .filter((item) => {
      if (item.dt < nowTimestamp) {
        return false;
      }
      return item.dt >= todayStartTimestamp && item.dt < todayEndTimestamp;
    })
    .slice(0, 8);

  if (todayForecasts.length === 0) return null;

  const formatHour = (timestamp: number) => {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 select-none">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        오늘 시간대별 일기예보
      </h3>
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto hide-scrollbar"
        {...dragHandlers}
        tabIndex={0}
        role="region"
        aria-label="오늘 시간대별 일기예보. 좌우 화살표 키로 스크롤할 수 있습니다."
        onKeyDown={handleKeyDown}
      >
        <div className="flex gap-4 min-w-max pb-2 select-none">
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
