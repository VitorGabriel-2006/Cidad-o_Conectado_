import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface NavigationStore {
  isGuidedMode: boolean;
  hideIrrelevant: boolean;
  setGuidedMode: (val: boolean) => void;
  setHideIrrelevant: (val: boolean) => void;
}

export const useNavigationStore = create<NavigationStore>()(
  persist(
    (set) => ({
      isGuidedMode: true,
      hideIrrelevant: false,
      setGuidedMode: (val) => set({ isGuidedMode: val }),
      setHideIrrelevant: (val) => set({ hideIrrelevant: val }),
    }),
    {
      name: "cidadao-navigation-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
