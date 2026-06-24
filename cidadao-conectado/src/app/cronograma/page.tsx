"use client";

import { useApplicationStore } from "@/store/useApplicationStore";
import { mockBenefits } from "@/data/mockBenefits";
import { ScheduleView } from "@/components/features/benefits/ScheduleView";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function CronogramaPage() {
  const favorites = useApplicationStore((state) => state.favorites);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const favoriteBenefits = mockBenefits.filter(b => favorites.includes(b.id));

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary/10 p-3 rounded-xl border border-primary/20">
          <Calendar className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Meu Cronograma Pessoal</h1>
          <p className="text-muted-foreground mt-1">
            Calendário gerado automaticamente com base nos seus benefícios favoritados.
          </p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <ScheduleView favoriteBenefits={favoriteBenefits} />
      </motion.div>
    </div>
  );
}
