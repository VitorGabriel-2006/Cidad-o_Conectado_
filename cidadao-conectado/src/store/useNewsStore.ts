import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface NewsStore {
  favoriteNewsIds: string[];
  toggleFavorite: (id: string) => void;
}

export const useNewsStore = create<NewsStore>()(
  persist(
    (set) => ({
      favoriteNewsIds: [],
      toggleFavorite: (id) => set((state) => {
        const isFavorite = state.favoriteNewsIds.includes(id);
        return {
          favoriteNewsIds: isFavorite 
            ? state.favoriteNewsIds.filter((newsId) => newsId !== id)
            : [...state.favoriteNewsIds, id]
        };
      })
    }),
    {
      name: "cidadao-news-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
