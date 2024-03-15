import { MovieCard } from "@/components/MovieCard";
import { MovieNotFound } from "@/components/MovieNotFound";
import { MoviePagination } from "@/components/MoviePagination";
import { env } from "@/env.mjs";
import { MAX_QUERY_LENGTH } from "@/lib/tmdb";
import { Fragment } from "react";

import { MovieCacheRouteResponseSchema } from "../api/v1/movies/route";

export default async function Home({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const { query, page } = searchParams;
  const isValidQuery = typeof query === "string" && query.length > 2 && query.length < MAX_QUERY_LENGTH;

  const response: MovieCacheRouteResponseSchema = isValidQuery
    ? await fetch(`${env.API_URL}/api/v1/movies?query=${query}&page=${page || 1}`, {
        cache: "no-store",
      }).then((res) => res.json())
    : null;

  return (
    <div>
      {response && response.data.total_results > 0 && (
        <Fragment>
          <div
            data-testid="movie-data-source-indicator"
            className="mb-2 flex items-center justify-center gap-1 text-xl font-bold  lg:absolute lg:left-1/2 lg:top-8 lg:-translate-x-1/2"
          >
            <span>Source:</span>
            <span className="text-primary" data-testid="movie-data-source">
              {response.source.toUpperCase()}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
            {response.data.results.map((movie) => {
              return <MovieCard key={movie.id} {...movie} />;
            })}
          </div>
          {response.data.total_pages > 1 && (
            <MoviePagination totalPages={response.data.total_pages} page={response.data.page} />
          )}
        </Fragment>
      )}
      {response && response.data.total_results === 0 && <MovieNotFound />}
    </div>
  );
}
