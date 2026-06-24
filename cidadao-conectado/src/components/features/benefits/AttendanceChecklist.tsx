"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FileText, Printer, CheckCircle2, Clock, MapPin, Building } from "lucide-react";
import { BenefitDocument, AgencyInfo } from "@/data/mockBenefits";
import { cn } from "@/lib/utils";

interface AttendanceChecklistProps {
  documents: BenefitDocument[];
  agencyInfo?: AgencyInfo;
  benefitTitle: string;
}

export function AttendanceChecklist({ documents, agencyInfo, benefitTitle }: AttendanceChecklistProps) {
  const [checkedDocs, setCheckedDocs] = useState<string[]>([]);

  const toggleDoc = (id: string) => {
    setCheckedDocs(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const mandatoryDocs = documents.filter(d => !d.isOptional);
  const optionalDocs = documents.filter(d => d.isOptional);

  const renderDocList = (docs: BenefitDocument[], title: string, isOptionalList: boolean) => {
    if (docs.length === 0) return null;

    return (
      <div className="space-y-3 mb-6 print:mb-4">
        <h4 className="font-semibold text-sm text-foreground print:text-black uppercase tracking-wider flex items-center gap-2">
          {title}
        </h4>
        <ul className="space-y-2">
          {docs.map((doc) => {
            const isChecked = checkedDocs.includes(doc.id);
            return (
              <li 
                key={doc.id} 
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer print:border-none print:p-1 print:gap-2",
                  isChecked 
                    ? "bg-muted/30 border-transparent print:bg-transparent" 
                    : isOptionalList
                      ? "bg-card border-border/50 hover:border-primary/30"
                      : "bg-card border-l-4 border-l-rose-400 border-y-border/50 border-r-border/50 hover:border-rose-400/60 print:border-l-0 print:border-transparent"
                )}
                onClick={() => toggleDoc(doc.id)}
              >
                <div className="mt-0.5 print:hidden">
                  <Checkbox 
                    checked={isChecked} 
                    onCheckedChange={() => toggleDoc(doc.id)}
                    className={cn(isChecked && "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500")}
                  />
                </div>
                {/* Print only visual checkbox */}
                <div className="hidden print:block mt-0.5 text-lg font-mono">
                  {isChecked ? "[X]" : "[ ]"}
                </div>
                
                <span className={cn(
                  "font-medium text-sm leading-relaxed flex-1 select-none print:text-black",
                  isChecked && "line-through text-muted-foreground print:no-underline print:text-black"
                )}>
                  {doc.name}
                </span>
                
                {isChecked && <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 print:hidden" />}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <h3 className="font-semibold text-lg">Checklist de Atendimento</h3>
        <Button variant="outline" size="sm" onClick={handlePrint} className="h-8 gap-1.5 bg-primary/5 hover:bg-primary/10 border-primary/20">
          <Printer className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Baixar / Imprimir</span>
        </Button>
      </div>

      {/* Cabeçalho de Impressão */}
      <div className="hidden print:block mb-8 border-b-2 border-black pb-4">
        <h1 className="text-2xl font-bold uppercase mb-2">Checklist de Atendimento</h1>
        <h2 className="text-xl font-medium">{benefitTitle}</h2>
      </div>

      {agencyInfo && (
        <div className="bg-muted/30 border border-border/60 rounded-xl p-4 print:bg-transparent print:border-black print:rounded-none print:p-2 print:mb-6">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 print:text-base print:font-bold">
            <Building className="h-4 w-4 text-primary print:hidden" /> Local de Atendimento
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="font-semibold w-20 shrink-0 print:w-auto print:mr-2">Órgão:</span>
              <span className="print:font-medium">{agencyInfo.name}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold w-20 shrink-0 print:w-auto print:mr-2">Endereço:</span>
              <span className="print:font-medium">{agencyInfo.address}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold w-20 shrink-0 print:w-auto print:mr-2">Horário:</span>
              <span className="print:font-medium">{agencyInfo.hours}</span>
            </div>
          </div>
        </div>
      )}

      <div>
        {renderDocList(mandatoryDocs, "Documentos Obrigatórios", false)}
        {renderDocList(optionalDocs, "Documentos Opcionais (Se aplicável)", true)}
      </div>

      <div className="hidden print:block mt-12 pt-4 border-t border-black text-sm text-center">
        Gerado pelo portal Cidadão Conectado
      </div>
    </div>
  );
}
