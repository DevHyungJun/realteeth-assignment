import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import useBaseQuery from "./shared/api/useBaseQuery";
import useGetLocation from "./shared/hooks/useGetLocation";
import { useGeocode } from "./shared/hooks/useGeocode";
import type { CurrentWeatherResponse } from "./shared/types";
import {
  Button,
  WeatherCard,
  WeatherCardSkeleton,
  LocationIcon,
  WeatherSearch,
  WeatherSearchResult,
} from "./shared/ui";
import WeatherDetailPage from "./pages/WeatherDetailPage/WeatherDetailPage";

function HomePage() {
  const [searchAddress, setSearchAddress] = useState<string | null>(null);
  const {
    position,
    isLocationLoading,
    locationError,
    refetch: refetchLocation,
  } = useGetLocation();
  const { latitude: lat, longitude: lon } = position || {};
  const {
    data,
    isLoading: isWeatherLoading,
    isSuccess: isWeatherSuccess,
  } = useBaseQuery<CurrentWeatherResponse>(
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

  // 주소를 좌표로 변환
  const {
    data: geocodeResult,
    isLoading: isGeocoding,
    error: geocodeError,
  } = useGeocode(searchAddress);

  // 좌표로 날씨 검색
  const {
    data: searchData,
    isLoading: isSearchLoading,
    error: searchError,
  } = useBaseQuery<CurrentWeatherResponse>(
    ["weather-search", geocodeResult?.lat, geocodeResult?.lon],
    "/data/2.5/weather",
    {
      params: {
        lat: geocodeResult?.lat,
        lon: geocodeResult?.lon,
      },
      enabled: !!geocodeResult,
    }
  );

  const searchErrorAsError =
    searchError instanceof Error
      ? searchError
      : searchError
      ? new Error(String(searchError))
      : null;

  const geocodeErrorAsError =
    geocodeError instanceof Error
      ? geocodeError
      : geocodeError
      ? new Error(String(geocodeError))
      : null;

  const handleSelectDistrict = (district: string) => {
    setSearchAddress(district);
  };

  const handleSearch = (district: string) => {
    setSearchAddress(district);
  };

  const showCurrentLocation = !searchAddress && data && !isLocationLoading;
  const showSearchResult = searchAddress;
  const isSearchProcessing = isGeocoding || (isSearchLoading && !searchData);

  return (
    <main className="min-h-[100dvh] bg-gray-50">
      <h1 className="sr-only">Weather App Main Page</h1>
      <div className="px-4 py-8">
        <div className="mb-6">
          <WeatherSearch
            onSelectDistrict={handleSelectDistrict}
            onSearch={handleSearch}
          />
        </div>

        {!searchAddress && (
          <Button
            onClick={refetchLocation}
            disabled={isLocationLoading}
            className="mb-4 flex items-center gap-2"
          >
            <LocationIcon className="h-5 w-5 text-green-500" />
            위치 새로고침
          </Button>
        )}

        {showSearchResult && (
          <WeatherSearchResult
            data={searchData}
            isLoading={isSearchProcessing}
            error={geocodeErrorAsError || searchErrorAsError}
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
          <WeatherCard data={data} isCurrentWeather={isWeatherSuccess} />
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
