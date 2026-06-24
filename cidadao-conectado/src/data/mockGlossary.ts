export interface GlossaryTermData {
  id: string;
  term: string;
  simpleDefinition: string;
  example: string;
  relatedBenefits?: string[];
}

export const mockGlossary: GlossaryTermData[] = [
  {
    id: "cadunico",
    term: "CadÚnico",
    simpleDefinition: "É a grande lista do Governo Federal que mostra quem são as famílias de baixa renda no Brasil e como elas vivem.",
    example: "Se você quer receber o Bolsa Família ou desconto na conta de luz, seu nome e da sua família precisam estar nesta lista atualizados.",
    relatedBenefits: ["bolsa-familia", "tarifa-social", "bpc"]
  },
  {
    id: "per-capita",
    term: "Renda Per Capita",
    simpleDefinition: "É o valor que sobra se você juntar todo o dinheiro que as pessoas da sua casa ganham num mês e dividir igualmente pela quantidade de pessoas que moram aí (incluindo as crianças).",
    example: "Se o pai e a mãe ganham R$ 1.000 cada, a casa tem R$ 2.000. Se eles têm 2 filhos (4 pessoas no total), a renda 'Per Capita' é R$ 500 para cada um."
  },
  {
    id: "nis",
    term: "NIS",
    simpleDefinition: "Número de Identificação Social. É como se fosse um CPF, mas focado nos benefícios do governo. Quem tem carteira assinada também o conhece como PIS.",
    example: "Você precisará do seu número de NIS para emitir o ID Jovem ou ver o calendário do Bolsa Família.",
    relatedBenefits: ["id-jovem", "tarifa-social"]
  },
  {
    id: "clt",
    term: "CLT",
    simpleDefinition: "É o trabalhador que tem a 'Carteira de Trabalho Assinada'. Significa que ele trabalha com todas as garantias da lei, como férias, 13º salário e FGTS.",
    example: "A padaria assinou a carteira do João, então ele agora é um trabalhador CLT.",
    relatedBenefits: ["clt-universal", "lei-4"]
  },
  {
    id: "mei",
    term: "MEI",
    simpleDefinition: "Microempreendedor Individual. É um jeito simples de quem trabalha por conta própria (autônomo) ter um CNPJ de forma barata e legalizada, pagando impostos reduzidos.",
    example: "Maria faz bolos para vender e abriu um MEI para poder ter direitos no INSS (aposentadoria e auxílio-doença) pagando pouco por mês."
  },
  {
    id: "cid",
    term: "CID",
    simpleDefinition: "Classificação Internacional de Doenças. É um código mundial usado por médicos para dizer exatamente qual é a doença, sintoma ou deficiência de um paciente.",
    example: "No laudo médico da Receita Federal, o doutor anotou o código G35, que é o CID específico para a Esclerose Múltipla."
  },
  {
    id: "beneficio-assistencial",
    term: "Benefício Assistencial",
    simpleDefinition: "São ajudas do governo (em dinheiro ou não) pagas a quem mais precisa, e que não exigem que a pessoa tenha pagado impostos ou INSS antes.",
    example: "O BPC (para idosos ou pessoas com deficiência carentes) é um benefício assistencial. Não precisou pagar carnê do INSS para ter direito.",
    relatedBenefits: ["bpc"]
  },
  {
    id: "beneficio-previdenciario",
    term: "Benefício Previdenciário",
    simpleDefinition: "São valores pagos pelo INSS para os trabalhadores que contribuíram (pagaram impostos mensais) quando ficaram sem poder trabalhar.",
    example: "A Aposentadoria e o Auxílio-Doença só são pagos para quem já estava contribuindo mensalmente com o INSS."
  }
];
