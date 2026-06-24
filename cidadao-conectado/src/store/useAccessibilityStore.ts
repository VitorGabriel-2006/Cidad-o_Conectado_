import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AccessibilityStore {
  isSimplifiedMode: boolean;
  toggleSimplifiedMode: () => void;
  zoomLevel: number;
  increaseZoom: () => void;
  decreaseZoom: () => void;
  resetZoom: () => void;
}

const ZOOM_LEVELS = [1, 1.2, 1.5, 2];

export const useAccessibilityStore = create<AccessibilityStore>()(
  persist(
    (set) => ({
      isSimplifiedMode: false,
      toggleSimplifiedMode: () => set((state) => ({ isSimplifiedMode: !state.isSimplifiedMode })),
      zoomLevel: 1,
      increaseZoom: () => set((state) => {
        const currentIndex = ZOOM_LEVELS.indexOf(state.zoomLevel);
        if (currentIndex < ZOOM_LEVELS.length - 1) {
          return { zoomLevel: ZOOM_LEVELS[currentIndex + 1] };
        }
        return state;
      }),
      decreaseZoom: () => set((state) => {
        const currentIndex = ZOOM_LEVELS.indexOf(state.zoomLevel);
        if (currentIndex > 0) {
          return { zoomLevel: ZOOM_LEVELS[currentIndex - 1] };
        }
        return state;
      }),
      resetZoom: () => set({ zoomLevel: 1 }),
    }),
    {
      name: "cidadao-accessibility",
    }
  )
);
