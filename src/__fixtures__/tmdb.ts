import { faker } from "@faker-js/faker";

import { TMDBMovie, TMDBSearchResponse } from "../lib/tmdb";

export const tmdbSearchResponse = (props?: Partial<TMDBSearchResponse>): TMDBSearchResponse => {
  const totalResults = faker.number.int({ min: 0, max: 21343 });
  const totalPages = Math.ceil(totalResults / 20);
  const page = faker.number.int({ min: 1, max: totalPages });

  return {
    page,
    total_results: totalResults,
    total_pages: totalPages,
    results: Array.from({ length: totalResults }, () => tmdbMovie()),
    ...props,
  };
};

export const tmdbMovie = (props?: Partial<TMDBMovie>): TMDBMovie => ({
  title: faker.lorem.words(),
  id: faker.number.int(),
  release_date: faker.date.recent().toISOString(),
  overview: faker.lorem.paragraph(),
  poster_path: faker.image.url(),
  ...props,
});
