import { useCallback, useEffect, useState } from "react";
import { useCurrentLocationStore } from "../config/store";

interface LocationPosition {
  latitude: number;
  longitude: number;
}

// 기본 위치: 서울시청
const DEFAULT_POSITION: LocationPosition = {
  latitude: 37.566046,
  longitude: 126.977862,
};

const useGetLocation = () => {
  const { cachedPosition, setCachedPosition } = useCurrentLocationStore();

  const [position, setPosition] = useState<LocationPosition | null>(
    cachedPosition
  );
  const [isLocationLoading, setIsLocationLoading] = useState(!cachedPosition);
  const [locationError, setLocationError] = useState<string | null>(null);

  const fetchLocation = useCallback(
    (forceRefresh = false) => {
      // 캐시된 위치가 있고 강제 새로고침이 아닌 경우 캐시 사용
      if (cachedPosition && !forceRefresh) {
        setPosition(cachedPosition);
        setIsLocationLoading(false);
        return;
      }

      if (!navigator.geolocation) {
        // Geolocation이 지원되지 않는 경우 기본 위치 사용
        const defaultPosition = DEFAULT_POSITION;
        setPosition(defaultPosition);
        setCachedPosition(defaultPosition);
        setLocationError("Geolocation이 지원되지 않는 브라우저입니다. 기본 위치(서울시청)를 표시합니다.");
        setIsLocationLoading(false);
        return;
      }

      setIsLocationLoading(true);
      setLocationError(null);

      navigator.geolocation.getCurrentPosition(
        (geoPosition) => {
          const newPosition = {
            latitude: geoPosition.coords.latitude,
            longitude: geoPosition.coords.longitude,
          };
          setPosition(newPosition);
          setCachedPosition(newPosition); // 전역 상태에 저장
          setIsLocationLoading(false);
        },
        (err) => {
          // 위치 허용 거부 또는 오류 발생 시 기본 위치(서울시청) 사용
          const defaultPosition = DEFAULT_POSITION;
          setPosition(defaultPosition);
          setCachedPosition(defaultPosition);
          setLocationError(
            err.message === "User denied Geolocation"
              ? "위치 정보 접근이 거부되었습니다. 기본 위치(서울시청)를 표시합니다."
              : "위치 정보를 가져오는 중 오류가 발생했습니다. 기본 위치(서울시청)를 표시합니다."
          );
          setIsLocationLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    },
    [cachedPosition, setCachedPosition]
  );

  // 캐시된 위치가 변경되면 position 상태 동기화
  useEffect(() => {
    if (cachedPosition) {
      setPosition(cachedPosition);
      setIsLocationLoading(false);
    }
  }, [cachedPosition]);

  // 컴포넌트 마운트 시 캐시가 없으면 위치 정보 가져오기
  useEffect(() => {
    if (!cachedPosition) {
      fetchLocation(false);
    }
  }, []);

  return {
    position,
    isLocationLoading,
    locationError,
    refetch: () => fetchLocation(true), // 강제 새로고침
  };
};

export default useGetLocation;
