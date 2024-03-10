import { createMovieCacheKey, getAndIncrementMovieCache, setMovieCache } from "@/lib/redis";
import { MAX_QUERY_LENGTH, searchMovies, tmdbSearchResponseSchema } from "@/lib/tmdb";
import { z } from "zod";

const moviesCacheQuerySchema = z.object({
  query: z.string().min(1).max(MAX_QUERY_LENGTH),
  page: z.number().min(0).max(10000),
});

const movieCacheRouteResponseSchema = z.object({
  data: tmdbSearchResponseSchema,
  source: z.literal("cache").or(z.literal("tmdb")),
});
export type MovieCacheRouteResponseSchema = z.infer<typeof movieCacheRouteResponseSchema>;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const page = Number(searchParams.get("page"));

  const movieQuery = moviesCacheQuerySchema.parse({ query, page });

  const key = createMovieCacheKey(movieQuery);

  const movieCache = await getAndIncrementMovieCache(key);

  if (movieCache) {
    return new Response(
      JSON.stringify(
        movieCacheRouteResponseSchema.parse({
          data: movieCache,
          source: "cache",
        }),
      ),
    );
  }

  const data = await searchMovies({
    query: movieQuery.query,
    page: movieQuery.page,
  });

  await setMovieCache({ key, data });

  return new Response(JSON.stringify(movieCacheRouteResponseSchema.parse({ data, source: "tmdb" })));
}
