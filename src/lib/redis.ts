import { env } from "@/env.mjs";
import { Redis } from "@upstash/redis";

import { MAX_QUERY_LENGTH, TMDBSearchResponse, tmdbSearchResponseSchema } from "./tmdb";

export const redis = env.ENABLE_REDIS
  ? new Redis({
      url: "https://eu1-humane-sheep-38246.upstash.io",
      token: env.UPSTASH_REDIS_TOKEN,
    })
  : null;

export const createMovieCacheKey = (params: { query: string; page: number }) => {
  if (params.query.length > MAX_QUERY_LENGTH) {
    throw new Error("Query length is too long");
  }
  return `${params.query.toLowerCase()}#${params.page}`;
};

export const getAndIncrementMovieCache = async (key: string) => {
  if (!redis) {
    return null;
  }
  const result = await redis.hget(key, "data");
  if (!result) {
    return null;
  }
  const movieCache = tmdbSearchResponseSchema.parse(result);
  await redis.hincrby(key, "hitCount", 1);
  await redis.expire(key, env.CACHE_TTL_SECONDS);
  return movieCache;
};

export const setMovieCache = async (params: { key: string; data: TMDBSearchResponse }) => {
  if (!redis) {
    return params.data;
  }
  await redis.hset(params.key, {
    data: JSON.stringify(params.data),
    hitCount: 0,
  });
  await redis.expire(params.key, env.CACHE_TTL_SECONDS);
  return params.data;
};
