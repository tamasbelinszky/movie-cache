import { ModeToggle } from "@/components/ModeToggle";
import { MovieCard } from "@/components/MovieCard";
import { MoviePagination } from "@/components/MoviePagination";
import { MovieSearch } from "@/components/MovieSearch";
import { env } from "@/env.mjs";
import { FilmIcon } from "lucide-react";
import { Fragment } from "react";
import { MovieCacheRouteResponseSchema } from "./api/v1/movies/route";
import { MoviesDataSourceIndicator } from "@/components/MoviesDataSourceIndicator";

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { query, page } = searchParams;
  const isValidQuery =
    typeof query === "string" && query.length > 2 && query.length < 50;

  const response: MovieCacheRouteResponseSchema = isValidQuery
    ? await fetch(
        `${env.API_URL}/api/v1/movies?query=${query}&page=${page || 1}`,
        {
          cache: "no-store",
        }
      ).then((res) => res.json())
    : null;

  return (
    <main className="flex min-h-screen w-full flex-col gap-3 justify-between items-center p-2 lg:p-4">
      <div className="flex flex-col w-full p-2 justify-between items-center gap-3">
        <div className="flex w-full justify-between">
          <FilmIcon size={32} className="text-primary" />
          <MovieSearch />
          <ModeToggle />
        </div>
        <MoviesDataSourceIndicator source={response?.source} />
      </div>
      {response && (
        <Fragment>
          <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {response.data.results.map((movie) => {
              return <MovieCard key={movie.id} {...movie} />;
            })}
          </div>
          <div className="flex">
            <MoviePagination
              totalPages={response.data.total_pages}
              page={response.data.page}
            />
          </div>
        </Fragment>
      )}
    </main>
  );
}
