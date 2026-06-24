"use client";

import { useMemo } from "react";
import { Bell, BellOff, BellRing, Trash2, CalendarClock } from "lucide-react";
import { useApplicationStore } from "@/store/useApplicationStore";
import { mockBenefits } from "@/data/mockBenefits";
import { getBenefitTimeStatus } from "@/lib/dateUtils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";

export default function AlertasPage() {
  const { alerts, alertsPaused, toggleAlert, togglePauseAlerts } = useApplicationStore();

  const monitoredBenefits = useMemo(() => {
    return mockBenefits
      .filter((b) => alerts.includes(b.id))
      .map((b) => {
        const timeStatus = getBenefitTimeStatus(b.enrollmentPeriod);
        return { ...b, timeStatus };
      });
  }, [alerts]);

  const activeAlerts = monitoredBenefits.filter(b => !b.timeStatus.isClosedMoreThan30Days);
  const expiredAlerts = monitoredBenefits.filter(b => b.timeStatus.isClosedMoreThan30Days);

  const clearExpired = () => {
    expiredAlerts.forEach(b => toggleAlert(b.id));
    toast.success("Alertas antigos removidos com sucesso.");
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto py-10 px-4 md:px-8 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-full">
            <BellRing className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Central de Alertas</h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Gerencie os avisos sobre a abertura de editais, auxílios e bolsas. Nós avisaremos você quando o prazo começar.
        </p>
      </div>

      <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-lg font-bold flex items-center gap-2">
            Privacidade e Alertas
            {alertsPaused && <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">Pausado</Badge>}
          </h2>
          <p className="text-sm text-muted-foreground">
            {alertsPaused 
              ? "Você pausou todas as notificações. Nenhum alerta será enviado." 
              : "As notificações do navegador estão sendo gerenciadas por esta central."}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Label htmlFor="pause-alerts" className="text-sm font-medium cursor-pointer">
            {alertsPaused ? "Retomar Avisos" : "Pausar Avisos"}
          </Label>
          <Switch 
            id="pause-alerts" 
            checked={alertsPaused} 
            onCheckedChange={togglePauseAlerts} 
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold border-b pb-2 flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-primary" />
          Editais Monitorados
          <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">{activeAlerts.length}</Badge>
        </h3>

        {activeAlerts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground border border-dashed rounded-xl bg-card/30">
            <BellOff className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg">Você não está monitorando nenhum edital no momento.</p>
            <p className="text-sm mt-2">Navegue pelos benefícios e clique no sininho para ser avisado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {activeAlerts.map(benefit => (
                <motion.div
                  key={benefit.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="h-full border-border/50 hover:border-primary/30 transition-colors shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                    <CardContent className="p-5 flex flex-col h-full gap-4">
                      <div className="flex justify-between items-start gap-4">
                        <Link href={`/beneficios/${benefit.id}`} className="font-bold text-lg hover:underline decoration-primary underline-offset-2 line-clamp-2">
                          {benefit.title}
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 -mt-1 -mr-1"
                          onClick={() => toggleAlert(benefit.id)}
                          title="Remover alerta"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="mt-auto">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status Atual</span>
                        <div className="mt-1">
                          {benefit.timeStatus.status === "Fechado" ? (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Aguardando Abertura</Badge>
                          ) : benefit.timeStatus.status === "Aberto" ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Inscrições Abertas!</Badge>
                          ) : (
                            <Badge variant="outline">Fluxo Contínuo</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {expiredAlerts.length > 0 && (
          <div className="mt-12 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-bold flex items-center gap-2 text-muted-foreground">
                <Trash2 className="w-4 h-4" />
                Alertas Expirados
              </h3>
              <Button variant="outline" size="sm" className="text-xs text-destructive hover:bg-destructive hover:text-white" onClick={clearExpired}>
                Limpar Histórico
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60 grayscale">
              {expiredAlerts.map(benefit => (
                <Card key={benefit.id} className="border-dashed bg-muted/50">
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <span className="text-sm font-medium line-clamp-1">{benefit.title}</span>
                    <Badge variant="secondary" className="text-[10px]">Encerrado</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
