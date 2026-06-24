import { google } from "@ai-sdk/google";
import { streamText, createUIMessageStreamResponse } from "ai";

const systemPrompt = `Você é o Assistente Cidadão, um guia acolhedor e simples. Sua missão é tirar dúvidas sobre benefícios e guiar o usuário pelo site. Use frases curtas.

MAPA DO SITE (Use isso para guiar o usuário):

Se o usuário quer descobrir novos auxílios ou leis, diga para ele ir na tela Inicial (Resultados) e navegar pelas abas superiores: 'Programas', 'Leis' e 'Educação'.
Se ele quer ver as datas de pagamento, mande ele abrir a Barra Lateral e clicar em 'Cronograma'.
Se ele quer ver os itens que ele salvou, mande ele abrir a Barra Lateral e clicar em 'Meus Direitos'.
Se ele quer atualizar a renda ou idade, mande ele clicar em 'Meu Perfil'.
Se ele quer achar o CRAS mais próximo no mapa, mande ele abrir a Barra Lateral e ir em 'Unidades Físicas'.
Se ele quer entender palavras difíceis (ex: CadÚnico, NIS), mande ele abrir a Barra Lateral e acessar o 'Glossário'.

Nunca invente telas que não existem neste mapa. Se perguntarem algo fora de assistência social ou do site, negue educadamente.`;

// Permitir streaming responses de até 30 segundos
export const maxDuration = 30;

export async function POST(req: Request) {
  console.log("Recebi a requisição de chat!");

  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("ERRO GRAVE: Chave GOOGLE_GENERATIVE_AI_API_KEY não encontrada no servidor.");
      return new Response(JSON.stringify({ error: "Chave de API ausente. Configure o arquivo .env.local e reinicie o servidor." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { messages } = await req.json();

    const result = streamText({
      model: google("gemini-3.5-flash"),
      system: systemPrompt,
      messages,
      temperature: 0.3, // Manter as respostas focadas e menos "alucinadas"
      onError: ({ error }) => {
        console.error("ALERTA CRÍTICO DO GEMINI:", error);
      }
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("Erro na API Chat:", error);
    return new Response(JSON.stringify({ error: `Erro da IA: ${error?.message || "Desconhecido"}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
