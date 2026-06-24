import { useProfileStore } from "@/store/useProfileStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, AlertTriangle, CheckCircle2, Info, ExternalLink, CalendarDays, HeartPulse } from "lucide-react";

export function TaxImpactCard() {
  const profile = useProfileStore((state) => state.profile);

  if (!profile || !profile.individualIncome) return null;

  // Parse individual income
  const incomeValue = parseInt(profile.individualIncome.replace(/\D/g, ""), 10) / 100;
  
  // Calculate annual income. If CLT or Aposentado, usually has 13th salary.
  const multiplier = (profile.occupation === "CLT" || profile.occupation === "Aposentado") ? 13 : 12;
  const annualIncome = incomeValue * multiplier;

  // 2024 Base Year Exemption Ceiling
  const EXEMPTION_CEILING = 30639.90;
  const isExempt = annualIncome <= EXEMPTION_CEILING;

  const formattedAnnualIncome = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(annualIncome);

  return (
    <Card className="border border-border/50 shadow-sm overflow-hidden bg-card mt-6">
      <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Análise Tributária (IRPF)</CardTitle>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Baseado na sua renda informada e regras da Receita Federal (Ano-base 2024).
        </p>
      </CardHeader>
      
      <CardContent className="pt-5 space-y-5">
        {/* Status Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status Estimado:</span>
          {isExempt ? (
             <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800 flex items-center gap-1.5 py-1">
               <CheckCircle2 className="h-3.5 w-3.5" /> Isento de Declaração
             </Badge>
          ) : (
             <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800 flex items-center gap-1.5 py-1">
               <AlertTriangle className="h-3.5 w-3.5" /> Obrigatoriedade Prevista
             </Badge>
          )}
        </div>

        {/* Breakdown */}
        <div className="bg-muted/30 rounded-lg p-3 text-sm flex justify-between border border-border/50">
           <span className="text-muted-foreground">Projeção Anual:</span>
           <span className="font-semibold">{formattedAnnualIncome}</span>
        </div>

        {/* Custom Occupation Alerts */}
        {profile.occupation === "MEI" && (
          <div className="flex items-start gap-2 text-sm bg-blue-50 dark:bg-blue-900/10 text-blue-800 dark:text-blue-300 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
            <Info className="h-4 w-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
            <p>
              <strong>Atenção MEI:</strong> Indepentende do IRPF pessoal, você é obrigado a entregar a <strong className="font-semibold">DASN-SIMEI</strong> (Declaração Anual do Simples Nacional) até 31 de maio.
            </p>
          </div>
        )}

        {profile.occupation === "Autônomo" && (
          <div className="flex items-start gap-2 text-sm bg-amber-50 dark:bg-amber-900/10 text-amber-800 dark:text-amber-300 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-500" />
            <p>
              <strong>Autônomo:</strong> Lembre-se do recolhimento mensal obrigatório via <strong>Carnê-Leão</strong> se seus rendimentos passarem de R$ 2.259,20 por mês.
            </p>
          </div>
        )}

        {/* Severe Disease Exemption Alert */}
        {!isExempt && (
           <div className="flex items-start gap-2 text-xs text-muted-foreground">
             <HeartPulse className="h-4 w-4 shrink-0 text-red-400" />
             <p>Aposentados e pensionistas portadores de <strong>doenças graves</strong> (como câncer, Parkinson, etc.) têm direito à isenção total do IRPF sobre esses rendimentos, mediante laudo médico oficial.</p>
           </div>
        )}

        {/* Restitution Dates */}
        <div className="space-y-2 border-t border-border/50 pt-4">
           <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
             <CalendarDays className="h-3.5 w-3.5" /> Lotes de Restituição 2024
           </h4>
           <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-muted p-1.5 rounded text-center">1º: 31 de Maio</div>
              <div className="bg-muted p-1.5 rounded text-center">2º: 28 de Junho</div>
              <div className="bg-muted p-1.5 rounded text-center">3º: 31 de Julho</div>
              <div className="bg-muted p-1.5 rounded text-center">4º: 30 de Agosto</div>
           </div>
        </div>

        {/* Simulator Link */}
        <div className="pt-2">
          <a 
            href="https://www27.receita.fazenda.gov.br/simulador-irpf/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full py-2 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-md transition-colors border border-primary/20"
          >
             Simulador Oficial da Receita <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
