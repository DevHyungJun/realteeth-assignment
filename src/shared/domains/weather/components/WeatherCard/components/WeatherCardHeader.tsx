import type { MouseEvent, KeyboardEvent } from "react";
import type { UseFormRegister } from "react-hook-form";
import { getTemperature, getWeatherIconUrl } from "../../../../../utils";
import type { CurrentWeatherResponse } from "../../../../../types";

type FormData = {
  favoriteName: string;
};

interface WeatherCardHeaderProps {
  data: CurrentWeatherResponse;
  displayName: string;
  displayDistrict: string | null;
  hasCustomName: boolean;
  weatherDescription: string;
  weatherDescriptionPosition: "below" | "separate";
  editableName: boolean;
  isEditing: boolean;
  register: UseFormRegister<FormData>;
  onNameBlur: () => void;
  onNameKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onNameClick: (e: MouseEvent) => void;
}

const WeatherCardHeader = ({
  data,
  displayName,
  displayDistrict,
  hasCustomName,
  weatherDescription,
  weatherDescriptionPosition,
  editableName,
  isEditing,
  register,
  onNameBlur,
  onNameKeyDown,
  onNameClick,
}: WeatherCardHeaderProps) => {
  const { main, weather } = data;
  const weatherIcon = weather[0]?.icon;

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {weatherIcon && (
            <img
              src={getWeatherIconUrl(weatherIcon)}
              alt={weatherDescription}
              className="w-12 h-12"
            />
          )}
          <div className="text-2xl sm:text-3xl text-gray-800 font-light">
            {getTemperature(main.temp)}°
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="inline-block">
            {isEditing ? (
              <input
                {...register("favoriteName", { maxLength: 25 })}
                type="text"
                maxLength={25}
                onBlur={onNameBlur}
                onKeyDown={onNameKeyDown}
                className="text-lg sm:text-xl font-bold border-b-2 border-blue-500 focus:outline-none w-full min-w-[100px] pr-[28px]"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h2
                className={`text-lg sm:text-xl font-bold max-w-[220px] sm:max-w-none truncate ${
                  hasCustomName && "text-blue-700"
                } ${
                  editableName &&
                  "hover:text-blue-700 transition-colors cursor-text"
                } inline-block pr-[28px]`}
                onClick={onNameClick}
              >
                {displayName}
              </h2>
            )}
          </div>
          {displayDistrict && displayDistrict !== displayName && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {displayDistrict}
            </p>
          )}
          {weatherDescription && weatherDescriptionPosition === "below" && (
            <p className="text-xs sm:text-sm text-gray-600 capitalize mt-1">
              {weatherDescription}
            </p>
          )}
        </div>
      </div>

      {weatherDescription && weatherDescriptionPosition === "separate" && (
        <p className="text-sm text-gray-600 capitalize ml-auto mb-3">
          {weatherDescription}
        </p>
      )}
    </>
  );
};

export default WeatherCardHeader;
