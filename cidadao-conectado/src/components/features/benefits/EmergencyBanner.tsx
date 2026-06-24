"use client";

import { useState } from "react";
import { Siren, Timer, PhoneCall, ChevronDown, X } from "lucide-react";
import { mockBenefits } from "@/data/mockBenefits";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { BenefitCard } from "./BenefitCard";
import { Button } from "@/components/ui/button";

export function EmergencyBanner() {
  const [isExpanded, setIsExpanded] = useState(false);
  const emergencyBenefits = mockBenefits.filter(b => b.isEmergency);

  if (emergencyBenefits.length === 0) return null;

  if (!isExpanded) {
    return (
      <div 
        className="bg-red-950/30 border border-red-500/50 backdrop-blur-md rounded-2xl p-3 mb-8 shadow-sm cursor-pointer hover:bg-red-950/40 transition-colors flex items-center justify-between"
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex items-center gap-3">
          <div className="bg-red-500/20 p-2 rounded-full">
            <Siren className="h-5 w-5 text-red-500 animate-pulse" />
          </div>
          <h2 className="text-sm sm:text-base font-bold text-red-50 dark:text-red-100 line-clamp-1">
            Alerta de Calamidade Ativo: Auxílios Emergenciais Liberados
          </h2>
        </div>
        <Button variant="ghost" size="sm" className="text-red-200 hover:text-white hover:bg-red-500/20 hidden sm:flex shrink-0">
          Ver Detalhes
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-red-950/30 border border-red-500/50 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-lg relative animate-in fade-in duration-300 slide-in-from-top-4">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 right-4 text-red-300 hover:text-white hover:bg-red-500/20 rounded-full"
        onClick={() => setIsExpanded(false)}
        title="Recolher alerta"
      >
        <X className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-3 mb-6 pr-10">
        <div className="bg-red-500/20 p-3 rounded-full">
          <Siren className="h-6 w-6 text-red-500 animate-pulse" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-red-50 dark:text-red-100">Central de Direitos Emergenciais</h2>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <a 
          href="tel:199" 
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-md"
        >
          <PhoneCall className="h-4 w-4" />
          Defesa Civil (199)
        </a>
        <a 
          href="tel:193" 
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-md"
        >
          <PhoneCall className="h-4 w-4" />
          Bombeiros (193)
        </a>
        <a 
          href="tel:192" 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-md"
        >
          <PhoneCall className="h-4 w-4" />
          SAMU (192)
        </a>
      </div>

      <Accordion type="single" collapsible className="w-full bg-background/40 rounded-xl mb-6 border border-border/50">
        <AccordionItem value="passos" className="border-none">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-background/20 rounded-xl font-semibold">
            Primeiros Passos em Caso de Calamidade
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 text-sm space-y-2 text-foreground/80">
            <p><strong>1.</strong> Salve seus documentos pessoais colocando-os em sacos plásticos vedados.</p>
            <p><strong>2.</strong> Registre os danos na sua propriedade com fotos e vídeos, se for seguro fazer isso.</p>
            <p><strong>3.</strong> Inscreva-se ou atualize seus dados no CadÚnico Emergencial o mais rápido possível.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-red-100">Auxílios Liberados:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {emergencyBenefits.map(benefit => (
            <div key={benefit.id} className="relative mt-4">
              {benefit.emergencyEndDate && (
                <div className="absolute -top-4 left-3 z-20">
                  <Badge className="bg-amber-500 hover:bg-amber-600 text-black font-bold flex items-center gap-1 shadow-md border-amber-300">
                    <Timer className="h-3 w-3" />
                    Vigência Temporária (Até {benefit.emergencyEndDate})
                  </Badge>
                </div>
              )}
              {/* Wrapper to control max-height and avoid infinite scroll feeling */}
              <div className="h-[380px] overflow-hidden rounded-xl">
                <BenefitCard benefit={benefit} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
