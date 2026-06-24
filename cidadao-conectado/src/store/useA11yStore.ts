import { create } from "zustand";

interface A11yStore {
  message: string;
  mode: "polite" | "assertive";
  announce: (message: string, mode?: "polite" | "assertive") => void;
}

export const useA11yStore = create<A11yStore>((set) => ({
  message: "",
  mode: "polite",
  announce: (message, mode = "polite") => {
    // Para forçar o leitor de tela a ler se a mesma mensagem for enviada, limpamos e reescrevemos
    set({ message: "", mode });
    setTimeout(() => {
      set({ message, mode });
    }, 100);
  }
}));
