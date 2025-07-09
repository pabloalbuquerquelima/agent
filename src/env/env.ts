import {z} from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
});

export const env = envSchema.parse({
  PORT: process.env.PORT,
});