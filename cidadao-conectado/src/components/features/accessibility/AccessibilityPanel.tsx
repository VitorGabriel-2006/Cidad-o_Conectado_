"use client";

import { useState } from "react";
import { AgencyAccessibility } from "@/data/mockBenefits";
import { Axe, Ear, MonitorUp, Clock, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useA11yStore } from "@/store/useA11yStore";

interface AccessibilityPanelProps {
  accessibility: AgencyAccessibility;
}

export function AccessibilityPanel({ accessibility }: AccessibilityPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [issueType, setIssueType] = useState("");
  const [details, setDetails] = useState("");
  const { announce } = useA11yStore();

  const handleSubmit = () => {
    if (!issueType) return;
    toast.success("Denúncia enviada aos administradores. Obrigado por ajudar a manter o portal atualizado!");
    announce("Denúncia de acessibilidade enviada com sucesso.", "assertive");
    setIsOpen(false);
    setIssueType("");
    setDetails("");
  };

  const features = [
    {
      id: "ramps",
      label: "Acesso a Cadeirantes / Rampas",
      active: accessibility.hasRamps || accessibility.wheelchairAccessible,
      icon: Axe,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      id: "libras",
      label: "Intérprete de Libras",
      active: accessibility.hasLibras,
      icon: Ear,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      id: "digital",
      label: "Acessibilidade Digital",
      active: accessibility.digitalAccessibility,
      icon: MonitorUp,
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20"
    },
    {
      id: "priority",
      label: "Atendimento Prioritário",
      active: accessibility.priorityService,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20"
    }
  ];

  return (
    <div className="mt-4 bg-card/60 backdrop-blur-sm border border-border/60 rounded-xl p-4 shadow-sm animate-in fade-in duration-300">
      <h4 className="font-semibold text-sm mb-3">Acessibilidade no Órgão</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {features.map((feat) => {
          const Icon = feat.active ? feat.icon : XCircle;
          return (
            <div 
              key={feat.id} 
              className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm transition-all
                ${feat.active ? `${feat.bg} ${feat.border}` : "bg-muted/50 border-border/40 opacity-60 grayscale"}`}
            >
              <div className={`p-1.5 rounded-full ${feat.active ? 'bg-background shadow-sm' : ''}`}>
                <Icon className={`w-4 h-4 ${feat.active ? feat.color : 'text-muted-foreground'}`} />
              </div>
              <span className={`font-medium ${feat.active ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                {feat.label}
              </span>
            </div>
          );
        })}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger render={<Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-foreground hover:bg-muted h-8" />}>
          <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
          Encontrou um erro de acessibilidade? Denunciar
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reportar Erro de Acessibilidade</DialogTitle>
            <DialogDescription>
              Ajude-nos a manter as informações atualizadas relatando o que está incorreto no local.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">O que está incorreto?</label>
              <Select onValueChange={(val) => setIssueType(val || "")} value={issueType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o problema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ramps">A rampa está quebrada ou não existe</SelectItem>
                  <SelectItem value="libras">Não havia intérprete de Libras</SelectItem>
                  <SelectItem value="priority">Atendimento prioritário desrespeitado</SelectItem>
                  <SelectItem value="digital">Totem/App digital sem acessibilidade</SelectItem>
                  <SelectItem value="other">Outro problema</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Detalhes (Opcional)</label>
              <Textarea 
                placeholder="Descreva brevemente o que aconteceu..." 
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="resize-none h-20"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!issueType}>Enviar Denúncia</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
