import { env } from "@/env.mjs";
import { Redis } from "@upstash/redis";
import { TMDBSearchResponse, tmdbSearchResponseSchema } from "./tmdb";

const redis = new Redis({
  url: "https://eu1-humane-sheep-38246.upstash.io",
  token: env.UPSTASH_REDIS_TOKEN,
});

export const createMovieCacheKey = (params: { query: string; page: number }) =>
  `${params.query.toLowerCase()}#${params.page}`;

export const getAndIncrementMovieCache = async (key: string) => {
  const result = await redis.hget(key, "data");

  if (!result) {
    console.debug("cache miss for", key);
    return null;
  }

  console.debug("cache hit for", key);

  const movieCache = tmdbSearchResponseSchema.parse(result);

  await redis.hincrby(key, "hitCount", 1);
  await redis.expire(key, env.CACHE_TTL_SECONDS);

  return movieCache;
};

export const setMovieCache = async (params: {
  key: string;
  data: TMDBSearchResponse;
}) => {
  await redis.hset(params.key, {
    data: JSON.stringify(params.data),
    hitCount: 0,
  });
  await redis.expire(params.key, env.CACHE_TTL_SECONDS);

  return params.data;
};
