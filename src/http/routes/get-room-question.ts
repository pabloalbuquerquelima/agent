import { desc, eq } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod/v4";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";

export const getRoomQuestionsRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    "/rooms/:roomId/questions",
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request) => {
      const { roomId } = request.params;
      const results = await db
        .select({
          id: schema.questions.id,
          question: schema.questions.question,
          answer: schema.questions.answer,
          createdAt: schema.questions.created_at,
        })
        .from(schema.questions)
        .where(eq(schema.questions.room_id, roomId))
        .orderBy(desc(schema.questions.created_at));

      if (results.length === 0) {
        throw new Error("No questions found for this room");
      }

      return results;
    }
  );
};
