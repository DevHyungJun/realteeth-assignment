import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { CurrentWeatherResponse } from "../../../../types";
import WEATHER_INFO_ITEMS from "./WEATHER_INFO_ITEMS";
import { getTemperature, getWeatherIconUrl } from "../../../../utils";
import { FavoriteButton } from "../../../favorite";
import {
  useFavoritesStore,
  generateFavoriteId,
} from "../../../../config/favoritesStore";

type WeatherInfoItemProps = {
  label: string;
  value: string | number;
  valueColor?: string;
  showDivider?: boolean;
};

const WeatherInfoItem = ({
  label,
  value,
  valueColor = "text-gray-800",
  showDivider = true,
}: WeatherInfoItemProps) => {
  return (
    <>
      <div className="flex items-center gap-1">
        <span className="text-gray-500 text-xs">{label}</span>
        <span className={`text-sm font-semibold ${valueColor}`}>{value}</span>
      </div>
      {showDivider && <div className="w-px h-4 bg-gray-300" />}
    </>
  );
};

const COMPACT_WEATHER_INFO_ITEMS = WEATHER_INFO_ITEMS.filter(
  (item) =>
    item.label === "체감" || item.label === "습도" || item.label === "풍속"
);

type WeatherCardProps = {
  data: CurrentWeatherResponse;
  displayAddress?: string | null;
  variant?: "full" | "compact";
  displayName?: string;
  displayDistrict?: string | null;
  editableName?: boolean;
  onNameChange?: (newName: string) => void;
  weatherDescriptionPosition?: "below" | "separate";
  onClick?: () => void;
};

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
  const weatherIcon = weather[0]?.icon;
  const weatherDescription = weather[0]?.description || "";

  // 즐겨찾기에 등록되어 있는지 확인
  const favoriteId = generateFavoriteId(data);
  const favorite = getFavoriteById(favoriteId);

  // 표시할 이름과 주소 결정
  const baseAddress = displayAddress || name;
  const computedDisplayName =
    propDisplayName !== undefined
      ? propDisplayName
      : favorite
      ? favorite.name !== (favorite.district || name)
        ? favorite.name
        : baseAddress
      : baseAddress;
  const computedDisplayDistrict =
    propDisplayDistrict !== undefined
      ? propDisplayDistrict
      : favorite && favorite.district && favorite.name !== favorite.district
      ? favorite.district
      : displayAddress;

  // 이름 편집 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(computedDisplayName);

  // computedDisplayName이 변경되면 editName도 업데이트
  useEffect(() => {
    if (!isEditing) {
      setEditName(computedDisplayName);
    }
  }, [computedDisplayName, isEditing]);

  const handleRouteDetail = () => {
    if (propOnClick) {
      propOnClick();
      return;
    }

    // 상세 페이지로 이동 (쿼리 스트링 없이)
    // 브라우저 히스토리에 이전 URL이 남아있어 뒤로가기 시 자동으로 복원됨
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

  const handleClick = () => {
    if (!isEditing) {
      handleRouteDetail();
    }
  };

  const handleNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditing && editableName) {
      setIsEditing(true);
    }
  };

  const handleNameBlur = () => {
    if (
      editName.trim() &&
      editName.trim() !== computedDisplayName &&
      onNameChange
    ) {
      onNameChange(editName.trim());
    } else {
      setEditName(computedDisplayName);
    }
    setIsEditing(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      setEditName(computedDisplayName);
      setIsEditing(false);
    }
  };

  const weatherInfoItems =
    variant === "compact" ? COMPACT_WEATHER_INFO_ITEMS : WEATHER_INFO_ITEMS;

  // 별칭이 등록되어 있는지 확인 (displayName과 displayDistrict가 다르면 별칭이 있는 것)
  const hasCustomName =
    propDisplayName !== undefined &&
    propDisplayDistrict !== undefined &&
    propDisplayName !== propDisplayDistrict;

  return (
    <div
      className="bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow relative"
      onClick={handleClick}
    >
      <div
        className="absolute top-4 right-4"
        onClick={(e) => e.stopPropagation()}
      >
        <FavoriteButton data={data} district={displayAddress || undefined} />
      </div>
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
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleNameBlur}
                onKeyDown={handleNameKeyDown}
                className="text-lg sm:text-xl font-bold border-b-2 border-blue-500 focus:outline-none w-full min-w-[100px] pr-[28px]"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h2
                className={`text-lg sm:text-xl font-bold ${
                  hasCustomName && "text-blue-700"
                } ${
                  editableName &&
                  "hover:text-blue-700 transition-colors cursor-text"
                } inline-block pr-[28px]`}
                onClick={handleNameClick}
              >
                {computedDisplayName}
              </h2>
            )}
          </div>
          {computedDisplayDistrict &&
            computedDisplayDistrict !== computedDisplayName && (
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {computedDisplayDistrict}
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

      <div
        className={`flex items-center gap-2 flex-wrap ${
          variant === "compact" ? "text-sm mt-3" : ""
        }`}
      >
        {weatherInfoItems.map((item, index) => (
          <WeatherInfoItem
            key={item.label}
            label={item.label}
            value={item.getValue(main, wind)}
            valueColor={item.valueColor}
            showDivider={index !== weatherInfoItems.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default WeatherCard;
