"use client";

import { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { XCircle, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function QuickExit() {
  const triggerExit = useCallback(() => {
    // We use replace so the user cannot use the back button to return to this page
    window.location.replace("https://www.google.com");
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

        if (escCount >= 3) {
          triggerExit();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerExit]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
    >
      <div className="hidden sm:block bg-background/80 backdrop-blur-sm border border-border px-3 py-1.5 rounded-full text-xs text-muted-foreground shadow-sm">
        Pressione <kbd className="font-mono bg-muted px-1 rounded">ESC</kbd> 3x para sair
      </div>
      
      <Tooltip>
        <TooltipTrigger render={
          <Button
            onClick={triggerExit}
            size="icon"
            aria-label="Saída de Emergência"
            className="h-14 w-14 rounded-full bg-slate-800 hover:bg-slate-900 text-white shadow-xl hover:shadow-2xl transition-all border-2 border-slate-700/50"
          />
        }>
          <XCircle className="h-7 w-7" />
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-slate-800 text-white border-slate-700">
          <p className="font-bold flex items-center gap-1">Saída de Emergência <ExternalLink className="h-3 w-3" /></p>
          <p className="text-xs text-slate-300">Fecha o site e apaga o histórico imediatamente</p>
        </TooltipContent>
      </Tooltip>
    </motion.div>
  );
}
