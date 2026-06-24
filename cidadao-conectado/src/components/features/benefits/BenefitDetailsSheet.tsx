"use client";

import { useState } from "react";
import { Benefit } from "@/data/mockBenefits";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useApplicationStore } from "@/store/useApplicationStore";
import { useProfileStore } from "@/store/useProfileStore";
import { useDocumentStore } from "@/store/useDocumentStore";
import { calculateDocumentStatus } from "@/lib/documents";
import { Clock, MonitorSmartphone, MapPin, AlertCircle, Phone, Globe, CheckCircle2, FileText, Copy, Check, ExternalLink, ShieldAlert, FileCheck, Info, Circle, CircleCheck, CheckCircle, Landmark, Mail, ShieldCheck, AlertTriangle, History, ChevronDown, HelpCircle, Volume2, VolumeX } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { HighlightText } from "@/components/ui/highlight-text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button, buttonVariants } from "@/components/ui/button";
import { ContentFeedback } from "@/components/ui/ContentFeedback";
import { BenefitFAQ } from "./BenefitFAQ";
import { AttendanceChecklist } from "./AttendanceChecklist";
import { ApprovalEstimate } from "./ApprovalEstimate";
import { ProcessTimeline } from "./ProcessTimeline";
import { AccessibilityPanel } from "@/components/features/accessibility/AccessibilityPanel";
import { useRecentStore } from "@/store/useRecentStore";
import { useAccessibilityStore } from "@/store/useAccessibilityStore";
import { useSpeech } from "@/hooks/useSpeech";
import { PetitionDownloadModule } from "./PetitionDownloadModule";
import { QRCodeShareModal } from "./QRCodeShareModal";

interface BenefitDetailsSheetProps {
  benefit: Benefit;
  children: React.ReactNode;
  nativeButton?: boolean;
}

