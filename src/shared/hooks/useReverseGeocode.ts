import { useQuery } from "@tanstack/react-query";
import vworldAxios from "../api/vworldAxios";
import type { VWorldReverseGeocoderResponse } from "../types/vworldTypes";

type ReverseGeocodeResult = string | null;

/**
 * 좌표를 주소로 변환하는 훅
 */
export function useReverseGeocode(
  lat: number | undefined,
  lon: number | undefined
) {
  return useQuery<ReverseGeocodeResult, Error>({
    queryKey: ["reverse-geocode", lat, lon],
    queryFn: async () => {
      const apiKey = import.meta.env.VITE_VWORLD_API_KEY;
      if (!apiKey) {
        throw new Error("VWorld API 키가 설정되지 않았습니다.");
      }

      try {
        const { data } = await vworldAxios.get<VWorldReverseGeocoderResponse>(
          "/address",
          {
            params: {
              service: "address",
              request: "getAddress",
              version: "2.0",
              crs: "EPSG:4326",
              point: `${lon},${lat}`,
              format: "json",
              type: "BOTH",
              zipcode: false,
              simple: false,
              key: apiKey,
            },
          }
        );

        if (data.response.status === "OK" && data.response.result) {
          const result = data.response.result;
          
          // result가 배열인 경우 (실제 응답 구조)
          if (Array.isArray(result) && result.length > 0) {
            // 도로명주소 우선, 없으면 지번주소 사용
            // type은 대소문자 구분 없이 비교
            const roadAddress = result.find(
              (addr) => addr.type?.toUpperCase() === "ROAD"
            );
            const parcelAddress = result.find(
              (addr) => addr.type?.toUpperCase() === "PARCEL"
            );

            const address = roadAddress?.text || parcelAddress?.text;

            if (address) {
              return address;
            }
            
            // type이 없거나 매칭되지 않는 경우 첫 번째 항목의 text 사용
            if (result[0]?.text) {
              return result[0].text;
            }
          }
          
          // result가 객체인 경우 (다른 응답 구조)
          if (!Array.isArray(result)) {
            // 1. result.text가 있으면 우선 사용
            if (result.text) {
              return result.text;
            }
            
            // 2. items가 있는 경우
            if (result.items) {
              const items = result.items;
              
              // items가 배열의 배열인지 단순 배열인지 확인
              let addressItems: Array<{ type?: string; text: string }> = [];
              
              if (Array.isArray(items) && items.length > 0) {
                // 첫 번째 요소가 배열인지 확인 (배열의 배열)
                if (Array.isArray(items[0])) {
                  // 배열의 배열인 경우
                  addressItems = items[0] as Array<{ type?: string; text: string }>;
                } else {
                  // 단순 배열인 경우
                  addressItems = items as Array<{ type?: string; text: string }>;
                }
              }
              
              if (addressItems.length > 0) {
                // 도로명주소 우선, 없으면 지번주소 사용
                const roadAddress = addressItems.find(
                  (addr) => addr.type?.toUpperCase() === "ROAD"
                );
                const parcelAddress = addressItems.find(
                  (addr) => addr.type?.toUpperCase() === "PARCEL"
                );

                const address = roadAddress?.text || parcelAddress?.text;

                if (address) {
                  return address;
                }
              }
            }
            
            // 3. structure가 있는 경우 조합
            if (result.structure) {
              const { level0, level1, level2 } = result.structure;
              const addressParts = [level0, level1, level2].filter(
                (part) => part && part.trim()
              );
              if (addressParts.length > 0) {
                return addressParts.join(" ");
              }
            }
          }
        }

        return null;
      } catch (error) {
        console.error("Reverse geocoding error:", error);
        throw new Error("좌표를 주소로 변환하는 중 오류가 발생했습니다.");
      }
    },
    enabled: !!lat && !!lon,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60, // 1시간
  });
}
