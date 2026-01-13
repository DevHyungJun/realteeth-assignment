import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CurrentWeatherResponse } from "../types";

export interface FavoriteItem {
  id: string;
  name: string; // 별칭
  data: CurrentWeatherResponse;
  district?: string; // 한글 주소
  createdAt: number;
}

interface FavoritesStore {
  favorites: FavoriteItem[];
  addFavorite: (data: CurrentWeatherResponse, district?: string) => boolean;
  removeFavorite: (id: string) => void;
  updateFavoriteName: (id: string, name: string) => void;
  isFavorite: (id: string) => boolean;
  getFavoriteById: (id: string) => FavoriteItem | undefined;
}

// 즐겨찾기 ID 생성 함수 (좌표 + 주소 기반)
export const generateFavoriteId = (
  data: CurrentWeatherResponse,
  district?: string
): string => {
  const locationIdentifier = district || data.name;
  return `${data.coord.lat.toFixed(4)}_${data.coord.lon.toFixed(4)}_${locationIdentifier}`;
};

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (data, district) => {
        const state = get();
        // 최대 6개 제한
        if (state.favorites.length >= 6) {
          return false;
        }
        const id = generateFavoriteId(data, district);
        // 이미 존재하는지 확인
        if (state.favorites.some((fav) => fav.id === id)) {
          return false;
        }
        const newFavorite: FavoriteItem = {
          id,
          name: district || data.name,
          data,
          district,
          createdAt: Date.now(),
        };
        set((state) => ({
          favorites: [...state.favorites, newFavorite],
        }));
        return true;
      },
      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav.id !== id),
        }));
      },
      updateFavoriteName: (id, name) => {
        set((state) => ({
          favorites: state.favorites.map((fav) =>
            fav.id === id ? { ...fav, name } : fav
          ),
        }));
      },
      isFavorite: (id) => {
        const state = get();
        return state.favorites.some((fav) => fav.id === id);
      },
      getFavoriteById: (id) => {
        return get().favorites.find((fav) => fav.id === id);
      },
    }),
    {
      name: "weather-favorites-storage",
    }
  )
);

