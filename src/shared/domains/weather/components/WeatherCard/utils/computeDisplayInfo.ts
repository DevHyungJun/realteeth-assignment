import type { CurrentWeatherResponse } from "../../../../../types";
import type { FavoriteItem } from "../../../../../config/favoritesStore";

type ComputeDisplayInfoParams = {
  data: CurrentWeatherResponse;
  displayAddress?: string | null;
  propDisplayName?: string;
  propDisplayDistrict?: string | null;
  favorite: FavoriteItem | undefined;
};

type DisplayInfo = {
  displayName: string;
  displayDistrict: string | null;
  hasCustomName: boolean;
};

export const computeDisplayInfo = ({
  data,
  displayAddress,
  propDisplayName,
  propDisplayDistrict,
  favorite,
}: ComputeDisplayInfoParams): DisplayInfo => {
  const { name } = data;
  const baseAddress = displayAddress || name;

  const displayName =
    propDisplayName !== undefined
      ? propDisplayName
      : favorite
      ? favorite.name !== (favorite.district || name)
        ? favorite.name
        : baseAddress
      : baseAddress;

  const displayDistrict =
    propDisplayDistrict !== undefined
      ? propDisplayDistrict
      : favorite && favorite.district && favorite.name !== favorite.district
      ? favorite.district
      : displayAddress;

  const hasCustomName =
    propDisplayName !== undefined &&
    propDisplayDistrict !== undefined &&
    propDisplayDistrict !== null &&
    propDisplayDistrict.trim() !== "" &&
    propDisplayName !== propDisplayDistrict;

  return {
    displayName,
    displayDistrict: displayDistrict ?? null,
    hasCustomName,
  };
};
