import { useState, useEffect } from "react";
import { Routes, Route, useSearchParams, useLocation } from "react-router-dom";
import useBaseQuery from "./shared/api/useBaseQuery";
import useGetLocation from "./shared/hooks/useGetLocation";
import { useReverseGeocode } from "./shared/hooks/useReverseGeocode";
import { useMultipleWeatherSearch } from "./shared/hooks/useMultipleWeatherSearch";
import type { CurrentWeatherResponse } from "./shared/types";
import { Button, LocationIcon, RefreshIcon } from "./shared/ui";
import {
  WeatherCard,
  WeatherCardSkeleton,
  WeatherSearch,
  WeatherSearchResult,
} from "./shared/domains/weather";
import { FavoriteList } from "./shared/domains/favorite";
import WeatherDetailPage from "./pages/WeatherDetailPage/WeatherDetailPage";

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");
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
  }, [searchQuery]);

  const updateSearchParams = (address: string | null) => {
    if (!address) {
      setSearchParams({});
      return;
    }
    setSearchParams({ q: address });
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
      <div className="sticky top-0 z-10 bg-gray-50 p-2">
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
            <WeatherCardSkeleton count={6} />
          )}

        {showCurrentLocation && (
          <>
            <section className="mb-8 pb-8 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
                <div className="flex items-center justify-between w-full sm:w-auto sm:justify-start gap-2">
                  <div className="flex items-center gap-2">
                    <LocationIcon className="h-5 w-5 text-green-500" />
                    <h2 className="text-lg font-medium text-gray-500 text-nowrap">
                      {locationError && locationError.includes("기본 위치")
                        ? "기본 위치"
                        : "현재 위치"}
                    </h2>
                  </div>
                  <Button
                    onClick={refetchLocation}
                    disabled={isLocationLoading}
                    aria-label="위치 새로고침"
                    className="sm:hidden"
                  >
                    <RefreshIcon
                      className={`h-5 w-5 ${
                        isLocationLoading ? "animate-spin" : ""
                      }`}
                    />
                  </Button>
                </div>
                {locationError && locationError.includes("기본 위치") && (
                  <span className="text-xs sm:text-sm text-gray-500">
                    위치 정보 접근이 거부되어 기본 위치로 표시합니다.
                  </span>
                )}
                <div className="hidden sm:block ml-auto">
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
