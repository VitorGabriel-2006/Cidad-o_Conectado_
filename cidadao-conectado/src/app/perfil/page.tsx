"use client";

import { CreateProfileForm } from "@/components/features/profile/CreateProfileForm";
import { TaxSavingsCTA } from "@/components/features/profile/TaxSavingsCTA";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { motion, Variants } from "framer-motion";

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function CreateProfilePage() {
  return (
    <motion.div 
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="max-w-screen-2xl w-full mx-auto py-10 px-4 md:px-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary mb-2">Criar Perfil Anônimo</h1>
        <p className="text-muted-foreground text-lg">
          Personalize sua experiência no portal sem precisar se identificar.
        </p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-8 flex items-start gap-4">
        <ShieldAlert className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-600 dark:text-blue-400">
          <strong className="font-semibold block mb-1">Privacidade Garantida</strong>
          Não exigimos CPF, RG ou qualquer documento. Os dados preenchidos aqui serão salvos 
          <strong> apenas durante esta sessão </strong> no seu navegador para personalizar os benefícios 
          sociais exibidos. Ao fechar o navegador, eles serão apagados.
        </div>
      </div>

      <TaxSavingsCTA />

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Dados Básicos</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para descobrirmos os direitos civis que se aplicam a você.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateProfileForm />
        </CardContent>
      </Card>
    </motion.div>
  );
}
