import { fastifyCors } from "@fastify/cors";
import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "./env.ts";
import { getRoomsRoute } from "./http/routes/get-rooms.ts";

const app = fastify()
  .withTypeProvider<ZodTypeProvider>()
  .register(fastifyCors, {
    origin: "*", // Allow all origins
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  });

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(getRoomsRoute);

app;
app.listen({ port: env.PORT }).then(() => {
  // biome-ignore lint/suspicious/noConsole: used for warning startup
  console.log("Server is running!");
});
