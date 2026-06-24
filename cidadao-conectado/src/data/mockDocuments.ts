export interface DocumentFile {
  format: "PDF" | "DOCX";
  sizeKb: number;
  url: string; // Fictício
}

export interface DocumentModel {
  id: string;
  title: string;
  description: string;
  instructions: string;
  requiresNotary: boolean;
  category: "Assistencial" | "Residência" | "Saúde" | "Trabalhista";
  files: DocumentFile[];
}

export const mockDocuments: DocumentModel[] = [
  {
    id: "doc-residencia",
    title: "Declaração de Residência",
    description: "Substituto legal para comprovante de residência (conta de água/luz) quando o imóvel não está no nome do cidadão.",
    instructions: "Preencha com seus dados completos e peça para o proprietário ou locador da casa onde você mora assinar junto com você. É necessário anexar uma cópia do RG do dono da casa se for levar no Detran ou na Polícia Federal.",
    requiresNotary: false,
    category: "Residência",
    files: [
      { format: "PDF", sizeKb: 145, url: "#simulated-pdf" },
      { format: "DOCX", sizeKb: 22, url: "#simulated-docx" }
    ]
  },
  {
    id: "doc-pobreza",
    title: "Declaração de Hipossuficiência (Atestado de Pobreza)",
    description: "Documento oficial exigido para garantir gratuidade em taxas de cartório, defensoria pública ou isenção em concursos públicos.",
    instructions: "Atenção: Declarar pobreza sendo uma pessoa de posses é crime de falsidade ideológica. O documento deve ser assinado pelo próprio cidadão. Algumas instituições pedem que seja carimbado em cartório para validar sua identidade.",
    requiresNotary: true,
    category: "Assistencial",
    files: [
      { format: "PDF", sizeKb: 89, url: "#simulated-pdf" },
      { format: "DOCX", sizeKb: 15, url: "#simulated-docx" }
    ]
  },
  {
    id: "doc-vida",
    title: "Prova de Vida (Procurador)",
    description: "Formulário para que um procurador legalmente autorizado comprove a vida do beneficiário idoso junto ao INSS.",
    instructions: "Este formulário deve ser levado a um Cartório de Notas na presença do idoso. O tabelião fará o reconhecimento por verdadeira autenticidade. O procurador não pode assinar pelo idoso a menos que tenha Procuração Pública específica para isso.",
    requiresNotary: true,
    category: "Saúde",
    files: [
      { format: "PDF", sizeKb: 210, url: "#simulated-pdf" }
    ]
  },
  {
    id: "doc-uniao-estavel",
    title: "Declaração de União Estável Particular",
    description: "Serve para comprovar o vínculo familiar na hora de somar a Renda Per Capita ou pedir inclusão no plano de saúde.",
    instructions: "Ambos os parceiros devem assinar. Para ter valor legal em órgãos federais (como INSS), é recomendável assinar com duas testemunhas maiores de 18 anos.",
    requiresNotary: false,
    category: "Assistencial",
    files: [
      { format: "PDF", sizeKb: 110, url: "#simulated-pdf" },
      { format: "DOCX", sizeKb: 18, url: "#simulated-docx" }
    ]
  }
];
