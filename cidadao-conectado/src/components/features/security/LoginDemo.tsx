"use client";

import { useState } from "react";
import { useSecurityStore } from "@/store/useSecurityStore";
import { ShieldAlert, Fingerprint, LockKeyhole, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export function LoginDemo() {
  const { failedLoginAttempts, incrementFailedAttempts, resetFailedAttempts } = useSecurityStore();
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isSimulatingValid, setIsSimulatingValid] = useState(false);

  const isBlocked = failedLoginAttempts >= 3;

  const handleSimulateError = () => {
    if (!isBlocked) {
      incrementFailedAttempts();
    }
  };

  const handleSimulateValid = () => {
    setIsSimulatingValid(true);
    setTimeout(() => {
      setIsSimulatingValid(false);
      resetFailedAttempts();
      setCaptchaVerified(false);
      alert("Login efetuado com sucesso!");
    }, 1000);
  };

  const handleCaptchaChange = (checked: boolean) => {
    if (checked) {
      setTimeout(() => {
        setCaptchaVerified(true);
        resetFailedAttempts();
      }, 800); // delayzinho para parecer que validou
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-sm relative overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Fingerprint className="w-6 h-6 text-primary" />
          <CardTitle>Mecanismo Antibot (Captcha)</CardTitle>
        </div>
        <CardDescription>
          Simule tentativas de login. Após 3 falhas consecutivas, o sistema acionará um bloqueio preventivo exigindo validação humana.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Status */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
          <span className="text-sm font-medium">Tentativas Falhas:</span>
          <span className={`text-xl font-bold ${isBlocked ? 'text-rose-500' : 'text-primary'}`}>
            {failedLoginAttempts} / 3
          </span>
        </div>

        {/* Captcha Box */}
        {isBlocked && !captchaVerified && (
          <div className="p-6 bg-background rounded-xl border-2 border-border/60 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-4">
              <Checkbox 
                id="captcha" 
                className="w-8 h-8 rounded-sm border-2" 
                onCheckedChange={handleCaptchaChange as any} 
              />
              <label htmlFor="captcha" className="font-medium text-lg cursor-pointer select-none">
                Não sou um robô
              </label>
            </div>
            <div className="flex flex-col items-center">
              <RefreshCw className="w-8 h-8 text-muted-foreground opacity-30 mb-1" />
              <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">reCAPTCHA</span>
            </div>
          </div>
        )}

        {/* Success Feedback after Captcha */}
        {captchaVerified && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-5 h-5" /> Identidade confirmada. Login desbloqueado.
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="default" 
            className="flex-1"
            onClick={handleSimulateValid}
            disabled={isBlocked && !captchaVerified}
          >
            {isSimulatingValid ? "Entrando..." : "Simular Login Válido"}
          </Button>
          
          <Button 
            variant="destructive" 
            className="flex-1"
            onClick={handleSimulateError}
            disabled={isBlocked && !captchaVerified}
          >
            <LockKeyhole className="w-4 h-4 mr-2" /> 
            Simular Erro de Senha
          </Button>
        </div>
        
        {isBlocked && !captchaVerified && (
          <div className="flex items-center justify-center gap-2 text-rose-500 text-sm font-medium mt-4">
            <ShieldAlert className="w-4 h-4" /> Conta temporariamente bloqueada por segurança.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
