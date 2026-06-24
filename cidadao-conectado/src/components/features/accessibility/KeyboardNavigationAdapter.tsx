"use client";

import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { ShortcutHelpModal } from "./ShortcutHelpModal";

export function KeyboardNavigationAdapter() {
  // Inicializa o ouvinte global de eventos do teclado
  useKeyboardNavigation();

  return (
    <>
      <ShortcutHelpModal />
    </>
  );
}
