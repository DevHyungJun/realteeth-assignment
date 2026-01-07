import { useQuery } from "@tanstack/react-query";
import vworldAxios from "../api/vworldAxios";
import type { VWorldGeocoderResponse } from "../types/vworldTypes";

type GeocodeResult = {
  lat: number;
  lon: number;
} | null;

/**
 * 주소를 좌표로 변환하는 훅
 */
export function useGeocode(address: string | null) {
  return useQuery<GeocodeResult, Error>({
    queryKey: ["geocode", address],
    queryFn: async () => {
      if (!address) return null;

      const apiKey = import.meta.env.VITE_VWORLD_API_KEY;
      if (!apiKey) {
        throw new Error("VWorld API 키가 설정되지 않았습니다.");
      }

      try {
        const { data } = await vworldAxios.get<VWorldGeocoderResponse>(
          "/address",
          {
            params: {
              service: "address",
              request: "GetCoord",
              version: "2.0",
              crs: "EPSG:4326",
              address: address,
              format: "json",
              type: "ROAD",
              key: apiKey,
            },
          }
        );

        if (data.response.status === "OK" && data.response.result?.point) {
          const { x, y } = data.response.result.point;
          const lat = parseFloat(y);
          const lon = parseFloat(x);

          // 유효한 좌표인지 확인
          if (!isNaN(lat) && !isNaN(lon)) {
            return {
              lat,
              lon,
            };
          }
        }

        // OK가 아닌 경우 또는 유효하지 않은 좌표인 경우 null 반환
        throw new Error("주소를 찾을 수 없습니다. 다른 주소를 입력해주세요.");
      } catch (error) {
        console.error("Geocoding error:", error);
        throw new Error("주소를 좌표로 변환하는 중 오류가 발생했습니다.");
      }
    },
    enabled: !!address,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60, // 1시간
  });
}
