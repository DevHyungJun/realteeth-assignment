import { useState, useEffect } from "react";
import { Routes, Route, useSearchParams, useLocation } from "react-router-dom";
import useBaseQuery from "./shared/api/useBaseQuery";
import useGetLocation from "./shared/hooks/useGetLocation";
import { useReverseGeocode } from "./shared/hooks/useReverseGeocode";
import { useMultipleWeatherSearch } from "./shared/hooks/useMultipleWeatherSearch";
import type { CurrentWeatherResponse } from "./shared/types";
import { MainPageSEO } from "./shared/seo";
import { WeatherSearch, WeatherSearchResult } from "./shared/domains/weather";
import { FavoriteList } from "./shared/domains/favorite";
import WeatherDetailPage from "./pages/WeatherDetailPage/WeatherDetailPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import DefaultWeatherSection from "./shared/domains/weather/components/DefaultWeatherSection";

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

  const { data: currentAddress, isLoading: isAddressLoading } =
    useReverseGeocode(lat, lon);

  const {
    results,
    isLoading: isSearchLoading,
    hasError,
  } = useMultipleWeatherSearch(searchAddress);

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

  const handleUpdateDistrict = (district: string) => {
    setSearchAddress(district);
    updateSearchParams(district);
  };

  return (
    <>
      <MainPageSEO />
      <main className="min-h-[100dvh] bg-gray-50">
        <h1 className="sr-only">Weather App Main Page</h1>
        <div className="sticky top-0 z-10 bg-gray-50 p-2">
          <WeatherSearch
            onSelectDistrict={handleUpdateDistrict}
            onSearch={handleUpdateDistrict}
            initialValue={searchAddress}
          />
        </div>
        <div className="px-4 py-8">
          {searchAddress && (
            <WeatherSearchResult
              results={results}
              isLoading={isSearchLoading}
              hasError={hasError}
              searchTerm={searchAddress || ""}
            />
          )}

          {!searchAddress && (
            <>
              <DefaultWeatherSection
                locationError={locationError}
                refetchLocation={refetchLocation}
                isLocationLoading={isLocationLoading}
                isWeatherLoading={isWeatherLoading}
                data={data || null}
                currentAddress={currentAddress || null}
                isAddressLoading={isAddressLoading}
              />
              <FavoriteList />
            </>
          )}
        </div>
      </main>
    </>
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
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
