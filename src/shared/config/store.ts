import { create } from "zustand";

interface LocationPosition {
  latitude: number;
  longitude: number;
}

interface CurrentLocationStore {
  cachedPosition: LocationPosition | null;
  setCachedPosition: (position: LocationPosition | null) => void;
}

export const useCurrentLocationStore = create<CurrentLocationStore>((set) => ({
  cachedPosition: null,
  setCachedPosition: (position) => set({ cachedPosition: position }),
}));
