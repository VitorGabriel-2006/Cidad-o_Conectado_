"use client";

import { useEffect, useState } from "react";
import { useSecurityStore } from "@/store/useSecurityStore";
import { Monitor, Smartphone, AlertTriangle, ShieldX, MapPin, Globe, History, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function SecuritySettings() {
  const { activeSessions, accessLogs, revokeSession, revokeAllOtherSessions } = useSecurityStore();
  const [hasAlerted, setHasAlerted] = useState(false);

  // Gatilho de Alerta Geográfico
  useEffect(() => {
    if (hasAlerted) return;

    // Encontra a sessão atual (simulada como a que tem isCurrentDevice)
    const currentSession = activeSessions.find(s => s.isCurrentDevice);
    
    if (currentSession) {
      // Procura sessões ativas com localização diferente
      const strangeSessions = activeSessions.filter(
        s => !s.isCurrentDevice && s.location !== currentSession.location
      );

      if (strangeSessions.length > 0) {
        strangeSessions.forEach(session => {
          toast.error(`Alerta de Segurança: Detectamos um novo acesso à sua conta a partir de ${session.location}. Se não foi você, encerre as sessões imediatamente.`, {
            duration: 8000,
            icon: <AlertTriangle className="w-5 h-5" />,
            style: { backgroundColor: '#ef4444', color: 'white', border: 'none' }
          });
        });
        setHasAlerted(true);
      }
    }
  }, [activeSessions, hasAlerted]);

  return (
    <div className="space-y-8">
      {/* Seção 1: Sessões Ativas */}
      <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Dispositivos Conectados
            </CardTitle>
            <CardDescription>
              Gerencie os aparelhos que estão com a sua conta logada neste momento.
            </CardDescription>
          </div>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={revokeAllOtherSessions}
            disabled={activeSessions.length <= 1}
            className="shrink-0 shadow-md shadow-rose-500/20"
          >
            <ShieldX className="w-4 h-4 mr-2" />
            Sair de todos os outros dispositivos
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeSessions.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">Nenhuma sessão ativa encontrada.</p>
          ) : (
            activeSessions.map((session) => (
              <div 
                key={session.id} 
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border ${
                  session.isCurrentDevice ? 'bg-primary/5 border-primary/20' : 'bg-background border-border/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-muted rounded-full shrink-0">
                    {session.deviceModel.toLowerCase().includes('iphone') || session.deviceModel.toLowerCase().includes('android') ? (
                      <Smartphone className="w-6 h-6 text-foreground/80" />
                    ) : (
                      <Monitor className="w-6 h-6 text-foreground/80" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold flex items-center gap-2">
                      {session.deviceModel}
                      {session.isCurrentDevice && (
                        <Badge variant="default" className="text-[10px] h-5 px-1.5 bg-emerald-500 hover:bg-emerald-600 border-none shadow-none text-white">
                          Neste aparelho
                        </Badge>
                      )}
                    </h4>
                    <div className="text-sm text-muted-foreground mt-1 space-y-0.5">
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> {session.location} ({session.ipAddress})
                      </p>
                      <p>Ativo: {session.lastActive}</p>
                    </div>
                  </div>
                </div>
                
                {!session.isCurrentDevice && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full sm:w-auto text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 border-rose-200 dark:border-rose-500/20"
                    onClick={() => revokeSession(session.id)}
                  >
                    <Ban className="w-4 h-4 mr-1.5" /> Desconectar
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Seção 2: Histórico de Acessos */}
      <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Histórico de Acessos (Últimos 90 dias)
          </CardTitle>
          <CardDescription>
            Registro completo de logins efetuados na sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-y border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Data e Hora</th>
                  <th className="px-6 py-4 font-medium">Dispositivo</th>
                  <th className="px-6 py-4 font-medium">IP</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {accessLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-6 py-4 text-muted-foreground">{log.deviceModel}</td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{log.ipAddress}</td>
                    <td className="px-6 py-4">
                      {log.status === 'Sucesso' ? (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20">
                          {log.status}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20">
                          {log.status}
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
