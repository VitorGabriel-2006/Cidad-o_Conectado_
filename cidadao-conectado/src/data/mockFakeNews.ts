export interface FakeNewsAlert {
  id: string;
  title: string;
  circulatingMessage: string;
  explanation: string;
  officialSource: string;
  date: string;
  isMajorAlert: boolean;
}

export const mockFakeNews: FakeNewsAlert[] = [
  {
    id: "fake-1",
    title: "Saque Extraordinário do Bolsa Família via PIX Liberado Hoje",
    circulatingMessage: "URGENTE! Governo acabou de liberar PIX de R$ 800 para quem recebe Bolsa Família. Consulte seu CPF no link agora antes que acabe: http://sitefalso-golpe.com/pix",
    explanation: "Não existe pagamento de Bolsa Família via PIX liberado por links no WhatsApp. Todos os pagamentos oficiais são feitos exclusivamente na conta cadastrada no Caixa Tem ou no cartão do benefício. O Governo Federal nunca envia links pedindo seus dados para liberar pagamentos.",
    officialSource: "Ministério do Desenvolvimento e Assistência Social (MDS)",
    date: "2026-06-19",
    isMajorAlert: true,
  },
  {
    id: "fake-2",
    title: "Novo Auxílio Gás de R$ 300 - Cadastre-se no Link",
    circulatingMessage: "Novo Auxílio Gás aprovado no valor de R$ 300 mensais! Faça seu cadastro pelo WhatsApp e receba a primeira parcela hoje mesmo.",
    explanation: "O Auxílio Gás não exige cadastro por WhatsApp nem tem o valor de R$ 300 mensais. O benefício é concedido automaticamente para as famílias inscritas no CadÚnico que cumprem os requisitos. Jamais forneça seus dados em links suspeitos.",
    officialSource: "Caixa Econômica Federal",
    date: "2026-06-18",
    isMajorAlert: false,
  }
];
