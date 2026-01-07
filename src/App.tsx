import useBaseQuery from "./shared/api/useBaseQuery";
import useGetLocation from "./shared/hooks/useGetLocation";
import type { CurrentWeatherResponse } from "./shared/types/CurrentWeatherResponseType";
import { WeatherCard, WeatherCardSkeleton } from "./shared/ui";

function App() {
  const { position, isLocationLoading, locationError } = useGetLocation();
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
        {(isLocationLoading || isWeatherLoading) && !data && (
          <WeatherCardSkeleton />
        )}

        {locationError && (
          <div className="mt-4 text-red-600">오류: {locationError}</div>
        )}

        {data && (
          <WeatherCard data={data} isCurrentWeather={isWeatherSuccess} />
        )}
      </div>
    </main>
  );
}

export default App;
