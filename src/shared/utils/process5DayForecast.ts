import type { Forecast5DayResponse, ForecastItem } from "../types";
import getTemperature from "./getTemperature";

export type DailyForecast = {
  date: string;
  dateLabel: string;
  forecast: ForecastItem;
  weather: {
    icon: string;
    description: string;
  };
  temperature: {
    current: string;
    max: string;
    min: string;
  };
};

/**
 * 다음날부터 5일간의 날짜 범위를 계산합니다.
 * 현재 시간을 기준으로 계산합니다 (즐겨찾기 데이터의 오래된 타임스탬프가 아닌 실제 현재 시간 사용).
 */
function calculateDateRange() {
  // 현재 시간을 기준으로 계산 (즐겨찾기 데이터의 오래된 타임스탬프 사용하지 않음)
  const now = new Date();
  const currentDate = new Date(now.getTime());
  
  const nextDay = new Date(currentDate);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);
  nextDay.setUTCHours(0, 0, 0, 0);
  const nextDayDateStr = nextDay.toISOString().split("T")[0];

  const fiveDaysLater = new Date(nextDay);
  fiveDaysLater.setUTCDate(fiveDaysLater.getUTCDate() + 5);
  const fiveDaysLaterDateStr = fiveDaysLater.toISOString().split("T")[0];

  return { nextDayDateStr, fiveDaysLaterDateStr };
}

/**
 * 예보 데이터를 날짜별로 필터링합니다.
 */
function filterForecastsByDateRange(
  forecasts: ForecastItem[],
  nextDayDateStr: string,
  fiveDaysLaterDateStr: string
) {
  return forecasts.filter((item) => {
    const itemDateStr = item.dt_txt.split(" ")[0];
    return itemDateStr >= nextDayDateStr && itemDateStr < fiveDaysLaterDateStr;
  });
}

/**
 * 예보 데이터를 날짜별로 그룹화합니다.
 */
function groupForecastsByDate(forecasts: ForecastItem[]) {
  return forecasts.reduce((acc, item) => {
    const dateKey = item.dt_txt.split(" ")[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(item);
    return acc;
  }, {} as Record<string, ForecastItem[]>);
}

/**
 * 각 날짜의 대표 예보 데이터를 선택합니다 (12:00 또는 15:00 우선).
 */
function selectPreferredForecast(items: ForecastItem[]): ForecastItem {
  const preferredItem = items.find((item) => {
    const hour = new Date(item.dt * 1000).getUTCHours();
    return hour === 12 || hour === 15;
  });
  return preferredItem || items[0];
}

/**
 * 날짜 레이블을 포맷팅합니다 (월 일 (요일)).
 */
function formatDateLabel(dateKey: string): string {
  const date = new Date(dateKey + "T00:00:00Z");
  return date.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

/**
 * 5일 예보 데이터를 처리하여 일별 예보 배열을 반환합니다.
 * 현재 시간을 기준으로 다음날부터 5일간의 예보를 표시합니다.
 */
export function process5DayForecast(
  forecastData: Forecast5DayResponse | undefined
): DailyForecast[] {
  if (!forecastData?.list) return [];

  const { nextDayDateStr, fiveDaysLaterDateStr } = calculateDateRange();

  const filteredForecasts = filterForecastsByDateRange(
    forecastData.list,
    nextDayDateStr,
    fiveDaysLaterDateStr
  );

  const groupedByDate = groupForecastsByDate(filteredForecasts);

  const dailyForecasts: DailyForecast[] = Object.entries(groupedByDate)
    .slice(0, 5)
    .map(([dateKey, items]) => {
      const preferredItem = selectPreferredForecast(items);
      const dateLabel = formatDateLabel(dateKey);
      const weather = preferredItem.weather[0];
      const weatherIcon = weather?.icon || "";
      const weatherDescription = weather?.description || "";

      return {
        date: dateKey,
        dateLabel,
        forecast: preferredItem,
        weather: {
          icon: weatherIcon,
          description: weatherDescription,
        },
        temperature: {
          current: String(getTemperature(preferredItem.main.temp)),
          max: String(getTemperature(preferredItem.main.temp_max)),
          min: String(getTemperature(preferredItem.main.temp_min)),
        },
      };
    });

  return dailyForecasts;
}

