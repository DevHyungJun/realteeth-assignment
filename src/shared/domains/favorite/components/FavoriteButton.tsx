import StarIcon from "../../../ui/Icons/StarIcon";
import {
  useFavoritesStore,
  generateFavoriteId,
} from "../../../config/favoritesStore";
import { useToast } from "../../../context/ToastContext";
import type { CurrentWeatherResponse } from "../../../types";

type FavoriteButtonProps = {
  data: CurrentWeatherResponse;
  district?: string;
  className?: string;
};

const FavoriteButton = ({
  data,
  district,
  className = "",
}: FavoriteButtonProps) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const { showToast } = useToast();
  const favoriteId = generateFavoriteId(data);
  const isFav = isFavorite(favoriteId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 요소의 클릭 이벤트 방지
    if (isFav) {
      removeFavorite(favoriteId);
    } else {
      const success = addFavorite(data, district);
      if (!success) {
        showToast("즐겨찾기는 최대 6개까지 추가할 수 있습니다.", "warning");
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`p-1 text-yellow-500 hover:text-yellow-600 transition-colors ${className}`}
      aria-label={isFav ? "즐겨찾기 제거" : "즐겨찾기 추가"}
    >
      <StarIcon filled={isFav} className="w-5 h-5" />
    </button>
  );
};

export default FavoriteButton;

