"use client";

import { useState } from "react";
import { FAQ } from "@/data/mockBenefits";
import { Search, Star, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { WhatsAppSupportButton } from "@/components/features/support/WhatsAppSupportButton";

interface BenefitFAQProps {
  faqs: FAQ[];
}

export function BenefitFAQ({ faqs }: BenefitFAQProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = faqs.filter((faq) => {
    const term = searchTerm.toLowerCase();
    return faq.question.toLowerCase().includes(term) || faq.answer.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Suporte Direto */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 text-blue-500 shrink-0" />
          <div className="space-y-3 w-full">
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Dica:</strong> Ao iniciar a conversa, você pode enviar um print da sua tela para nossa equipe identificar o erro mais rapidamente.
            </p>
            <WhatsAppSupportButton variant="inline" />
          </div>
        </div>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
        <Input 
          placeholder="Busque sua dúvida (ex: cancelar, limite)..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-card/50 backdrop-blur-sm border-primary/20 focus-visible:ring-primary/30 h-11"
        />
      </div>

      {/* Lista de FAQs */}
      {filteredFaqs.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center bg-card/30 border border-border/50 border-dashed rounded-xl">
          <MessageSquare className="h-10 w-10 text-muted-foreground mb-3 opacity-30" />
          <p className="text-muted-foreground font-medium text-sm">Nenhuma dúvida encontrada com esses termos.</p>
          <button 
            onClick={() => setSearchTerm("")}
            className="text-primary text-xs mt-2 hover:underline"
          >
            Limpar busca
          </button>
        </div>
      ) : (
        <Accordion className="w-full space-y-3">
          {filteredFaqs.map((faq) => (
            <AccordionItem 
              key={faq.id} 
              value={faq.id} 
              className="border border-border/50 bg-card rounded-xl px-4 overflow-hidden data-[state=open]:border-primary/30 data-[state=open]:shadow-sm transition-all"
            >
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 pr-4 w-full">
                  <span className="font-semibold text-sm leading-tight flex-1">
                    {faq.question}
                  </span>
                  {faq.isPopular && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 border-none shrink-0 w-fit gap-1 text-[10px] uppercase tracking-wider px-2">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> Em alta
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1">
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
