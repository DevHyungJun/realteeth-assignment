import { useNavigate } from "react-router-dom";
import { useFavoritesStore } from "../../../config/favoritesStore";
import { StarIcon } from "../../../ui/Icons";
import { WeatherCard } from "../../weather";

const FavoriteList = () => {
  const { favorites, updateFavoriteName } = useFavoritesStore();
  const navigate = useNavigate();

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
        <div className="flex items-center gap-2">
          <StarIcon filled className="h-5 w-5 text-yellow-500" />
          <h2 className="text-lg font-medium text-gray-500 text-nowrap">
            즐겨찾기
          </h2>
        </div>
        <span className="text-xs sm:text-sm text-gray-500">
          즐겨찾기는 최대 6개까지 등록하실 수 있으며, 지역명을 클릭하여 별칭을
          등록/수정할 수 있습니다.
        </span>
      </div>
      <div className="space-y-4">
        {favorites.map((favorite) => (
          <WeatherCard
            key={favorite.id}
            data={favorite.data}
            displayAddress={favorite.district}
            variant="compact"
            displayName={favorite.name}
            displayDistrict={favorite.district}
            editableName={true}
            onNameChange={(newName) => updateFavoriteName(favorite.id, newName)}
            weatherDescriptionPosition="below"
            onClick={() => {
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
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoriteList;
