"use client";

import { useEffect } from "react";
import { useAccessibilityStore } from "@/store/useAccessibilityStore";

export function FontSizeAdapter() {
  const zoomLevel = useAccessibilityStore((state) => state.zoomLevel);

  useEffect(() => {
    document.documentElement.style.fontSize = `${zoomLevel * 100}%`;
  }, [zoomLevel]);

  return null;
}
