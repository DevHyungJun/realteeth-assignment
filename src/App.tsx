import useBaseQuery from "./shared/api/useBaseQuery";
import useGetLocation from "./shared/hooks/useGetLocation";
import type { CurrentWeatherResponse } from "./shared/types/CurrentWeatherResponseType";

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

  console.log(data);

  return (
    <div className="min-h-[100dvh] bg-gray-50">
      <div className="px-4 py-8">
        {isLoading && (
          <div className="mt-4 text-blue-600">위치 정보를 가져오는 중...</div>
        )}

        {error && <div className="mt-4 text-red-600">오류: {error}</div>}

        {position && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">현재 위치</h2>
            <p className="text-gray-700">
              위도: {position.latitude.toFixed(6)}
            </p>
            <p className="text-gray-700">
              경도: {position.longitude.toFixed(6)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
