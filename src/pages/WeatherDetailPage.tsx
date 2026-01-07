import { useNavigate, useLocation } from "react-router-dom";
import type { CurrentWeatherResponse } from "../shared/types";
import { getTemperature, getWeatherIconUrl } from "../shared/utils";
import { Button } from "../shared/ui";

const WeatherDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state as CurrentWeatherResponse | null;

  if (!data) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">날씨 정보를 찾을 수 없습니다.</p>
          <Button onClick={() => navigate("/")}>홈으로 돌아가기</Button>
        </div>
      </div>
    );
  }

  const {
    coord,
    weather,
    main,
    wind,
    clouds,
    visibility,
    rain,
    snow,
    sys,
    dt,
    timezone,
    name,
  } = data;

  const weatherIcon = weather[0]?.icon;
  const weatherDescription = weather[0]?.description || "";
  const weatherMain = weather[0]?.main || "";

  const formatTime = (timestamp: number, timezoneOffset: number) => {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp: number, timezoneOffset: number) => {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  const getWindDirection = (deg: number) => {
    const directions = [
      "북",
      "북동",
      "동",
      "남동",
      "남",
      "남서",
      "서",
      "북서",
    ];
    return directions[Math.round(deg / 45) % 8];
  };

  return (
    <div className="min-h-[100dvh] bg-gray-50">
      <div className="px-4 py-8 max-w-2xl mx-auto">
        <Button onClick={() => navigate("/")} className="mb-6">
          ← 뒤로가기
        </Button>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* 헤더 섹션 */}
          <div className="flex items-center gap-3 mb-6">
            {weatherIcon && (
              <img
                src={getWeatherIconUrl(weatherIcon)}
                alt={weatherDescription}
                className="w-16 h-16"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
              <p className="text-sm text-gray-500">
                {formatDate(dt, timezone)}
              </p>
            </div>
          </div>

          {/* 현재 온도 */}
          <div className="mb-6">
            <div className="text-5xl text-gray-800 font-light mb-2">
              {getTemperature(main.temp)}°
            </div>
            {weatherDescription && (
              <p className="text-lg text-gray-600 capitalize">
                {weatherDescription}
              </p>
            )}
          </div>

          {/* 기본 날씨 정보 그리드 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">체감 온도</p>
              <p className="text-xl font-semibold text-gray-800">
                {getTemperature(main.feels_like)}°
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">최저 온도</p>
              <p className="text-xl font-semibold text-blue-600">
                {getTemperature(main.temp_min)}°
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">최고 온도</p>
              <p className="text-xl font-semibold text-red-600">
                {getTemperature(main.temp_max)}°
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">습도</p>
              <p className="text-xl font-semibold text-gray-800">
                {main.humidity}%
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">기압</p>
              <p className="text-xl font-semibold text-gray-800">
                {main.pressure} hPa
              </p>
            </div>
            {visibility && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">가시거리</p>
                <p className="text-xl font-semibold text-gray-800">
                  {(visibility / 1000).toFixed(1)} km
                </p>
              </div>
            )}
          </div>

          {/* 바람 정보 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">바람</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">풍속</p>
                <p className="text-lg font-semibold text-gray-800">
                  {wind.speed.toFixed(1)} m/s
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">풍향</p>
                <p className="text-lg font-semibold text-gray-800">
                  {getWindDirection(wind.deg)} ({wind.deg}°)
                </p>
              </div>
              {wind.gust && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">돌풍</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {wind.gust.toFixed(1)} m/s
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 구름 정보 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">구름</h2>
            <p className="text-lg font-semibold text-gray-800">
              {clouds.all}%
            </p>
          </div>

          {/* 강수량 정보 */}
          {(rain || snow) && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                강수량
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {rain?.["1h"] !== undefined && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">지난 1시간</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {rain["1h"]} mm
                    </p>
                  </div>
                )}
                {rain?.["3h"] !== undefined && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">지난 3시간</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {rain["3h"]} mm
                    </p>
                  </div>
                )}
                {snow?.["1h"] !== undefined && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">적설 (1시간)</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {snow["1h"]} mm
                    </p>
                  </div>
                )}
                {snow?.["3h"] !== undefined && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">적설 (3시간)</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {snow["3h"]} mm
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 일출/일몰 정보 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              일출/일몰
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">일출</p>
                <p className="text-lg font-semibold text-gray-800">
                  {formatTime(sys.sunrise, timezone)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">일몰</p>
                <p className="text-lg font-semibold text-gray-800">
                  {formatTime(sys.sunset, timezone)}
                </p>
              </div>
            </div>
          </div>

          {/* 추가 정보 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              추가 정보
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">좌표</p>
                <p className="text-sm font-semibold text-gray-800">
                  {coord.lat.toFixed(2)}, {coord.lon.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">국가</p>
                <p className="text-sm font-semibold text-gray-800">
                  {sys.country}
                </p>
              </div>
              {main.sea_level && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">해수면 기압</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {main.sea_level} hPa
                  </p>
                </div>
              )}
              {main.grnd_level && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">지면 기압</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {main.grnd_level} hPa
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetailPage;

