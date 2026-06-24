"use client";

import React, { useMemo } from "react";
import { mockGlossary } from "@/data/mockGlossary";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Info, BookOpen } from "lucide-react";

interface GlossaryTermProps {
  termId: string;
  children: React.ReactNode;
}

export function GlossaryTerm({ termId, children }: GlossaryTermProps) {
  const isMobile = useIsMobile();
  
  const glossaryItem = useMemo(() => {
    return mockGlossary.find((item) => item.id === termId);
  }, [termId]);

  if (!glossaryItem) {
    // Fallback gracioso se a palavra não for achada no dicionário
    return <>{children}</>;
  }

  // Estilo compartilhado para o termo clicável/focado
  const triggerStyle = "underline decoration-primary/50 decoration-dashed underline-offset-4 cursor-help font-medium text-primary hover:text-primary/80 transition-colors inline-block";

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger render={<span className={triggerStyle} tabIndex={0} role="button" aria-haspopup="dialog" aria-expanded="false" />}>
          {children}
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-2xl px-6 pb-8 pt-6 max-h-[85vh] overflow-y-auto">
          <SheetHeader className="text-left space-y-4">
            <SheetTitle className="flex items-center gap-2 text-2xl">
              <BookOpen className="w-6 h-6 text-primary" />
              {glossaryItem.term}
            </SheetTitle>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">O que significa?</h4>
                <SheetDescription className="text-base text-foreground leading-relaxed">
                  {glossaryItem.simpleDefinition}
                </SheetDescription>
              </div>
              
              {glossaryItem.example && (
                <div className="bg-muted p-4 rounded-xl border border-border/50">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Info className="w-4 h-4" /> Exemplo Prático
                  </h4>
                  <p className="text-sm italic">"{glossaryItem.example}"</p>
                </div>
              )}
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger render={<span className={triggerStyle} tabIndex={0} role="button" aria-haspopup="dialog" />}>
        {children}
      </TooltipTrigger>
      <TooltipContent side="top" align="center" className="max-w-xs p-4 shadow-xl border-primary/20 bg-card text-card-foreground">
        <div className="space-y-2">
          <div className="flex items-center gap-2 border-b border-border/50 pb-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="font-bold text-base">{glossaryItem.term}</span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {glossaryItem.simpleDefinition}
          </p>
          {glossaryItem.example && (
            <p className="text-xs italic bg-muted p-2 rounded-md mt-2 border border-border/50">
              Ex: {glossaryItem.example}
            </p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
