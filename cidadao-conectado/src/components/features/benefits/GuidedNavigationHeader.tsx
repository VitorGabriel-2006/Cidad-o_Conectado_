"use client";

import { useNavigationStore } from "@/store/useNavigationStore";
import { Sparkles, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

export function GuidedNavigationHeader() {
  const { isGuidedMode, setGuidedMode, hideIrrelevant, setHideIrrelevant } = useNavigationStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/80 backdrop-blur-md border border-emerald-500/30 shadow-sm shadow-emerald-900/5 rounded-xl p-4 sm:p-5 mb-6 print:hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20 shrink-0">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              Motor de Recomendação
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Reorganizamos os benefícios em tempo real com base no seu perfil.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 shrink-0 bg-background/50 p-3 rounded-lg border border-border/50">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="guided-mode" className="text-sm font-medium cursor-pointer flex-1">
              Modo Guiado Ativo
            </label>
            <Switch 
              id="guided-mode" 
              checked={isGuidedMode} 
              onCheckedChange={setGuidedMode} 
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>

          <div className="h-px w-full bg-border/50" />

          <div className="flex items-center gap-2">
            <Checkbox 
              id="hide-irrelevant" 
              checked={hideIrrelevant} 
              onCheckedChange={(checked) => setHideIrrelevant(checked === true)}
              className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
            />
            <label htmlFor="hide-irrelevant" className="text-xs text-muted-foreground cursor-pointer flex items-center gap-1.5 hover:text-foreground transition-colors">
              <EyeOff className="w-3.5 h-3.5" />
              Ocultar incompatíveis com meu perfil
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
