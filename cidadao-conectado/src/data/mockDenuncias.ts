export type ViolationCategory = "Mulher" | "Idoso" | "Criança e Adolescente" | "Direitos Humanos" | "Emergência" | "Trabalho";

export interface NationalChannel {
  id: string;
  name: string;
  number: string;
  description: string;
  categories: ViolationCategory[];
  anonymousInfo?: string;
  type: "phone" | "website";
  url?: string;
}

export interface StateChannel {
  state: string; // Sigla (Ex: SP)
  delegaciaVirtualUrl: string;
  defensoriaPublicaUrl: string;
  ministerioPublicoUrl?: string;
}

export const nationalChannels: NationalChannel[] = [
  {
    id: "disque-100",
    name: "Disque Direitos Humanos",
    number: "100",
    description: "Para denúncias de violações de direitos humanos em geral, incluindo idosos, pessoas com deficiência e crianças.",
    categories: ["Direitos Humanos", "Idoso", "Criança e Adolescente"],
    anonymousInfo: "Ligação gratuita, anônima e disponível 24 horas por dia.",
    type: "phone"
  },
  {
    id: "disque-180",
    name: "Central de Atendimento à Mulher",
    number: "180",
    description: "Registra e encaminha denúncias de violência contra a mulher aos órgãos competentes.",
    categories: ["Mulher"],
    anonymousInfo: "A denúncia pode ser feita de forma anônima. Gratuito e 24h.",
    type: "phone"
  },
  {
    id: "pm-190",
    name: "Polícia Militar",
    number: "190",
    description: "Situações de emergência e risco iminente de violência.",
    categories: ["Emergência"],
    type: "phone"
  },
  {
    id: "samu-192",
    name: "SAMU",
    number: "192",
    description: "Atendimento médico de urgência.",
    categories: ["Emergência"],
    type: "phone"
  },
  {
    id: "conselho-tutelar",
    name: "Conselho Tutelar",
    number: "Consulte no Município",
    description: "Órgão encarregado de zelar pelos direitos da criança e do adolescente. Procure o conselho do seu município.",
    categories: ["Criança e Adolescente"],
    type: "website",
    url: "https://www.gov.br/mdh/pt-br/navegue-por-temas/crianca-e-adolescente/conselho-tutelar"
  },
  {
    id: "mpt",
    name: "Ministério Público do Trabalho (MPT)",
    number: "Denúncia Online",
    description: "Denúncias sobre trabalho escravo, infantil, discriminação ou irregularidades trabalhistas.",
    categories: ["Trabalho"],
    type: "website",
    url: "https://mpt.mp.br/pgt/servicos/servico-denuncie"
  }
];

export const states = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" }
];

export const stateChannels: Record<string, StateChannel> = {
  "SP": {
    state: "SP",
    delegaciaVirtualUrl: "https://www.delegaciaeletronica.policiacivil.sp.gov.br/",
    defensoriaPublicaUrl: "https://www.defensoria.sp.def.br/",
    ministerioPublicoUrl: "http://www.mpsp.mp.br/"
  },
  "RJ": {
    state: "RJ",
    delegaciaVirtualUrl: "https://dedic.pcivil.rj.gov.br/",
    defensoriaPublicaUrl: "https://defensoria.rj.def.br/",
    ministerioPublicoUrl: "http://www.mprj.mp.br/"
  },
  "MG": {
    state: "MG",
    delegaciaVirtualUrl: "https://delegaciavirtual.sids.mg.gov.br/",
    defensoriaPublicaUrl: "https://defensoria.mg.def.br/",
    ministerioPublicoUrl: "https://www.mpmg.mp.br/"
  },
  // Default fallback if a state doesn't have exact mapped values
  "DEFAULT": {
    state: "DEFAULT",
    delegaciaVirtualUrl: "https://www.gov.br/pt-br/servicos/registrar-ocorrencia-policial-online",
    defensoriaPublicaUrl: "https://www.anadep.org.br/wtk/pagina/defensorias",
    ministerioPublicoUrl: "https://www.cnmp.mp.br/portal/institucional/ministerio-publico"
  }
};
