import { Routes, Route } from "react-router-dom";
import useBaseQuery from "./shared/api/useBaseQuery";
import useGetLocation from "./shared/hooks/useGetLocation";
import type { CurrentWeatherResponse } from "./shared/types/CurrentWeatherResponseType";
import { Button, WeatherCard, WeatherCardSkeleton } from "./shared/ui";
import WeatherDetailPage from "./pages/WeatherDetailPage/WeatherDetailPage";

function HomePage() {
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
      enabled: !!lat && !!lon,
    }
  );

  return (
    <main className="min-h-[100dvh] bg-gray-50">
      <h1 className="sr-only">Weather App Main Page</h1>
      <div className="px-4 py-8">
        <Button
          onClick={refetchLocation}
          disabled={isLocationLoading}
          className="mb-4"
        >
          내 위치 새로고침
        </Button>
        {(isLocationLoading || (isWeatherLoading && !data)) && (
          <WeatherCardSkeleton />
        )}

        {locationError && (
          <div className="mt-4 text-red-600">오류: {locationError}</div>
        )}

        {data && !isLocationLoading && (
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
