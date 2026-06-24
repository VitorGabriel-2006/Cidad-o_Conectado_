import { EnrollmentPeriod } from "@/lib/dateUtils";

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  isPopular?: boolean;
}

export interface BenefitUpdate {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
  affectsEligibility: boolean;
  previousText?: string;
}

export interface BenefitRequirements {
  minAge?: number;
  maxAge?: number;
  maxIncome?: number; // valor em Reais (ex: 1412 para um salário mínimo)
  requiresStudent?: boolean;
  requiresPregnant?: boolean;
  requiresPcD?: boolean;
  allowedGenders?: string[];
  allowedRaces?: string[];
  targetGender?: "Feminino" | "Masculino" | "Outro" | "All";
  requiresCadUnico?: boolean;
  exceptions?: string;
  baseYear?: number;
}

export interface BenefitDetails {
  modality: "Online" | "Presencial" | "Híbrido";
  estimatedTime: string;
  isFree: boolean;
  feesDescription?: string;
  channels: {
    type: "Site" | "Telefone" | "Aplicativo" | "Presencial";
    value: string;
    link?: string;
  }[];
}

export interface ProviderDetails {
  name: string;
  sphere: "Federal" | "Estadual" | "Municipal" | "Privado";
  phone?: string;
  email?: string;
  site?: string;
  openingHours?: string;
}

export interface BenefitDocument {
  id: string;
  name: string;
  isOptional: boolean;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  estimatedTime?: string;
  type: "online" | "in-person" | "analysis" | "approval";
  isMandatoryInPerson?: boolean;
}

export interface AgencyAccessibility {
  hasRamps: boolean;
  wheelchairAccessible: boolean;
  hasLibras: boolean;
  priorityService: boolean;
  digitalAccessibility: boolean;
}

export interface AgencyInfo {
  name: string;
  address: string;
  hours: string;
  accessibility?: AgencyAccessibility;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  simplifiedDescription?: string;
  simplifiedRequirements?: string[];
  provider: string;
  providerDetails?: ProviderDetails;
  targetGroups: string[];
  enrollmentPeriod?: EnrollmentPeriod;
  requirements?: BenefitRequirements;
  details?: BenefitDetails;
  iconType?: "money" | "education" | "health" | "transport" | "housing";
  relevanceScore?: number; // 0 a 100
  itemType?: "benefit" | "law";
  documents?: BenefitDocument[];
  agencyInfo?: AgencyInfo;
  steps?: string[];
  applicationSteps?: ProcessStep[];
  paymentDates?: string[];
  updates?: BenefitUpdate[];
  incompatibilities?: string[];
  orgaoResponsavel?: string;
  faqs?: FAQ[];
  lastValidatedAt?: string;
  sourceType?: 'official' | 'system_summary';
  isEmergency?: boolean;
  emergencyEndDate?: string;
}

