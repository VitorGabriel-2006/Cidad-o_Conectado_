"use client";

import { useTaxSavings } from "@/hooks/useTaxSavings";
import { PiggyBank, Landmark, ShieldAlert, CheckCircle2, ChevronRight } from "lucide-react";
import { useAccessibilityStore } from "@/store/useAccessibilityStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TaxSavingsDashboard() {
  const { totalAnnualSavings, qualifiedExemptions, hasExemptions } = useTaxSavings();
  const { isSimplifiedMode } = useAccessibilityStore();

  if (!hasExemptions) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="bg-muted p-4 rounded-full mb-4">
          <ShieldAlert className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Nenhuma Isenção Encontrada</h2>
        <p className="text-muted-foreground max-w-md">
          Com base nos dados atuais do seu perfil, não encontramos estimativas de economia tributária. Atualize sua renda ou perfil familiar para reavaliar.
        </p>
      </div>
    );
  }

  const formattedTotal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(totalAnnualSavings);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-zinc-900/50 dark:bg-card/40 backdrop-blur-md border border-emerald-500/20 rounded-3xl p-8 relative overflow-hidden shadow-lg">
        <div className="absolute -top-10 -right-10 opacity-[0.03] transform rotate-12 pointer-events-none">
          <PiggyBank className="w-96 h-96 text-emerald-400" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 mb-4 px-3 py-1 text-sm font-medium">
            <Landmark className="w-4 h-4 mr-2" />
            Estimativa de Redução Tributária
          </Badge>
          
          <h2 className={isSimplifiedMode ? "text-xl text-emerald-700 dark:text-emerald-400 font-medium mb-2 leading-loose tracking-wide" : "text-xl text-emerald-700 dark:text-emerald-400 font-medium mb-2"}>
            Você pode economizar aproximadamente
          </h2>
          
          <div className="text-5xl md:text-7xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight my-4">
            {formattedTotal}
          </div>
          
          <p className={isSimplifiedMode ? "text-lg text-muted-foreground leading-loose tracking-wide mt-2" : "text-sm text-muted-foreground mt-2"}>
            por ano através de isenções fiscais e descontos.
          </p>
        </div>
      </div>

      {/* Lista de Isenções */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold px-1">Seus Direitos Fiscais ({qualifiedExemptions.length})</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {qualifiedExemptions.map((exemption) => (
            <Card key={exemption.id} className="bg-card/60 backdrop-blur-sm border-border/60 hover:border-emerald-500/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <h4 className="font-semibold text-lg">{exemption.name}</h4>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div className="font-bold text-emerald-600 dark:text-emerald-400">
                      ~ R$ {exemption.estimatedSavings}
                    </div>
                    <div className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">
                      {exemption.savingsType}
                    </div>
                  </div>
                </div>
                
                <p className={isSimplifiedMode ? "text-base text-foreground leading-loose tracking-wide mb-4" : "text-sm text-muted-foreground mb-4"}>
                  {exemption.simplifiedDescription}
                </p>
                
                <div className="pt-4 border-t border-border/40 flex flex-col gap-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Órgão:</span>
                    <span className="font-medium text-foreground">{exemption.agency}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Validade:</span>
                    <span className="font-medium text-foreground text-right max-w-[200px] truncate" title={exemption.validity}>{exemption.validity}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Aviso Legal */}
      <div className="text-center mt-12 mb-8">
        <p className="text-xs text-muted-foreground bg-muted/30 inline-block px-4 py-2 rounded-full border border-border/40">
          Valores estimados para fins educativos. A isenção real depende de análise e aprovação oficial junto a cada órgão responsável.
        </p>
      </div>
    </div>
  );
}
