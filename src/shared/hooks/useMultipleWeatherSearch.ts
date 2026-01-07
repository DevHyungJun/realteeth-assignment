import { useQueries } from "@tanstack/react-query";
import type { CurrentWeatherResponse } from "../types";
import { filterDistricts } from "../utils/filterDistricts";
import vworldAxios from "../api/vworldAxios";
import baseAxios from "../api/baseAxios";
import type { VWorldGeocoderResponse } from "../types/vworldTypes";
import { WEATHER_CACHE_TIME } from "../config/cacheTimes";

export type WeatherSearchItem = {
  district: string;
  address: string | null;
  data: CurrentWeatherResponse | undefined;
  isLoading: boolean;
  error: Error | null;
};

/**
 * 검색어로 여러 지역을 찾아 각각의 날씨를 조회하는 훅
 */
export function useMultipleWeatherSearch(searchTerm: string | null) {
  // 검색어로 여러 지역 찾기 (최대 5개)
  const matchedDistricts = searchTerm
    ? filterDistricts(searchTerm, 5).map((district) => district.trim())
    : [];

  // 각 지역에 대해 geocode + weather 조회
  const weatherQueries = useQueries({
    queries: matchedDistricts.map((district) => ({
      queryKey: ["weather-search-multiple", district],
      queryFn: async (): Promise<WeatherSearchItem> => {
        const apiKey = import.meta.env.VITE_VWORLD_API_KEY;
        if (!apiKey) {
          throw new Error("VWorld API 키가 설정되지 않았습니다.");
        }

        // 1. 주소를 좌표로 변환
        const isDevelopment = import.meta.env.DEV;
        const geocodeUrl = isDevelopment
          ? "/api/vworld/address"
          : "https://api.vworld.kr/req/address";

        const { data: geocodeData } = await vworldAxios.get<VWorldGeocoderResponse>(
          "/address",
          {
            params: {
              service: "address",
              request: "GetCoord",
              version: "2.0",
              crs: "EPSG:4326",
              address: district,
              format: "json",
              type: "ROAD",
              key: apiKey,
            },
          }
        );

        if (
          geocodeData.response.status !== "OK" ||
          !geocodeData.response.result?.point
        ) {
          throw new Error(`주소를 찾을 수 없습니다: ${district}`);
        }

        const { x, y } = geocodeData.response.result.point;
        const lat = parseFloat(y);
        const lon = parseFloat(x);

        if (isNaN(lat) || isNaN(lon)) {
          throw new Error(`유효하지 않은 좌표입니다: ${district}`);
        }

        // VWorld API 응답에서 실제 주소 가져오기
        let address = district;
        const result = geocodeData.response.result;
        
        // 우선순위: result.text > structure 조합 > input.address.text > district
        if (result?.text) {
          address = result.text;
        } else if (result?.structure) {
          // structure를 사용해서 주소 조합
          const { level0, level1, level2 } = result.structure;
          const addressParts = [level0, level1, level2].filter(
            (part) => part && part.trim()
          );
          if (addressParts.length > 0) {
            address = addressParts.join(" ");
          }
        } else if (geocodeData.response.input?.address?.text) {
          address = geocodeData.response.input.address.text;
        }

        // 2. 좌표로 날씨 조회
        const { data: weatherData } = await baseAxios.get<CurrentWeatherResponse>(
          "/data/2.5/weather",
          {
            params: {
              lat,
              lon,
              appid: import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY,
              lang: "kr",
              units: "metric",
            },
          }
        );

        return {
          district,
          address,
          data: weatherData,
          isLoading: false,
          error: null,
        };
      },
      enabled: !!searchTerm && matchedDistricts.length > 0,
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: WEATHER_CACHE_TIME, // 날씨 데이터 캐싱 시간 사용
    })),
  });

  // 결과를 WeatherSearchItem 배열로 변환
  const results: WeatherSearchItem[] = matchedDistricts.map(
    (district, index) => {
      const query = weatherQueries[index];
      return {
        district,
        address: query.data?.address || null,
        data: query.data?.data,
        isLoading: query.isLoading,
        error: query.error
          ? new Error(query.error.message || "알 수 없는 오류가 발생했습니다.")
          : null,
      };
    }
  );

  const isLoading = weatherQueries.some((query) => query.isLoading);
  const hasError = weatherQueries.some((query) => query.isError);

  return {
    results,
    isLoading,
    hasError,
  };
}

