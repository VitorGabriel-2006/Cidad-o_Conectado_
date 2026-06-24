import { CitizenshipDashboard } from "@/components/features/goals/CitizenshipDashboard";
import { Target } from "lucide-react";
import { AuthGuard } from "@/components/layout/AuthGuard";

export default function GoalsPage() {
  return (
    <AuthGuard>
      <main className="flex-1 flex flex-col relative bg-background px-4 md:px-8 py-8 w-full max-w-screen-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3">
            <Target className="h-8 w-8 text-primary" />
            Metas de Cidadania
          </h1>
          <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
            Sua jornada para conquistar e organizar seus direitos fundamentais. Guarde comprovantes com segurança local.
          </p>
        </div>

        <CitizenshipDashboard />
      </main>
    </AuthGuard>
  );
}
