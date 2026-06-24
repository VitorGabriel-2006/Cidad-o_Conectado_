"use client";

import { useEffect, useState } from "react";
import { Newspaper, Flame, Heart, ExternalLink, CalendarDays, Eye } from "lucide-react";
import { fetchLegislativeNews, LegislativeNews } from "@/services/newsService";
import { useNewsStore } from "@/store/useNewsStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function LegislativeFeed() {
  const [news, setNews] = useState<LegislativeNews[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSortedByViews, setIsSortedByViews] = useState(false);

  const { favoriteNewsIds, toggleFavorite } = useNewsStore();

  useEffect(() => {
    let isMounted = true;
    
    async function loadNews() {
      setIsLoading(true);
      try {
        const data = await fetchLegislativeNews();
        if (isMounted) {
          setNews(data);
        }
      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadNews();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSortToggle = () => {
    setIsSortedByViews(!isSortedByViews);
  };

  // Aplica a ordenação baseada no estado atual
  const displayedNews = [...news].sort((a, b) => {
    if (isSortedByViews) {
      return b.views - a.views;
    }
    // Caso padrão: mantém a ordem da API (geralmente por data, mas mantemos o index)
    return 0;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Cabeçalho e Filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/40 backdrop-blur-md p-6 rounded-3xl border border-border/50 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-primary" />
            Atualizações Legislativas
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Acompanhe projetos de lei, portarias e normas em tempo real.
          </p>
        </div>
        
        <Button 
          variant={isSortedByViews ? "default" : "outline"}
          onClick={handleSortToggle}
          className={`shrink-0 rounded-full transition-all shadow-sm ${
            isSortedByViews 
              ? "bg-orange-500 hover:bg-orange-600 text-white border-transparent" 
              : "hover:text-orange-500 hover:border-orange-500/50"
          }`}
        >
          <Flame className={`w-4 h-4 mr-2 ${isSortedByViews ? "fill-white" : ""}`} />
          Mais Lidas da Semana
        </Button>
      </div>

      {/* Grid de Notícias */}
      <div className="grid md:grid-cols-2 gap-6">
        {isLoading ? (
          // Skeletons simulando latência de rede
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="bg-card/50 dark:bg-zinc-900/50 border border-border/50 dark:border-white/10 rounded-3xl p-6 h-72 flex flex-col justify-between animate-pulse shadow-sm">
              <div className="space-y-4">
                <div className="h-6 w-24 bg-muted/60 dark:bg-white/10 rounded-full" />
                <div className="space-y-2">
                  <div className="h-5 w-full bg-muted/60 dark:bg-white/10 rounded" />
                  <div className="h-5 w-4/5 bg-muted/60 dark:bg-white/10 rounded" />
                </div>
                <div className="space-y-2 pt-2">
                  <div className="h-4 w-full bg-muted/40 dark:bg-white/5 rounded" />
                  <div className="h-4 w-full bg-muted/40 dark:bg-white/5 rounded" />
                  <div className="h-4 w-3/4 bg-muted/40 dark:bg-white/5 rounded" />
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 mt-auto border-t border-border/30 dark:border-white/5">
                <div className="h-4 w-24 bg-muted/40 dark:bg-white/5 rounded" />
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-muted/40 dark:bg-white/5 rounded-full" />
                  <div className="h-8 w-8 bg-muted/40 dark:bg-white/5 rounded-full" />
                </div>
              </div>
            </div>
          ))
        ) : (
          displayedNews.map((item) => {
            const isFavorite = favoriteNewsIds.includes(item.id);

            return (
              <div 
                key={item.id} 
                className="bg-card/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-border/50 dark:border-white/10 rounded-3xl p-6 flex flex-col shadow-sm transition-all hover:shadow-md group"
              >
                {/* Meta Header */}
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary dark:bg-white/10 dark:text-zinc-300 font-medium border-none shadow-none">
                    {item.category}
                  </Badge>
                  {isSortedByViews && (
                    <span className="text-xs font-medium text-orange-500/80 flex items-center gap-1 bg-orange-500/10 px-2 py-0.5 rounded-full">
                      <Eye className="w-3 h-3" /> {item.views.toLocaleString('pt-BR')}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3 mb-6">
                  <h3 className="text-xl font-bold leading-tight text-foreground dark:text-white group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  
                  {/* Critério Crítico: line-clamp-4 para limitar a leitura rápida */}
                  <p className="text-sm text-muted-foreground dark:text-zinc-400 leading-relaxed line-clamp-4">
                    {item.summary}
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-4 mt-auto border-t border-border/50 dark:border-white/10">
                  <div className="flex items-center text-xs text-muted-foreground dark:text-zinc-500 gap-1.5 font-medium">
                    <CalendarDays className="w-4 h-4" />
                    {item.date}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => toggleFavorite(item.id)}
                      className={`h-9 w-9 rounded-full transition-colors ${
                        isFavorite 
                          ? "text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 hover:text-rose-600" 
                          : "text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:hover:text-zinc-200 bg-muted/30 dark:bg-white/5"
                      }`}
                      aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      nativeButton={false}
                      render={<a href={item.officialLink} target="_blank" rel="noopener noreferrer" aria-label="Acessar publicação oficial" />}
                      className="h-9 w-9 rounded-full bg-muted/30 dark:bg-white/5 text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:hover:text-zinc-200 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
