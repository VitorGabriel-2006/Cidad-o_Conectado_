"use client";

import { useCompareStore } from "@/store/useCompareStore";
import { mockBenefits, Benefit } from "@/data/mockBenefits";
import { useProfileStore } from "@/store/useProfileStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Clock, MapPin, MonitorSmartphone, X, AlertTriangle } from "lucide-react";

export function ComparisonModal() {
  const { compareList, isModalOpen, setModalOpen, removeFromCompare } = useCompareStore();
  const { profile } = useProfileStore();

  const benefits = compareList
    .map((id) => mockBenefits.find((b) => b.id === id))
    .filter((b): b is NonNullable<typeof b> => !!b);

  if (benefits.length === 0) return null;

  // R044: Motor Anti-Conflito
  const checkConflicts = (selectedBenefits: Benefit[]) => {
    const conflicts: { benefitA: Benefit; benefitB: Benefit }[] = [];
    for (let i = 0; i < selectedBenefits.length; i++) {
      for (let j = i + 1; j < selectedBenefits.length; j++) {
        const a = selectedBenefits[i];
        const b = selectedBenefits[j];
        if (a.incompatibilities?.includes(b.id) || b.incompatibilities?.includes(a.id)) {
          conflicts.push({ benefitA: a, benefitB: b });
        }
      }
    }
    return conflicts;
  };

  const currentConflicts = checkConflicts(benefits);

  // Helper function to check if profile is incompatible with a benefit's requirement
  const getIncompatibility = (benefit: Benefit) => {
    if (!benefit.requirements || !profile) return null;
    const reqs = benefit.requirements;
    
    if (reqs.maxIncome && profile.perCapitaIncome !== undefined && profile.perCapitaIncome > reqs.maxIncome) {
      return "Renda acima do limite";
    }
    if (reqs.minAge && profile.age && Number(profile.age) < reqs.minAge) {
      return "Idade insuficiente";
    }
    if (reqs.maxAge && profile.age && Number(profile.age) > reqs.maxAge) {
      return "Acima da idade limite";
    }
    if (reqs.requiresStudent && !profile.isStudent) {
      return "Exige matrícula escolar";
    }
    if (reqs.requiresPregnant && !profile.isPregnant) {
      return "Exclusivo para gestantes";
    }
    if (reqs.requiresPcD && !profile.isPcD) {
      return "Exclusivo para PcD";
    }
    return null;
  };

  const renderBenefitColumn = (benefit: Benefit) => {
    const incompatibility = getIncompatibility(benefit);
    const details = benefit.details;

    return (
      <div key={benefit.id} className="flex flex-col h-full border border-border/60 rounded-xl overflow-hidden bg-card/50 relative">
        {incompatibility && (
          <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-[10px] font-bold text-center py-0.5 uppercase tracking-wider z-10">
            Incompatível: {incompatibility}
          </div>
        )}
        
        <div className={`p-4 border-b border-border/60 bg-muted/20 relative ${incompatibility ? 'pt-6' : ''}`}>
          <button 
            onClick={() => removeFromCompare(benefit.id)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-rose-500 transition-colors bg-background/50 rounded-full p-1 z-20"
          >
            <X className="h-4 w-4" />
          </button>
          <h3 className="font-bold text-lg leading-tight pr-6 break-words">{benefit.title}</h3>
          <p className="text-xs text-muted-foreground mt-1 font-medium">{benefit.providerDetails?.name || benefit.provider}</p>
          <div className="flex flex-wrap gap-1 mt-3">
            {benefit.targetGroups.slice(0, 2).map((group) => (
              <Badge key={group} variant="secondary" className="text-[10px] px-1.5 py-0">
                {group}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4 space-y-6 text-sm overflow-y-auto hide-scrollbar">
          {/* Modalidade e Valores */}
          <div>
            <h4 className="font-semibold text-muted-foreground mb-2 text-xs uppercase tracking-wider">Modalidade e Custos</h4>
            {details ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {details.modality === "Online" ? <MonitorSmartphone className="h-4 w-4 text-primary" /> : <MapPin className="h-4 w-4 text-primary" />}
                  <span>{details.modality}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{details.estimatedTime}</span>
                </div>
                {details.isFree ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mt-1">Gratuito</Badge>
                ) : (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 mt-1">Possui Taxas</Badge>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground italic">Não especificado</span>
            )}
          </div>

          {/* Requisitos */}
          <div>
            <h4 className="font-semibold text-muted-foreground mb-2 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" /> Principais Requisitos
            </h4>
            {!benefit.requirements || Object.keys(benefit.requirements).length === 0 ? (
              <span className="text-muted-foreground italic">Público geral</span>
            ) : (
              <ul className="space-y-1.5">
                {benefit.requirements.maxIncome && (
                  <li className="flex items-start gap-2">
                    <span className="shrink-0 text-primary font-medium">•</span>
                    <span>Renda Per Capita até R$ {benefit.requirements.maxIncome}</span>
                  </li>
                )}
                {benefit.requirements.requiresCadUnico && (
                  <li className="flex items-start gap-2">
                    <span className="shrink-0 text-primary font-medium">•</span>
                    <span>Inscrição no CadÚnico</span>
                  </li>
                )}
                {benefit.requirements.minAge && (
                  <li className="flex items-start gap-2">
                    <span className="shrink-0 text-primary font-medium">•</span>
                    <span>A partir de {benefit.requirements.minAge} anos</span>
                  </li>
                )}
                {benefit.requirements.requiresStudent && (
                  <li className="flex items-start gap-2">
                    <span className="shrink-0 text-primary font-medium">•</span>
                    <span>Ser Estudante</span>
                  </li>
                )}
                {benefit.requirements.requiresPcD && (
                  <li className="flex items-start gap-2">
                    <span className="shrink-0 text-primary font-medium">•</span>
                    <span>Ser Pessoa com Deficiência</span>
                  </li>
                )}
                {benefit.requirements.requiresPregnant && (
                  <li className="flex items-start gap-2">
                    <span className="shrink-0 text-primary font-medium">•</span>
                    <span>Ser Gestante</span>
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* Documentos */}
          <div>
            <h4 className="font-semibold text-muted-foreground mb-2 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Documentos Chave
            </h4>
            {benefit.documents && benefit.documents.length > 0 ? (
              <ul className="space-y-1.5 line-clamp-4 hover:line-clamp-none transition-all">
                {benefit.documents.slice(0, 3).map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="shrink-0 text-muted-foreground font-medium">-</span>
                    <span className="text-xs">{doc.name} {doc.isOptional && "(Opcional)"}</span>
                  </li>
                ))}
                {benefit.documents.length > 3 && (
                  <li className="text-xs text-primary font-medium mt-1 cursor-pointer">
                    + {benefit.documents.length - 3} documentos...
                  </li>
                )}
              </ul>
            ) : (
              <span className="text-muted-foreground italic">Não listado</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="w-[95vw] max-w-[95vw] md:w-[90vw] md:max-w-6xl lg:max-w-7xl max-h-[90vh] overflow-hidden flex flex-col gap-0 p-0 sm:rounded-2xl">
        <DialogHeader className="p-6 border-b border-border/60 bg-muted/10 shrink-0">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            Comparação de Benefícios
          </DialogTitle>
          <DialogDescription>
            Analisando {benefits.length} {benefits.length === 1 ? 'benefício' : 'benefícios'} lado a lado.
          </DialogDescription>
        </DialogHeader>

        {/* Alertas de Conflito de Elegibilidade (R044) */}
        {currentConflicts.length > 0 && (
          <div className="bg-destructive/10 border-b border-destructive/20 p-4 shrink-0 shadow-inner">
            {currentConflicts.map((conflict, idx) => (
              <div key={idx} className="flex gap-3 items-start md:items-center max-w-5xl mx-auto">
                <div className="bg-destructive/20 p-2 rounded-full shrink-0 mt-1 md:mt-0">
                  <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400" />
                </div>
                <div>
                  <h4 className="text-red-600 dark:text-red-400 font-bold text-sm">Atenção: Incompatibilidade Legal Encontrada</h4>
                  <p className="text-sm text-red-600/80 dark:text-red-400/80 font-medium mt-0.5">
                    A lei não permite receber o <strong className="font-extrabold">{conflict.benefitA.title}</strong> e o <strong className="font-extrabold">{conflict.benefitB.title}</strong> ao mesmo tempo. Solicitar ambos pode causar o cancelamento de um deles. Em caso de dúvida, procure o órgão responsável ({conflict.benefitA.orgaoResponsavel || conflict.benefitA.provider} / {conflict.benefitB.orgaoResponsavel || conflict.benefitB.provider}).
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Desktop View (Grid Lado a Lado) */}
        <div className="hidden md:grid gap-6 p-6 overflow-y-auto bg-background/50 h-full" style={{ gridTemplateColumns: `repeat(${benefits.length}, minmax(0, 1fr))` }}>
          {benefits.map(renderBenefitColumn)}
        </div>

        {/* Mobile View (Tabs) */}
        <div className="md:hidden flex flex-col h-full overflow-hidden p-4 bg-background/50">
          <Tabs defaultValue={benefits[0]?.id} className="w-full h-full flex flex-col">
            <TabsList className="w-full bg-muted/50 overflow-x-auto hide-scrollbar justify-start mb-4">
              {benefits.map((benefit, index) => (
                <TabsTrigger key={benefit.id} value={benefit.id} className="text-xs font-medium min-w-fit px-3">
                  Ben. {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex-1 overflow-hidden relative">
              {benefits.map((benefit) => (
                <TabsContent key={benefit.id} value={benefit.id} className="h-full m-0 data-[state=inactive]:hidden outline-none h-full absolute inset-0 pb-16">
                  {renderBenefitColumn(benefit)}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
