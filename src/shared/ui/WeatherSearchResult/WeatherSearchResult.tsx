import { useNavigate } from "react-router-dom";
import type { CurrentWeatherResponse } from "../../types";
import { getTemperature, getWeatherIconUrl } from "../../utils";
import WeatherCardSkeleton from "../WeatherCardSkeleton/WeatherCardSkeleton";

type WeatherSearchResultProps = {
  data: CurrentWeatherResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  searchTerm: string;
};

const WeatherSearchResult = ({
  data,
  isLoading,
  error,
  searchTerm,
}: WeatherSearchResultProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return <WeatherCardSkeleton />;
  }

  if (error) {
    return (
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">
          {error.message || "날씨 정보를 가져오는 중 오류가 발생했습니다."}
        </p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { main, weather, name, wind } = data;
  const weatherIcon = weather[0]?.icon;
  const weatherDescription = weather[0]?.description || "";

  const handleClick = () => {
    navigate("/weather-detail", { state: data });
  };

  return (
    <div
      className="bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow mt-4"
      onClick={handleClick}
    >
      <h2 className="text-lg font-medium mb-3 text-gray-500">검색 결과</h2>
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

      <div className="flex items-center gap-2 flex-wrap text-sm">
        <span className="text-gray-500">체감온도</span>
        <span className="text-gray-800 font-semibold">
          {getTemperature(main.feels_like)}°
        </span>
        <span className="w-px h-4 bg-gray-300" />
        <span className="text-gray-500">습도</span>
        <span className="text-gray-800 font-semibold">{main.humidity}%</span>
        <span className="w-px h-4 bg-gray-300" />
        <span className="text-gray-500">풍속</span>
        <span className="text-gray-800 font-semibold">
          {wind.speed.toFixed(1)} m/s
        </span>
      </div>
    </div>
  );
};

export default WeatherSearchResult;