export function BenefitDetailsSheet({ benefit, children, nativeButton = true }: BenefitDetailsSheetProps) {
  const { completedSteps, toggleStep, getProgress } = useApplicationStore();
  const { profile } = useProfileStore();
  const { documents } = useDocumentStore();
  const { addRecent } = useRecentStore();
  const { isSimplifiedMode } = useAccessibilityStore();
  const { speak, stop, isSpeaking } = useSpeech();
  const [copied, setCopied] = useState(false);
  const details = benefit.details;

  const expiredRequiredDocs = documents.filter(doc => 
    doc.affectedBenefits.includes(benefit.id) && 
    calculateDocumentStatus(doc.expirationDate) === 'expired'
  );

  const descriptionText = isSimplifiedMode && benefit.simplifiedDescription ? benefit.simplifiedDescription : benefit.description;

  const handleOpenChange = (open: boolean) => {
    if (open) {
      addRecent(benefit);
    }
  };

  const officialSite = benefit.providerDetails?.site;
  const isGovSite = officialSite && (officialSite.includes('.gov.br') || officialSite.includes('.jus.br') || officialSite.includes('.leg.br'));

  const handleCopyDocs = () => {
    if (!benefit.documents || benefit.documents.length === 0) return;
    
    let textToCopy = `Documentação para: ${benefit.title}\n\n`;
    benefit.documents.forEach(doc => {
      textToCopy += `- ${doc.name} ${doc.isOptional ? '(Opcional)' : ''}\n`;
    });
    
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalSteps = benefit.steps?.length || 0;
  const progress = totalSteps > 0 ? getProgress(benefit.id, totalSteps) : 0;

  const hasDocsOrSteps = (benefit.steps && benefit.steps.length > 0) || (benefit.documents && benefit.documents.length > 0);

  let petitionCategory: "saude" | "educacao" | "previdencia" | null = null;
  if (benefit.iconType === "health") {
    petitionCategory = "saude";
  } else if (benefit.iconType === "education") {
    petitionCategory = "educacao";
  } else if (benefit.provider === "INSS" || benefit.id === "bpc") {
    petitionCategory = "previdencia";
  }

  if (!hasDocsOrSteps) {
    return (
      <Sheet onOpenChange={handleOpenChange}>
        <SheetTrigger nativeButton={nativeButton} render={children as React.ReactElement} />
        <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto overflow-x-hidden pr-6 pb-24 break-words">
          <SheetHeader>
            <SheetTitle>{benefit.title}</SheetTitle>
            <div className="flex items-start gap-2 mt-2">
              <SheetDescription className={isSimplifiedMode ? "text-lg text-foreground leading-loose tracking-wide mt-4" : ""}>
                {descriptionText}
              </SheetDescription>
              <Button 
                variant="outline" 
                size="icon" 
                aria-label={isSpeaking ? "Parar leitura" : "Ouvir texto"}
                className={`shrink-0 rounded-full mt-4 ${isSpeaking ? "bg-primary/10 text-primary border-primary/30 animate-pulse" : "text-muted-foreground"}`}
                onClick={() => isSpeaking ? stop() : speak(descriptionText)}
                title={isSpeaking ? "Parar leitura" : "Ouvir texto"}
              >
                {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          </SheetHeader>
          <div className="py-6 flex flex-col items-center justify-center text-center h-40">
            <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Os detalhes e passos para este benefício ainda não foram mapeados.</p>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet onOpenChange={handleOpenChange}>
      <SheetTrigger nativeButton={nativeButton} render={children as React.ReactElement} />
      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto overflow-x-hidden pr-6 pb-24 break-words">
        <SheetHeader className="pb-4 border-b border-border">
          {expiredRequiredDocs.length > 0 && (
            <div className="mb-4 bg-red-950/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-600 dark:text-red-400">Atenção: Ação Bloqueada</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Seu {expiredRequiredDocs[0].name} está vencido. Você não poderá solicitar este benefício até atualizá-lo na sua Carteira de Documentos.
                </p>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between w-full gap-2">
              <div className="flex items-center gap-2 flex-1">
                <SheetTitle className="text-2xl">{benefit.title}</SheetTitle>
                {benefit.updates && benefit.updates.length > 0 && (
                  <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 text-[10px] uppercase px-2 py-0 h-5 font-bold tracking-wider animate-pulse shrink-0">
                    Atualizado
                  </Badge>
                )}
              </div>
              <QRCodeShareModal benefitId={benefit.id} benefitTitle={benefit.title} />
            </div>
            
            <div className="flex">
              <TrustBadge 
                lastValidatedAt={benefit.lastValidatedAt} 
                sourceType={benefit.sourceType}
              />
            </div>
          </div>
          
          <div className="flex items-start gap-2 mt-2">
            <SheetDescription className={`flex-1 ${isSimplifiedMode ? "text-lg text-foreground leading-loose tracking-wide" : "text-base max-w-prose leading-relaxed"}`}>
              {descriptionText}
            </SheetDescription>
            <Button 
              variant="outline" 
              size="icon" 
              aria-label={isSpeaking ? "Parar leitura" : "Ouvir texto"}
              className={`shrink-0 rounded-full ${isSpeaking ? "bg-primary/10 text-primary border-primary/30 animate-pulse" : "text-muted-foreground"}`}
              onClick={() => isSpeaking ? stop() : speak(descriptionText)}
              title={isSpeaking ? "Parar leitura" : "Ouvir texto"}
            >
              {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>
          
          {details && (
            <>
              <div className="flex flex-wrap gap-2 mt-4 pt-2">
                <Badge variant="outline" className="flex items-center gap-1 bg-primary/5">
                  {details.modality === "Online" ? <MonitorSmartphone className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
                  {details.modality}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 bg-primary/5">
                  <Clock className="h-3.5 w-3.5" />
                  {details.estimatedTime}
                </Badge>
                {details.isFree ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                    Totalmente Gratuito
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400">
                    Possui Taxas
                  </Badge>
                )}
              </div>
              
              {!details.isFree && details.feesDescription && (
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/50 rounded-md text-sm text-yellow-800 dark:text-yellow-500 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>{details.feesDescription}</p>
                </div>
              )}
            </>
          )}

          {benefit.providerDetails && (
            <div className="mt-5 bg-muted/20 border border-border/60 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-primary/10 p-2 rounded-full shrink-0">
                  <Landmark className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm leading-tight">{benefit.providerDetails.name}</h4>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 mt-1 uppercase tracking-wider bg-background/50">
                    Esfera {benefit.providerDetails.sphere}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-border/50">
                {benefit.providerDetails.phone && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                    <span className="font-medium">{benefit.providerDetails.phone}</span>
                  </div>
                )}
                {benefit.providerDetails.openingHours && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                    <span>{benefit.providerDetails.openingHours}</span>
                  </div>
                )}
                {benefit.providerDetails.email && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                    <a href={`mailto:${benefit.providerDetails.email}`} className="hover:underline hover:text-primary break-all block w-full">{benefit.providerDetails.email}</a>
                  </div>
                )}
                {benefit.providerDetails.site && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Globe className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                    <a href={benefit.providerDetails.site} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-primary flex items-center gap-1 font-medium">
                      Site Oficial <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {benefit.agencyInfo?.accessibility && (
            <AccessibilityPanel accessibility={benefit.agencyInfo.accessibility} />
          )}
        </SheetHeader>

        <Tabs defaultValue="requisitos" className="w-full mt-6">
          <TabsList className="flex flex-wrap h-auto w-full justify-start gap-2 overflow-x-auto scrollbar-hide mb-6">
            <TabsTrigger value="requisitos" className="flex items-center justify-center gap-1.5 text-xs sm:text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" /> <span className="hidden sm:inline">Requisitos</span><span className="sm:hidden">Reqs</span>
            </TabsTrigger>
            <TabsTrigger value="passos" className="flex items-center justify-center gap-1.5 text-xs sm:text-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0" /> Guia
            </TabsTrigger>
            <TabsTrigger value="documentos" className="flex items-center justify-center gap-1.5 text-xs sm:text-sm">
              <FileText className="h-4 w-4 shrink-0" /> Docs
            </TabsTrigger>
            {benefit.faqs && benefit.faqs.length > 0 && (
              <TabsTrigger value="faq" className="flex items-center justify-center gap-1.5 text-xs sm:text-sm">
                <HelpCircle className="h-4 w-4 shrink-0" /> Dúvidas
              </TabsTrigger>
            )}
            {benefit.updates && benefit.updates.length > 0 && (
              <TabsTrigger value="historico" className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-rose-600 data-[state=active]:text-rose-700 dark:text-rose-400 dark:data-[state=active]:text-rose-300">
                <History className="h-4 w-4 shrink-0" /> Histórico
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="requisitos" className="space-y-6 mt-0 animate-in fade-in duration-300">
            <ApprovalEstimate benefit={benefit} />
            
            {benefit.requirements && Object.keys(benefit.requirements).length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Critérios de Elegibilidade</h3>
                </div>
                
                <ul className="space-y-3">
                  {Object.entries(benefit.requirements).map(([key, value]) => {
                    if (value === undefined || value === false || key === 'exceptions' || key === 'baseYear') return null;
                    if (key === 'targetGender' && value === 'All') return null;

                    let label = "";
                    let isMet: boolean | null = null; // null means we don't have this in profile to check

                    switch(key) {
                      case 'minAge': 
                        if (benefit.requirements?.maxAge !== undefined) return null; // Handled by maxAge
                        label = `Idade mínima: ${value} anos`;
                        isMet = profile?.age ? Number(profile.age) >= value : null;
                        break;
                      case 'maxAge':
                        if (benefit.requirements?.minAge !== undefined) {
                          label = `Idade entre ${benefit.requirements.minAge} e ${value} anos`;
                          isMet = profile?.age ? (Number(profile.age) >= benefit.requirements.minAge && Number(profile.age) <= value) : null;
                        } else {
                          label = `Idade máxima: ${value} anos`;
                          isMet = profile?.age ? Number(profile.age) <= value : null;
                        }
                        break;
                      case 'maxIncome':
                        label = `Renda familiar per capita de até R$ ${Number(value).toFixed(2).replace('.', ',')}`;
                        isMet = profile?.perCapitaIncome !== undefined ? profile.perCapitaIncome <= value : null;
                        break;
                      case 'requiresStudent':
                        label = `Estar matriculado em instituição de ensino`;
                        isMet = profile?.isStudent ?? null;
                        break;
                      case 'requiresPcD':
                        label = `Ser Pessoa com Deficiência (PcD)`;
                        isMet = profile?.isPcD ?? null;
                        break;
                      case 'requiresPregnant':
                        label = `Ser gestante`;
                        isMet = profile?.isPregnant ?? null;
                        break;
                      case 'targetGender':
                        label = `Público alvo: Mulheres / Identidade Feminina`; // Assuming usually used for women based on laws
                        if (value !== 'Feminino') label = `Público alvo: ${value}`;
                        isMet = profile?.gender ? profile.gender === value : null;
                        break;
                      case 'allowedGenders':
                        label = `Gêneros permitidos: ${(value as string[]).join(', ')}`;
                        isMet = profile?.gender ? (value as string[]).includes(profile.gender) : null;
                        break;
                      case 'allowedRaces':
                        label = `Raças/Etnias permitidas: ${(value as string[]).join(', ')}`;
                        isMet = profile?.race ? (value as string[]).includes(profile.race) : null;
                        break;
                      case 'requiresCadUnico':
                        // Handled separately below, or we can just render here
                        return null; 
                      default:
                        label = `${key}: ${value}`;
                        break;
                    }

                    if (!label) return null;

                    return (
                      <li key={key} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                        <div className="shrink-0 mt-0.5">
                          {isMet === true ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : isMet === false ? (
                            <Circle className="h-5 w-5 text-red-400 opacity-80" /> // Using red for not met helps user see what's failing
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground opacity-50" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{label}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {benefit.requirements.requiresCadUnico && (
                  <div className="mt-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                          Exige inscrição no Cadastro Único (CadÚnico)
                        </p>
                        <p className="text-xs text-blue-800/80 dark:text-blue-400/80">
                          É obrigatório estar com os dados atualizados nos últimos 2 anos.
                        </p>
                        <a 
                          href="https://cadunico.dataprev.gov.br/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline"
                        >
                          Saiba como se inscrever <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {benefit.requirements.exceptions && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground border border-border/50 max-w-prose">
                    <strong className="block mb-1 text-foreground">Exceções à Regra:</strong>
                    <span className="leading-relaxed">{benefit.requirements.exceptions}</span>
                  </div>
                )}

                {benefit.requirements.baseYear && (
                  <p className="text-xs text-muted-foreground mt-4 text-right">
                    * Valores referentes ao ano-base {benefit.requirements.baseYear}.
                  </p>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="passos" className="space-y-6 mt-0 animate-in fade-in duration-300">
            {!benefit.steps || benefit.steps.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                 <CheckCircle2 className="h-10 w-10 text-muted-foreground mb-3 opacity-50" />
                 <p className="text-muted-foreground">O passo a passo não está disponível no momento.</p>
               </div>
            ) : (
              <>
                {benefit.applicationSteps && benefit.applicationSteps.length > 0 && (
                  <div className="mb-8">
                    <ProcessTimeline steps={benefit.applicationSteps} />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      Como Solicitar
                    </h3>
                    <span className="text-sm font-medium text-muted-foreground">
                      {progress}% concluído
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500 ease-in-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {benefit.steps.map((step, index) => {
                    const stepId = `step-${index}`;
                    const isCompleted = (completedSteps[benefit.id] || []).includes(stepId);
                    
                    return (
                      <div 
                        key={index} 
                        className={`flex gap-4 p-4 rounded-lg border transition-colors ${
                          isCompleted ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          <Checkbox 
                            id={`check-${benefit.id}-${index}`}
                            checked={isCompleted}
                            onCheckedChange={() => toggleStep(benefit.id, stepId)}
                            className="h-5 w-5"
                          />
                        </div>
                        <div className="space-y-1.5 flex-1 max-w-prose">
                          <label 
                            htmlFor={`check-${benefit.id}-${index}`}
                            className={`font-medium text-base cursor-pointer leading-relaxed ${isCompleted ? 'text-primary line-through opacity-70' : ''}`}
                          >
                            {index + 1}. {step}
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {details?.channels && details.channels.length > 0 && (
              <div className="pt-4 border-t border-border">
                <h3 className="font-semibold text-lg mb-4">Canais de Atendimento</h3>
                <div className="space-y-3">
                  {details.channels.map((channel, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg">
                      <div className="bg-background p-2 rounded-full shrink-0 shadow-sm">
                        {channel.type === "Telefone" && <Phone className="h-4 w-4 text-primary" />}
                        {channel.type === "Site" && <Globe className="h-4 w-4 text-primary" />}
                        {channel.type === "Presencial" && <MapPin className="h-4 w-4 text-primary" />}
                        {channel.type === "Aplicativo" && <MonitorSmartphone className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{channel.type}</span>
                        {channel.link ? (
                          <a href={channel.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">
                            {channel.value}
                          </a>
                        ) : (
                          <span className="text-sm font-medium">{channel.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {progress === 100 && (
              <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-lg flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />
                <h4 className="font-bold text-green-800 dark:text-green-400">Parabéns!</h4>
                <p className="text-sm text-green-700 dark:text-green-500 mt-1">Você concluiu todos os passos para solicitar este benefício.</p>
              </div>
            )}

            {officialSite && isGovSite && (
              <div className="mt-8 pt-6 border-t border-border">
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-center">
                  <ShieldCheck className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h4 className="font-bold text-lg mb-2">Acesso Oficial</h4>
                  <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                    Realize a solicitação ou consulte mais informações diretamente no canal oficial seguro do governo.
                  </p>
                  <a 
                    href={officialSite} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={buttonVariants({ variant: "default", className: "w-full sm:w-auto min-h-[48px] h-12 px-8 text-base font-bold shadow-md hover:shadow-lg transition-all" })}
                  >
                    Acessar Portal Oficial <ExternalLink className="ml-2 h-5 w-5" />
                  </a>
                  <p className="text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Você está saindo para um site externo (Nova aba)
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="documentos" className="space-y-6 mt-0 animate-in fade-in duration-300">
            {!benefit.documents || benefit.documents.length === 0 ? (
               <div className="py-12 flex flex-col items-center justify-center text-center print:hidden">
                 <FileText className="h-10 w-10 text-muted-foreground mb-3 opacity-50" />
                 <p className="text-muted-foreground">A lista de documentos não está disponível no momento.</p>
               </div>
            ) : (
              <AttendanceChecklist 
                documents={benefit.documents} 
                agencyInfo={benefit.agencyInfo} 
                benefitTitle={benefit.title} 
              />
            )}
          </TabsContent>

          {benefit.faqs && benefit.faqs.length > 0 && (
            <TabsContent value="faq" className="mt-0 animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-muted-foreground" /> Perguntas Frequentes
                </h3>
              </div>
              <BenefitFAQ faqs={benefit.faqs} />
            </TabsContent>
          )}

          {benefit.updates && benefit.updates.length > 0 && (
            <TabsContent value="historico" className="space-y-6 mt-0 animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <History className="h-5 w-5 text-muted-foreground" /> Alterações Recentes
                </h3>
              </div>
              
              <div className="relative border-l border-border/60 ml-3 pl-6 space-y-8">
                {benefit.updates.map((update) => {
                  const updateDate = new Date(update.date + "T00:00:00");
                  
                  return (
                    <div key={update.id} className="relative">
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[30px] top-1 h-3 w-3 rounded-full border-2 border-background ${update.affectsEligibility ? 'bg-rose-500' : 'bg-primary'}`}></div>
                      
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="bg-muted text-xs font-medium">
                            {updateDate.toLocaleDateString("pt-BR")}
                          </Badge>
                          {update.affectsEligibility && (
                            <Badge variant="destructive" className="bg-rose-100 text-rose-800 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 text-[10px] px-1.5 py-0 h-4 uppercase tracking-wider">
                              Altera Regras
                            </Badge>
                          )}
                        </div>
                        
                        <h4 className="font-bold text-foreground">{update.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {update.description}
                        </p>
                        
                        {update.previousText && (
                          <details className="mt-3 group rounded-lg border border-border/60 bg-muted/20 overflow-hidden cursor-pointer open:bg-card">
                            <summary className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors select-none">
                              Ler o texto anterior à lei
                              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                            </summary>
                            <div className="p-3 pt-0 border-t border-border/40 text-xs text-muted-foreground/80 italic leading-relaxed">
                              {update.previousText}
                            </div>
                          </details>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          )}
        </Tabs>

        {petitionCategory && (
          <PetitionDownloadModule category={petitionCategory} />
        )}

        <div className="mt-8 pt-6 border-t border-border/60">
          <ContentFeedback itemId={`benefit-${benefit.id}`} itemTitle={benefit.title} itemType="benefit" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
