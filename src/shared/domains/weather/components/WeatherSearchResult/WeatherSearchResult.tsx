import { useNavigate } from "react-router-dom";
import type { CurrentWeatherResponse } from "../../../../types";
import WeatherCardSkeleton from "../WeatherCardSkeleton/WeatherCardSkeleton";
import WeatherCard from "../WeatherCard/WeatherCard";
import type { WeatherSearchItem } from "../../../../hooks/useMultipleWeatherSearch";
import {
  useFavoritesStore,
  generateFavoriteId,
} from "../../../../config/favoritesStore";

interface WeatherSearchResultProps {
  results: WeatherSearchItem[];
  isLoading: boolean;
  hasError: boolean;
  searchTerm: string;
}

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

  if (error || !data) {
    return null;
  }

  const favoriteId = generateFavoriteId(data, district);
  const favorite = getFavoriteById(favoriteId);

  const displayName = favorite
    ? favorite.name !== (favorite.district || data.name)
      ? favorite.name
      : district
    : district;
  const displayAddress =
    favorite && favorite.district && favorite.name !== favorite.district
      ? favorite.district
      : null;

  return (
    <WeatherCard
      data={data}
      displayAddress={district}
      variant="compact"
      displayName={displayName}
      displayDistrict={displayAddress}
      weatherDescriptionPosition="below"
      onClick={() => {
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
      }}
    />
  );
};

const WeatherSearchResult = ({
  results,
  isLoading,
  hasError,
}: WeatherSearchResultProps) => {
  const validResults = results.filter((item) => item.data && !item.error);

  return (
    <div className="mt-4 space-y-4">
      <h2 className="text-lg font-medium text-gray-500">
        {isLoading ? "검색 결과" : `검색 결과 (${validResults.length}개)`}
      </h2>
      {isLoading && <WeatherCardSkeleton count={6} />}
      {!isLoading && hasError && results.length === 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">
            날씨 정보를 가져오는 중 오류가 발생했습니다.
          </p>
        </div>
      )}
      {!isLoading && !hasError && validResults.length === 0 && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-600">해당 장소의 정보가 제공되지 않습니다.</p>
        </div>
      )}

      {!isLoading &&
        validResults.length > 0 &&
        validResults.map((item) => (
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
