import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Benefit } from "@/data/mockBenefits";

interface RecentStore {
  recentBenefits: Benefit[];
  addRecent: (benefit: Benefit) => void;
  removeRecent: (benefitId: string) => void;
  clearRecent: () => void;
}

export const useRecentStore = create<RecentStore>()(
  persist(
    (set) => ({
      recentBenefits: [],
      
      addRecent: (benefit) => set((state) => {
        // Remove a versão antiga caso exista, para evitar duplicatas e mover para o topo
        const filtered = state.recentBenefits.filter(b => b.id !== benefit.id);
        
        // Adiciona no topo e limita a 10 itens
        const newRecent = [benefit, ...filtered].slice(0, 10);
        
        return { recentBenefits: newRecent };
      }),
      
      removeRecent: (benefitId) => set((state) => ({
        recentBenefits: state.recentBenefits.filter(b => b.id !== benefitId)
      })),
      
      clearRecent: () => set({ recentBenefits: [] }),
    }),
    {
      name: "cidadao-recent-views",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
