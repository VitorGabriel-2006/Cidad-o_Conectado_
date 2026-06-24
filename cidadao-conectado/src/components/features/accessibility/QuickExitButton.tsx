"use client";

import { useQuickExit } from "@/hooks/useQuickExit";
import { LogOut } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function QuickExitButton() {
  const { triggerExit } = useQuickExit();

  return (
    <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50">
      <Tooltip>
        <TooltipTrigger 
          render={
            <button
              onClick={triggerExit}
              onTouchStart={triggerExit}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-10 w-10 rounded-full bg-zinc-200 text-zinc-500 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 shadow-sm border border-border/10 transition-colors"
              )}
              aria-label="Sair rapidamente (Pressione Esc duas vezes)"
            />
          }
        >
          <LogOut className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-zinc-800 text-zinc-200 border-zinc-700 text-xs">
          <p>Sair (Esc 2x)</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
