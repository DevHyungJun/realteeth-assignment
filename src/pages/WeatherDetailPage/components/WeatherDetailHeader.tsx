import { useNavigate } from "react-router-dom";
import { Button } from "../../../shared/ui";
import { getWeatherIconUrl } from "../../../shared/utils";
import { getTemperature } from "../../../shared/utils";
import { formatDate } from "../../../shared/utils";

type WeatherDetailHeaderProps = {
  name: string;
  weatherIcon?: string;
  weatherDescription: string;
  temperature: number;
  timestamp: number;
  timezone: number;
};

const WeatherDetailHeader = ({
  name,
  weatherIcon,
  weatherDescription,
  temperature,
  timestamp,
  timezone,
}: WeatherDetailHeaderProps) => {
  const navigate = useNavigate();
  return (
    <>
      <Button
        onClick={() => navigate("/")}
        className="mb-3 bg-transparent text-2xl"
        aria-label="뒤로가기"
        variant="secondary"
      >
        ←
      </Button>
      <div className="flex items-center gap-3 mb-6">
        {weatherIcon && (
          <img
            src={getWeatherIconUrl(weatherIcon)}
            alt={weatherDescription}
            className="w-16 h-16"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
          <p className="text-sm text-gray-500">
            {formatDate(timestamp, timezone)}
          </p>
        </div>
      </div>
      <div className="mb-6">
        <div className="text-5xl text-gray-800 font-light mb-2">
          {getTemperature(temperature)}°
        </div>
        {weatherDescription && (
          <p className="text-lg text-gray-600 capitalize">
            {weatherDescription}
          </p>
        )}
      </div>
    </>
  );
};

export default WeatherDetailHeader;
