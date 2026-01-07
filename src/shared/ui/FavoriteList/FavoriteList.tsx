import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavoritesStore } from "../../config/favoritesStore";
import { getTemperature, getWeatherIconUrl } from "../../utils";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
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
  const { removeFavorite, updateFavoriteName } = useFavoritesStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(favorite.name);

  const { main, weather, wind } = favorite.data;
  const weatherIcon = weather[0]?.icon;
  const weatherDescription = weather[0]?.description || "";

  const handleClick = () => {
    if (!isEditing) {
      navigate("/weather-detail", {
        state: {
          ...favorite.data,
          district: favorite.district || favorite.name,
        },
      });
    }
  };

  const handleNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleNameBlur = () => {
    if (editName.trim()) {
      updateFavoriteName(favorite.id, editName.trim());
    } else {
      setEditName(favorite.name);
    }
    setIsEditing(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNameBlur();
    } else if (e.key === "Escape") {
      setEditName(favorite.name);
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow relative">
      <div className="absolute top-4 right-4" onClick={(e) => e.stopPropagation()}>
        <FavoriteButton
          data={favorite.data}
          district={favorite.district}
        />
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
          <div className="text-3xl text-gray-800 font-light">
            {getTemperature(main.temp)}°
          </div>
        </div>
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={handleNameKeyDown}
              className="text-xl font-bold border-b-2 border-blue-500 focus:outline-none"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <h2
              className="text-xl font-bold hover:text-blue-600 transition-colors"
              onClick={handleNameClick}
            >
              {favorite.name}
            </h2>
          )}
          {weatherDescription && (
            <p className="text-sm text-gray-600 capitalize">
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
      <h2 className="text-lg font-medium text-gray-500 mb-4">즐겨찾기</h2>
      <div className="space-y-4">
        {favorites.map((favorite) => (
          <FavoriteItem key={favorite.id} favorite={favorite} />
        ))}
      </div>
    </div>
  );
};

export default FavoriteList;

