import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ShortcutAction = 'mainContent' | 'search' | 'footer' | 'help' | 'tts';

interface ShortcutState {
  shortcuts: Record<ShortcutAction, string>;
  isHelpModalOpen: boolean;
  updateShortcut: (action: ShortcutAction, newKey: string) => void;
  toggleHelpModal: (forceState?: boolean) => void;
}

const defaultShortcuts: Record<ShortcutAction, string> = {
  mainContent: '1',
  search: '2',
  footer: '3',
  help: '?',
  tts: 'Alt+s'
};

export const useShortcutStore = create<ShortcutState>()(
  persist(
    (set) => ({
      shortcuts: defaultShortcuts,
      isHelpModalOpen: false,
      
      updateShortcut: (action, newKey) => set((state) => ({
        shortcuts: {
          ...state.shortcuts,
          [action]: newKey
        }
      })),
      
      toggleHelpModal: (forceState) => set((state) => ({
        isHelpModalOpen: forceState !== undefined ? forceState : !state.isHelpModalOpen
      }))
    }),
    {
      name: "cidadao-shortcuts-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ shortcuts: state.shortcuts }), // Only persist shortcuts, not modal state
    }
  )
);