export const mockBenefits: Benefit[] = [
  {
    id: "emergencial-garantia-safra",
    title: "Auxílio Emergencial Seca/Enchente - Garantia-Safra Extraordinário",
    description: "Apoio financeiro excepcional para agricultores familiares que tiveram perda de safra devido a eventos climáticos extremos (secas ou enchentes).",
    provider: "Governo Federal",
    providerDetails: {
      name: "Ministério do Desenvolvimento Agrário",
      sphere: "Federal",
      phone: "121",
      site: "https://www.gov.br/mda"
    },
    targetGroups: ["Agricultor Familiar", "Baixa Renda"],
    iconType: "money",
    relevanceScore: 100,
    isEmergency: true,
    emergencyEndDate: "31/12/2026",
    requirements: {
      requiresCadUnico: true,
      exceptions: "O município deve ter decretado Estado de Calamidade Pública ou Situação de Emergência reconhecida pelo Governo Federal."
    },
    steps: [
      "Verifique se o seu município decretou estado de calamidade",
      "Acesse o aplicativo gov.br ou vá ao CRAS para confirmar sua inscrição",
      "O pagamento será creditado automaticamente na conta cadastrada"
    ],
    details: {
      modality: "Online",
      estimatedTime: "Imediato",
      isFree: true,
      channels: [
        { type: "Telefone", value: "121" },
        { type: "Aplicativo", value: "Gov.br" }
      ]
    }
  },
  {
    id: "bpc",
    title: "Benefício de Prestação Continuada (BPC)",
    description: "Garante um salário mínimo mensal à pessoa com deficiência e ao idoso com 65 anos ou mais que comprovem não possuir meios de prover a própria manutenção.",
    provider: "INSS",
    agencyInfo: {
      name: "Agência INSS - Unidade Centro",
      address: "Av. Presidente Vargas, 1000 - Centro",
      hours: "Segunda a Sexta, das 07h às 13h",
      accessibility: {
        hasRamps: true,
        wheelchairAccessible: true,
        hasLibras: true,
        priorityService: true,
        digitalAccessibility: true,
      }
    },
    providerDetails: {
      name: "Instituto Nacional do Seguro Social",
      sphere: "Federal",
      phone: "135",
      site: "https://meu.inss.gov.br",
      openingHours: "Segunda a Sábado, das 07h às 22h"
    },
    targetGroups: ["PcD", "Idoso", "Baixa Renda"],
    enrollmentPeriod: { isContinuous: true },
    iconType: "money",
    relevanceScore: 95,
    requirements: { 
      maxIncome: 353, // 1/4 do salário mínimo (R$ 1412) per capita
      requiresCadUnico: true,
      exceptions: "Exige idade maior que 65 anos OU ser Pessoa com Deficiência (PcD).",
      baseYear: 2024
    },
    documents: [
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-0", name: "RG e CPF", isOptional: false },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-1", name: "Comprovante de Residência atualizado (últimos 3 meses)", isOptional: false },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-2", name: "Laudo Médico ou atestado (se Pessoa com Deficiência)", isOptional: false },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-3", name: "Comprovante de Inscrição no CadÚnico", isOptional: false }
    ],
    steps: [
      "Agende o atendimento no CRAS mais próximo",
      "Inscreva-se ou atualize seus dados no CadÚnico",
      "Acesse o aplicativo Meu INSS com sua conta gov.br",
      "Solicite o benefício na aba 'Benefícios Assistenciais'",
      "Acompanhe a análise e o resultado pelo aplicativo ou ligando para o 135"
    ],
    applicationSteps: [
      {
        id: "step-1",
        title: "Solicitação e Cadastro",
        description: "Agendamento pelo aplicativo Meu INSS ou central 135 para iniciar o processo.",
        estimatedTime: "Imediato",
        type: "online"
      },
      {
        id: "step-2",
        title: "Perícia Médica e Avaliação Conjunta",
        description: "Comparecimento à agência do INSS para avaliação por junta médica e assistentes sociais.",
        estimatedTime: "Até 45 dias após agendamento",
        type: "in-person",
        isMandatoryInPerson: true
      },
      {
        id: "step-3",
        title: "Análise Social e de Renda",
        description: "Cruzamento dos dados com o CadÚnico para verificar vulnerabilidade econômica.",
        estimatedTime: "Até 30 dias",
        type: "analysis"
      },
      {
        id: "step-4",
        title: "Resultado e Concessão",
        description: "Emissão do parecer e liberação do primeiro pagamento em caso de aprovação.",
        estimatedTime: "Até 15 dias após análise",
        type: "approval"
      }
    ],
    details: {
      modality: "Híbrido",
      estimatedTime: "45 a 90 dias úteis",
      isFree: true,
      channels: [
        { type: "Telefone", value: "135 (Central INSS)" },
        { type: "Site", value: "Meu INSS", link: "https://meu.inss.gov.br/" },
        { type: "Presencial", value: "Agência do INSS mais próxima" }
      ]
    },
    paymentDates: ["2026-06-25", "2026-07-25", "2026-08-25"],
    renewalDate: "2026-11-15",
    updates: [
      {
        id: "upd-bpc-1",
        date: "2026-05-10",
        title: "Atualização do Critério de Renda",
        description: "O Supremo Tribunal Federal decidiu que o critério de 1/4 do salário mínimo não pode ser a única forma de comprovar a miserabilidade.",
        affectsEligibility: true,
        previousText: "A renda per capita da família deve ser estritamente inferior a 1/4 do salário mínimo vigente (R$ 353,00)."
      }
    ],
    orgaoResponsavel: "INSS",
    incompatibilities: ["bolsa-familia"],
    lastValidatedAt: "2026-06-10",
    sourceType: "official",
    faqs: [
      {
        id: "faq-bpc-1",
        question: "Como faço para solicitar este benefício?",
        answer: "A solicitação pode ser feita através dos canais oficiais indicados nos passos acima, seja presencialmente ou pelas plataformas digitais do governo.",
        isPopular: true
      },
      {
        id: "faq-bpc-2",
        question: "Existem taxas para o processo?",
        answer: "A maioria dos serviços governamentais sociais é gratuita, mas verifique a seção de detalhes para eventuais custos de emissão de documentos.",
        isPopular: false
      }
    ]
  },
  {
    id: "tarifa-social",
    title: "Tarifa Social de Energia Elétrica",
    description: "Desconto na conta de luz para famílias de baixa renda inscritas no Cadastro Único.",
    provider: "ANEEL",
    agencyInfo: {
      name: "Posto de Atendimento da Distribuidora Local",
      address: "Praça da Luz, S/N - Centro",
      hours: "Segunda a Sexta, das 08h às 16h",
      accessibility: {
        hasRamps: false,
        wheelchairAccessible: false,
        hasLibras: false,
        priorityService: true,
        digitalAccessibility: true,
      }
    },
    providerDetails: {
      name: "Agência Nacional de Energia Elétrica",
      sphere: "Federal",
      phone: "167",
      site: "https://www.gov.br/aneel",
      openingHours: "Segunda a Sábado, das 06h20 às 24h"
    },
    targetGroups: ["Baixa Renda", "Indígena", "Quilombola"],
    iconType: "housing",
    relevanceScore: 85,
    requirements: { 
      maxIncome: 706, // Meio salário mínimo per capita
      requiresCadUnico: true,
      exceptions: "Famílias indígenas e quilombolas têm descontos diferenciados que podem chegar a 100%.",
      baseYear: 2024
    },
    documents: [
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-0", name: "RG e CPF", isOptional: false },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-1", name: "Conta de luz recente", isOptional: false },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-2", name: "Número de Inscrição Social (NIS)", isOptional: false }
    ],
    steps: [
      "Garanta que sua inscrição no CadÚnico está atualizada",
      "Entre em contato com a distribuidora de energia da sua região",
      "Informe o seu NIS e solicite a inclusão na Tarifa Social",
      "Aguarde o desconto automático na próxima fatura"
    ],
    details: {
      modality: "Híbrido",
      estimatedTime: "Até 30 dias",
      isFree: true,
      channels: [
        { type: "Telefone", value: "Atendimento da sua distribuidora" }
      ]
    },
    faqs: [
      {
        id: "faq-ts-1",
        question: "Preciso estar com as contas em dia para solicitar?",
        answer: "Sim, geralmente as distribuidoras exigem que não haja contas em atraso para ativar o benefício, ou que se faça um acordo de parcelamento antes.",
        isPopular: true
      },
      {
        id: "faq-ts-2",
        question: "O desconto é automático se eu morar de aluguel?",
        answer: "Não. A conta precisa estar no nome do beneficiário inscrito no CadÚnico. Se você mora de aluguel, deve pedir a transferência de titularidade para o seu nome na companhia de energia.",
        isPopular: false
      }
    ],
    lastValidatedAt: "2025-05-01",
    sourceType: "official",
    updates: [
      {
        id: "upd-tarifa-social-1",
        date: "2026-01-15",
        title: "Revisão Anual de Benefício",
        description: "As regras gerais e valores base foram revisados conforme a legislação vigente do novo ano fiscal.",
        affectsEligibility: false
      }
    ]
  },
  {
    id: "passe-livre-estudantil",
    title: "Passe Livre Estudantil",
    description: "Isenção tarifária no transporte coletivo urbano para estudantes matriculados em instituições de ensino.",
    provider: "Governo Estadual",
    providerDetails: {
      name: "Secretaria de Transportes",
      sphere: "Estadual",
      site: "https://www.emtu.sp.gov.br",
      openingHours: "Horário Comercial"
    },
    targetGroups: ["Estudante"],
    enrollmentPeriod: { isContinuous: false, endDate: "2026-04-01" }, // Closed > 30 days
    iconType: "transport",
    relevanceScore: 88,
    requirements: { requiresStudent: true },
    documents: [
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-0", name: "RG e CPF", isOptional: false },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-1", name: "Declaração de Matrícula Escolar atualizada", isOptional: false },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-2", name: "Foto 3x4 recente (em alguns municípios)", isOptional: true },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-3", name: "Comprovante de residência", isOptional: false }
    ],
    steps: [
      "Solicite a declaração de matrícula na secretaria da escola/faculdade",
      "Acesse o site da empresa de transporte da sua cidade",
      "Preencha o formulário e anexe a documentação",
      "Aguarde a aprovação e retire seu cartão estudantil"
    ],
    details: {
      modality: "Online",
      estimatedTime: "15 dias úteis",
      isFree: false,
      feesDescription: "A emissão da primeira via do cartão pode custar aproximadamente R$ 30,00.",
      channels: [
        { type: "Site", value: "Portal do Transporte Metropolitano" }
      ]
    },
    faqs: [
      {
        id: "faq-passe-livre-estudantil-1",
        question: "Como faço para solicitar este benefício?",
        answer: "A solicitação pode ser feita através dos canais oficiais indicados nos passos acima, seja presencialmente ou pelas plataformas digitais do governo.",
        isPopular: true
      },
      {
        id: "faq-passe-livre-estudantil-2",
        question: "Existem taxas para o processo?",
        answer: "A maioria dos serviços governamentais sociais é gratuita, mas verifique a seção de detalhes para eventuais custos de emissão de documentos.",
        isPopular: false
      }
    ],
    updates: [
      {
        id: "upd-passe-livre-estudantil-1",
        date: "2026-01-15",
        title: "Revisão Anual de Benefício",
        description: "As regras gerais e valores base foram revisados conforme a legislação vigente do novo ano fiscal.",
        affectsEligibility: false
      }
    ]
  },
  {
    id: "bolsa-familia",
    title: "Programa Bolsa Família",
    description: "Programa de transferência direta de renda que beneficia famílias em situação de pobreza.",
    simplifiedDescription: "Ajuda em dinheiro todo mês para famílias que têm renda baixa viverem melhor.",
    simplifiedRequirements: ["Sua família precisa ganhar pouco por pessoa.", "As crianças têm que estar na escola e com a vacina em dia."],
    provider: "MDS",
    agencyInfo: {
      name: "CRAS - Centro de Referência de Assistência Social",
      address: "Rua da Cidadania, 45 - Bairro Esperança",
      hours: "Segunda a Sexta, das 08h às 17h",
      accessibility: {
        hasRamps: true,
        wheelchairAccessible: true,
        hasLibras: true,
        priorityService: true,
        digitalAccessibility: true,
      }
    },
    providerDetails: {
      name: "Ministério do Desenvolvimento e Assistência Social",
      sphere: "Federal",
      phone: "121",
      site: "https://www.gov.br/mds",
      email: "bolsafamilia@mds.gov.br",
      openingHours: "Segunda a Sexta, das 07h às 19h"
    },
    targetGroups: ["Baixa Renda", "Gestante", "Criança"],
    enrollmentPeriod: { isContinuous: true },
    iconType: "money",
    relevanceScore: 98,
    requirements: { 
      maxIncome: 218, // Limite de renda per capita oficial
      requiresCadUnico: true,
      exceptions: "O valor do limite de renda per capita é de R$ 218,00 por membro da família.",
      baseYear: 2024
    },
    documents: [
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-0", name: "RG e CPF de todos os membros da família", isOptional: false },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-1", name: "Certidão de Nascimento das crianças", isOptional: false },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-2", name: "Carteira de Vacinação infantil atualizada", isOptional: false },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-3", name: "Comprovante de matrícula escolar das crianças", isOptional: false }
    ],
    steps: [
      "Vá até o CRAS do seu município",
      "Inscreva-se no CadÚnico ou atualize seus dados",
      "Aguarde o cruzamento de dados feito pelo Ministério",
      "Caso aprovado, o cartão será enviado para o seu endereço"
    ],
    updates: [
      {
        id: "upd-bf-2",
        date: "2026-06-01",
        title: "Novo Adicional para Crianças",
        description: "Foi sancionado o Benefício Primeira Infância, que garante um adicional de R$ 150 por criança de 0 a 6 anos na família.",
        affectsEligibility: false
      },
      {
        id: "upd-bf-1",
        date: "2025-03-15",
        title: "Alteração da Renda Limite",
        description: "A linha de extrema pobreza e pobreza foi unificada para o teto de R$ 218 mensais per capita.",
        affectsEligibility: true,
        previousText: "O limite de renda para ingresso no programa era dividido em R$ 105 para extrema pobreza e R$ 210 para pobreza."
      }
    ],
    orgaoResponsavel: "MDS - Ministério do Desenvolvimento Social",
    incompatibilities: ["bpc"],
    faqs: [
      {
        id: "faq-bf-1",
        question: "Posso receber o Bolsa Família e trabalhar de carteira assinada?",
        answer: "Sim! Se você assinar a carteira, a renda da família vai aumentar. Se mesmo assim a renda por pessoa (renda per capita) da sua casa não passar de R$ 218 mensais, você continua recebendo o valor integral. Se passar disso, mas ficar até meio salário mínimo por pessoa, você entra na 'Regra de Proteção' e continua recebendo metade do valor do benefício por até 2 anos.",
        isPopular: true
      },
      {
        id: "faq-bf-2",
        question: "Mães solteiras recebem mais?",
        answer: "O valor não depende do estado civil, mas sim da composição familiar. O programa paga um adicional de R$ 150 para cada criança de até 6 anos, e R$ 50 adicionais para gestantes ou crianças/jovens de 7 a 18 anos.",
        isPopular: true
      },
      {
        id: "faq-bf-3",
        question: "O que faz o benefício ser cancelado?",
        answer: "Não atualizar o CadÚnico por mais de 2 anos, renda da família ultrapassar o limite permitido sem informar, ou não cumprir os requisitos de saúde (vacinação) e educação (frequência escolar) das crianças.",
        isPopular: false
      }
    ],
    lastValidatedAt: "2026-06-05",
    sourceType: "system_summary"
  },
  {
    id: "farmacia-popular",
    title: "Programa Farmácia Popular",
    description: "Disponibiliza medicamentos gratuitos para o tratamento de diabetes, asma e hipertensão.",
    provider: "Ministério da Saúde",
    providerDetails: {
      name: "Ministério da Saúde",
      sphere: "Federal",
      phone: "136",
      site: "https://www.gov.br/saude",
      openingHours: "Atendimento 24h"
    },
    targetGroups: ["Geral", "Idoso"],
    iconType: "health",
    relevanceScore: 60,
    documents: [
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-0", name: "Receita médica válida (SUS ou particular, com menos de 180 dias)", isOptional: false },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-1", name: "Documento de identidade oficial com foto e CPF", isOptional: true }
    ],
    steps: [
      "Vá até uma farmácia com a placa 'Aqui Tem Farmácia Popular'",
      "Apresente a receita médica e seus documentos ao farmacêutico",
      "Receba os medicamentos indicados gratuitamente",
      "Assine a via da farmácia comprovando a retirada"
    ],
    details: {
      modality: "Presencial",
      estimatedTime: "Imediato",
      isFree: true,
      channels: [
        { type: "Presencial", value: "Qualquer farmácia credenciada" }
      ]
    },
    faqs: [
      {
        id: "faq-farmacia-popular-1",
        question: "Como faço para solicitar este benefício?",
        answer: "A solicitação pode ser feita através dos canais oficiais indicados nos passos acima, seja presencialmente ou pelas plataformas digitais do governo.",
        isPopular: true
      },
      {
        id: "faq-farmacia-popular-2",
        question: "Existem taxas para o processo?",
        answer: "A maioria dos serviços governamentais sociais é gratuita, mas verifique a seção de detalhes para eventuais custos de emissão de documentos.",
        isPopular: false
      }
    ],
    updates: [
      {
        id: "upd-farmacia-popular-1",
        date: "2026-01-15",
        title: "Revisão Anual de Benefício",
        description: "As regras gerais e valores base foram revisados conforme a legislação vigente do novo ano fiscal.",
        affectsEligibility: false
      }
    ]
  },
  {
    id: "passe-livre-pcd",
    title: "Passe Livre Interestadual (PcD)",
    description: "Acesso gratuito ao transporte coletivo interestadual para pessoas com deficiência carentes.",
    provider: "Ministério dos Transportes",
    providerDetails: {
      name: "Ministério dos Transportes",
      sphere: "Federal",
      phone: "166",
      email: "passelivre@transportes.gov.br",
      site: "https://www.gov.br/transportes",
      openingHours: "Segunda a Sexta, das 08h às 18h"
    },
    targetGroups: ["PcD", "Baixa Renda"],
    iconType: "transport",
    relevanceScore: 90,
    requirements: { requiresPcD: true, maxIncome: 1412 }, // 1 Salário Mínimo per capita
    documents: [
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-0", name: "Atestado Médico padrão do Passe Livre", isOptional: false },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-1", name: "Requerimento e Declaração de Renda Familiar", isOptional: false },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-2", name: "Documento de identidade e foto 3x4", isOptional: true }
    ],
    steps: [
      "Baixe os formulários oficiais no site do Ministério da Infraestrutura",
      "Peça ao médico do SUS para preencher o laudo",
      "Envie os formulários preenchidos pelos Correios ou via site",
      "Aguarde o recebimento da credencial em casa"
    ],
    faqs: [
      {
        id: "faq-passe-livre-pcd-1",
        question: "Como faço para solicitar este benefício?",
        answer: "A solicitação pode ser feita através dos canais oficiais indicados nos passos acima, seja presencialmente ou pelas plataformas digitais do governo.",
        isPopular: true
      },
      {
        id: "faq-passe-livre-pcd-2",
        question: "Existem taxas para o processo?",
        answer: "A maioria dos serviços governamentais sociais é gratuita, mas verifique a seção de detalhes para eventuais custos de emissão de documentos.",
        isPopular: false
      }
    ],
    updates: [
      {
        id: "upd-passe-livre-pcd-1",
        date: "2026-01-15",
        title: "Revisão Anual de Benefício",
        description: "As regras gerais e valores base foram revisados conforme a legislação vigente do novo ano fiscal.",
        affectsEligibility: false
      }
    ]
  },
  {
    id: "soc-1",
    title: "Auxílio Gás",
    description: "Subsídio para compra de botijão de gás de cozinha para famílias de baixa renda.",
    provider: "MDS",
    agencyInfo: {
      name: "CRAS - Unidade Central",
      address: "Rua da Cidadania, 45",
      hours: "Segunda a Sexta, das 08h às 17h",
      accessibility: {
        hasRamps: true,
        wheelchairAccessible: false,
        hasLibras: false,
        priorityService: true,
        digitalAccessibility: true,
      }
    },
    providerDetails: {
      name: "Ministério do Desenvolvimento e Assistência Social",
      sphere: "Federal",
      phone: "121",
      site: "https://www.gov.br/mds",
      openingHours: "Segunda a Sexta, das 07h às 19h"
    },
    targetGroups: ["Baixa Renda"],
    iconType: "money",
    relevanceScore: 85,
    requirements: { 
      maxIncome: 706, // Meio salário mínimo per capita
      requiresCadUnico: true,
      exceptions: "Mulheres vítimas de violência doméstica com medida protetiva têm preferência.",
      baseYear: 2024
    },
    documents: [
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-0", name: "NIS atualizado", isOptional: false },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-1", name: "RG e CPF do responsável familiar", isOptional: false }
    ],
    steps: [
      "Atualize os dados da família no CRAS",
      "O benefício é concedido automaticamente se o perfil se enquadrar",
      "O pagamento é realizado junto com a parcela do Bolsa Família"
    ],
    faqs: [
      {
        id: "faq-soc-1-1",
        question: "Como faço para solicitar este benefício?",
        answer: "A solicitação pode ser feita através dos canais oficiais indicados nos passos acima, seja presencialmente ou pelas plataformas digitais do governo.",
        isPopular: true
      },
      {
        id: "faq-soc-1-2",
        question: "Existem taxas para o processo?",
        answer: "A maioria dos serviços governamentais sociais é gratuita, mas verifique a seção de detalhes para eventuais custos de emissão de documentos.",
        isPopular: false
      }
    ],
    updates: [
      {
        id: "upd-soc-1-1",
        date: "2026-01-15",
        title: "Revisão Anual de Benefício",
        description: "As regras gerais e valores base foram revisados conforme a legislação vigente do novo ano fiscal.",
        affectsEligibility: false
      }
    ]
  },
  {
    id: "soc-2",
    title: "Minha Casa Minha Vida",
    description: "Subsidia a aquisição da casa própria para famílias com renda de até R$ 8.000,00.",
    simplifiedDescription: "Ajuda sua família a comprar uma casa. A renda de todos juntos na casa deve ser até R$ 8.000 por mês.",
    simplifiedRequirements: ["A renda de todos na casa deve ser até R$ 8.000 por mês."],
    provider: "Caixa Econômica Federal",
    providerDetails: {
      name: "Caixa Econômica Federal",
      sphere: "Federal",
      phone: "0800 104 0104",
      site: "https://www.caixa.gov.br",
      openingHours: "Segunda a Sexta, das 10h às 16h"
    },
    targetGroups: ["Baixa Renda", "Geral"],
    iconType: "housing",
    relevanceScore: 92,
    requirements: { maxIncome: 8000 },
    documents: [
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-0", name: "Comprovante de Renda (holerite ou declaração do IR)", isOptional: false },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-1", name: "Extrato do FGTS atualizado", isOptional: false },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-2", name: "RG, CPF e Certidão de Estado Civil", isOptional: false }
    ],
    steps: [
      "Faça uma simulação de financiamento no site da Caixa",
      "Procure a Caixa ou correspondente bancário com a documentação",
      "Aguarde a análise de crédito",
      "Assine o contrato de financiamento"
    ],
    faqs: [
      {
        id: "faq-soc-2-1",
        question: "Como faço para solicitar este benefício?",
        answer: "A solicitação pode ser feita através dos canais oficiais indicados nos passos acima, seja presencialmente ou pelas plataformas digitais do governo.",
        isPopular: true
      },
      {
        id: "faq-soc-2-2",
        question: "Existem taxas para o processo?",
        answer: "A maioria dos serviços governamentais sociais é gratuita, mas verifique a seção de detalhes para eventuais custos de emissão de documentos.",
        isPopular: false
      }
    ],
    updates: [
      {
        id: "upd-soc-2-1",
        date: "2026-01-15",
        title: "Revisão Anual de Benefício",
        description: "As regras gerais e valores base foram revisados conforme a legislação vigente do novo ano fiscal.",
        affectsEligibility: false
      }
    ]
  },
  {
    id: "edu-1",
    title: "FIES (Fundo de Financiamento Estudantil)",
    description: "Financiamento para cursar ensino superior em universidades privadas.",
    provider: "MEC",
    providerDetails: {
      name: "Ministério da Educação",
      sphere: "Federal",
      phone: "0800 616161",
      site: "https://acessounico.mec.gov.br/fies",
      openingHours: "Segunda a Sexta, das 08h às 20h"
    },
    targetGroups: ["Estudante"],
    enrollmentPeriod: { isContinuous: false, endDate: "2026-06-06" }, // Expires in ~5 days
    iconType: "education",
    relevanceScore: 90,
    requirements: { 
      requiresStudent: true,
      exceptions: "Cursos de Medicina possuem regras e tetos de financiamento diferenciados.",
      baseYear: 2024
    },
    documents: [
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-0", name: "Boletim de notas do ENEM", isOptional: false },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-1", name: "RG e CPF do estudante e do fiador", isOptional: false },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-2", name: "Comprovantes de renda do fiador e da família", isOptional: false }
    ],
    steps: [
      "Inscreva-se no sistema do FIES com a nota do ENEM",
      "Se pré-selecionado, valide as informações na instituição de ensino",
      "Compareça ao agente financeiro (banco) com o fiador para assinar o contrato"
    ],
    faqs: [
      {
        id: "faq-edu-1-1",
        question: "Como faço para solicitar este benefício?",
        answer: "A solicitação pode ser feita através dos canais oficiais indicados nos passos acima, seja presencialmente ou pelas plataformas digitais do governo.",
        isPopular: true
      },
      {
        id: "faq-edu-1-2",
        question: "Existem taxas para o processo?",
        answer: "A maioria dos serviços governamentais sociais é gratuita, mas verifique a seção de detalhes para eventuais custos de emissão de documentos.",
        isPopular: false
      }
    ],
    updates: [
      {
        id: "upd-edu-1-1",
        date: "2026-01-15",
        title: "Revisão Anual de Benefício",
        description: "As regras gerais e valores base foram revisados conforme a legislação vigente do novo ano fiscal.",
        affectsEligibility: false
      }
    ]
  },
  {
    id: "edu-2",
    title: "PROUNI",
    description: "Bolsas de estudo integrais ou parciais em instituições privadas.",
    provider: "MEC",
    providerDetails: {
      name: "Ministério da Educação",
      sphere: "Federal",
      phone: "0800 616161",
      site: "https://acessounico.mec.gov.br/prouni",
      openingHours: "Segunda a Sexta, das 08h às 20h"
    },
    targetGroups: ["Estudante", "Baixa Renda"],
    enrollmentPeriod: { isContinuous: false, endDate: "2026-06-02" }, // Expires in < 48h
    iconType: "education",
    relevanceScore: 95,
    requirements: { requiresStudent: true, maxIncome: 4236 },
    documents: [
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-0", name: "Boletim de notas do ENEM do ano anterior", isOptional: false },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-1", name: "Comprovante de Ensino Médio em escola pública (ou bolsa integral em escola particular)", isOptional: false },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-2", name: "Documentos de identificação familiar", isOptional: false }
    ],
    steps: [
      "Acesse o site oficial do Prouni durante o período de inscrições",
      "Escolha as opções de curso",
      "Aguarde o resultado e comprove as informações diretamente na faculdade"
    ],
    faqs: [
      {
        id: "faq-edu-2-1",
        question: "Como faço para solicitar este benefício?",
        answer: "A solicitação pode ser feita através dos canais oficiais indicados nos passos acima, seja presencialmente ou pelas plataformas digitais do governo.",
        isPopular: true
      },
      {
        id: "faq-edu-2-2",
        question: "Existem taxas para o processo?",
        answer: "A maioria dos serviços governamentais sociais é gratuita, mas verifique a seção de detalhes para eventuais custos de emissão de documentos.",
        isPopular: false
      }
    ],
    updates: [
      {
        id: "upd-edu-2-1",
        date: "2026-01-15",
        title: "Revisão Anual de Benefício",
        description: "As regras gerais e valores base foram revisados conforme a legislação vigente do novo ano fiscal.",
        affectsEligibility: false
      }
    ]
  },
  {
    id: "trib-1",
    title: "Isenção de IPVA para PcD",
    description: "Dispensa do pagamento anual do IPVA para veículos registrados em nome de PcD.",
    provider: "Sefaz",
    providerDetails: {
      name: "Secretaria da Fazenda do Estado",
      sphere: "Estadual",
      site: "https://www.fazenda.sp.gov.br",
      openingHours: "Segunda a Sexta, das 09h às 16h"
    },
    targetGroups: ["PcD"],
    iconType: "transport",
    relevanceScore: 88,
    requirements: { 
      requiresPcD: true,
      exceptions: "O veículo adaptado não pode ultrapassar o valor venal estipulado pelo Convênio ICMS (atualmente R$ 120 mil).",
      baseYear: 2024
    },
    documents: [
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-0", name: "Laudo médico emitido por clínica conveniada ao Detran", isOptional: false },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-1", name: "CNH com restrição", isOptional: false },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-2", name: "Documentos do veículo (CRLV)", isOptional: false }
    ],
    steps: [
      "Agende a perícia médica pelo site do Detran",
      "Obtenha a CNH especial com a restrição adequada",
      "Acesse o site da SEFAZ do seu estado e solicite a isenção online"
    ],
    faqs: [
      {
        id: "faq-trib-1-1",
        question: "Como faço para solicitar este benefício?",
        answer: "A solicitação pode ser feita através dos canais oficiais indicados nos passos acima, seja presencialmente ou pelas plataformas digitais do governo.",
        isPopular: true
      },
      {
        id: "faq-trib-1-2",
        question: "Existem taxas para o processo?",
        answer: "A maioria dos serviços governamentais sociais é gratuita, mas verifique a seção de detalhes para eventuais custos de emissão de documentos.",
        isPopular: false
      }
    ],
    updates: [
      {
        id: "upd-trib-1-1",
        date: "2026-01-15",
        title: "Revisão Anual de Benefício",
        description: "As regras gerais e valores base foram revisados conforme a legislação vigente do novo ano fiscal.",
        affectsEligibility: false
      }
    ]
  },
  {
    id: "lei-1",
    title: "Lei Maria da Penha (Abrigamento)",
    description: "Proteção e acolhimento em Casas Abrigo para mulheres em situação de violência doméstica.",
    provider: "Polícia Civil",
    providerDetails: {
      name: "Delegacia de Defesa da Mulher (DDM)",
      sphere: "Estadual",
      phone: "180",
      site: "https://www.gov.br/mdh",
      openingHours: "Atendimento 24h"
    },
    targetGroups: ["Mulher", "Vítima"],
    iconType: "housing",
    relevanceScore: 98,
    itemType: "law",
    requirements: { targetGender: "Feminino" },
    documents: [
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-0", name: "Boletim de Ocorrência (se possível)", isOptional: true },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-1", name: "Documento de identificação (se houver possibilidade de pegar antes da fuga)", isOptional: true }
    ],
    steps: [
      "Ligue 180 (Central de Atendimento à Mulher) ou 190 em caso de emergência",
      "Procure a Delegacia da Mulher (DEAM) mais próxima",
      "Solicite medida protetiva de urgência",
      "Peça encaminhamento para a rede de acolhimento (Casa Abrigo)"
    ],
    faqs: [
      {
        id: "faq-lei-1-1",
        question: "Como faço para solicitar este benefício?",
        answer: "A solicitação pode ser feita através dos canais oficiais indicados nos passos acima, seja presencialmente ou pelas plataformas digitais do governo.",
        isPopular: true
      },
      {
        id: "faq-lei-1-2",
        question: "Existem taxas para o processo?",
        answer: "A maioria dos serviços governamentais sociais é gratuita, mas verifique a seção de detalhes para eventuais custos de emissão de documentos.",
        isPopular: false
      }
    ],
    updates: [
      {
        id: "upd-lei-1-1",
        date: "2026-01-15",
        title: "Revisão Anual de Benefício",
        description: "As regras gerais e valores base foram revisados conforme a legislação vigente do novo ano fiscal.",
        affectsEligibility: false
      }
    ]
  },
  {
    id: "lei-4",
    title: "CLT: Licença Maternidade",
    description: "Direito a 120 dias de licença remunerada para mães trabalhadoras.",
    provider: "INSS",
    providerDetails: {
      name: "Instituto Nacional do Seguro Social",
      sphere: "Federal",
      phone: "135",
      site: "https://meu.inss.gov.br",
      openingHours: "Segunda a Sábado, das 07h às 22h"
    },
    targetGroups: ["Gestante"],
    iconType: "health",
    relevanceScore: 95,
    requirements: { requiresPregnant: true },
    documents: [
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-0", name: "Atestado Médico indicando a necessidade do afastamento (a partir do 28º dia antes do parto)", isOptional: false },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-1", name: "Certidão de Nascimento da Criança (após o nascimento)", isOptional: false },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-2", name: "Carteira de Trabalho", isOptional: false }
    ],
    steps: [
      "Avise o RH da sua empresa sobre a gravidez com antecedência",
      "Entregue o atestado médico ou a certidão de nascimento ao setor de Recursos Humanos",
      "A empresa comunicará o INSS e providenciará o pagamento da licença",
      "Caso seja autônoma ou MEI, faça a solicitação diretamente no aplicativo Meu INSS"
    ],
    faqs: [
      {
        id: "faq-lei-4-1",
        question: "Como faço para solicitar este benefício?",
        answer: "A solicitação pode ser feita através dos canais oficiais indicados nos passos acima, seja presencialmente ou pelas plataformas digitais do governo.",
        isPopular: true
      },
      {
        id: "faq-lei-4-2",
        question: "Existem taxas para o processo?",
        answer: "A maioria dos serviços governamentais sociais é gratuita, mas verifique a seção de detalhes para eventuais custos de emissão de documentos.",
        isPopular: false
      }
    ],
    updates: [
      {
        id: "upd-lei-4-1",
        date: "2026-01-15",
        title: "Revisão Anual de Benefício",
        description: "As regras gerais e valores base foram revisados conforme a legislação vigente do novo ano fiscal.",
        affectsEligibility: false
      }
    ]
  },
  {
    id: "id-jovem",
    title: "ID Jovem",
    description: "Documento que garante meia-entrada em eventos artísticos, culturais e esportivos, além de vagas gratuitas ou com desconto em transportes coletivos interestaduais.",
    provider: "Secretaria Nacional da Juventude",
    providerDetails: {
      name: "Secretaria Nacional da Juventude",
      sphere: "Federal",
      site: "https://www.gov.br/secretariageral/pt-br/juventude"
    },
    targetGroups: ["Jovem", "Estudante", "Baixa Renda"],
    iconType: "transport",
    relevanceScore: 94,
    requirements: { 
      minAge: 15,
      maxAge: 29,
      maxIncome: 1412,
      requiresStudent: true,
      requiresCadUnico: true
    },
    documents: [
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-0", name: "NIS (Número de Identificação Social)", isOptional: false },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-1", name: "Documento de Identidade oficial com foto", isOptional: true }
    ],
    steps: [
      "Verifique se o seu CadÚnico está atualizado há pelo menos 24 meses",
      "Baixe o aplicativo ID Jovem no seu celular",
      "Preencha com o seu NIS e gere a carteirinha virtual"
    ],
    faqs: [
      {
        id: "faq-id-jovem-1",
        question: "Como faço para solicitar este benefício?",
        answer: "A solicitação pode ser feita através dos canais oficiais indicados nos passos acima, seja presencialmente ou pelas plataformas digitais do governo.",
        isPopular: true
      },
      {
        id: "faq-id-jovem-2",
        question: "Existem taxas para o processo?",
        answer: "A maioria dos serviços governamentais sociais é gratuita, mas verifique a seção de detalhes para eventuais custos de emissão de documentos.",
        isPopular: false
      }
    ],
    updates: [
      {
        id: "upd-id-jovem-1",
        date: "2026-01-15",
        title: "Revisão Anual de Benefício",
        description: "As regras gerais e valores base foram revisados conforme a legislação vigente do novo ano fiscal.",
        affectsEligibility: false
      }
    ]
  },
  {
    id: "estatuto-idoso",
    title: "Estatuto da Pessoa Idosa",
    description: "Lei que assegura direitos fundamentais às pessoas com 60 anos ou mais, incluindo atendimento preferencial, gratuidade em transportes coletivos e proteção contra discriminação.",
    provider: "Legislação Federal",
    providerDetails: {
      name: "Governo Federal",
      sphere: "Federal",
      site: "https://www.planalto.gov.br/ccivil_03/leis/2003/l10.741.htm"
    },
    targetGroups: ["Idoso"],
    itemType: "law",
    iconType: "health",
    relevanceScore: 100,
    requirements: { 
      minAge: 60
    },
    documents: [
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-0", name: "Documento de Identidade oficial com foto para comprovação de idade", isOptional: true }
    ],
    steps: [
      "Apresente seu documento de identidade para ter acesso a filas prioritárias e transporte gratuito"
    ],
    faqs: [
      {
        id: "faq-estatuto-idoso-1",
        question: "Como faço para solicitar este benefício?",
        answer: "A solicitação pode ser feita através dos canais oficiais indicados nos passos acima, seja presencialmente ou pelas plataformas digitais do governo.",
        isPopular: true
      },
      {
        id: "faq-estatuto-idoso-2",
        question: "Existem taxas para o processo?",
        answer: "A maioria dos serviços governamentais sociais é gratuita, mas verifique a seção de detalhes para eventuais custos de emissão de documentos.",
        isPopular: false
      }
    ],
    updates: [
      {
        id: "upd-estatuto-idoso-1",
        date: "2026-01-15",
        title: "Revisão Anual de Benefício",
        description: "As regras gerais e valores base foram revisados conforme a legislação vigente do novo ano fiscal.",
        affectsEligibility: false
      }
    ]
  },
  {
    id: "estatuto-juventude",
    title: "Estatuto da Juventude",
    description: "Lei que dispõe sobre os direitos dos jovens e as políticas públicas de juventude, garantindo acesso à educação, profissionalização, trabalho e renda.",
    provider: "Legislação Federal",
    providerDetails: {
      name: "Governo Federal",
      sphere: "Federal",
      site: "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/lei/l12852.htm"
    },
    targetGroups: ["Jovem"],
    itemType: "law",
    iconType: "education",
    relevanceScore: 95,
    requirements: { 
      minAge: 15,
      maxAge: 29
    },
    documents: [],
    steps: [],
    faqs: [
      {
        id: "faq-estatuto-juventude-1",
        question: "Como faço para solicitar este benefício?",
        answer: "A solicitação pode ser feita através dos canais oficiais indicados nos passos acima, seja presencialmente ou pelas plataformas digitais do governo.",
        isPopular: true
      },
      {
        id: "faq-estatuto-juventude-2",
        question: "Existem taxas para o processo?",
        answer: "A maioria dos serviços governamentais sociais é gratuita, mas verifique a seção de detalhes para eventuais custos de emissão de documentos.",
        isPopular: false
      }
    ],
    updates: [
      {
        id: "upd-estatuto-juventude-1",
        date: "2026-01-15",
        title: "Revisão Anual de Benefício",
        description: "As regras gerais e valores base foram revisados conforme a legislação vigente do novo ano fiscal.",
        affectsEligibility: false
      }
    ]
  },
  {
    id: "clt-universal",
    title: "CLT: Direitos Trabalhistas",
    description: "A Consolidação das Leis do Trabalho garante a todos os trabalhadores de carteira assinada direitos universais como férias, 13º salário, FGTS e seguro-desemprego.",
    provider: "Ministério do Trabalho",
    providerDetails: {
      name: "Ministério do Trabalho e Emprego",
      sphere: "Federal",
      site: "https://www.gov.br/trabalho-e-emprego"
    },
    targetGroups: ["Geral"],
    itemType: "law",
    iconType: "money",
    relevanceScore: 100,
    documents: [
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-0", name: "Carteira de Trabalho e Previdência Social (CTPS)", isOptional: false },
      { id: "doc-${Math.random().toString(36).substr(2, 5)}-1", name: "Contrato de Trabalho ativo", isOptional: false }
    ],
    steps: [
      "Acesse o aplicativo Carteira de Trabalho Digital",
      "Acompanhe seus registros, férias e pagamentos através do portal do Governo Federal"
    ],
    faqs: [
      {
        id: "faq-clt-universal-1",
        question: "Como faço para solicitar este benefício?",
        answer: "A solicitação pode ser feita através dos canais oficiais indicados nos passos acima, seja presencialmente ou pelas plataformas digitais do governo.",
        isPopular: true
      },
      {
        id: "faq-clt-universal-2",
        question: "Existem taxas para o processo?",
        answer: "A maioria dos serviços governamentais sociais é gratuita, mas verifique a seção de detalhes para eventuais custos de emissão de documentos.",
        isPopular: false
      }
    ],
    updates: [
      {
        id: "upd-clt-universal-1",
        date: "2026-01-15",
        title: "Revisão Anual de Benefício",
        description: "As regras gerais e valores base foram revisados conforme a legislação vigente do novo ano fiscal.",
        affectsEligibility: false
      }
    ]
  },
  {
    id: "sisu",
    title: "Sistema de Seleção Unificada (Sisu)",
    description: "Programa federal que oferece vagas em instituições públicas de ensino superior utilizando as notas do Enem.",
    provider: "MEC",
    providerDetails: {
      name: "Ministério da Educação",
      sphere: "Federal",
      site: "https://acessounico.mec.gov.br/sisu"
    },
    targetGroups: ["Estudante", "Jovens"],
    enrollmentPeriod: { startDate: "2026-06-14", endDate: "2026-06-25", isContinuous: false },
    iconType: "education",
    relevanceScore: 90,
    itemType: "benefit",
    requirements: {
      requiresStudent: true
    },
    steps: [
      "Tenha em mãos o número de inscrição e a senha do Enem do ano anterior",
      "Acesse o Portal Único de Acesso ao Ensino Superior",
      "Escolha até duas opções de curso",
      "Acompanhe as notas de corte diariamente"
    ],
    details: {
      modality: "Online",
      estimatedTime: "Imediato durante o período de inscrição",
      isFree: true,
      channels: [
        { type: "Site", value: "Portal Sisu", link: "https://acessounico.mec.gov.br/sisu" }
      ]
    },
    faqs: [
      {
        id: "faq-sisu-1",
        question: "Como faço para solicitar este benefício?",
        answer: "A solicitação pode ser feita através dos canais oficiais indicados nos passos acima, seja presencialmente ou pelas plataformas digitais do governo.",
        isPopular: true
      },
      {
        id: "faq-sisu-2",
        question: "Existem taxas para o processo?",
        answer: "A maioria dos serviços governamentais sociais é gratuita, mas verifique a seção de detalhes para eventuais custos de emissão de documentos.",
        isPopular: false
      }
    ],
    updates: [
      {
        id: "upd-sisu-1",
        date: "2026-01-15",
        title: "Revisão Anual de Benefício",
        description: "As regras gerais e valores base foram revisados conforme a legislação vigente do novo ano fiscal.",
        affectsEligibility: false
      }
    ]
  },
  {
    id: "prouni",
    title: "Programa Universidade para Todos (Prouni)",
    description: "Concede bolsas de estudo integrais e parciais (50%) em cursos de graduação em instituições privadas de ensino superior.",
    provider: "MEC",
    providerDetails: {
      name: "Ministério da Educação",
      sphere: "Federal",
      site: "https://acessounico.mec.gov.br/prouni"
    },
    targetGroups: ["Estudante", "Baixa Renda"],
    enrollmentPeriod: { startDate: "2026-06-20", endDate: "2026-06-30", isContinuous: false },
    iconType: "education",
    relevanceScore: 95,
    itemType: "benefit",
    requirements: {
      maxIncome: 4236, // até 3 salários mínimos per capita para bolsa parcial (1412 * 3)
      requiresStudent: true
    },
    steps: [
      "Acesse o Portal Único com sua conta gov.br",
      "Pesquise as bolsas disponíveis por curso ou instituição",
      "Verifique os requisitos de renda (integral até 1.5 salário mínimo per capita, parcial até 3 salários)",
      "Confirme sua inscrição"
    ],
    details: {
      modality: "Online",
      estimatedTime: "Imediato durante o período de inscrição",
      isFree: true,
      channels: [
        { type: "Site", value: "Portal Prouni", link: "https://acessounico.mec.gov.br/prouni" }
      ]
    },
    faqs: [
      {
        id: "faq-prouni-1",
        question: "Como faço para solicitar este benefício?",
        answer: "A solicitação pode ser feita através dos canais oficiais indicados nos passos acima, seja presencialmente ou pelas plataformas digitais do governo.",
        isPopular: true
      },
      {
        id: "faq-prouni-2",
        question: "Existem taxas para o processo?",
        answer: "A maioria dos serviços governamentais sociais é gratuita, mas verifique a seção de detalhes para eventuais custos de emissão de documentos.",
        isPopular: false
      }
    ],
    updates: [
      {
        id: "upd-prouni-1",
        date: "2026-01-15",
        title: "Revisão Anual de Benefício",
        description: "As regras gerais e valores base foram revisados conforme a legislação vigente do novo ano fiscal.",
        affectsEligibility: false
      }
    ]
  },
  {
    id: "ipi-icms-pcd",
    title: "Isenção de IPI e ICMS (Veículos 0km para PcD)",
    description: "Direito de adquirir um veículo 0km com isenção total de IPI (Imposto sobre Produtos Industrializados) e ICMS.",
    provider: "Receita Federal / Sefaz",
    providerDetails: {
      name: "Receita Federal do Brasil",
      sphere: "Federal",
      site: "https://www.gov.br/receitafederal"
    },
    targetGroups: ["PcD"],
    iconType: "transport",
    relevanceScore: 92,
    itemType: "benefit",
    requirements: {
      requiresPcD: true,
      exceptions: "Para o ICMS, o valor do veículo não pode ultrapassar o teto estipulado pelo Convênio ICMS. O benefício se estende a NÃO-CONDUTORES (pessoas com deficiência grave que não dirigem)."
    },
    steps: [
      "Obtenha um Laudo Médico Pericial em uma clínica credenciada pelo Detran",
      "Caso seja condutor, altere sua CNH para incluir as restrições médicas",
      "Solicite a Isenção de IPI via portal SISEN da Receita Federal",
      "Solicite a Isenção de ICMS na Secretaria da Fazenda do seu estado",
      "Vá até a concessionária escolhida com as cartas de isenção"
    ],
    details: {
      modality: "Online",
      estimatedTime: "30 a 60 dias para obter ambas as autorizações",
      isFree: true,
      channels: [
        { type: "Site", value: "Portal SISEN (Receita Federal)" }
      ]
    },
    faqs: [
      {
        id: "faq-ipi-icms-pcd-1",
        question: "Como faço para solicitar este benefício?",
        answer: "A solicitação pode ser feita através dos canais oficiais indicados nos passos acima, seja presencialmente ou pelas plataformas digitais do governo.",
        isPopular: true
      },
      {
        id: "faq-ipi-icms-pcd-2",
        question: "Existem taxas para o processo?",
        answer: "A maioria dos serviços governamentais sociais é gratuita, mas verifique a seção de detalhes para eventuais custos de emissão de documentos.",
        isPopular: false
      }
    ],
    updates: [
      {
        id: "upd-ipi-icms-pcd-1",
        date: "2026-01-15",
        title: "Revisão Anual de Benefício",
        description: "As regras gerais e valores base foram revisados conforme a legislação vigente do novo ano fiscal.",
        affectsEligibility: false
      }
    ]
  }
];
