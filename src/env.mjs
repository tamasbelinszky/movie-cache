// src/env.mjs
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    TMDB_API_KEY: z.string().min(1),
    UPSTASH_REDIS_TOKEN: z.string().min(1),
    API_URL: z.string().url().default("http://localhost:3000"),
    CACHE_TTL_SECONDS: z.coerce.number().default(60 * 2),
    ENABLE_EXPERIMENTAL_COREPACK: z.coerce.number().default(1),
    ENABLE_REDIS: z
      .string()
      .refine((s) => s === "true" || s === "false")
      .transform((s) => s === "true")
      .default("false"),
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {},
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    TMDB_API_KEY: process.env.TMDB_API_KEY,
    UPSTASH_REDIS_TOKEN: process.env.UPSTASH_REDIS_TOKEN,
    API_URL: process.env.API_URL,
    CACHE_TTL_SECONDS: process.env.CACHE_TTL_SECONDS,
    ENABLE_EXPERIMENTAL_COREPACK: process.env.ENABLE_EXPERIMENTAL_COREPACK,
    ENABLE_REDIS: process.env.ENABLE_REDIS,
  },
  skipValidation: process.env.NODE_ENV === "test" || process.env.CI,
});
