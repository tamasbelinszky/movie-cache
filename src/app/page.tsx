import { ModeToggle } from "@/components/ModeToggle";
import { MovieCard } from "@/components/MovieCard";
import { MovieNotFound } from "@/components/MovieNotFound";
import { MoviePagination } from "@/components/MoviePagination";
import { MovieSearch } from "@/components/MovieSearch";
import { MoviesDataSourceIndicator } from "@/components/MoviesDataSourceIndicator";
import { env } from "@/env.mjs";
import { MAX_QUERY_LENGTH } from "@/lib/tmdb";
import { FilmIcon } from "lucide-react";
import { Fragment } from "react";

import { MovieCacheRouteResponseSchema } from "./api/v1/movies/route";

export default async function Home({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const { query, page } = searchParams;
  const isValidQuery = typeof query === "string" && query.length > 2 && query.length < MAX_QUERY_LENGTH;

  const response: MovieCacheRouteResponseSchema = isValidQuery
    ? await fetch(`${env.API_URL}/api/v1/movies?query=${query}&page=${page || 1}`, {
        cache: "no-store",
      }).then((res) => res.json())
    : null;

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-between gap-3 p-2 lg:p-4">
      <div className="flex w-full flex-col items-center justify-between gap-3 p-2">
        <div className="flex w-full justify-between">
          <FilmIcon size={32} className="text-primary" />
          <MovieSearch />
          <ModeToggle />
        </div>
        <MoviesDataSourceIndicator source={response?.source} />
      </div>
      {response && response.data.total_results > 0 && (
        <Fragment>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
            {response.data.results.map((movie) => {
              return <MovieCard key={movie.id} {...movie} />;
            })}
          </div>
          <div className="flex">
            {response.data.total_pages > 1 && (
              <MoviePagination totalPages={response.data.total_pages} page={response.data.page} />
            )}
          </div>
        </Fragment>
      )}
      {response && response.data.total_results === 0 && <MovieNotFound />}
    </main>
  );
}
