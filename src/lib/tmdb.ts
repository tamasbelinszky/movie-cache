import { z } from "zod";

import { env } from "../env.mjs";

const tmdbMovieSchema = z.object({
  title: z.string(),
  id: z.number(),
  release_date: z.string().optional(),
  overview: z.string(),
  poster_path: z.string().nullable(),
});

export type TMDBMovie = z.infer<typeof tmdbMovieSchema>;

export const tmdbSearchResponseSchema = z.object({
  page: z.number(),
  total_results: z.number(),
  total_pages: z.number(),
  results: z.array(tmdbMovieSchema),
});

export type TMDBSearchResponse = z.infer<typeof tmdbSearchResponseSchema>;

export const MAX_QUERY_LENGTH = 50;

export const searchMovies = async (params: { query: string; page: number }): Promise<TMDBSearchResponse> => {
  const url = new URL("https://api.themoviedb.org/3/search/movie");
  url.searchParams.append("api_key", env.TMDB_API_KEY);
  url.searchParams.append("query", params.query);
  url.searchParams.append("page", params.page.toString());

  const response = await fetch(url.toString());

  if (!response.ok) {
    console.error(`Failed to fetch movies for query: ${params.query}, page: ${params.page}`);
    throw new Error("Network response was not ok");
  }

  const rawData = await response.json();

  return tmdbSearchResponseSchema.parse(rawData);
};
