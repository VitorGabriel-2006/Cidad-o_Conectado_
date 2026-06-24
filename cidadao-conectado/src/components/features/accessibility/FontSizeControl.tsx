"use client";

import { useAccessibilityStore } from "@/store/useAccessibilityStore";
import { Button } from "@/components/ui/button";

export function FontSizeControl() {
  const { zoomLevel, increaseZoom, decreaseZoom, resetZoom } = useAccessibilityStore();

  return (
    <div className="flex items-center bg-muted/50 rounded-full border border-border/50 p-1">
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 px-2 text-xs rounded-full disabled:opacity-50"
        onClick={decreaseZoom}
        disabled={zoomLevel <= 1}
        title="Diminuir fonte"
      >
        A-
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 px-2 text-xs rounded-full font-medium"
        onClick={resetZoom}
        title="Fonte original"
      >
        A
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 px-2 text-xs rounded-full disabled:opacity-50"
        onClick={increaseZoom}
        disabled={zoomLevel >= 2}
        title="Aumentar fonte"
      >
        A+
      </Button>
    </div>
  );
}
