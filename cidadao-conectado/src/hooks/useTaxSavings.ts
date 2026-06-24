import { useMemo } from "react";
import { useProfileStore } from "@/store/useProfileStore";
import { TaxExemption, mockTaxExemptions } from "@/data/mockTaxExemptions";

export function useTaxSavings() {
  const { profile } = useProfileStore();

  const { qualifiedExemptions, totalAnnualSavings, potentialSavings } = useMemo(() => {
    // Se não há perfil ou se a renda per capita for zero/undefined (o usuário não preencheu)
    if (!profile || profile.perCapitaIncome === undefined) {
      return { qualifiedExemptions: [], totalAnnualSavings: 0, potentialSavings: 0 };
    }

    const qualified: TaxExemption[] = [];
    let annualSum = 0;
    let potentialSum = 0;

    mockTaxExemptions.forEach(exemption => {
      const { eligibilityRule } = exemption;
      let isEligible = true;

      if (eligibilityRule.maxIncomePerCapita !== undefined) {
        if (profile.perCapitaIncome > eligibilityRule.maxIncomePerCapita) {
          isEligible = false;
        }
      }

      if (eligibilityRule.requiresAge && profile.age) {
        const ageNum = Number(profile.age);
        if (eligibilityRule.requiresAge.min !== undefined && ageNum < eligibilityRule.requiresAge.min) {
          isEligible = false;
        }
        if (eligibilityRule.requiresAge.max !== undefined && ageNum > eligibilityRule.requiresAge.max) {
          isEligible = false;
        }
      }

      if (isEligible) {
        qualified.push(exemption);

        // Somar para o total (assumindo que "por evento" acontece 1x ao ano para o total base)
        if (exemption.savingsType === "mensal") {
          annualSum += exemption.estimatedSavings * 12;
        } else if (exemption.savingsType === "anual") {
          annualSum += exemption.estimatedSavings;
        } else if (exemption.savingsType === "por evento") {
          potentialSum += exemption.estimatedSavings;
        }
      }
    });

    return {
      qualifiedExemptions: qualified,
      totalAnnualSavings: annualSum + potentialSum, // Agrupa a economia fixa e a economia potencial por evento
      potentialSavings: potentialSum
    };
  }, [profile]);

  return {
    qualifiedExemptions,
    totalAnnualSavings,
    hasExemptions: qualifiedExemptions.length > 0
  };
}
