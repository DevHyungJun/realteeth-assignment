import { useState, useEffect } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";
import useBaseQuery from "./shared/api/useBaseQuery";
import useGetLocation from "./shared/hooks/useGetLocation";
import { useReverseGeocode } from "./shared/hooks/useReverseGeocode";
import { useMultipleWeatherSearch } from "./shared/hooks/useMultipleWeatherSearch";
import type { CurrentWeatherResponse } from "./shared/types";
import {
  Button,
  WeatherCard,
  WeatherCardSkeleton,
  LocationIcon,
  WeatherSearch,
  WeatherSearchResult,
} from "./shared/ui";
import FavoriteList from "./shared/ui/FavoriteList/FavoriteList";
import WeatherDetailPage from "./pages/WeatherDetailPage/WeatherDetailPage";

const SEARCH_QUERY_KEY = "q";

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get(SEARCH_QUERY_KEY);
  const [searchAddress, setSearchAddress] = useState<string | null>(
    searchQuery
  );
  const {
    position,
    isLocationLoading,
    locationError,
    refetch: refetchLocation,
  } = useGetLocation();
  const { latitude: lat, longitude: lon } = position || {};
  const { data, isLoading: isWeatherLoading } =
    useBaseQuery<CurrentWeatherResponse>(
      ["weather", lat, lon],
      "/data/2.5/weather",
      {
        params: {
          lat,
          lon,
        },
        enabled: !!lat && !!lon && !searchAddress,
      }
    );

  // 좌표를 주소로 변환
  const { data: currentAddress } = useReverseGeocode(lat, lon);
  // 여러 지역에 대한 날씨 검색
  const {
    results,
    isLoading: isSearchLoading,
    hasError,
  } = useMultipleWeatherSearch(searchAddress);

  // URL 쿼리 파라미터와 상태 동기화
  useEffect(() => {
    if (searchQuery !== searchAddress) {
      setSearchAddress(searchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const updateSearchParams = (address: string | null) => {
    if (address) {
      setSearchParams({ [SEARCH_QUERY_KEY]: address });
    } else {
      setSearchParams({});
    }
  };

  const handleSelectDistrict = (district: string) => {
    setSearchAddress(district);
    updateSearchParams(district);
  };

  const handleSearch = (district: string) => {
    setSearchAddress(district);
    updateSearchParams(district);
  };

  const showCurrentLocation = !searchAddress && data && !isLocationLoading;
  const showSearchResult = searchAddress;

  return (
    <main className="min-h-[100dvh] bg-gray-50">
      <h1 className="sr-only">Weather App Main Page</h1>
      <div className="px-4 py-8">
        <div className="mb-6">
          <WeatherSearch
            onSelectDistrict={handleSelectDistrict}
            onSearch={handleSearch}
            initialValue={searchAddress}
          />
        </div>

        {!searchAddress && (
          <div className="w-full flex justify-end">
            <Button
              onClick={refetchLocation}
              disabled={isLocationLoading}
              className="mb-4 flex items-center gap-2 text-sm"
            >
              <LocationIcon className="h-4 w-4 text-green-500" />
              새로고침
            </Button>
          </div>
        )}

        {showSearchResult && (
          <WeatherSearchResult
            results={results}
            isLoading={isSearchLoading}
            hasError={hasError}
            searchTerm={searchAddress || ""}
          />
        )}

        {!searchAddress &&
          (isLocationLoading || (isWeatherLoading && !data)) && (
            <WeatherCardSkeleton />
          )}

        {!searchAddress && locationError && (
          <div className="mt-4 text-red-600">오류: {locationError}</div>
        )}

        {showCurrentLocation && (
          <>
            <section className="mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <LocationIcon className="h-5 w-5 text-green-500" />
                <h2 className="text-lg font-medium text-gray-500">현재 위치</h2>
              </div>
              <WeatherCard data={data} displayAddress={currentAddress} />
            </section>
            <FavoriteList />
          </>
        )}
      </div>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/weather-detail" element={<WeatherDetailPage />} />
    </Routes>
  );
}

export default App;
