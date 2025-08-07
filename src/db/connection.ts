import postgres from "postgres";
import { env } from "../env/env.ts";

export const client = postgres(env.DATABASE_URL)