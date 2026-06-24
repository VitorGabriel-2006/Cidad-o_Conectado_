export interface TaxExemption {
  id: string;
  name: string;
  agency: string;
  simplifiedDescription: string;
  estimatedSavings: number; // valor monetário
  savingsType: "mensal" | "anual" | "por evento";
  validity: string;
  eligibilityRule: {
    maxIncomePerCapita?: number;
    requiresCadUnico?: boolean;
    requiresStudent?: boolean;
    requiresAge?: { min?: number; max?: number };
  };
}

export const mockTaxExemptions: TaxExemption[] = [
  {
    id: "tax-1",
    name: "Tarifa Social de Energia Elétrica",
    agency: "ANEEL",
    simplifiedDescription: "Desconto de até 65% na conta de luz todos os meses para famílias de baixa renda inscritas no CadÚnico.",
    estimatedSavings: 60,
    savingsType: "mensal",
    validity: "Renovação automática a cada 2 anos (necessita CadÚnico atualizado).",
    eligibilityRule: {
      maxIncomePerCapita: 706, // Meio salário mínimo
      requiresCadUnico: true,
    }
  },
  {
    id: "tax-2",
    name: "Isenção em Concursos Públicos",
    agency: "Bancas Organizadoras Federais e Estaduais",
    simplifiedDescription: "Você não precisa pagar as taxas de inscrição para fazer provas de concursos públicos ou ENEM.",
    estimatedSavings: 120,
    savingsType: "por evento",
    validity: "Válido para cada edital que você se inscrever.",
    eligibilityRule: {
      maxIncomePerCapita: 2118, // Até 1.5 salário mínimo ou CadÚnico
      requiresCadUnico: true,
    }
  },
  {
    id: "tax-3",
    name: "ID Jovem - Viagens Interestaduais",
    agency: "Secretaria Nacional de Juventude",
    simplifiedDescription: "Viagens de ônibus de um estado para outro de graça ou pagando metade do preço, além de meia-entrada em eventos culturais.",
    estimatedSavings: 300,
    savingsType: "anual",
    validity: "Válido por 1 ano, renovável até completar 29 anos.",
    eligibilityRule: {
      maxIncomePerCapita: 2824, // Até 2 salários mínimos
      requiresCadUnico: true,
      requiresAge: { min: 15, max: 29 }
    }
  },
  {
    id: "tax-4",
    name: "Isenção de IPTU",
    agency: "Prefeituras Municipais",
    simplifiedDescription: "Aposentados, pensionistas e famílias de baixíssima renda podem não pagar o imposto do imóvel onde moram.",
    estimatedSavings: 800,
    savingsType: "anual",
    validity: "Deve ser solicitado anualmente ou conforme a lei do seu município.",
    eligibilityRule: {
      maxIncomePerCapita: 1412,
    }
  }
];
