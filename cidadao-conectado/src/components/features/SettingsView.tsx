"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  Monitor, 
  Bell, 
  Shield, 
  Smartphone, 
  Trash2, 
  ExternalLink 
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { useAccessibilityStore } from "@/store/useAccessibilityStore";
import { useProfileStore } from "@/store/useProfileStore";
import Link from "next/link";

export function SettingsView() {
  const { theme, setTheme } = useTheme();
  const { zoomLevel, resetZoom, increaseZoom } = useAccessibilityStore();
  const isAuthenticated = useProfileStore((state) => state.isAuthenticated);
  const userAccount = useProfileStore((state) => state.userAccount);
  const logout = useProfileStore((state) => state.logout);
  
  const [mounted, setMounted] = useState(false);
  const [alertsCalamity, setAlertsCalamity] = useState(true);
  const [alertsBenefits, setAlertsBenefits] = useState(true);
  const [alertsCommunity, setAlertsCommunity] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHighContrast = theme === "high-contrast";
  const isLargeText = zoomLevel > 1;

  const handleHighContrastChange = (checked: boolean) => {
    if (checked) {
      setTheme("high-contrast");
    } else {
      setTheme("system");
    }
  };

  const handleLargeTextChange = (checked: boolean) => {
    if (checked) {
      resetZoom();
      increaseZoom();
    } else {
      resetZoom();
    }
  };

  const handleClearCache = () => {
    alert("Cache do aplicativo limpo com sucesso!");
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 p-4 md:p-6 pb-24">
      <div className="space-y-1 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie suas preferências de conta, aparência e notificações.
        </p>
      </div>

      {/* 1. Conta (Account) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Conta
          </CardTitle>
          <CardDescription>Informações básicas do seu perfil</CardDescription>
        </CardHeader>
        {!isAuthenticated ? (
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-lg">Você não está logado</h3>
                <p className="text-sm text-muted-foreground">Faça login para gerenciar sua conta e alertas.</p>
              </div>
              <Link href="/seguranca" className="w-full sm:w-auto">
                <Button className="w-full">
                  Fazer Login / Cadastrar
                </Button>
              </Link>
            </div>
          </CardContent>
        ) : (
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-primary/20">
                <AvatarImage src="" alt={userAccount?.name || "Usuário"} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {userAccount?.name?.substring(0, 2).toUpperCase() || "CC"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <h3 className="font-medium text-lg leading-none">{userAccount?.name || "Cidadão"}</h3>
                <p className="text-sm text-muted-foreground">{userAccount?.email || "Email não disponível"}</p>
              </div>
              <Link href="/perfil" className="hidden sm:block">
                <Button variant="outline" size="sm">
                  Editar Perfil
                </Button>
              </Link>
            </div>
            <Link href="/perfil" className="block sm:hidden">
              <Button variant="outline" className="w-full">
                Editar Perfil
              </Button>
            </Link>

            <div className="pt-4 border-t border-border">
              <Button 
                variant="destructive" 
                className="w-full sm:w-auto flex items-center gap-2"
                onClick={() => logout()}
              >
                <LogOut className="w-4 h-4" />
                Sair da Conta
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* 2. Aparência e Acessibilidade (Visual) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-primary" />
            Aparência e Acessibilidade
          </CardTitle>
          <CardDescription>Personalize como o aplicativo é exibido para você</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Tema do Aplicativo</label>
            <Select 
              value={mounted ? (theme === "high-contrast" ? "system" : theme) : "system"} 
              onValueChange={(val) => {
                if (val !== null) setTheme(val);
              }}
            >
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Selecione o tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <span className="flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    Claro
                  </span>
                </SelectItem>
                <SelectItem value="dark">
                  <span className="flex items-center gap-2">
                    <Moon className="w-4 h-4" />
                    Escuro
                  </span>
                </SelectItem>
                <SelectItem value="system">
                  <span className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    Automático do Sistema
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h4 className="text-sm font-medium text-foreground">Alto Contraste</h4>
                <p className="text-sm text-muted-foreground">Melhora a legibilidade com cores mais fortes</p>
              </div>
              <Switch checked={mounted ? isHighContrast : false} onCheckedChange={handleHighContrastChange} />
            </div>
            
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h4 className="text-sm font-medium text-foreground">Texto Grande</h4>
                <p className="text-sm text-muted-foreground">Aumenta o tamanho das fontes em todo o app</p>
              </div>
              <Switch checked={mounted ? isLargeText : false} onCheckedChange={handleLargeTextChange} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Notificações e Privacidade */}
      {isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notificações e Privacidade
            </CardTitle>
            <CardDescription>Gerencie quais alertas você deseja receber</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h4 className="text-sm font-medium text-foreground">Alertas de Calamidade</h4>
                <p className="text-sm text-muted-foreground">Avisos urgentes sobre sua região</p>
              </div>
              <Switch checked={alertsCalamity} onCheckedChange={setAlertsCalamity} />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h4 className="text-sm font-medium text-foreground">Lembretes de Benefícios</h4>
                <p className="text-sm text-muted-foreground">Prazos e novidades sobre seus auxílios</p>
              </div>
              <Switch checked={alertsBenefits} onCheckedChange={setAlertsBenefits} />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h4 className="text-sm font-medium text-foreground">Novidades da Comunidade</h4>
                <p className="text-sm text-muted-foreground">Eventos e informações do seu bairro</p>
              </div>
              <Switch checked={alertsCommunity} onCheckedChange={setAlertsCommunity} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* 4. Técnico / Sobre */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-primary" />
            Técnico e Sobre
          </CardTitle>
          <CardDescription>Manutenção e informações do aplicativo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h4 className="text-sm font-medium text-foreground">Cache do Aplicativo</h4>
              <p className="text-sm text-muted-foreground">Libere espaço no seu dispositivo</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleClearCache} className="gap-2">
              <Trash2 className="w-4 h-4" />
              Limpar Cache
            </Button>
          </div>

          <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-foreground">Versão do App</h4>
              <p className="text-sm text-muted-foreground">v1.0.0 (Build 42)</p>
            </div>
            <Button variant="link" className="p-0 h-auto gap-1 self-start sm:self-center text-primary">
              <Shield className="w-4 h-4" />
              Política de Privacidade
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
