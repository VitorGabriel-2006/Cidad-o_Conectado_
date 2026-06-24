"use client";

import { TaxSavingsDashboard } from "@/components/features/benefits/TaxSavingsDashboard";
import { motion } from "framer-motion";

export default function EconomiaPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-screen-2xl w-full mx-auto py-10 px-4 md:px-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary mb-2">Painel de Economia Financeira</h1>
        <p className="text-muted-foreground text-lg">
          Veja o impacto financeiro real dos direitos civis e benefícios fiscais mapeados para o seu perfil.
        </p>
      </div>

      <TaxSavingsDashboard />
    </motion.div>
  );
}
