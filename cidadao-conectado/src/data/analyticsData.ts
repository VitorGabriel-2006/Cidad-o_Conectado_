export interface UserDemographics {
  gender: string;
  race: string;
  city: string;
  ageGroup: string;
}

export interface AccessLog {
  id: string;
  accessedBenefitId: string;
  category: string;
  timestamp: string; // ISO Date String
  userDemographics: UserDemographics;
  feedbackPositive: boolean;
}

// Fixed values for realistic generation
const CITIES = [
  { name: "Lagarto", weight: 60 },
  { name: "Simão Dias", weight: 15 },
  { name: "Itabaiana", weight: 10 },
  { name: "Tobias Barreto", weight: 10 },
  { name: "Aracaju", weight: 5 }
];

const CATEGORIES = [
  { name: "Transferência de Renda", weight: 45 },
  { name: "Moradia", weight: 30 },
  { name: "Educação", weight: 15 },
  { name: "Saúde", weight: 7 },
  { name: "Transporte", weight: 3 }
];

const RACES = [
  { name: "Parda", weight: 50 },
  { name: "Preta", weight: 30 },
  { name: "Branca", weight: 15 },
  { name: "Indígena", weight: 5 }
];

const GENDERS = [
  { name: "Feminino", weight: 65 },
  { name: "Masculino", weight: 30 },
  { name: "Outro", weight: 5 }
];

const AGE_GROUPS = [
  { name: "18-24", weight: 20 },
  { name: "25-34", weight: 35 },
  { name: "35-44", weight: 25 },
  { name: "45-59", weight: 15 },
  { name: "60+", weight: 5 }
];

function getRandomByWeight(options: { name: string; weight: number }[]) {
  const total = options.reduce((sum, opt) => sum + opt.weight, 0);
  let random = Math.random() * total;
  for (const opt of options) {
    if (random < opt.weight) return opt.name;
    random -= opt.weight;
  }
  return options[0].name;
}

function getRandomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Generate 500 mock logs between Jan 2025 and Jun 2026
const generateMockLogs = (count: number): AccessLog[] => {
  const logs: AccessLog[] = [];
  const startDate = new Date("2025-01-01T00:00:00Z");
  const endDate = new Date("2026-06-30T23:59:59Z");

  for (let i = 0; i < count; i++) {
    const category = getRandomByWeight(CATEGORIES);
    // Benefit Id matching category loosely
    let benefitId = "gen-1";
    if (category === "Transferência de Renda") benefitId = Math.random() > 0.5 ? "bolsa-familia" : "bpc";
    if (category === "Moradia") benefitId = "soc-2"; // Minha Casa Minha Vida
    if (category === "Educação") benefitId = "edu-2"; // Prouni

    logs.push({
      id: `log-${i.toString().padStart(4, "0")}`,
      accessedBenefitId: benefitId,
      category,
      timestamp: getRandomDate(startDate, endDate).toISOString(),
      userDemographics: {
        gender: getRandomByWeight(GENDERS),
        race: getRandomByWeight(RACES),
        city: getRandomByWeight(CITIES),
        ageGroup: getRandomByWeight(AGE_GROUPS),
      },
      // 85% positive feedback
      feedbackPositive: Math.random() < 0.85
    });
  }

  // Sort by date ascending
  return logs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

export const mockAccessLogs: AccessLog[] = generateMockLogs(500);
