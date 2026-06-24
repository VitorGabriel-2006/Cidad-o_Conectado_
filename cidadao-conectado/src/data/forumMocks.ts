export interface ForumPost {
  id: string;
  title: string;
  content: string;
  topic: "Saúde" | "Trabalho" | "Documentação" | "Benefícios" | "Outros";
  author: string;
  upvotes: number;
  createdAt: string;
}

export const mockForumPosts: ForumPost[] = [
  {
    id: "post-1",
    title: "Alguém conseguiu o passe livre para acompanhante recentemente?",
    content: "Oi pessoal, a lei mudou recentemente e estou com dificuldades para aprovar o passe livre do meu filho com TEA, eles alegam que a renda ultrapassa. Alguém passou por isso?",
    topic: "Benefícios",
    author: "Cidadão Anônimo",
    upvotes: 42,
    createdAt: "2026-06-18T10:30:00Z"
  },
  {
    id: "post-2",
    title: "Tempo de espera para perícia do INSS está um absurdo!",
    content: "Agendei minha perícia e marcaram para daqui a 6 meses. O que eu faço enquanto isso se não tenho como trabalhar? Alguém tem dica de como antecipar?",
    topic: "Saúde",
    author: "Maria Oliveira",
    upvotes: 89,
    createdAt: "2026-06-17T14:15:00Z"
  },
  {
    id: "post-3",
    title: "Dica: Como renovar a identidade mais rápido",
    content: "Pessoal, descobri que se você agendar pelo app do gov.br de madrugada, aparecem várias vagas que o pessoal desiste. Consegui para o dia seguinte!",
    topic: "Documentação",
    author: "João Silva",
    upvotes: 120,
    createdAt: "2026-06-15T09:20:00Z"
  }
];
