import useBaseQuery from "./shared/api/useBaseQuery";
import useGetLocation from "./shared/hooks/useGetLocation";
import type { CurrentWeatherResponse } from "./shared/types/CurrentWeatherResponseType";
import WeatherCard from "./shared/ui/WeatherCard/WeatherCard";

function App() {
  const { position, isLoading, error } = useGetLocation();
  const { latitude: lat, longitude: lon } = position || {};
  const { data } = useBaseQuery<CurrentWeatherResponse>(
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
        {isLoading && (
          <div className="mt-4 text-blue-600">위치 정보를 가져오는 중...</div>
        )}

        {error && <div className="mt-4 text-red-600">오류: {error}</div>}

        {data && <WeatherCard data={data} />}
      </div>
    </main>
  );
}

export default App;
