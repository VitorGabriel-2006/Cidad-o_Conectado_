import { create } from "zustand";

interface CompareStore {
  compareList: string[]; // Benefit IDs
  isModalOpen: boolean;
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearComparison: () => void;
  setModalOpen: (isOpen: boolean) => void;
}

export const useCompareStore = create<CompareStore>((set) => ({
  compareList: [],
  isModalOpen: false,
  
  addToCompare: (id) => set((state) => {
    if (state.compareList.includes(id)) return state;
    if (state.compareList.length >= 3) return state; // Hard limit
    return { compareList: [...state.compareList, id] };
  }),
  
  removeFromCompare: (id) => set((state) => ({
    compareList: state.compareList.filter(item => item !== id)
  })),
  
  clearComparison: () => set({ compareList: [] }),
  
  setModalOpen: (isOpen) => set({ isModalOpen: isOpen })
}));
