"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, X, ExternalLink, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function FraudAlertBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isVisible) return null;

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full z-40 bg-amber-900 border-b border-amber-500/20 backdrop-blur-md text-white"
          >
            <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 max-w-7xl">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500/20 p-2 rounded-full shrink-0">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-sm font-medium">
                  <span className="font-bold mr-1">🚨 FALSO: Recadastramento de Benefícios.</span>
                  Esta mensagem é um golpe. O governo NÃO está oferecendo este benefício. Cuidado com links falsos no WhatsApp.
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto self-end sm:self-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-transparent border-white/30 hover:bg-white/20 text-white"
                  onClick={() => setIsModalOpen(true)}
                >
                  Entenda o Golpe
                </Button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md p-1.5 text-white/80 hover:text-white hover:bg-white/20 shrink-0 transition-colors focus:outline-none"
                  onClick={() => setIsVisible(false)}
                >
                  <X className="w-4 h-4" />
                  <span className="sr-only">Fechar</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] border-amber-500/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-amber-600 dark:text-amber-500">
              <AlertTriangle className="w-6 h-6" />
              Alerta de Phishing (Golpe)
            </DialogTitle>
            <DialogDescription className="text-base text-foreground mt-2">
              Golpistas estão enviando mensagens em massa pelo WhatsApp exigindo um falso "recadastramento" para não perder benefícios.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 my-4">
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg flex gap-3 items-start text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>
                <strong>ATENÇÃO:</strong> O Governo Federal <strong>NUNCA</strong> solicita senhas, códigos de verificação ou depósitos bancários via WhatsApp ou SMS.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-destructive/30 bg-destructive/5 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-destructive font-semibold text-sm mb-1">
                  <XCircle className="w-4 h-4" />
                  Link Falso (Golpe)
                </div>
                <code className="text-xs bg-background/50 px-2 py-1 rounded block truncate border">
                  www.gov-br-beneficios.com
                </code>
              </div>
              <div className="border border-emerald-500/30 bg-emerald-500/5 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500 font-semibold text-sm mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Link Oficial
                </div>
                <code className="text-xs bg-background/50 px-2 py-1 rounded block border">
                  www.gov.br
                </code>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Caí no golpe, e agora?</h4>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 ml-1">
                <li>Avise imediatamente o seu banco e bloqueie cartões.</li>
                <li>Registre um Boletim de Ocorrência (B.O.).</li>
                <li>Altere as senhas das suas contas (gov.br, e-mail).</li>
                <li>Não faça transferências para "recuperar" valores.</li>
              </ol>
            </div>
          </div>

          <div className="pt-4 border-t flex flex-col sm:flex-row justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Entendi, fechar
            </Button>
            <Button variant="destructive" className="gap-2" nativeButton={false} render={<a href="/denuncias" />}>
              <ShieldAlert className="w-4 h-4" />
              Denunciar Site Suspeito
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
