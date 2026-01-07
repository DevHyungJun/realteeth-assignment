import type { Forecast5DayResponse, ForecastItem } from "../../types";
import { getTemperature, getWeatherIconUrl } from "../../utils";

type Weather5DaysProps = {
  forecastData: Forecast5DayResponse | undefined;
  currentDateTimestamp: number;
};

type DailyForecast = {
  date: string;
  dateLabel: string;
  forecast: ForecastItem;
};

const Weather5Days = ({
  forecastData,
  currentDateTimestamp,
}: Weather5DaysProps) => {
  if (!forecastData?.list) return null;

  // 현재 날짜의 다음날 날짜 문자열 계산 (YYYY-MM-DD 형식)
  const currentDate = new Date(currentDateTimestamp * 1000);
  const nextDay = new Date(currentDate);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);
  nextDay.setUTCHours(0, 0, 0, 0);
  const nextDayDateStr = nextDay.toISOString().split("T")[0]; // "YYYY-MM-DD"

  // 5일 후 날짜 문자열 계산
  const fiveDaysLater = new Date(nextDay);
  fiveDaysLater.setUTCDate(fiveDaysLater.getUTCDate() + 5);
  const fiveDaysLaterDateStr = fiveDaysLater.toISOString().split("T")[0];

  // 다음날부터 5일간의 데이터 필터링 (dt_txt의 날짜 부분 기준)
  const filteredForecasts = forecastData.list.filter((item) => {
    const itemDateStr = item.dt_txt.split(" ")[0]; // "YYYY-MM-DD"
    return itemDateStr >= nextDayDateStr && itemDateStr < fiveDaysLaterDateStr;
  });

  // 날짜별로 그룹화 (dt_txt의 날짜 부분 기준)
  const groupedByDate = filteredForecasts.reduce((acc, item) => {
    const dateKey = item.dt_txt.split(" ")[0]; // "YYYY-MM-DD" 형식
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(item);
    return acc;
  }, {} as Record<string, ForecastItem[]>);

  // 각 날짜의 대표 데이터 선택 (12:00 또는 15:00 우선, 없으면 첫 번째)
  const dailyForecasts: DailyForecast[] = Object.entries(groupedByDate)
    .slice(0, 5) // 최대 5일까지만
    .map(([dateKey, items]) => {
      // 12:00 또는 15:00 시간대 우선 선택
      const preferredItem =
        items.find((item) => {
          const hour = new Date(item.dt * 1000).getUTCHours();
          return hour === 12 || hour === 15;
        }) || items[0]; // 없으면 첫 번째 항목

      // 날짜 레이블 포맷팅 (월 일 (요일))
      const date = new Date(dateKey + "T00:00:00Z");
      const dateLabel = date.toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
        weekday: "short",
      });

      return {
        date: dateKey,
        dateLabel,
        forecast: preferredItem,
      };
    });

  if (dailyForecasts.length === 0) return null;

  return (
    <div className="pt-6 border-t-4 border-gray-400">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">5일 예보</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {dailyForecasts.map(({ date, dateLabel, forecast }) => {
          const weather = forecast.weather[0];
          const weatherIcon = weather?.icon;
          const weatherDescription = weather?.description || "";

          return (
            <div
              key={date}
              className="bg-gray-50 rounded-lg p-4 flex flex-col items-center gap-2"
            >
              <div className="text-sm font-medium text-gray-700 text-center">
                {dateLabel}
              </div>
              {weatherIcon && (
                <img
                  src={getWeatherIconUrl(weatherIcon)}
                  alt={weatherDescription}
                  className="w-12 h-12"
                />
              )}
              <div className="text-xl font-semibold text-gray-800">
                {getTemperature(forecast.main.temp)}°
              </div>
              <div className="text-xs text-gray-600 text-center">
                {weatherDescription}
              </div>
              <div className="flex gap-2 text-xs text-gray-500 mt-1">
                <span>최고 {getTemperature(forecast.main.temp_max)}°</span>
                <span>/</span>
                <span>최저 {getTemperature(forecast.main.temp_min)}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Weather5Days;
