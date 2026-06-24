"use client";

import { Benefit } from "@/data/mockBenefits";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, GraduationCap, HeartPulse, Bus, Home, Info, Landmark, Clock, CalendarX2, CalendarCheck2, Timer, Star, Share2, MessageCircle, Bell, BellRing, Scale, Check } from "lucide-react";
import { getBenefitTimeStatus } from "@/lib/dateUtils";
import { requestNotificationPermission, sendMockPushNotification } from "@/lib/notifications";
import { Button } from "@/components/ui/button";
import { HighlightText } from "@/components/ui/highlight-text";
import { useApplicationStore } from "@/store/useApplicationStore";
import { toast } from "sonner";
import { BenefitDetailsSheet } from "./BenefitDetailsSheet";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { motion, Variants } from "framer-motion";
import { useCompareStore } from "@/store/useCompareStore";
import { useAccessibilityStore } from "@/store/useAccessibilityStore";
import { useProfileStore } from "@/store/useProfileStore";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

interface BenefitCardProps {
  benefit: Benefit;
  searchQuery?: string;
}

export function BenefitCard({ benefit, searchQuery }: BenefitCardProps) {
  const getIcon = (type: Benefit["iconType"]) => {
    switch (type) {
      case "money": return <Coins className="h-5 w-5 text-green-500" />;
      case "education": return <GraduationCap className="h-5 w-5 text-blue-500" />;
      case "health": return <HeartPulse className="h-5 w-5 text-red-500" />;
      case "transport": return <Bus className="h-5 w-5 text-yellow-500" />;
      case "housing": return <Home className="h-5 w-5 text-purple-500" />;
      default: return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const timeStatus = getBenefitTimeStatus(benefit.enrollmentPeriod);
  const { toggleFavorite, alerts, toggleAlert } = useApplicationStore();
  const favorites = useApplicationStore((state) => state.favorites) || [];
  const isAuthenticated = useProfileStore((state) => state.isAuthenticated);
  const { compareList, addToCompare, removeFromCompare } = useCompareStore();
  const { isSimplifiedMode } = useAccessibilityStore();
  const isFavorite = favorites.includes(benefit.id);
  const isAlertActive = alerts.includes(benefit.id);
  const inCompareList = compareList.includes(benefit.id);
  const compareDisabled = !inCompareList && compareList.length >= 3;
  
  const canHaveAlert = !!benefit.enrollmentPeriod && timeStatus.status !== "Fluxo Contínuo";

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Crie uma conta gratuita para salvar este item nos seus favoritos!");
      return;
    }
    
    toggleFavorite(benefit.id);
    if (!isFavorite) {
      toast.success("Salvo nos favoritos", {
        description: benefit.title
      });
    } else {
      toast("Removido dos favoritos", {
        description: benefit.title
      });
    }
  };

  const handleAlertClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAlertActive) {
      const permission = await requestNotificationPermission();
      if (permission === "granted") {
        toggleAlert(benefit.id);
        sendMockPushNotification(
          "Alerta Configurado!",
          `Você será avisado quando as inscrições para "${benefit.title}" abrirem.`,
          window.location.origin + `/beneficios/${benefit.id}`
        );
        toast.success("Alerta ativado com sucesso!");
      } else {
        toast.error("Permissão negada. Ative as notificações no navegador.");
      }
    } else {
      toggleAlert(benefit.id);
      toast("Alerta desativado", { description: benefit.title });
    }
  };

  const getShareUrl = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/beneficios/${benefit.id}`;
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = getShareUrl();
    const shareText = `Olha esse direito: ${benefit.title}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: benefit.title,
          text: shareText,
          url: url,
        });
      } catch (error) {
        // Usuário cancelou ou houve erro ignorável
      }
    } else {
      navigator.clipboard.writeText(`${shareText}\n${url}`);
      toast.success("Link copiado!", { 
        description: "O link foi copiado para sua área de transferência." 
      });
    }
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = getShareUrl();
    const shareText = `Olha esse direito: ${benefit.title}\n\nSaiba mais acessando aqui: ${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -2 }}
      className="h-full"
    >
      <Card className={`flex flex-col h-full bg-card/60 backdrop-blur-sm transition-colors shadow-sm hover:shadow-md relative ${benefit.relevanceScore && benefit.relevanceScore >= 10 ? 'border-emerald-500/50 ring-2 ring-emerald-500/50 shadow-emerald-900/10' : 'border-border/30 hover:border-primary/40'}`}>
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          {canHaveAlert && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAlertClick}
              aria-label={isAlertActive ? "Remover Alerta" : "Me avise quando abrir"}
              className={`h-8 w-8 rounded-full transition-colors bg-background/50 backdrop-blur-sm ${
                isAlertActive ? "text-primary hover:text-primary/80 hover:bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              title={isAlertActive ? "Remover Alerta" : "Me avise quando abrir"}
            >
              {isAlertActive ? <BellRing className="h-4 w-4 fill-primary text-primary animate-pulse" /> : <Bell className="h-4 w-4" />}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleWhatsApp}
            aria-label="Compartilhar no WhatsApp"
            className="h-8 w-8 rounded-full text-green-600 hover:text-green-700 hover:bg-green-500/10 transition-colors bg-background/50 backdrop-blur-sm"
            title="Compartilhar no WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            aria-label="Compartilhar"
            className="h-8 w-8 rounded-full text-blue-600 hover:text-blue-700 hover:bg-blue-500/10 transition-colors bg-background/50 backdrop-blur-sm"
            title="Compartilhar"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavoriteClick}
            className={`h-8 w-8 rounded-full transition-colors bg-background/50 backdrop-blur-sm ${
              !isAuthenticated ? "opacity-60 hover:opacity-100" : ""
            } ${
              isFavorite ? "text-yellow-500 hover:text-yellow-600 hover:bg-yellow-500/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            title={!isAuthenticated ? "Requer conta: Salvar Favorito" : "Salvar Favorito"}
          >
            <Star className={`h-4 w-4 ${isFavorite ? "fill-yellow-500 text-yellow-500" : ""}`} />
          </Button>
        </div>
        
      <CardHeader className="pb-3 flex-row items-start justify-between gap-4 space-y-0 relative mt-4">
        <div className="space-y-1 pr-6">
          {benefit.relevanceScore && benefit.relevanceScore >= 10 && (
            <Badge variant="default" className="absolute -top-3 -left-3 bg-emerald-500 hover:bg-emerald-600 text-white shadow-md px-2.5 py-0.5 text-[11px] uppercase tracking-wider">
              ⭐ Recomendado para você
            </Badge>
          )}
          
          <CardTitle className="text-xl leading-tight mt-1">
            <HighlightText text={benefit.title} query={searchQuery} />
          </CardTitle>
          
          <div className="flex items-center gap-2 mt-2 pt-1">
            <div className="bg-muted p-1.5 rounded-md shrink-0 flex items-center justify-center border border-border">
              <Landmark className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium leading-none mb-1">
                {benefit.providerDetails?.name || benefit.provider}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {benefit.providerDetails?.sphere && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 w-fit uppercase tracking-wider bg-background border-border/50">
                    {benefit.providerDetails.sphere}
                  </Badge>
                )}
                <TrustBadge 
                  lastValidatedAt={benefit.lastValidatedAt} 
                  sourceType={benefit.sourceType} 
                  showText={false}
                  className="h-5 py-0 px-1.5"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-muted/50 p-2 rounded-full shrink-0">
          {getIcon(benefit.iconType)}
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <CardDescription className={isSimplifiedMode ? "text-lg text-foreground leading-loose tracking-wide line-clamp-3" : "text-sm text-foreground/80 line-clamp-3"}>
          <HighlightText text={isSimplifiedMode && benefit.simplifiedDescription ? benefit.simplifiedDescription : benefit.description} query={searchQuery} />
        </CardDescription>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {benefit.targetGroups.map((group) => (
            <Badge key={group} variant="secondary" className="font-normal text-xs bg-secondary/60">
              {group}
            </Badge>
          ))}
        </div>

        {benefit.enrollmentPeriod && (
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {timeStatus.status === "Aberto" && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50">
                  <CalendarCheck2 className="w-3 h-3 mr-1" /> Aberto
                </Badge>
              )}
              {timeStatus.status === "Fechado" && (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50">
                  <CalendarX2 className="w-3 h-3 mr-1" /> Fechado
                </Badge>
              )}
              {timeStatus.status === "Fluxo Contínuo" && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50">
                  <Clock className="w-3 h-3 mr-1" /> Fluxo Contínuo
                </Badge>
              )}
              
              {timeStatus.formattedEndDate && timeStatus.status !== "Fechado" && (
                <span className="text-xs font-medium text-muted-foreground">
                  até {timeStatus.formattedEndDate}
                </span>
              )}
            </div>

            {timeStatus.status === "Aberto" && timeStatus.hoursLeft !== undefined && (
              <>
                {timeStatus.hoursLeft < 48 ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 animate-pulse bg-red-50 dark:bg-red-900/10 p-1.5 rounded w-fit border border-red-100 dark:border-red-900/30">
                    <Timer className="w-3.5 h-3.5" /> Termina em {timeStatus.hoursLeft} horas!
                  </div>
                ) : timeStatus.daysLeft !== undefined && timeStatus.daysLeft < 7 ? (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/10 p-1.5 rounded w-fit border border-amber-100 dark:border-amber-900/30">
                    <Clock className="w-3.5 h-3.5" /> Vence em {timeStatus.daysLeft} dias
                  </div>
                ) : null}
              </>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex gap-2 w-full">
        <BenefitDetailsSheet benefit={benefit}>
          <Button variant="outline" className="flex-1 text-primary hover:bg-primary/5 hover:text-primary border-primary/20">
            Ver detalhes
          </Button>
        </BenefitDetailsSheet>
        <Button 
          variant={inCompareList ? "default" : "secondary"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            inCompareList ? removeFromCompare(benefit.id) : addToCompare(benefit.id);
          }}
          disabled={compareDisabled}
          title={compareDisabled ? "Limite de 3 comparações atingido" : inCompareList ? "Remover da comparação" : "Adicionar à comparação"}
          className={`shrink-0 transition-all ${inCompareList ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" : "bg-muted hover:bg-muted/80 text-muted-foreground"}`}
        >
          {inCompareList ? <Check className="h-4 w-4 mr-2" /> : <Scale className="h-4 w-4 mr-2" />}
          <span className="hidden sm:inline">{inCompareList ? "Adicionado" : "Comparar"}</span>
        </Button>
      </CardFooter>
    </Card>
    </motion.div>
  );
}
