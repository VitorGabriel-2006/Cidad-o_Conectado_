"use client";

import { useEffect } from "react";
import { useShortcutStore } from "@/store/useShortcutStore";
import { useTTSStore } from "@/store/useTTSStore";

export function useKeyboardNavigation() {
  const { shortcuts, toggleHelpModal } = useShortcutStore();
  const { openReader } = useTTSStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Formata a tecla atual pressionada para bater com o padrão salvo
      let pressedKey = e.key;
      
      // Monta o combo se tiver modifer
      if (e.altKey && e.key.toLowerCase() !== 'alt') {
        pressedKey = `Alt+${e.key.toLowerCase()}`;
      } else if (e.ctrlKey && e.key.toLowerCase() !== 'control') {
        pressedKey = `Ctrl+${e.key.toLowerCase()}`;
      } else if (e.metaKey && e.key.toLowerCase() !== 'meta') {
        pressedKey = `Cmd+${e.key.toLowerCase()}`;
      }

      // Filtro Crítico (Anti-Bug): Ignora atalhos se o foco estiver em um input (exceto ESC para sair)
      const activeElement = document.activeElement as HTMLElement | null;
      if (activeElement) {
        const tagName = activeElement.tagName.toUpperCase();
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName)) {
          if (pressedKey !== 'Escape') {
            return;
          } else {
            activeElement.blur();
            return;
          }
        }
      }

      // Lógica de Mapeamento
      if (pressedKey === shortcuts.help) {
        e.preventDefault();
        toggleHelpModal(true);
      } 
      else if (pressedKey === shortcuts.mainContent) {
        e.preventDefault();
        // Foca no primeiro elemento principal da página. Assumindo que a <main> terá um ID nativo ou focamos nela
        const main = document.querySelector('main');
        if (main) {
          main.setAttribute('tabindex', '-1');
          main.focus();
        }
      }
      else if (pressedKey === shortcuts.search) {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="Buscar"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }
      else if (pressedKey === shortcuts.footer) {
        e.preventDefault();
        const footer = document.querySelector('footer');
        if (footer) {
          footer.scrollIntoView({ behavior: 'smooth' });
          footer.setAttribute('tabindex', '-1');
          footer.focus();
        }
      }
      else if (pressedKey === shortcuts.tts) {
        e.preventDefault();
        const pageText = document.body.innerText;
        openReader(pageText.substring(0, 1000) + "..."); // Simulação: ler os primeiros 1000 caracteres
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts, toggleHelpModal, openReader]);
}
