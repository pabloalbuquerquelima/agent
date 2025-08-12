import { fastifyCors } from "@fastify/cors";
import { fastifyMultipart } from "@fastify/multipart";
import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "./env.ts";
import { createQuestionRoute } from "./http/routes/create-question.ts";
import { createRoomRoute } from "./http/routes/create-room.ts"; // import from ("./http/routes/create-room.ts"
import { getRoomQuestionsRoute } from "./http/routes/get-room-question.ts";
import { getRoomsRoute } from "./http/routes/get-rooms.ts";
import { uploadAudioRoute } from "./http/routes/upload-audio.ts";

const app = fastify()
  .withTypeProvider<ZodTypeProvider>()
  .register(fastifyCors, {
    origin: "*", // Allow all origins
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  });

app.register(fastifyMultipart);

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(getRoomsRoute);
app.register(createRoomRoute);
app.register(getRoomQuestionsRoute);
app.register(createQuestionRoute);
app.register(uploadAudioRoute);

app;
app.listen({ port: env.PORT }).then(() => {
  // biome-ignore lint/suspicious/noConsole: used for warning startup
  console.log("Server is running!");
});
