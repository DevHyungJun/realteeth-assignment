import { useState, useEffect } from "react";
import { Routes, Route, useSearchParams, useLocation } from "react-router-dom";
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
  RefreshIcon,
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
      <div className="sticky top-0 z-10 bg-gray-50 p-2 shadow-md">
        <WeatherSearch
          onSelectDistrict={handleSelectDistrict}
          onSearch={handleSearch}
          initialValue={searchAddress}
        />
      </div>
      <div className="px-4 py-8">
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <LocationIcon className="h-5 w-5 text-green-500" />
                  <h2 className="text-lg font-medium text-gray-500">
                    현재 위치
                  </h2>
                </div>
                <Button
                  onClick={refetchLocation}
                  disabled={isLocationLoading}
                  aria-label="위치 새로고침"
                >
                  <RefreshIcon
                    className={`h-5 w-5 ${
                      isLocationLoading ? "animate-spin" : ""
                    }`}
                  />
                </Button>
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
  const location = useLocation();

  // 라우팅 변경 시 스크롤을 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/weather-detail" element={<WeatherDetailPage />} />
    </Routes>
  );
}

export default App;
