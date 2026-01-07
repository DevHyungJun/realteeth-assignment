import { useEffect, useState } from "react";

interface LocationPosition {
  latitude: number;
  longitude: number;
}

const useGetLocation = () => {
  const [position, setPosition] = useState<LocationPosition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation이 지원되지 않는 브라우저입니다.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (geoPosition) => {
        setPosition({
          latitude: geoPosition.coords.latitude,
          longitude: geoPosition.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        setError(
          err.message === "User denied Geolocation"
            ? "위치 정보 접근이 거부되었습니다."
            : "위치 정보를 가져오는 중 오류가 발생했습니다."
        );
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return { position, isLoading, error };
};

export default useGetLocation;
