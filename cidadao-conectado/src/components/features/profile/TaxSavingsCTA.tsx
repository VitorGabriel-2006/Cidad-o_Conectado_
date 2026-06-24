"use client";

import { PiggyBank, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTaxSavings } from "@/hooks/useTaxSavings";
import { motion } from "framer-motion";

export function TaxSavingsCTA() {
  const { totalAnnualSavings, hasExemptions } = useTaxSavings();

  if (!hasExemptions || totalAnnualSavings === 0) {
    return null;
  }

  // Format currency
  const formattedSavings = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(totalAnnualSavings);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
      className="bg-emerald-500/10 border border-emerald-500/20 dark:bg-emerald-900/20 dark:border-emerald-800/30 rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-center gap-4 justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="bg-emerald-500/20 p-3 rounded-full shrink-0">
          <PiggyBank className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="font-bold text-emerald-800 dark:text-emerald-300 text-lg flex items-center gap-2">
            🎉 Você tem isenções disponíveis!
          </h3>
          <p className="text-emerald-700 dark:text-emerald-400/80 text-sm">
            Seu perfil atende aos requisitos para isenções fiscais. Você pode economizar aproximadamente <strong className="font-bold">{formattedSavings}</strong> por ano.
          </p>
        </div>
      </div>
      <Link href="/economia" className="w-full sm:w-auto shrink-0">
        <button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
          Ver Minha Economia <ArrowRight className="w-4 h-4" />
        </button>
      </Link>
    </motion.div>
  );
}
