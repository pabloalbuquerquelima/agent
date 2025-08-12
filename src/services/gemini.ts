import { GoogleGenAI } from "@google/genai";
import { env } from "../env.ts";

export const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

const model = "gemini-2.5-flash";

export async function transcribeAudio(audioAsBase64: string, mimeType: string) {
  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: "Transcreva o áudio para português do Brasil. Seja preciso e natural na transcrição. Mantenha a pontuação correta.",
      },
      {
        inlineData: {
          mimeType,
          data: audioAsBase64,
        },
      },
    ],
  });

  if (!response.text) {
    throw new Error("No transcription available");
  }

  return response.text;
}

export async function generateEmbeddings(text: string) {
  const response = await gemini.models.embedContent({
    model: "text-embedding-004",
    contents: [
      {
        text,
      },
    ],
    config: {
      taskType: "RETRIEVAL_DOCUMENT",
    },
  });

  if (!response.embeddings || response.embeddings.length === 0) {
    throw new Error("No embeddings generated");
  }

  return response.embeddings[0].values;
}

export async function generateAnswer(question: string, transcriptions: string[]) {
  const context = transcriptions.join("\n\n");
  const prompt = `
  Com base no contexto abaixo, responda a pergunta de forma clara e objetiva.
  Pergunta: ${question}
  Contexto: ${context}

  INSTRUÇÕES:
  - Responda apenas com a resposta direta à pergunta e contidas no contexto enviado.
  - Se não for encontrada uma resposta no contexto, responda "Desculpe, não sei a resposta para isso".
  - Não inclua informações adicionais ou suposições.
  - Seja objetivo e direto ao ponto.
  - Use uma linguagem simples e clara, evitando jargões técnicos.
  - Responda em português do Brasil.
  - Mantenha o tom profissional e educado.
  - Não cite o contexto na resposta.
  `.trim();

  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: prompt,
      },
    ],
  });

  if (!response.text) {
    throw new Error("No answer generated");
  }

  return response.text;
}
