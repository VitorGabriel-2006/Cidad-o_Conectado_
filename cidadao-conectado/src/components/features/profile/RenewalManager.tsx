"use client";

import { useState } from "react";
import { useRenewalStore, RenewalItem } from "@/store/useRenewalStore";
import { mockBenefits } from "@/data/mockBenefits";
import { calculateExpirationDate, getRenewalStatus } from "@/lib/renewals";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Bell, BellOff, Trash2, ExternalLink, CalendarClock, Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export function RenewalManager() {
  const { renewals, addRenewal, removeRenewal, toggleNotifications } = useRenewalStore();
  
  const [selectedBenefit, setSelectedBenefit] = useState<string>("");
  const [lastDate, setLastDate] = useState<string>("");
  const [periodicity, setPeriodicity] = useState<string>("12");

  const handleAdd = () => {
    if (!selectedBenefit || !lastDate || !periodicity) {
      toast.error("Preencha todos os campos para cadastrar o alerta.");
      return;
    }

    addRenewal({
      benefitId: selectedBenefit,
      lastRenewalDate: lastDate,
      periodicityMonths: parseInt(periodicity, 10),
      notificationsEnabled: true
    });

    toast.success("Alerta de renovação configurado!");
    setSelectedBenefit("");
    setLastDate("");
  };

  // Avaliable benefits not already added
  const availableBenefits = mockBenefits.filter(b => !renewals.some(r => r.benefitId === b.id));

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-4 md:p-6 shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-2.5 rounded-xl">
          <CalendarClock className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Prazos de Renovação</h2>
          <p className="text-sm text-muted-foreground">Seja avisado antes de perder o benefício.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-muted/30 p-4 rounded-xl border border-border/40">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="benefitSelect" className="text-xs text-muted-foreground uppercase tracking-wider">Benefício</Label>
          <Select value={selectedBenefit} onValueChange={setSelectedBenefit} name="benefitSelect">
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Selecione um benefício" />
            </SelectTrigger>
            <SelectContent>
              {availableBenefits.map(b => (
                <SelectItem key={b.id} value={b.id}>{b.title}</SelectItem>
              ))}
              {availableBenefits.length === 0 && (
                <SelectItem value="none" disabled>Nenhum benefício disponível</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastDate" className="text-xs text-muted-foreground uppercase tracking-wider">Data da Última</Label>
          <Input 
            id="lastDate"
            type="date" 
            value={lastDate} 
            onChange={(e) => setLastDate(e.target.value)}
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="periodicity" className="text-xs text-muted-foreground uppercase tracking-wider">Frequência</Label>
          <Select value={periodicity} onValueChange={setPeriodicity} name="periodicity">
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Frequência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Mensal</SelectItem>
              <SelectItem value="3">Trimestral</SelectItem>
              <SelectItem value="6">Semestral</SelectItem>
              <SelectItem value="12">Anual</SelectItem>
              <SelectItem value="24">A cada 2 anos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-4 flex justify-end mt-2">
          <Button onClick={handleAdd} disabled={!selectedBenefit || !lastDate}>
            Cadastrar Alerta
          </Button>
        </div>
      </div>

      {renewals.length > 0 ? (
        <div className="space-y-4">
          {renewals.map(renewal => {
            const benefit = mockBenefits.find(b => b.id === renewal.benefitId);
            if (!benefit) return null;

            const expDate = calculateExpirationDate(renewal.lastRenewalDate, renewal.periodicityMonths);
            const status = getRenewalStatus(expDate);
            
            return (
              <div key={renewal.id} className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl border transition-colors ${!renewal.notificationsEnabled ? 'bg-muted/20 opacity-70 grayscale' : 'bg-background hover:border-primary/30'} ${status.daysLeft < 0 ? 'border-destructive/50 bg-destructive/5' : ''}`}>
                <div className="flex-1 mb-4 md:mb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                    {status.daysLeft < 0 && <Badge variant="destructive" className="h-5 text-[10px]">Expirado</Badge>}
                    {status.daysLeft >= 0 && status.daysLeft <= 15 && <Badge variant="destructive" className="bg-amber-500 hover:bg-amber-600 h-5 text-[10px]">Próximo</Badge>}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                      <CalendarClock className="h-3.5 w-3.5" />
                      Vence em: <strong className={status.daysLeft <= 15 ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}>
                        {expDate.toLocaleDateString("pt-BR")}
                      </strong>
                    </span>
                    
                    {benefit.providerDetails?.site && (
                      <a href={benefit.providerDetails.site} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                        <ExternalLink className="h-3 w-3" /> Link Oficial
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
                  <div className="flex items-center gap-2 mr-2">
                    <Label htmlFor={`notif-${renewal.id}`} className="text-xs cursor-pointer flex items-center gap-1.5">
                      {renewal.notificationsEnabled ? <Bell className="h-3.5 w-3.5 text-primary" /> : <BellOff className="h-3.5 w-3.5 text-muted-foreground" />}
                      <span className="hidden sm:inline">{renewal.notificationsEnabled ? 'Alertas On' : 'Alertas Off'}</span>
                    </Label>
                    <Switch 
                      id={`notif-${renewal.id}`}
                      checked={renewal.notificationsEnabled}
                      onCheckedChange={() => {
                        toggleNotifications(renewal.id);
                        toast(renewal.notificationsEnabled ? "Notificações desativadas para " + benefit.title : "Notificações ativadas para " + benefit.title);
                      }}
                    />
                  </div>
                  
                  <Button variant="ghost" size="icon" aria-label="Remover alerta" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => removeRenewal(renewal.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 bg-muted/20 border border-dashed rounded-xl">
          <Info className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">Nenhuma renovação cadastrada.</p>
        </div>
      )}
    </div>
  );
}
