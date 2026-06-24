"use client";

import { useCompareStore } from "@/store/useCompareStore";
import { mockBenefits } from "@/data/mockBenefits";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Scale, Trash2 } from "lucide-react";

export function ComparisonDrawer() {
  const { compareList, removeFromCompare, clearComparison, setModalOpen } = useCompareStore();

  const benefits = compareList
    .map((id) => mockBenefits.find((b) => b.id === id))
    .filter((b): b is NonNullable<typeof b> => !!b);

  if (benefits.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 z-50 flex items-center justify-center pr-20 md:pr-24"
      >
        <div className="bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-md border border-slate-700/50 dark:border-slate-800/50 rounded-2xl shadow-2xl p-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full max-w-2xl">
          
          <div className="flex-1 flex items-center gap-3 w-full overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {benefits.map((benefit) => (
              <div 
                key={benefit.id} 
                className="flex items-center justify-between gap-2 bg-slate-800/50 dark:bg-slate-900/50 border border-slate-700/50 rounded-xl px-3 py-2 min-w-[140px] max-w-[180px]"
              >
                <span className="text-sm font-medium text-slate-200 truncate" title={benefit.title}>
                  {benefit.title}
                </span>
                <button 
                  onClick={() => removeFromCompare(benefit.id)}
                  className="text-slate-400 hover:text-rose-400 transition-colors shrink-0 p-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            
            {/* Empty slots placeholders */}
            {Array.from({ length: 3 - benefits.length }).map((_, i) => (
              <div 
                key={`empty-${i}`} 
                className="flex items-center justify-center bg-slate-800/20 dark:bg-slate-900/20 border border-slate-700/30 border-dashed rounded-xl px-3 py-2 min-w-[140px]"
              >
                <span className="text-xs text-slate-500">Adicionar benefício</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Remover do comparativo"
              onClick={clearComparison}
              className="text-slate-400 hover:text-rose-400 hover:bg-slate-800 shrink-0"
              title="Limpar comparação"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => setModalOpen(true)}
              disabled={benefits.length < 1}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/20"
            >
              <Scale className="h-4 w-4 mr-2" />
              Comparar ({benefits.length}/3)
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
