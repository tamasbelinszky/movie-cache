import { TMDBSearchResponse } from "@/lib/tmdb";

type Movie = TMDBSearchResponse["results"][number];

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export const MovieCard: React.FC<Movie> = ({
  title,
  poster_path,
  release_date,
}) => {
  return (
    <Card className="flex w-full flex-col items-center justify-center">
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
          width={280}
          height={280}
        />
      </CardContent>
    </Card>
  );
};
