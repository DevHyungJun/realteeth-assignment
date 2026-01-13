import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { CurrentWeatherResponse } from "../../../../types";
import {
  WEATHER_INFO_ITEMS,
  COMPACT_WEATHER_INFO_ITEMS,
} from "./WEATHER_INFO_ITEMS";
import { FavoriteButton } from "../../../favorite";
import {
  useFavoritesStore,
  generateFavoriteId,
} from "../../../../config/favoritesStore";
import { WeatherCardHeader, WeatherCardInfo } from "./components";
import { useFavoriteNameEdit } from "./hooks/useFavoriteNameEdit";
import { computeDisplayInfo } from "./utils/computeDisplayInfo";

interface WeatherCardProps {
  data: CurrentWeatherResponse;
  displayAddress?: string | null;
  variant?: "full" | "compact";
  displayName?: string;
  displayDistrict?: string | null;
  editableName?: boolean;
  onNameChange?: (newName: string) => void;
  weatherDescriptionPosition?: "below" | "separate";
  onClick?: () => void;
}

const WeatherCard = ({
  data,
  displayAddress,
  variant = "full",
  displayName: propDisplayName,
  displayDistrict: propDisplayDistrict,
  editableName = false,
  onNameChange,
  weatherDescriptionPosition = "separate",
  onClick: propOnClick,
}: WeatherCardProps) => {
  const navigate = useNavigate();
  const { getFavoriteById } = useFavoritesStore();
  const { main, weather, name, wind } = data;
  const weatherDescription = weather[0]?.description || "";

  const favoriteId = generateFavoriteId(data, displayAddress || undefined);
  const favorite = getFavoriteById(favoriteId);

  const { displayName, displayDistrict, hasCustomName } = computeDisplayInfo({
    data,
    displayAddress,
    propDisplayName,
    propDisplayDistrict,
    favorite,
  });

  const {
    isEditing,
    register,
    handleNameBlur,
    handleNameKeyDown,
    startEditing,
  } = useFavoriteNameEdit({
    initialName: displayName,
    onNameChange,
  });

  const handleRouteDetail = () => {
    if (propOnClick) {
      propOnClick();
      return;
    }

    navigate("/weather-detail", {
      state: {
        ...data,
        district: favorite?.district || displayAddress,
        favoriteName:
          favorite && favorite.name !== (favorite.district || name)
            ? favorite.name
            : undefined,
      },
    });
  };

  const handleNameClick = (e: MouseEvent) => {
    if (!isEditing && editableName) {
      e.stopPropagation();
      startEditing();
    }
  };

  const weatherInfoItems =
    variant === "compact" ? COMPACT_WEATHER_INFO_ITEMS : WEATHER_INFO_ITEMS;

  return (
    <div
      className="bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow relative"
      onClick={() => {
        if (isEditing) return;
        handleRouteDetail();
      }}
    >
      <div
        className="absolute top-4 right-4"
        onClick={(e) => e.stopPropagation()}
      >
        <FavoriteButton data={data} district={displayAddress || undefined} />
      </div>
      <WeatherCardHeader
        data={data}
        displayName={displayName}
        displayDistrict={displayDistrict}
        hasCustomName={hasCustomName}
        weatherDescription={weatherDescription}
        weatherDescriptionPosition={weatherDescriptionPosition}
        editableName={editableName}
        isEditing={isEditing}
        register={register}
        onNameBlur={handleNameBlur}
        onNameKeyDown={handleNameKeyDown}
        onNameClick={handleNameClick}
      />
      <WeatherCardInfo
        items={weatherInfoItems}
        main={main}
        wind={wind}
        variant={variant}
      />
    </div>
  );
};

export default WeatherCard;
