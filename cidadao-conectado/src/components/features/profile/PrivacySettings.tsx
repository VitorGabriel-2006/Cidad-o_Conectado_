"use client";

import { useProfileStore } from "@/store/useProfileStore";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ShieldAlert, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";

export function PrivacySettings() {
  const profile = useProfileStore((state) => state.profile);
  const updateConsent = useProfileStore((state) => state.updateConsent);
  const deleteAccount = useProfileStore((state) => state.deleteAccount);

  const consents = profile?.consents || {
    terms: false,
    privacy: false,
    notifications: false,
  };

  const formattedTimestamp = profile?.consentTimestamp
    ? new Date(profile.consentTimestamp).toLocaleString("pt-BR")
    : null;

  return (
    <div className="space-y-6">
      {/* Glassmorphism Container */}
      <Card className="backdrop-blur-xl bg-background/60 border-border/50 shadow-lg p-6 space-y-6 rounded-xl">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Central de Privacidade</h2>
          <p className="text-muted-foreground">
            Gerencie seus dados sensíveis e controle como suas informações são utilizadas.
          </p>
        </div>

        <Accordion className="w-full">
          <AccordionItem value="terms">
            <AccordionTrigger className="text-lg font-medium">Termos de Uso</AccordionTrigger>
            <AccordionContent className="space-y-2 text-muted-foreground">
              <p><strong>O que esperamos:</strong> Uso consciente dos nossos serviços, respeitando as leis vigentes.</p>
              <p><strong>Responsabilidades:</strong> Garantimos a disponibilidade do portal, mas não nos responsabilizamos por mau uso.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="privacy">
            <AccordionTrigger className="text-lg font-medium">Política de Privacidade</AccordionTrigger>
            <AccordionContent className="space-y-2 text-muted-foreground">
              <p><strong>O que coletamos:</strong> Apenas dados essenciais para calcular seus benefícios e fornecer serviços.</p>
              <p><strong>Como protegemos seus dados:</strong> Criptografia de ponta a ponta e acesso restrito.</p>
              <p><strong>Compartilhamento:</strong> Não vendemos seus dados. Só compartilhamos sob exigência legal.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="space-y-4 pt-4 border-t border-border/50">
          <h3 className="text-lg font-medium">Seus Consentimentos</h3>
          
          <div className="flex items-center justify-between p-4 bg-background/40 rounded-lg border border-border/50">
            <div className="space-y-0.5">
              <label className="text-base font-medium">Aceito os Termos de Uso</label>
              <p className="text-sm text-muted-foreground">Obrigatório para utilizar os serviços.</p>
            </div>
            <Switch
              checked={consents.terms}
              onCheckedChange={(val) => updateConsent("terms", val)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-background/40 rounded-lg border border-border/50">
            <div className="space-y-0.5">
              <label className="text-base font-medium">Aceito a Política de Privacidade</label>
              <p className="text-sm text-muted-foreground">Concordo com o processamento dos meus dados.</p>
            </div>
            <Switch
              checked={consents.privacy}
              onCheckedChange={(val) => updateConsent("privacy", val)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-background/40 rounded-lg border border-border/50">
            <div className="space-y-0.5">
              <label className="text-base font-medium">Notificações e Alertas</label>
              <p className="text-sm text-muted-foreground">Receber avisos sobre novos benefícios e prazos.</p>
            </div>
            <Switch
              checked={consents.notifications}
              onCheckedChange={(val) => updateConsent("notifications", val)}
            />
          </div>

          {formattedTimestamp && (
            <p className="text-xs text-muted-foreground mt-4 italic">
              Consentimento registrado em: {formattedTimestamp}
            </p>
          )}
        </div>

        {/* DPO Contact Card */}
        <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10 mt-6">
          <ShieldAlert className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-medium text-sm">Dúvidas sobre seus dados?</h4>
            <p className="text-sm text-muted-foreground">
              Fale com nosso Encarregado de Dados (DPO) através do email:{" "}
              <a href="mailto:dpo@portal.gov.br" className="text-primary hover:underline font-medium">
                dpo@portal.gov.br
              </a>
            </p>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <div className="border border-red-500/30 bg-red-950/10 rounded-lg p-6 space-y-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-semibold text-destructive">Zona de Perigo (Danger Zone)</h3>
            <p className="text-sm text-muted-foreground">
              A exclusão da sua conta apaga permanentemente todos os seus dados pessoais, histórico de navegação e estimativas de benefícios do nosso sistema.
            </p>
          </div>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="destructive" className="w-full sm:w-auto" />}>
            Excluir Minha Conta e Meus Dados
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação é irreversível. Todos os seus dados, histórico e estimativas serão apagados permanentemente de nossos servidores.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={deleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Sim, Excluir Meus Dados
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
