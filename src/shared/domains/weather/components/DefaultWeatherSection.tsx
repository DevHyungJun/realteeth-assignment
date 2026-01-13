import type { CurrentWeatherResponse } from "../../../types";
import { Button, LocationIcon, RefreshIcon } from "../../../ui";
import WeatherCard from "./WeatherCard/WeatherCard";
import WeatherCardSkeleton from "./WeatherCardSkeleton";

interface DefaultWeatherSectionProps {
  locationError: string | null;
  refetchLocation: () => void;
  isLocationLoading: boolean;
  isWeatherLoading: boolean;
  data: CurrentWeatherResponse | null;
  currentAddress: string | null;
  isAddressLoading: boolean;
}

const DefaultWeatherSection = ({
  locationError,
  refetchLocation,
  isLocationLoading,
  isWeatherLoading,
  data,
  currentAddress,
  isAddressLoading,
}: DefaultWeatherSectionProps) => {
  return (
    <section className="mb-8 pb-8 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
        <div className="flex items-center justify-between w-full sm:w-auto sm:justify-start gap-2">
          <div className="flex items-center gap-2">
            <LocationIcon className="h-5 w-5 text-green-500" />
            <h2 className="text-lg font-medium text-gray-500 text-nowrap">
              {locationError && locationError.includes("기본 위치")
                ? "기본 위치"
                : "현재 위치"}
            </h2>
          </div>
          <Button
            onClick={refetchLocation}
            disabled={isLocationLoading}
            aria-label="위치 새로고침"
            className="sm:hidden"
          >
            <RefreshIcon
              className={`h-5 w-5 ${isLocationLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
        {locationError && locationError.includes("기본 위치") && (
          <span className="text-xs sm:text-sm text-gray-500">
            위치 정보 접근이 거부되어 기본 위치로 표시합니다.
          </span>
        )}
        <div className="hidden sm:block ml-auto">
          <Button
            onClick={refetchLocation}
            disabled={isLocationLoading}
            aria-label="위치 새로고침"
          >
            <RefreshIcon
              className={`h-5 w-5 ${isLocationLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>
      {/* 로딩 중이면 스켈레톤, 아니면 실제 카드 */}
      {isLocationLoading || (isWeatherLoading && !data) ? (
        <WeatherCardSkeleton count={1} />
      ) : (
        data && (
          <WeatherCard
            data={data}
            displayAddress={
              // 주소가 로딩 중이거나 없으면 null 전달 (WeatherCard에서 data.name을 fallback으로 사용)
              isAddressLoading ? null : currentAddress || null
            }
          />
        )
      )}
    </section>
  );
};

export default DefaultWeatherSection;
