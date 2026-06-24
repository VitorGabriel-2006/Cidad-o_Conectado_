export interface LegislativeNews {
  id: string;
  title: string;
  summary: string;
  category: string;
  officialLink: string;
  date: string;
  views: number;
}

const mockNews: LegislativeNews[] = [
  {
    id: "legis-001",
    title: "Senado aprova ampliação da Tarifa Social de Energia para novas famílias de baixa renda",
    summary: "O Plenário do Senado Federal aprovou nesta terça-feira o Projeto de Lei que amplia os critérios de concessão da Tarifa Social de Energia Elétrica. A medida prevê a inclusão automática de famílias inscritas no Cadastro Único (CadÚnico) que possuam renda per capita de até um salário mínimo. Especialistas apontam que a desburocratização do acesso ajudará mais de 3 milhões de novos lares a obterem descontos de até 65% na conta de luz. O texto agora segue para sanção presidencial e as concessionárias terão 90 dias para adaptar seus sistemas automatizados de faturamento cruzado com a base de dados do Governo Federal.",
    category: "Benefícios",
    officialLink: "https://www12.senado.leg.br/noticias",
    date: "19 Jun 2026",
    views: 15400
  },
  {
    id: "legis-002",
    title: "Nova regulamentação do Trabalho Remoto garante direitos de desconexão e insalubridade virtual",
    summary: "A Câmara dos Deputados concluiu a votação da 'CLT Digital', um marco regulatório focado nas novas dinâmicas do trabalho remoto e híbrido. Entre os principais pontos da nova legislação está a garantia ao 'direito à desconexão', proibindo que empregadores exijam respostas em aplicativos de mensagens corporativas fora do horário de expediente, sob pena de multa. Além disso, a lei inova ao introduzir o conceito de 'insalubridade ergonômica', obrigando as empresas a fornecerem auxílio financeiro comprovado para a aquisição de cadeiras adequadas e custeio de internet e energia. A oposição tentou flexibilizar a regra, mas o texto base foi mantido.",
    category: "Trabalho",
    officialLink: "https://www.camara.leg.br/noticias",
    date: "18 Jun 2026",
    views: 22100
  },
  {
    id: "legis-003",
    title: "Ministério da Saúde unifica Carteira Nacional de Vacinação em formato 100% digital e com blockchain",
    summary: "Em portaria conjunta publicada hoje no Diário Oficial da União, o Ministério da Saúde anunciou a transição definitiva do histórico vacinal de papel para um ambiente 100% digital protegido por tecnologia blockchain. A nova Carteira Nacional de Vacinação poderá ser acessada offline pelos cidadãos através do aplicativo oficial, garantindo portabilidade em viagens internacionais e matrículas escolares. A tecnologia blockchain foi adotada para prevenir fraudes em certificados de imunização. Postos de saúde terão o prazo de 6 meses para arquivar registros antigos e migrar para a base centralizada do SUS.",
    category: "Saúde",
    officialLink: "https://www.gov.br/saude",
    date: "15 Jun 2026",
    views: 8900
  },
  {
    id: "legis-004",
    title: "Mutirão Nacional para emissão da nova Carteira de Identidade Nacional (CIN) é estendido",
    summary: "O Ministério da Gestão e da Inovação em Serviços Públicos prorrogou por mais 60 dias o mutirão nacional para a emissão gratuita da nova Carteira de Identidade Nacional (CIN), que adota o CPF como número único de identificação. A decisão atende ao pedido de governadores do Nordeste e Norte, onde a procura superou a capacidade de agendamento dos institutos de identificação locais. O documento possui padrões rigorosos de segurança e a primeira via em papel-moeda continuará sendo isenta de taxas. A emissão pode ser agendada pelos canais oficiais de atendimento ao cidadão.",
    category: "Documentação",
    officialLink: "https://www.gov.br/gestao",
    date: "10 Jun 2026",
    views: 11250
  }
];

export async function fetchLegislativeNews(): Promise<LegislativeNews[]> {
  return new Promise((resolve) => {
    // Simulando latência de rede realista (1.5 segundos)
    setTimeout(() => {
      resolve([...mockNews]); // Retorna uma cópia para não mutar a base se reordenado depois
    }, 1500);
  });
}
