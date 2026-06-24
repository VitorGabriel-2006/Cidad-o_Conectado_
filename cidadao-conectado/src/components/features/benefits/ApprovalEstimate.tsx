"use client";

import { useMemo } from "react";
import { Benefit } from "@/data/mockBenefits";
import { useProfileStore } from "@/store/useProfileStore";
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ApprovalEstimateProps {
  benefit: Benefit;
}

type RuleStatus = "met" | "failed" | "missing";

interface EvaluatedRule {
  key: string;
  label: string;
  status: RuleStatus;
  message: string;
}

export function ApprovalEstimate({ benefit }: ApprovalEstimateProps) {
  const { profile } = useProfileStore();
  const reqs = benefit.requirements;

  // Evaluate rules
  const evaluation = useMemo(() => {
    if (!reqs || Object.keys(reqs).length === 0) {
      return { level: "high" as const, rules: [] };
    }

    const rules: EvaluatedRule[] = [];
    let hasFailures = false;
    let hasMissing = false;

    // maxIncome
    if (reqs.maxIncome !== undefined) {
      const formattedMax = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(reqs.maxIncome);
      if (profile?.perCapitaIncome !== undefined) {
        const formattedInc = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(profile.perCapitaIncome);
        if (profile.perCapitaIncome <= reqs.maxIncome) {
          rules.push({ key: "maxIncome", label: "Renda per capita", status: "met", message: `Sua renda (${formattedInc}) está dentro do limite (${formattedMax}).` });
        } else {
          rules.push({ key: "maxIncome", label: "Renda per capita", status: "failed", message: `Sua renda (${formattedInc}) ultrapassa o teto permitido (${formattedMax}).` });
          hasFailures = true;
        }
      } else {
        rules.push({ key: "maxIncome", label: "Renda per capita", status: "missing", message: `Falta informar sua renda no perfil para validarmos o limite de ${formattedMax}.` });
        hasMissing = true;
      }
    }

    // minAge
    if (reqs.minAge !== undefined && reqs.maxAge === undefined) {
      if (profile?.age) {
        if (Number(profile.age) >= reqs.minAge) {
          rules.push({ key: "minAge", label: "Idade", status: "met", message: `Sua idade (${profile.age} anos) atende ao requisito mínimo (${reqs.minAge} anos).` });
        } else {
          rules.push({ key: "minAge", label: "Idade", status: "failed", message: `Sua idade (${profile.age} anos) é menor que o requisito mínimo (${reqs.minAge} anos).` });
          hasFailures = true;
        }
      } else {
        rules.push({ key: "minAge", label: "Idade", status: "missing", message: `Falta informar sua idade no perfil para validarmos o mínimo de ${reqs.minAge} anos.` });
        hasMissing = true;
      }
    }

    // maxAge
    if (reqs.maxAge !== undefined) {
      if (profile?.age) {
        const age = Number(profile.age);
        if (reqs.minAge !== undefined) {
          if (age >= reqs.minAge && age <= reqs.maxAge) {
            rules.push({ key: "ageRange", label: "Idade", status: "met", message: `Sua idade (${age} anos) está entre ${reqs.minAge} e ${reqs.maxAge} anos.` });
          } else {
            rules.push({ key: "ageRange", label: "Idade", status: "failed", message: `Sua idade (${age} anos) não está na faixa exigida (${reqs.minAge} a ${reqs.maxAge} anos).` });
            hasFailures = true;
          }
        } else {
          if (age <= reqs.maxAge) {
            rules.push({ key: "maxAge", label: "Idade", status: "met", message: `Sua idade (${age} anos) está dentro do máximo (${reqs.maxAge} anos).` });
          } else {
            rules.push({ key: "maxAge", label: "Idade", status: "failed", message: `Sua idade (${age} anos) ultrapassa o máximo permitido (${reqs.maxAge} anos).` });
            hasFailures = true;
          }
        }
      } else {
        rules.push({ key: "maxAge", label: "Idade", status: "missing", message: `Falta informar sua idade no perfil para validarmos este critério.` });
        hasMissing = true;
      }
    }

    // requiresStudent
    if (reqs.requiresStudent) {
      if (profile && profile.isStudent !== undefined) {
        if (profile.isStudent) {
          rules.push({ key: "isStudent", label: "Estudante", status: "met", message: `Você está matriculado em uma instituição de ensino.` });
        } else {
          rules.push({ key: "isStudent", label: "Estudante", status: "failed", message: `Este benefício exige que você seja estudante.` });
          hasFailures = true;
        }
      } else {
        rules.push({ key: "isStudent", label: "Estudante", status: "missing", message: `Falta informar se você é estudante no seu perfil.` });
        hasMissing = true;
      }
    }

    // requiresPcD
    if (reqs.requiresPcD) {
      if (profile && profile.isPcD !== undefined) {
        if (profile.isPcD) {
          rules.push({ key: "isPcD", label: "PcD", status: "met", message: `Você atende ao requisito de ser Pessoa com Deficiência.` });
        } else {
          rules.push({ key: "isPcD", label: "PcD", status: "failed", message: `Este benefício é exclusivo para Pessoas com Deficiência (PcD).` });
          hasFailures = true;
        }
      } else {
        rules.push({ key: "isPcD", label: "PcD", status: "missing", message: `Falta informar no seu perfil se você é Pessoa com Deficiência.` });
        hasMissing = true;
      }
    }

    // targetGender
    if (reqs.targetGender && reqs.targetGender !== "All") {
      if (profile?.gender) {
        if (profile.gender === reqs.targetGender) {
          rules.push({ key: "gender", label: "Público Alvo", status: "met", message: `Você se enquadra no gênero exigido (${reqs.targetGender}).` });
        } else {
          rules.push({ key: "gender", label: "Público Alvo", status: "failed", message: `Este benefício é direcionado para o gênero ${reqs.targetGender}.` });
          hasFailures = true;
        }
      } else {
        rules.push({ key: "gender", label: "Público Alvo", status: "missing", message: `Falta informar seu gênero no perfil para validação.` });
        hasMissing = true;
      }
    }

    let level: "high" | "medium" | "low" = "high";
    if (hasFailures) {
      level = "low";
    } else if (hasMissing) {
      level = "medium";
    }

    return { level, rules };
  }, [profile, reqs]);

  // Se não há requisitos, podemos considerar universal
  if (!reqs || Object.keys(reqs).length === 0) {
    return (
      <div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-5 mb-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <CheckCircle2 className="h-24 w-24 text-green-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2 mb-3">
          <CheckCircle2 className="h-5 w-5 text-green-400" />
          Benefício Universal
        </h3>
        <p className="text-sm text-slate-300 mb-4">
          Este benefício não possui restrições específicas e está disponível para o público geral.
        </p>
        <Progress value={100} className="h-2.5 bg-white/10 [&>div]:bg-green-500 mb-3" />
      </div>
    );
  }

  const { level, rules } = evaluation;

  const config = {
    high: {
      title: "Alta",
      color: "text-green-400",
      progressValue: 100,
      progressClass: "bg-white/10 [&>div]:bg-green-500",
      icon: <CheckCircle2 className="h-5 w-5 text-green-400" />,
      watermark: <CheckCircle2 className="h-32 w-32 text-green-400" />
    },
    medium: {
      title: "Média",
      color: "text-amber-400",
      progressValue: 66,
      progressClass: "bg-white/10 [&>div]:bg-amber-500",
      icon: <AlertTriangle className="h-5 w-5 text-amber-400" />,
      watermark: <AlertTriangle className="h-32 w-32 text-amber-400" />
    },
    low: {
      title: "Baixa",
      color: "text-rose-400",
      progressValue: 33,
      progressClass: "bg-white/10 [&>div]:bg-rose-500",
      icon: <AlertCircle className="h-5 w-5 text-rose-400" />,
      watermark: <AlertCircle className="h-32 w-32 text-rose-400" />
    }
  }[level];

  return (
    <div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-5 mb-8 shadow-sm relative overflow-hidden transition-all duration-500">
      <div className="absolute -top-4 -right-4 p-4 opacity-[0.04] pointer-events-none transform rotate-12">
        {config.watermark}
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-base sm:text-lg font-bold flex items-center gap-2 ${config.color}`}>
            {config.icon}
            Estimativa de Elegibilidade: {config.title}
          </h3>
          <span className={`text-sm font-bold ${config.color}`}>{config.progressValue}%</span>
        </div>
        
        <Progress value={config.progressValue} className={`h-3 mb-5 shadow-inner ${config.progressClass} transition-all duration-1000 ease-in-out`} />

        <div className="space-y-2 mb-4">
          {rules.length === 0 ? (
            <p className="text-sm text-slate-400 italic flex items-start gap-2">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              Nenhum critério principal pôde ser avaliado com os dados atuais.
            </p>
          ) : (
            <ul className="space-y-2">
              {rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm">
                  {rule.status === "met" && <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />}
                  {rule.status === "failed" && <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />}
                  {rule.status === "missing" && <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />}
                  
                  <span className="text-slate-200 leading-relaxed">
                    {rule.message}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-start gap-2 bg-black/20 border border-white/5 rounded-lg p-3 mt-4 text-xs text-slate-400">
          <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 opacity-70" />
          <p className="leading-tight opacity-90">
            Atenção: Esta é apenas uma estimativa gerada pelo sistema para te auxiliar. Ela não garante a aprovação oficial do benefício, que será analisada pelo órgão responsável.
          </p>
        </div>
      </div>
    </div>
  );
}
