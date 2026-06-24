"use client";

import { useRecentStore } from "@/store/useRecentStore";
import { Benefit } from "@/data/mockBenefits";
import { BenefitDetailsSheet } from "./BenefitDetailsSheet";
import { Coins, GraduationCap, HeartPulse, Bus, Home, Info, X, Trash2, History } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RecentlyViewed() {
  const { recentBenefits, removeRecent, clearRecent } = useRecentStore();

  if (recentBenefits.length === 0) return null;

  const getIcon = (type: Benefit["iconType"]) => {
    switch (type) {
      case "money": return <Coins className="h-4 w-4 text-green-500" />;
      case "education": return <GraduationCap className="h-4 w-4 text-blue-500" />;
      case "health": return <HeartPulse className="h-4 w-4 text-red-500" />;
      case "transport": return <Bus className="h-4 w-4 text-yellow-500" />;
      case "housing": return <Home className="h-4 w-4 text-purple-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="mb-8 w-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground">
          <History className="h-5 w-5 text-primary" />
          Consultados Recentemente
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearRecent}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs h-8"
        >
          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
          Limpar
        </Button>
      </div>

      <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {recentBenefits.map((benefit) => (
          <BenefitDetailsSheet key={`recent-${benefit.id}`} benefit={benefit} nativeButton={false}>
            <div 
              role="button"
              tabIndex={0}
              className="flex-shrink-0 w-[240px] bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 rounded-xl p-3 flex flex-col gap-2 relative shadow-sm hover:shadow-md transition-all group cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <Button
                variant="ghost"
                size="icon"
                aria-label="Limpar histórico"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeRecent(benefit.id);
                }}
                className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-destructive/10 hover:text-destructive z-10 sm:flex hidden"
              >
                <X className="h-3 w-3" />
              </Button>

              {/* Sempre visível no mobile */}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeRecent(benefit.id);
                }}
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/50 text-muted-foreground hover:bg-destructive/10 hover:text-destructive z-10 sm:hidden flex"
              >
                <X className="h-3 w-3" />
              </Button>
              
              <div className="flex items-center gap-2.5">
                <div className="bg-muted p-1.5 rounded-full shrink-0">
                  {getIcon(benefit.iconType)}
                </div>
                <div className="flex flex-col overflow-hidden w-full">
                  <span className="text-sm font-semibold truncate pr-4 text-foreground">
                    {benefit.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium truncate">
                    {benefit.providerDetails?.name || benefit.provider}
                  </span>
                </div>
              </div>
            </div>
          </BenefitDetailsSheet>
        ))}
      </div>
    </div>
  );
}
