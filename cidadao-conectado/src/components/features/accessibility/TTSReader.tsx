"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Square, X, FastForward, Rewind, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTTSStore } from "@/store/useTTSStore";
import { useTTS } from "./useTTS";

export function TTSReader() {
  const { isOpen, textToRead, closeReader } = useTTSStore();
  const { isPlaying, isPaused, rate, charIndex, charLength, play, pause, stop, setRate } = useTTS(textToRead);
  
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para manter o texto destacado visível
  useEffect(() => {
    if (textContainerRef.current && isPlaying && !isPaused) {
      const highlightedElement = textContainerRef.current.querySelector('mark');
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [charIndex, isPlaying, isPaused]);

  // Limpar a leitura se o componente fechar
  useEffect(() => {
    if (!isOpen) {
      stop();
    }
  }, [isOpen, stop]);

  if (!isOpen) return null;

  // Quebrar o texto em 3 partes: antes do destaque, a palavra destacada, depois do destaque
  const beforeText = textToRead.substring(0, charIndex);
  const highlightedText = textToRead.substring(charIndex, charIndex + charLength);
  const afterText = textToRead.substring(charIndex + charLength);

  const cycleRate = () => {
    const rates = [0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(rate);
    const nextIndex = (currentIndex + 1) % rates.length;
    setRate(rates[nextIndex]);
  };

  const handleClose = () => {
    stop();
    closeReader();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none"
      >
        <div className="container max-w-4xl mx-auto pointer-events-auto">
          <div className="bg-background/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
            
            {/* Controles de Áudio */}
            <div className="flex items-center justify-between md:flex-col md:justify-center p-4 bg-primary/5 border-b md:border-b-0 md:border-r border-border gap-4 shrink-0">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Headphones className="w-5 h-5" />
                <span className="hidden md:inline">Modo Leitura</span>
              </div>
              
              <div className="flex items-center gap-2">
                {isPlaying && !isPaused ? (
                  <Button variant="default" size="icon" aria-label="Pausar leitura" onClick={pause} className="rounded-full shadow-md w-12 h-12">
                    <Pause className="w-6 h-6 fill-current" />
                  </Button>
                ) : (
                  <Button variant="default" size="icon" aria-label="Iniciar leitura" onClick={play} className="rounded-full shadow-md w-12 h-12">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </Button>
                )}
                
                <Button variant="outline" size="icon" aria-label="Parar leitura" onClick={stop} className="rounded-full">
                  <Square className="w-4 h-4 fill-current" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={cycleRate} className="font-mono font-bold text-xs h-8 px-2 rounded-full border border-border/50 bg-background/50 hover:bg-background">
                  {rate}x
                </Button>
              </div>

              <Button variant="ghost" size="icon-sm" onClick={handleClose} className="absolute top-2 right-2 md:static text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Visor do Teleprompter */}
            <div className="p-6 md:p-8 flex-1 h-64 md:h-72 overflow-y-auto bg-background" ref={textContainerRef}>
              <div className="text-xl md:text-2xl leading-relaxed md:leading-loose font-medium text-muted-foreground">
                {charIndex === 0 && charLength === 0 && !isPlaying ? (
                  <span>{textToRead}</span>
                ) : (
                  <>
                    <span>{beforeText}</span>
                    <mark className="bg-primary/20 text-foreground rounded-sm px-1 shadow-sm transition-all duration-150 py-0.5 border-b-2 border-primary">
                      {highlightedText}
                    </mark>
                    <span>{afterText}</span>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
