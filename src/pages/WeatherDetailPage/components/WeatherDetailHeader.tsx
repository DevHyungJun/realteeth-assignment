import { useNavigate } from "react-router-dom";
import { Button } from "../../../shared/ui";
import { getWeatherIconUrl } from "../../../shared/utils";
import { getTemperature } from "../../../shared/utils";
import { formatDate } from "../../../shared/utils";
import { FavoriteButton } from "../../../shared/domains/favorite";
import type { CurrentWeatherResponse } from "../../../shared/types";

type WeatherDetailHeaderProps = {
  name: string;
  weatherIcon?: string;
  weatherDescription: string;
  temperature: number;
  timestamp: number;
  timezone: number;
  data: CurrentWeatherResponse;
  district?: string;
  favoriteName?: string;
};

const WeatherDetailHeader = ({
  name,
  weatherIcon,
  weatherDescription,
  temperature,
  timestamp,
  timezone,
  data,
  district,
  favoriteName,
}: WeatherDetailHeaderProps) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <Button
          onClick={() => navigate(-1)}
          className="bg-transparent text-2xl"
          aria-label="뒤로가기"
          variant="secondary"
        >
          ←
        </Button>
        <FavoriteButton data={data} district={district} />
      </div>
      <div className="flex items-center gap-3 mb-6">
        {weatherIcon && (
          <img
            src={getWeatherIconUrl(weatherIcon)}
            alt={weatherDescription}
            className="w-16 h-16"
          />
        )}
        <div>
          {favoriteName ? (
            <>
              <h1 className="text-lg sm:text-3xl font-bold text-blue-700 mb-1">
                {favoriteName}
              </h1>
              <p className="text-base sm:text-lg text-gray-500 mb-1">{name}</p>
            </>
          ) : (
            <h1 className="text-lg sm:text-3xl font-bold text-gray-800">
              {name}
            </h1>
          )}
          <p className="text-sm text-gray-500">
            {formatDate(timestamp, timezone)}
          </p>
        </div>
      </div>
      <div className="mb-6 pl-5">
        <div className="text-4xl sm:text-5xl text-gray-800 font-light mb-2">
          {getTemperature(temperature)}°
        </div>
        {weatherDescription && (
          <p className="text-base sm:text-lg text-gray-600 capitalize">
            {weatherDescription}
          </p>
        )}
      </div>
    </>
  );
};

export default WeatherDetailHeader;
