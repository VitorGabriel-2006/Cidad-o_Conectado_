"use client";

import { useState } from "react";
import { ShieldCheck, ShieldAlert, AlertTriangle, Search, Trash2, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export function checkLinkSafety(url: string) {
  try {
    // Formatação básica para permitir parsing se o usuário não incluir o protocolo
    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    const parsedUrl = new URL(formattedUrl);
    const domain = parsedUrl.hostname.toLowerCase();
    
    // Lista simulada de domínios perigosos
    const maliciousDomains = ['sorteio-gov.com', 'auxilio-brasil-2026.net', 'ganhe-dinheiro-agora.site', 'premio-urgente.link', 'free-iphone.com', 'login-banco-falso.net'];
    
    // Perigo: Não é HTTPS ou está na lista de domínios maliciosos
    if (parsedUrl.protocol !== 'https:' || maliciousDomains.some(m => domain.includes(m))) {
      return { status: 'danger', isShortened: false };
    }
    
    // Atenção: Encurtadores conhecidos
    const shortenerDomains = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'buff.ly', 'ow.ly'];
    if (shortenerDomains.some(s => domain.includes(s))) {
      return { status: 'warning', isShortened: true };
    }
    
    // Seguro: Domínios do governo brasileiro
    if (domain.endsWith('gov.br')) {
      return { status: 'safe', isShortened: false };
    }
    
    // Default (Desconhecido)
    return { status: 'warning', isShortened: false };
  } catch (e) {
    return { status: 'invalid', isShortened: false };
  }
}

export function LinkVerifier() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<{ status: string, isShortened: boolean } | null>(null);

  const handleVerify = () => {
    if (!url.trim()) return;
    setResult(checkLinkSafety(url));
  };

  const handleClear = () => {
    setUrl("");
    setResult(null);
  };

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-sm overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-primary" />
          Verificador Anti-Phishing
        </CardTitle>
        <CardDescription>
          Cole um link recebido por SMS, WhatsApp ou e-mail para receber um veredito de segurança antes de acessá-lo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Ex: https://meu.inss.gov.br ou bit.ly/12345" 
              className="pl-9 h-12 text-base"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleVerify} className="h-12 px-6 font-semibold" disabled={!url.trim()}>
              Verificar
            </Button>
            {result && (
              <Button variant="outline" onClick={handleClear} className="h-12 px-4" title="Limpar">
                <Trash2 className="h-5 w-5 text-muted-foreground" />
              </Button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="pt-2"
            >
              {result.status === 'invalid' && (
                <div className="p-4 rounded-xl bg-muted text-muted-foreground border border-border flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 shrink-0" />
                  <div>
                    <h4 className="font-bold">Formato Inválido</h4>
                    <p className="text-sm">O texto inserido não parece ser um link válido. Tente novamente.</p>
                  </div>
                </div>
              )}

              {result.status === 'safe' && (
                <div className="p-4 rounded-xl bg-emerald-500 text-white shadow-md flex items-center gap-3">
                  <ShieldCheck className="h-8 w-8 shrink-0" />
                  <div>
                    <h4 className="font-bold">Verificado pelo Sistema - Ambiente Seguro</h4>
                    <p className="text-emerald-50 text-sm mt-0.5">Este é um domínio governamental oficial (.gov.br).</p>
                  </div>
                </div>
              )}

              {result.status === 'warning' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-amber-500 text-white shadow-md flex items-start gap-3">
                    <AlertTriangle className="h-8 w-8 shrink-0 mt-0.5" />
                    <div className="w-full">
                      <h4 className="font-bold">Link desconhecido ou encurtado. Prossiga com cautela.</h4>
                      <p className="text-amber-50 text-sm mt-0.5">Este link não é de um portal oficial reconhecido pelo nosso sistema.</p>
                      {result.isShortened && (
                        <div className="mt-4 p-3 bg-white/20 rounded-lg text-white text-sm font-medium flex items-center gap-2">
                          <LinkIcon className="h-4 w-4 shrink-0" />
                          Este é um link encurtado. Recomendamos que você acesse apenas portais oficiais do governo.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {result.status === 'danger' && (
                <div className="p-4 rounded-xl bg-red-600 text-white shadow-md flex items-start gap-3">
                  <ShieldAlert className="h-8 w-8 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold uppercase tracking-wide">BLOQUEADO</h4>
                    <p className="text-red-50 text-sm mt-1">Este link apresenta sinais de fraude ou conexão não segura. <strong>Não forneça seus dados.</strong></p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
