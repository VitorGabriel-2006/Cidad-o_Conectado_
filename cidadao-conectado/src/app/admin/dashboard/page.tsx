import { SocialImpactDashboard } from "@/components/features/admin/SocialImpactDashboard";

export const metadata = {
  title: "Dashboard de Impacto Social | Cidadão Conectado",
  description: "Painel Administrativo de Inteligência de Dados Públicos",
};

export default function DashboardPage() {
  return (
    <main className="flex-1 flex flex-col p-4 md:p-8 bg-muted/10 w-full max-w-screen-2xl mx-auto">
      <SocialImpactDashboard />
    </main>
  );
}
