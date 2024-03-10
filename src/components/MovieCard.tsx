import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TMDBMovie } from "@/lib/tmdb";
import Image from "next/image";

export const MovieCard: React.FC<TMDBMovie> = ({ title, poster_path, release_date }) => {
  return (
    <Card data-testid="movie-card" className="flex flex-col items-center justify-center">
      <CardHeader>
        <CardTitle className="text-balance">
          {title} {release_date ? `(${release_date.slice(0, 4)})` : null}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Image
          alt={title}
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
          }
          width={350}
          height={350}
        />
      </CardContent>
    </Card>
  );
};
