"use client";

import { useA11yStore } from "@/store/useA11yStore";

export function ScreenReaderAnnouncer() {
  const { message, mode } = useA11yStore();

  return (
    <div
      aria-live={mode}
      aria-atomic="true"
      className="sr-only"
      role="status"
    >
      {message}
    </div>
  );
}
