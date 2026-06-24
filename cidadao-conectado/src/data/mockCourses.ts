export interface CourseModel {
  id: string;
  title: string;
  provider: string; // SENAI, IFSP, Pronatec, etc.
  area: string; // Tecnologia, Indústria, Serviços, etc.
  modality: "EAD" | "Presencial";
  state: string; // "Nacional" ou sigla do estado (SP, RJ, etc.)
  city?: string;
  prerequisites: string;
  hours: number;
  mecCertified: boolean;
  extraAids?: string[]; // "Auxílio Transporte", "Material Gratuito", etc.
  enrollmentLink: string;
  description: string;
  status: "Aberto" | "Breve" | "Encerrado";
}

export const mockCourses: CourseModel[] = [
  {
    id: "curso-senai-mec",
    title: "Mecânica Automotiva Básica",
    provider: "SENAI",
    area: "Indústria Automotiva",
    modality: "Presencial",
    state: "SP",
    city: "São Paulo",
    prerequisites: "Ensino Fundamental Completo e maior de 16 anos.",
    hours: 160,
    mecCertified: true,
    extraAids: ["Auxílio Transporte (R$ 15/dia)", "Uniforme e EPIs Gratuitos"],
    enrollmentLink: "https://www.sp.senai.br",
    description: "Formação inicial para jovens e adultos que desejam ingressar no mercado de manutenção automotiva. Foco em motores de combustão interna e freios.",
    status: "Aberto"
  },
  {
    id: "curso-if-dev",
    title: "Lógica de Programação e Web",
    provider: "Instituto Federal (IFRN)",
    area: "Tecnologia",
    modality: "EAD",
    state: "Nacional",
    prerequisites: "Ensino Médio Incompleto (cursando ou concluído).",
    hours: 240,
    mecCertified: true,
    enrollmentLink: "https://ead.ifrn.edu.br",
    description: "Curso online massivo (MOOC) introdutório para quem quer aprender a programar do zero. Ensina HTML, CSS e Javascript Básico.",
    status: "Aberto"
  },
  {
    id: "curso-sebrae-emp",
    title: "Como Gerenciar seu Próprio Negócio (MEI)",
    provider: "SEBRAE",
    area: "Empreendedorismo",
    modality: "EAD",
    state: "Nacional",
    prerequisites: "Livre (Recomendado para maiores de 18 anos).",
    hours: 40,
    mecCertified: false,
    extraAids: ["Apostila Digital Gratuita"],
    enrollmentLink: "https://sebrae.com.br",
    description: "Trilha rápida focada no microempreendedor (MEI). Ensina noções de caixa, imposto DAS e como precificar serviços e produtos.",
    status: "Aberto"
  },
  {
    id: "curso-senac-estetica",
    title: "Técnico em Estética e Cosmética",
    provider: "SENAC (Programa de Gratuidade)",
    area: "Saúde e Bem-Estar",
    modality: "Presencial",
    state: "RJ",
    city: "Rio de Janeiro",
    prerequisites: "Ensino Médio Completo. Renda per capita de até 2 salários mínimos.",
    hours: 800,
    mecCertified: true,
    extraAids: ["Material Prático Subsidiado", "Passe Livre Estudantil"],
    enrollmentLink: "https://www.rj.senac.br",
    description: "Curso técnico de longa duração formando profissionais habilitados a realizar procedimentos estéticos faciais e corporais.",
    status: "Breve"
  },
  {
    id: "curso-pronatec-log",
    title: "Auxiliar de Logística e Estoque",
    provider: "Pronatec / FAT",
    area: "Serviços Gerais",
    modality: "Presencial",
    state: "MG",
    city: "Belo Horizonte",
    prerequisites: "Ensino Fundamental II Incompleto.",
    hours: 120,
    mecCertified: true,
    extraAids: ["Bolsa-Formação (R$ 200/mês)", "Vale-Transporte"],
    enrollmentLink: "https://pronatec.mec.gov.br",
    description: "Qualificação rápida para desempregados que buscam reinserção via agências do trabalhador. Foca em controle de armazém e notas fiscais.",
    status: "Encerrado"
  }
];
