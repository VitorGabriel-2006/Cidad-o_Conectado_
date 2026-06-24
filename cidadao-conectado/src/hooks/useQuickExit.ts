"use client";

import { useEffect, useCallback } from "react";

export function useQuickExit() {
  const triggerExit = useCallback(() => {
    window.location.replace("https://www.google.com.br");
  }, []);

  useEffect(() => {
    let escCount = 0;
    let lastEscTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const now = Date.now();
        if (now - lastEscTime < 500) {
          escCount++;
        } else {
          escCount = 1;
        }
        lastEscTime = now;

        if (escCount >= 2) {
          triggerExit();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerExit]);

  return { triggerExit };
}
