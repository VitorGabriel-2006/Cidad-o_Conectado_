import { create } from 'zustand';

interface TTSState {
  isOpen: boolean;
  textToRead: string;
  openReader: (text: string) => void;
  closeReader: () => void;
}

export const useTTSStore = create<TTSState>((set) => ({
  isOpen: false,
  textToRead: '',
  openReader: (text) => set({ isOpen: true, textToRead: text }),
  closeReader: () => set({ isOpen: false, textToRead: '' }),
}));
