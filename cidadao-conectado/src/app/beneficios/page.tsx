"use client";

import { BenefitsView } from "@/components/features/benefits/BenefitsView";
import { mockBenefits } from "@/data/mockBenefits";
import { Info, UserPlus } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useProfileStore } from "@/store/useProfileStore";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function BeneficiosPage() {
  const isAuthenticated = useProfileStore((state) => state.isAuthenticated);

  return (
    <motion.div 
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="max-w-screen-2xl w-full mx-auto py-10 px-4 md:px-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary mb-2">Catálogo de Benefícios</h1>
        <p className="text-muted-foreground text-lg">
          Explore e encontre os direitos civis e benefícios sociais que se aplicam ao seu perfil.
        </p>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-8 flex items-start gap-4">
        <Info className="w-6 h-6 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
        <div className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong className="font-semibold block mb-1">Dica de Uso</strong>
          Utilize os filtros laterais para encontrar benefícios específicos para grupos como 
          Estudantes, Idosos, PcD, entre outros. O sistema atualizará os resultados instantaneamente.
        </div>
      </div>

      {!isAuthenticated && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full shrink-0">
              <UserPlus className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-primary">Quer salvar seus resultados e criar uma Carteira de Documentos Digital?</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Crie uma conta gratuita agora para não perder sua triagem e acessar recursos exclusivos como a Central de Privacidade.
              </p>
            </div>
          </div>
          <Link href="/seguranca" className="shrink-0 w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              Criar Conta Gratuita
            </Button>
          </Link>
        </div>
      )}

      <BenefitsView initialBenefits={mockBenefits} />
    </motion.div>
  );
}
