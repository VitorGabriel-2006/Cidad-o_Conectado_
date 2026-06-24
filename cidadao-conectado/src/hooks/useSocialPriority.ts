import { useMemo } from "react";
import { useProfileStore } from "@/store/useProfileStore";

export type PriorityLevel = "max" | "high" | "medium" | "basic" | "pending";

export interface PriorityData {
  level: PriorityLevel;
  label: string;
  color: string;
  bgColor: string;
  progress: number; // 0 a 100 para o termômetro
  reason: string;
}

export function useSocialPriority(previewIncome?: number, previewMembers?: number): PriorityData {
  const profile = useProfileStore((state) => state.profile);

  return useMemo(() => {
    const income = previewIncome !== undefined ? previewIncome : profile?.perCapitaIncome;
    const members = previewMembers !== undefined ? previewMembers : (profile?.familyMembers ? parseInt(profile.familyMembers) : 1);
    
    if (income === undefined || isNaN(income)) {
      return {
        level: "pending",
        label: "Aguardando Dados",
        color: "text-slate-400",
        bgColor: "bg-slate-200 dark:bg-slate-800",
        progress: 0,
        reason: "Preencha sua renda e dependentes para calcular sua prioridade social."
      };
    }

    const dependents = Math.max(0, members - 1);

    let level: PriorityLevel;
    let label = "";
    let color = "";
    let bgColor = "";
    let progress = 0;
    let reasonBase = `Seu nível foi calculado porque sua renda por pessoa é de R$ ${income.toFixed(2).replace('.', ',')}`;
    let bonusApplied = false;

    // Determinar a base de prioridade
    if (income <= 109) {
      level = "max";
    } else if (income <= 218) {
      level = "high";
    } else if (income <= 706) {
      level = "medium";
    } else {
      level = "basic";
    }

    // Bônus de Família Numerosa
    if (level === "medium" && members >= 4) {
      level = "high";
      bonusApplied = true;
    }

    // Traduzir nível para visual
    switch (level) {
      case "max":
        label = "Prioridade Máxima";
        color = "text-rose-600 dark:text-rose-500";
        bgColor = "bg-rose-500";
        progress = 100;
        break;
      case "high":
        label = "Prioridade Alta";
        color = "text-orange-600 dark:text-orange-500";
        bgColor = "bg-orange-500";
        progress = 75;
        break;
      case "medium":
        label = "Prioridade Média";
        color = "text-amber-600 dark:text-amber-500";
        bgColor = "bg-amber-500";
        progress = 50;
        break;
      case "basic":
      default:
        label = "Prioridade Básica";
        color = "text-emerald-600 dark:text-emerald-500";
        bgColor = "bg-emerald-500";
        progress = 25;
        break;
    }

    const reason = bonusApplied 
      ? `${reasonBase} e você possui ${dependents} dependentes (Bônus de Família Numerosa aplicado).`
      : `${reasonBase}.`;

    return { level, label, color, bgColor, progress, reason };
  }, [profile]);
}
