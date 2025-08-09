import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod/v4";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";

export const createQuestionRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/rooms/:roomId/questions",
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
        body: z.object({
          question: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params;
      const { question } = request.body;

      const results = await db
        .insert(schema.questions)
        .values({
          question,
          room_id: roomId,
        })
        .returning();

      const insertedRoom = results[0];

      if (!insertedRoom) {
        throw new Error("No questions found for this room");
      }

      return reply.status(201).send({ questionId: insertedRoom.id });
    }
  );
};
