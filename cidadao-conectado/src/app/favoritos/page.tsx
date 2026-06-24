"use client";

import { useApplicationStore } from "@/store/useApplicationStore";
import { mockBenefits } from "@/data/mockBenefits";
import { BenefitCard } from "@/components/features/benefits/BenefitCard";
import { ExportPdfButton } from "@/components/features/benefits/ExportPdfButton";
import { BenefitPrintView } from "@/components/features/benefits/BenefitPrintView";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { useProfileStore } from "@/store/useProfileStore";

export default function FavoritosPage() {
  const favorites = useApplicationStore((state) => state.favorites) || [];
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const favoriteBenefits = mockBenefits.filter(b => favorites.includes(b.id));

  if (!mounted) return null;

  return (
    <>
      <BenefitPrintView />
      <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/20">
              <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Meus Favoritos</h1>
              <p className="text-muted-foreground mt-1">
                Aqui estão os benefícios e leis que você salvou para acompanhar.
              </p>
            </div>
          </div>
          {favoriteBenefits.length > 0 && (
            <ExportPdfButton />
          )}
        </div>

      {favoriteBenefits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border/50 border-dashed rounded-xl">
          <div className="bg-muted p-4 rounded-full mb-4">
            <Star className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Nenhum favorito ainda</h3>
          <p className="text-muted-foreground max-w-md">
            Você ainda não salvou nenhum benefício. Navegue pela lista principal e clique na estrela para salvar os itens do seu interesse aqui.
          </p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {favoriteBenefits.map(benefit => (
            <BenefitCard key={benefit.id} benefit={benefit} />
          ))}
        </motion.div>
      )}
      </div>
    </>
  );
}
