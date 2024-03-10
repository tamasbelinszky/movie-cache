"use client";

import { TypewriterEffect } from "./ui/typewriter-effect";

export const MoviesDataSourceIndicator: React.FC<{
  source?: "cache" | "tmdb";
}> = ({ source }) => {
  return (
    <div data-testid="movie-data-source-indicator">
      {source ? (
        <div className="text-xl font-bold">
          <span>Source: </span>
          <span className="text-primary" data-testid="movie-data-source">
            {source.toUpperCase()}
          </span>
        </div>
      ) : (
        <TypewriterEffect
          words={[
            { text: "Start" },
            { text: "typing" },
            { text: "to" },
            { text: "search" },
            { text: "for" },
            {
              text: "movies.",
              className: "text-primary dark:text-primary",
            },
          ]}
        />
      )}
    </div>
  );
};
