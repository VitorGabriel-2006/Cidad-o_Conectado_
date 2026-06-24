import { FakeNewsAlert } from "@/data/mockFakeNews";
import { MessageSquareWarning, ShieldAlert } from "lucide-react";

interface FactCheckCardProps {
  item: FakeNewsAlert;
}

export function FactCheckCard({ item }: FactCheckCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md p-6 shadow-sm">
      {/* Carimbo FALSO */}
      <div className="absolute top-4 right-4 rotate-12 z-10 pointer-events-none">
        <span className="text-red-600 border-4 border-red-600 font-black text-3xl px-2 py-1 uppercase opacity-80 inline-block tracking-widest bg-background/50 backdrop-blur-sm">
          FALSO
        </span>
      </div>

      <div className="mb-4 pr-24">
        <h3 className="text-xl font-bold leading-tight">{item.title}</h3>
        <p className="text-sm text-muted-foreground mt-1">Identificado em: {item.date}</p>
      </div>

      <div className="bg-muted/50 rounded-xl p-4 mb-4 relative">
        <div className="absolute top-4 left-4">
          <MessageSquareWarning className="h-5 w-5 text-amber-500" />
        </div>
        <p className="italic text-foreground/80 pl-8 leading-relaxed text-sm">
          "{item.circulatingMessage}"
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-primary font-semibold">
          <ShieldAlert className="h-5 w-5" />
          A Verdade:
        </div>
        <p className="line-clamp-4 text-sm text-foreground leading-relaxed">
          {item.explanation}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground font-medium">
          Fonte Oficial: <span className="text-foreground">{item.officialSource}</span>
        </p>
      </div>
    </div>
  );
}
