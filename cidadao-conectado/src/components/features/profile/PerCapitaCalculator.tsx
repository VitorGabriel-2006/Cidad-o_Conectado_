"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Plus, Trash2, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface IncomeSource {
  id: string;
  name: string;
  value: string;
}

interface PerCapitaCalculatorProps {
  initialMembers?: string;
  onApply: (totalIncome: number, members: number) => void;
}

const formatCurrency = (value: string) => {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  if (digits === "") return "";
  
  const numberValue = parseInt(digits, 10) / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numberValue);
};

const getRawValue = (formattedValue: string) => {
  if (!formattedValue) return 0;
  return parseInt(formattedValue.replace(/\D/g, ""), 10) / 100;
};

export function PerCapitaCalculator({ initialMembers, onApply }: PerCapitaCalculatorProps) {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState(initialMembers || "1");
  const [incomes, setIncomes] = useState<IncomeSource[]>([
    { id: "1", name: "Minha Renda", value: "" }
  ]);

  // Update members when initialMembers changes and dialog is not open
  useEffect(() => {
    if (!open && initialMembers) {
      setMembers(initialMembers);
    }
  }, [initialMembers, open]);

  const totalIncome = useMemo(() => {
    return incomes.reduce((acc, curr) => acc + getRawValue(curr.value), 0);
  }, [incomes]);

  const membersCount = parseInt(members, 10) || 0;
  
  const perCapitaIncome = useMemo(() => {
    if (membersCount <= 0) return 0;
    return totalIncome / membersCount;
  }, [totalIncome, membersCount]);

  const handleAddIncome = () => {
    setIncomes([...incomes, { id: Math.random().toString(36).substring(7), name: `Renda ${incomes.length + 1}`, value: "" }]);
  };

  const handleRemoveIncome = (id: string) => {
    setIncomes(incomes.filter(inc => inc.id !== id));
  };

  const handleIncomeChange = (id: string, field: "name" | "value", newValue: string) => {
    setIncomes(incomes.map(inc => {
      if (inc.id === id) {
        if (field === "value") {
          return { ...inc, value: formatCurrency(newValue) };
        }
        return { ...inc, [field]: newValue };
      }
      return inc;
    }));
  };

  const handleApply = () => {
    onApply(totalIncome, membersCount);
    setOpen(false);
  };

  // Validations
  const isUnrealistic = perCapitaIncome > 50000 || membersCount > 20;
  const isBolsaFamiliaEligible = perCapitaIncome <= 218 && perCapitaIncome >= 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" type="button" className="w-full gap-2 border-primary/30 text-primary hover:bg-primary/5 shadow-sm" />}>
        <Calculator className="h-4 w-4" />
        Usar Calculadora de Renda
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Calculadora de Renda Per Capita
          </DialogTitle>
          <DialogDescription>
            Some a renda de todas as pessoas que moram na mesma casa para descobrir sua Renda Per Capita oficial.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Accordion type="single" className="w-full bg-muted/30 rounded-lg px-4 border border-border/50">
            <AccordionItem value="o-que-e-renda" className="border-none">
              <AccordionTrigger className="text-sm font-medium hover:no-underline py-3">
                <div className="flex items-center gap-2 text-primary">
                  <Info className="h-4 w-4" />
                  O que conta como Renda?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4 space-y-3">
                <div>
                  <strong className="text-foreground">👍 VOCÊ DEVE SOMAR:</strong>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Salários de carteira assinada</li>
                    <li>Renda de trabalhos autônomos ou "bicos"</li>
                    <li>Aposentadorias e Pensões do INSS</li>
                    <li>Pensão alimentícia recebida</li>
                    <li>Benefícios de Prestação Continuada (BPC/LOAS)</li>
                    <li>Rendimentos de aluguel</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-foreground text-destructive">👎 NÃO DEVE SOMAR:</strong>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>O próprio Bolsa Família</li>
                    <li>Auxílio-Gás e auxílios emergenciais</li>
                    <li>Indenizações por danos ou acidentes</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="space-y-3">
            <Label className="font-semibold text-base">Pessoas na Casa</Label>
            <div className="flex items-center gap-3">
              <Input 
                type="number" 
                min="1" 
                max="30"
                value={members} 
                onChange={(e) => setMembers(e.target.value)} 
                className="w-24 text-center font-bold"
              />
              <span className="text-sm text-muted-foreground">Quantas pessoas moram com você (incluindo crianças e você mesmo)?</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="font-semibold text-base">Fontes de Renda Mensal</Label>
              <Button type="button" variant="secondary" size="sm" onClick={handleAddIncome} className="gap-1 h-8">
                <Plus className="h-3 w-3" /> Adicionar Renda
              </Button>
            </div>
            
            <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-2">
              {incomes.map((inc, index) => (
                <div key={inc.id} className="flex items-center gap-3 bg-card p-3 rounded-xl border border-border shadow-sm">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs text-muted-foreground">De quem é? / Nome</Label>
                    <Input 
                      placeholder="Ex: Salário do Pai" 
                      value={inc.name} 
                      onChange={(e) => handleIncomeChange(inc.id, "name", e.target.value)} 
                      className="h-8"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs text-muted-foreground">Valor (R$)</Label>
                    <Input 
                      placeholder="R$ 0,00" 
                      value={inc.value} 
                      onChange={(e) => handleIncomeChange(inc.id, "value", e.target.value)} 
                      className="h-8 font-medium"
                    />
                  </div>
                  {incomes.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      aria-label="Remover fonte de renda"
                      className="mt-5 text-destructive hover:bg-destructive/10 shrink-0" 
                      onClick={() => handleRemoveIncome(inc.id)}
                      title="Remover"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 rounded-xl p-5 border border-primary/20 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-primary/10">
              <span className="text-muted-foreground font-medium">Renda Familiar Total:</span>
              <span className="text-lg font-bold">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalIncome)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground font-bold text-lg">Renda Per Capita:</span>
              <span className="text-2xl font-black text-primary">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(perCapitaIncome)}
              </span>
            </div>
          </div>

          {isUnrealistic && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Valores Irreais</AlertTitle>
              <AlertDescription>
                A renda per capita calculada é excessivamente alta ou o número de pessoas é inválido. Por favor, revise os valores inseridos.
              </AlertDescription>
            </Alert>
          )}

          {!isUnrealistic && totalIncome > 0 && isBolsaFamiliaEligible && (
            <Alert className="bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/30">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
              <AlertTitle className="text-green-800 dark:text-green-400">Dentro do Limite do Bolsa Família!</AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-500">
                Sua renda está abaixo de R$ 218 por pessoa, o que enquadra sua família nos requisitos financeiros do programa.
              </AlertDescription>
            </Alert>
          )}

          {!isUnrealistic && perCapitaIncome > 218 && perCapitaIncome <= 706 && (
            <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-900/30">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-500" />
              <AlertTitle className="text-blue-800 dark:text-blue-400">Direito à Tarifa Social</AlertTitle>
              <AlertDescription className="text-blue-700 dark:text-blue-500">
                Sua renda passa o teto do Bolsa Família, mas por ser menor que Meio Salário Mínimo (R$ 706), você tem direito ao CadÚnico, Tarifa Social de Energia e Auxílio-Gás.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button type="button" onClick={handleApply} disabled={isUnrealistic || membersCount <= 0}>
            Aplicar Valores ao Perfil
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
