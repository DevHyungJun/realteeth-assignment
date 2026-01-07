"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  UseQueryOptions,
  UseQueryResult,
  QueryKey,
} from "@tanstack/react-query";
import type { AxiosRequestConfig } from "axios";
import baseAxios from "./baseAxios";

/**
 * React Query를 사용한 기본 API 쿼리 훅
 *
 * baseAxios를 사용하여 GET 요청을 수행하고, React Query의 useQuery를 래핑한 커스텀 훅입니다.
 * 쿼리 파라미터를 객체 형태로 전달할 수 있으며, 기본적인 재시도 및 캐싱 설정이 포함되어 있습니다.
 *
 * @template TQueryFnData - API 응답 데이터의 타입
 * @template TError - 에러 타입 (기본값: unknown)
 * @template TData - 변환된 데이터 타입 (기본값: TQueryFnData)
 *
 * @param queryKey - React Query의 쿼리 키. 쿼리를 고유하게 식별하는 데 사용됩니다.
 * @param url - API 엔드포인트 URL
 * @param options - React Query 옵션 및 API 파라미터
 * @param options.params - URL 쿼리 파라미터 객체 (예: { lat: 37.5, lon: 127.0 })
 * @param options.enabled - 쿼리 실행 여부를 제어하는 옵션
 * @param options.staleTime - 데이터가 fresh 상태로 유지되는 시간 (밀리초)
 * @param options.refetchOnWindowFocus - 윈도우 포커스 시 재요청 여부
 * @param options.retry - 실패 시 재시도 횟수
 * @param options.retryDelay - 재시도 간격 (밀리초)
 * @param options.select - 데이터 변환 함수
 * @param options.onSuccess - 성공 시 콜백 함수
 * @param options.onError - 에러 시 콜백 함수
 *
 * @returns React Query의 UseQueryResult 객체
 *
 * @example
 * // 기본 사용법
 * const { data, isLoading, error } = useBaseQuery(
 *   ['weather'],
 *   '/weather'
 * );
 *
 * @example
 * // 쿼리 파라미터와 함께 사용
 * const { data } = useBaseQuery(
 *   ['weather', lat, lon],
 *   '/weather',
 *   {
 *     params: {
 *       lat: 37.5,
 *       lon: 127.0,
 *       units: 'metric'
 *     }
 *   }
 * );
 *
 * @example
 * // 타입 지정 및 옵션 사용
 * interface WeatherData {
 *   temperature: number;
 *   humidity: number;
 * }
 *
 * const { data } = useBaseQuery<WeatherData>(
 *   ['weather', cityId],
 *   '/weather',
 *   {
 *     params: { cityId },
 *     enabled: !!cityId,
 *     staleTime: 1000 * 60 * 5, // 5분
 *     select: (data) => ({
 *       temp: data.temperature,
 *       hum: data.humidity
 *     })
 *   }
 * );
 */
const useBaseQuery = <TQueryFnData, TError = unknown, TData = TQueryFnData>(
  queryKey: QueryKey,
  url: string,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData>,
    "queryKey" | "queryFn"
  > & {
    params?: AxiosRequestConfig["params"];
  }
): UseQueryResult<TData, TError> => {
  const { params, ...queryOptions } = options || {};
  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await baseAxios.get<TQueryFnData>(url, {
        params: {
          ...params,
          appid: import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY,
        },
      });
      return data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
    ...queryOptions,
  });
};

export default useBaseQuery;
