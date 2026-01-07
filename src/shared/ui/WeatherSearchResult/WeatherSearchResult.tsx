import { useNavigate } from "react-router-dom";
import type { CurrentWeatherResponse } from "../../types";
import { getTemperature, getWeatherIconUrl } from "../../utils";
import WeatherCardSkeleton from "../WeatherCardSkeleton/WeatherCardSkeleton";
import type { WeatherSearchItem } from "../../hooks/useMultipleWeatherSearch";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import {
  useFavoritesStore,
  generateFavoriteId,
} from "../../config/favoritesStore";

type WeatherSearchResultProps = {
  results: WeatherSearchItem[];
  isLoading: boolean;
  hasError: boolean;
  searchTerm: string;
};

const WeatherSearchResultItem = ({
  data,
  district,
  error,
}: {
  data: CurrentWeatherResponse | undefined;
  district: string;
  address: string | null;
  error: Error | null;
}) => {
  const navigate = useNavigate();
  const { getFavoriteById } = useFavoritesStore();

  // 에러가 있거나 데이터가 없으면 렌더링하지 않음
  if (error || !data) {
    return null;
  }

  const { main, weather, wind } = data;
  const weatherIcon = weather[0]?.icon;
  const weatherDescription = weather[0]?.description || "";

  // 즐겨찾기에 등록되어 있는지 확인
  const favoriteId = generateFavoriteId(data);
  const favorite = getFavoriteById(favoriteId);

  // 표시할 이름과 주소 결정
  const displayName = favorite
    ? favorite.name !== (favorite.district || data.name)
      ? favorite.name
      : district
    : district;
  const displayAddress =
    favorite && favorite.district && favorite.name !== favorite.district
      ? favorite.district
      : null;

  const handleClick = () => {
    // district와 favoriteName 정보를 함께 전달
    navigate("/weather-detail", {
      state: {
        ...data,
        district: favorite?.district || district,
        favoriteName:
          favorite && favorite.name !== (favorite.district || data.name)
            ? favorite.name
            : undefined,
      },
    });
  };
  return (
    <div
      className="bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow relative"
      onClick={handleClick}
    >
      <div className="absolute top-4 right-4" onClick={(e) => e.stopPropagation()}>
        <FavoriteButton data={data} district={displayAddress || undefined} />
      </div>
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
        <div className="flex-1">
          <h2 className="text-xl font-bold">{displayName}</h2>
          {displayAddress && (
            <p className="text-sm text-gray-500 mt-1">{displayAddress}</p>
          )}
          {weatherDescription && (
            <p className="text-sm text-gray-600 capitalize mt-1">
              {weatherDescription}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap text-sm mt-3">
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

const WeatherSearchResult = ({
  results,
  isLoading,
  hasError,
  searchTerm,
}: WeatherSearchResultProps) => {
  if (isLoading) {
    return (
      <div className="mt-4 space-y-4">
        <WeatherCardSkeleton />
        <WeatherCardSkeleton />
        <WeatherCardSkeleton />
      </div>
    );
  }

  if (hasError && results.length === 0) {
    return (
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">
          날씨 정보를 가져오는 중 오류가 발생했습니다.
        </p>
      </div>
    );
  }

  // 에러가 없고 데이터가 있는 결과만 필터링
  const validResults = results.filter((item) => item.data && !item.error);

  if (validResults.length === 0) {
    return (
      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-600">
          &quot;{searchTerm}&quot;에 대한 검색 결과를 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <h2 className="text-lg font-medium text-gray-500">
        검색 결과 ({validResults.length}개)
      </h2>
      {validResults.map((item) => (
        <WeatherSearchResultItem
          key={item.district}
          data={item.data}
          district={item.district}
          address={item.address}
          error={item.error}
        />
      ))}
    </div>
  );
};

export default WeatherSearchResult;
