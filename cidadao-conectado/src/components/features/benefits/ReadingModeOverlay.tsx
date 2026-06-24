"use client";

import { useState, useEffect } from "react";
import { BookOpen, X, HeadphonesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTTSStore } from "@/store/useTTSStore";

interface ReadingModeOverlayProps {
  title: string;
  content: string;
}

export function ReadingModeOverlay({ title, content }: ReadingModeOverlayProps) {
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [readingTheme, setReadingTheme] = useState<'light' | 'sepia' | 'dark'>('light');

  const { openReader } = useTTSStore();

  const calculateReadingTime = (text: string) => Math.ceil(text.split(' ').length / 200);
  const readingTime = calculateReadingTime(content);

  const getThemeClasses = () => {
    switch (readingTheme) {
      case 'sepia': return 'bg-[#f4ecd8] text-[#5b4636]';
      case 'dark': return 'bg-zinc-950 text-zinc-300';
      case 'light':
      default: return 'bg-white text-slate-900';
    }
  };

  // Bloqueia o scroll do body quando o overlay está aberto
  useEffect(() => {
    if (isReadingMode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isReadingMode]);

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2 rounded-full border-border/50 bg-background/50 backdrop-blur-sm shadow-sm"
        onClick={() => setIsReadingMode(true)}
      >
        <BookOpen className="w-4 h-4" />
        Modo de Leitura
      </Button>

      {isReadingMode && (
        <div className={`fixed inset-0 z-[100] overflow-y-auto transition-colors duration-300 ${getThemeClasses()}`}>
          <div className="sticky top-0 z-10 p-4 border-b border-current/10 bg-inherit/80 backdrop-blur-md flex items-center justify-between shadow-sm">
            <div className="text-sm font-medium opacity-80 pl-2 hidden sm:block">
              Leitura: ~{readingTime} min
            </div>

            <div className="flex items-center gap-4 mx-auto sm:mx-0">
              <button 
                onClick={() => setReadingTheme('light')}
                className={`w-6 h-6 rounded-full bg-white border ${readingTheme === 'light' ? 'border-current ring-2 ring-current/20' : 'border-slate-300'} transition-all`}
                aria-label="Tema Claro"
              />
              <button 
                onClick={() => setReadingTheme('sepia')}
                className={`w-6 h-6 rounded-full bg-[#f4ecd8] border ${readingTheme === 'sepia' ? 'border-current ring-2 ring-current/20' : 'border-[#d3c2a3]'} transition-all`}
                aria-label="Tema Sépia"
              />
              <button 
                onClick={() => setReadingTheme('dark')}
                className={`w-6 h-6 rounded-full bg-zinc-950 border ${readingTheme === 'dark' ? 'border-current ring-2 ring-current/20' : 'border-zinc-700'} transition-all`}
                aria-label="Tema Escuro"
              />
            </div>

            <div className="flex items-center gap-2 pr-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openReader(`${title}. ${content}`)}
                className="hover:bg-current/10 gap-2"
              >
                <HeadphonesIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Ouvir</span>
              </Button>
              <div className="w-px h-6 bg-current/20 mx-1" />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsReadingMode(false)}
                className="hover:bg-current/10 rounded-full"
                aria-label="Fechar Modo de Leitura"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="max-w-2xl mx-auto p-6 md:p-12 lg:p-16 text-lg leading-loose selection:bg-current/20 min-h-screen">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-10 leading-tight tracking-tight">{title}</h1>
            <div className="space-y-6">
              {content.split('\n').map((paragraph, idx) => (
                paragraph.trim() ? <p key={idx}>{paragraph}</p> : null
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
