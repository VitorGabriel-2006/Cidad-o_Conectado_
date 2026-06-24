"use client";

import React, { useState } from "react";
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

export function SettingsView() {
  const [theme, setTheme] = useState<string>("system");
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  
  const [alertsCalamity, setAlertsCalamity] = useState(true);
  const [alertsBenefits, setAlertsBenefits] = useState(true);
  const [alertsCommunity, setAlertsCommunity] = useState(false);

  const handleClearCache = () => {
    alert("Cache do aplicativo limpo com sucesso!");
  };

  const handleLogout = () => {
    alert("Saindo da conta...");
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
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-primary/20">
              <AvatarImage src="" alt="Usuário" />
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <h3 className="font-medium text-lg leading-none">João da Silva</h3>
              <p className="text-sm text-muted-foreground">joao.silva@exemplo.com</p>
            </div>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              Editar Perfil
            </Button>
          </div>
          <Button variant="outline" className="w-full sm:hidden">
            Editar Perfil
          </Button>

          <div className="pt-4 border-t border-border">
            <Button 
              variant="destructive" 
              className="w-full sm:w-auto flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Sair da Conta
            </Button>
          </div>
        </CardContent>
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
              value={theme} 
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
              <Switch checked={highContrast} onCheckedChange={setHighContrast} />
            </div>
            
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h4 className="text-sm font-medium text-foreground">Texto Grande</h4>
                <p className="text-sm text-muted-foreground">Aumenta o tamanho das fontes em todo o app</p>
              </div>
              <Switch checked={largeText} onCheckedChange={setLargeText} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Notificações e Privacidade */}
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
