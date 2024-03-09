import { ModeToggle } from "@/components/ModeToggle";
import { MovieCard } from "@/components/MovieCard";
import { MoviePagination } from "@/components/MoviePagination";
import { MovieSearch } from "@/components/MovieSearch";
import { searchMovies } from "@/lib/tmdb";
import { FilmIcon } from "lucide-react";
import { Fragment } from "react";
export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { query, page } = searchParams;

  const data =
    typeof query === "string"
      ? await searchMovies(query, page ? parseInt(page as string) : 1)
      : null;

  return (
    <main className="flex min-h-screen w-full flex-col gap-3 justify-between items-center p-2 lg:p-4">
      <div className="flex w-full p-2 justify-between items-center gap-3">
        <FilmIcon />
        <MovieSearch />
        <ModeToggle />
      </div>
      {data && (
        <Fragment>
          <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {data.results.map((movie) => {
              return <MovieCard key={movie.id} {...movie} />;
            })}
          </div>
          <div className="flex">
            <MoviePagination totalPages={data.total_pages} page={data.page} />
          </div>
        </Fragment>
      )}
    </main>
  );
}
