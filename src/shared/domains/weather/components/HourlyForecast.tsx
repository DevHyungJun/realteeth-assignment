import type { Forecast5DayResponse } from "../../../types";
import { getTemperature, getWeatherIconUrl } from "../../../utils";
import { useDragScroll } from "../../../hooks/useDragScroll";

type HourlyForecastProps = {
  forecastData: Forecast5DayResponse | undefined;
  timezone: number;
};

const HourlyForecast = ({
  forecastData,
  timezone,
}: HourlyForecastProps) => {
  const { scrollContainerRef, dragHandlers } = useDragScroll();

  if (!forecastData || !forecastData.list) {
    return null;
  }

  // 현재 시간을 기준으로 오늘 날짜 계산 (즐겨찾기 데이터의 오래된 타임스탬프가 아닌 실제 현재 시간 사용)
  const nowTimestamp = Math.floor(Date.now() / 1000);
  
  // 현재 시간에 타임존 오프셋을 적용하여 현지 시간 계산
  const nowLocal = new Date((nowTimestamp + timezone) * 1000);
  
  // 오늘 날짜의 시작 시간 (자정) - 현지 시간 기준
  const todayStartLocal = new Date(
    nowLocal.getFullYear(),
    nowLocal.getMonth(),
    nowLocal.getDate()
  );
  
  // 오늘 자정의 UTC 타임스탬프 (타임존 오프셋 제거)
  const todayStartTimestamp = Math.floor(todayStartLocal.getTime() / 1000) - timezone;
  const todayEndTimestamp = todayStartTimestamp + 24 * 60 * 60; // 다음날 자정

  // 오늘 날짜의 예보만 필터링 (최대 24시간)
  // 현재 시간 이후의 예보 중 오늘 날짜인 것만 필터링
  const todayForecasts = forecastData.list
    .filter((item) => {
      // 현재 시간 이후의 예보만
      if (item.dt < nowTimestamp) {
        return false;
      }
      // 오늘 날짜인지 확인 (타임존 고려하여 현지 시간 기준)
      return item.dt >= todayStartTimestamp && item.dt < todayEndTimestamp;
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
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing"
        {...dragHandlers}
      >
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
