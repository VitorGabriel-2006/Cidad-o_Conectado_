"use client";

import { useState } from "react";
import { Smartphone, Building2, Search, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft } from "lucide-react";
import { ProcessStep } from "@/data/mockBenefits";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface ProcessTimelineProps {
  steps: ProcessStep[];
}

export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!steps || steps.length === 0) return null;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const getStepIcon = (type: ProcessStep["type"]) => {
    switch (type) {
      case "online":
        return <Smartphone className="w-5 h-5" />;
      case "in-person":
        return <Building2 className="w-5 h-5" />;
      case "analysis":
        return <Search className="w-5 h-5" />;
      case "approval":
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <CheckCircle2 className="w-5 h-5" />;
    }
  };

  const getStepColor = (type: ProcessStep["type"], status: "past" | "current" | "future") => {
    if (status === "future") return "bg-muted text-muted-foreground border-border";
    
    switch (type) {
      case "online":
        return status === "current" ? "bg-blue-500 text-white border-blue-500 ring-4 ring-blue-500/20" : "bg-blue-500 text-white border-blue-500";
      case "in-person":
        return status === "current" ? "bg-amber-500 text-white border-amber-500 ring-4 ring-amber-500/20" : "bg-amber-500 text-white border-amber-500";
      case "analysis":
        return status === "current" ? "bg-purple-500 text-white border-purple-500 ring-4 ring-purple-500/20" : "bg-purple-500 text-white border-purple-500";
      case "approval":
        return status === "current" ? "bg-green-500 text-white border-green-500 ring-4 ring-green-500/20" : "bg-green-500 text-white border-green-500";
      default:
        return "bg-primary text-primary-foreground border-primary";
    }
  };

  return (
    <div className="bg-zinc-900/40 dark:bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-sm">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            Linha do Tempo da Solicitação
          </h3>
          <p className="text-sm text-muted-foreground">Acompanhe as etapas necessárias para este benefício.</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={handlePrev} 
            disabled={currentStepIndex === 0}
            className="p-2 rounded-full border border-border bg-background hover:bg-muted disabled:opacity-50 transition-colors"
            title="Voltar Etapa"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={handleNext} 
            disabled={currentStepIndex === steps.length - 1}
            className="p-2 rounded-full border border-border bg-background hover:bg-muted disabled:opacity-50 transition-colors"
            title="Avançar Etapa"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative pl-6 space-y-8">
        {/* Linha vertical conectora */}
        <div className="absolute left-[19px] top-6 bottom-6 w-[2px] bg-border rounded-full" />

        {steps.map((step, index) => {
          const status = index < currentStepIndex ? "past" : index === currentStepIndex ? "current" : "future";
          
          return (
            <motion.div 
              key={step.id} 
              className={`relative flex gap-4 ${status === "past" ? "opacity-70" : status === "future" ? "opacity-50" : "opacity-100"}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: status === "past" ? 0.7 : status === "future" ? 0.5 : 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* O Ícone na linha */}
              <div className={`absolute -left-6 z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${getStepColor(step.type, status)}`}>
                {status === "past" ? <CheckCircle2 className="w-5 h-5" /> : getStepIcon(step.type)}
              </div>

              {/* Conteúdo do Passo */}
              <div className={`flex-1 pl-6 pt-1 ${status === "current" ? "" : ""}`}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className={`font-semibold ${status === "current" ? "text-foreground text-lg" : "text-foreground/80"}`}>
                      {index + 1}. {step.title}
                    </h4>
                    {step.isMandatoryInPerson && (
                      <Badge variant="destructive" className="bg-rose-500/10 text-rose-600 border-rose-500/20 text-[10px] px-1.5 py-0">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Presencial Obrigatório
                      </Badge>
                    )}
                  </div>
                  {step.estimatedTime && (
                    <span className="text-xs font-medium bg-muted/50 px-2 py-1 rounded whitespace-nowrap text-muted-foreground border border-border/50">
                      {step.estimatedTime}
                    </span>
                  )}
                </div>
                
                <p className={`text-sm ${status === "current" ? "text-foreground/90 leading-relaxed" : "text-muted-foreground"}`}>
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
