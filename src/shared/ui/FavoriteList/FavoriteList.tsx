import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFavoritesStore } from "../../config/favoritesStore";
import { getTemperature, getWeatherIconUrl } from "../../utils";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import StarIcon from "../Icons/StarIcon";
import type { CurrentWeatherResponse } from "../../types";

const FavoriteItem = ({
  favorite,
}: {
  favorite: {
    id: string;
    name: string;
    data: CurrentWeatherResponse;
    district?: string;
  };
}) => {
  const navigate = useNavigate();
  const { updateFavoriteName } = useFavoritesStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(favorite.name);

  // favorite.name이 변경되면 editName도 업데이트
  useEffect(() => {
    if (!isEditing) {
      setEditName(favorite.name);
    }
  }, [favorite.name, isEditing]);

  const { main, weather, wind } = favorite.data;
  const weatherIcon = weather[0]?.icon;
  const weatherDescription = weather[0]?.description || "";

  const handleClick = () => {
    if (!isEditing) {
      navigate("/weather-detail", {
        state: {
          ...favorite.data,
          district: favorite.district || favorite.data.name,
          favoriteName:
            favorite.name !== (favorite.district || favorite.data.name)
              ? favorite.name
              : undefined,
        },
      });
    }
  };

  const handleNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleNameBlur = () => {
    if (editName.trim() && editName.trim() !== favorite.name) {
      updateFavoriteName(favorite.id, editName.trim());
    } else {
      setEditName(favorite.name);
    }
    setIsEditing(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      setEditName(favorite.name);
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow relative">
      <div
        className="absolute top-4 right-4"
        onClick={(e) => e.stopPropagation()}
      >
        <FavoriteButton data={favorite.data} district={favorite.district} />
      </div>
      <div className="flex items-center gap-3" onClick={handleClick}>
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
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleNameBlur}
                onKeyDown={handleNameKeyDown}
                className="text-xl font-bold border-b-2 border-blue-500 focus:outline-none w-full min-w-[100px]"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h2
                className="text-lg sm:text-xl font-bold hover:text-blue-600 transition-colors cursor-text inline-block pr-[28px]"
                onClick={handleNameClick}
              >
                {favorite.name}
              </h2>
            )}
          </div>
          {favorite.district && favorite.district !== favorite.name && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {favorite.district}
            </p>
          )}
          {weatherDescription && (
            <p className="text-xs sm:text-sm text-gray-600 capitalize mt-1">
              {weatherDescription}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap text-sm mt-3">
        <span className="text-gray-500">체감온도</span>
        <span className="text-gray-800 font-semibold">
          {getTemperature(main.feels_like)}°
        </span>
        <span className="w-px h-4 bg-gray-300" />
        <span className="text-gray-500">습도</span>
        <span className="text-gray-800 font-semibold">{main.humidity}%</span>
        <span className="w-px h-4 bg-gray-300" />
        <span className="text-gray-500">풍속</span>
        <span className="text-gray-800 font-semibold">
          {wind.speed.toFixed(1)} m/s
        </span>
      </div>
    </div>
  );
};

const FavoriteList = () => {
  const { favorites } = useFavoritesStore();

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <StarIcon filled className="h-5 w-5 text-yellow-500" />
        <h2 className="text-lg font-medium text-gray-500 text-nowrap">
          즐겨찾기
        </h2>
        <span className="text-xs sm:text-sm text-gray-500">
          즐겨찾기는 최대 6개까지 등록하실 수 있으며, 지역명을 클릭하여 별칭을
          등록/수정할 수 있습니다.
        </span>
      </div>
      <div className="space-y-4">
        {favorites.map((favorite) => (
          <FavoriteItem key={favorite.id} favorite={favorite} />
        ))}
      </div>
    </div>
  );
};

export default FavoriteList;
