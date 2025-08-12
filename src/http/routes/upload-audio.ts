import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod/v4";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import { generateEmbeddings, transcribeAudio } from "../../services/gemini.ts";

export const uploadAudioRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/rooms/:roomId/audio",
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params;
      const audio = await request.file();

      if (!audio) {
        return reply.status(400).send({ error: "No audio file uploaded" });
      }

      const audioAsBase64 = await audio
        .toBuffer()
        .then((buffer) => buffer.toString("base64"));

      const transcription = await transcribeAudio(
        audioAsBase64,
        audio.mimetype
      );

      const embeddings = await generateEmbeddings(transcription);
      if (embeddings === undefined) {
        throw new Error("Failed to generate embeddings");
      }

      const result = await db
        .insert(schema.audioChunks)
        .values({
          room_id: roomId,
          transcription,
          embeddings,
        })
        .returning();

      const chunk = result[0];

      if (!chunk) {
        throw new Error("Failed to insert audio chunk into the database");
      }

      return reply.status(201).send({
        id: chunk.id,
      });
    }
  );
};
