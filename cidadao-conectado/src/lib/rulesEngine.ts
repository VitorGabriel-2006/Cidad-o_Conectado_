import { ProfileData } from "@/store/useProfileStore";
import { Benefit } from "@/data/mockBenefits";

/**
 * Função utilitária opcional: Extrai tags para uso visual se necessário
 */
export function extractTagsFromProfile(profile: ProfileData): Set<string> {
  const userTags = new Set<string>();
  const age = Number(profile.age);
  if (age >= 60) userTags.add("Idoso");
  if (age <= 29) userTags.add("Jovem");
  const incomeValue = profile.perCapitaIncome;
  if (incomeValue <= 3000) userTags.add("Baixa Renda"); 
  if (profile.race === "Preto" || profile.race === "Pardo") userTags.add("Preto/Pardo");
  if (profile.race === "Indígena") userTags.add("Indígena");
  if (profile.race === "Quilombola") userTags.add("Quilombola");
  if (profile.gender === "Feminino") userTags.add("Mulher");
  if (profile.isStudent) userTags.add("Estudante");
  if (profile.isPregnant) userTags.add("Gestante");
  if (profile.isPcD) {
    userTags.add("PcD");
    if (profile.pcdType) {
      userTags.add(`PcD ${profile.pcdType}`);
    }
  }
  return userTags;
}

/**
 * Motor de Regras Estrito (Exclusion Filter):
 * Se o benefício tem um requirement e o usuário NÃO atende a esse requirement,
 * o benefício é sumariamente ignorado (return false).
 */
export function matchBenefits(profile: ProfileData | null, allBenefits: Benefit[]): Benefit[] {
  if (!profile) return [];

  const age = Number(profile.age);
  const incomeValue = profile.perCapitaIncome;

  return allBenefits.filter(benefit => {
    // Se o benefício não possui objeto de requisitos, ele é universal.
    if (!benefit.requirements) return true;
    
    const req = benefit.requirements;
    
    // Regras Numéricas
    if (req.minAge !== undefined && age < req.minAge) return false;
    if (req.maxAge !== undefined && age > req.maxAge) return false;
    if (req.maxIncome !== undefined && incomeValue > req.maxIncome) return false;
    
    // Regras Booleanas (Checkbox)
    // Se a regra EXIGE que seja estudante, e o perfil marcou falso -> exclui
    if (req.requiresStudent === true && profile.isStudent === false) return false;
    
    // Se a regra EXIGE que seja gestante, e o perfil marcou falso -> exclui
    if (req.requiresPregnant === true && profile.isPregnant === false) return false;
    
    // Se a regra EXIGE que seja PcD, e o perfil marcou falso -> exclui
    if (req.requiresPcD === true && profile.isPcD === false) return false;
    
    // Regras de Matrizes (Gênero, Raça)
    if (req.targetGender && req.targetGender !== "All") {
      if (profile.gender !== req.targetGender) return false;
    }
    
    if (req.allowedGenders && req.allowedGenders.length > 0) {
      if (!req.allowedGenders.includes(profile.gender)) return false;
    }
    
    if (req.allowedRaces && req.allowedRaces.length > 0) {
      if (!req.allowedRaces.includes(profile.race)) return false;
    }
    
    // Se o código chegou até aqui sem cair em nenhum "return false", 
    // significa que o perfil atende a 100% dos requisitos estritos deste benefício.
    return true;
  });
}

/**
 * Motor de Relevância (R049):
 * Calcula uma pontuação de aderência baseada em critérios positivos.
 */
export function calculateRelevanceScore(benefit: Benefit, profile: ProfileData | null): number {
  if (!profile) return 0;
  
  let score = 0;
  const age = Number(profile.age);
  const income = profile.perCapitaIncome;
  
  // Regra: Idoso
  if (age >= 60 && benefit.targetGroups.includes("Idoso")) {
    score += 10;
  }
  
  // Regra: Renda Compatível com o teto (e usuário não zerado para evitar falsos positivos)
  if (benefit.requirements?.maxIncome !== undefined && income > 0 && income <= benefit.requirements.maxIncome) {
    score += 5;
  }
  
  // Regra: Famílias
  if (profile.familyMembers > 1 && benefit.targetGroups.includes("Famílias")) {
    score += 5;
  }
  
  // Regra: Estudante
  if (profile.isStudent && benefit.targetGroups.includes("Estudante")) {
    score += 5;
  }

  // Regra: PcD
  if (profile.isPcD && benefit.targetGroups.includes("PcD")) {
    score += 5;
  }

  // Regra: Gestante
  if (profile.isPregnant && benefit.targetGroups.includes("Gestante")) {
    score += 5;
  }

  return score;
}
