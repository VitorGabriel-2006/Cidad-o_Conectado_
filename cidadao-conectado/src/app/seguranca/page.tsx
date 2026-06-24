import { SecuritySettings } from "@/components/features/security/SecuritySettings";
import { LinkVerifier } from "@/components/features/security/LinkVerifier";
import { PrivacySettings } from "@/components/features/profile/PrivacySettings";
import { ShieldCheck, Link2, MonitorDot, Lock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthGuard } from "@/components/layout/AuthGuard";

export default function SecurityPage() {
  return (
    <main className="flex-1 flex flex-col relative bg-transparent px-4 md:px-8 py-8 w-full max-w-screen-2xl mx-auto">
      <div className="mb-8 max-w-5xl mx-auto w-full">
        <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-primary" />
          Central de Segurança e Privacidade
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Monitore o acesso à sua conta, valide links suspeitos e gerencie seus dados sensíveis.
        </p>
      </div>

      <div className="w-full max-w-5xl mx-auto space-y-8">
        <Tabs defaultValue="history" className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto p-1 bg-muted/50 border border-border/50 rounded-xl">
            <TabsTrigger value="history" className="flex items-center gap-2 py-3 rounded-lg">
              <MonitorDot className="w-4 h-4 shrink-0" />
              Sessões e Histórico
            </TabsTrigger>
            <TabsTrigger value="verifier" className="flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-700 dark:data-[state=active]:text-amber-400">
              <Link2 className="w-4 h-4 shrink-0" />
              Verificador de Links
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2 py-3 rounded-lg">
              <Lock className="w-4 h-4 shrink-0" />
              Central de Privacidade
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-0 outline-none">
            <AuthGuard>
              <SecuritySettings />
            </AuthGuard>
          </TabsContent>

          <TabsContent value="verifier" className="mt-0 outline-none">
            <LinkVerifier />
          </TabsContent>

          <TabsContent value="privacy" className="mt-0 outline-none">
            <AuthGuard>
              <PrivacySettings />
            </AuthGuard>
          </TabsContent>
        </Tabs>

      </div>
    </main>
  );
}
