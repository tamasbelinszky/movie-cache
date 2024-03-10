import nock from "nock";
import { describe, expect, it } from "vitest";

import { tmdbSearchResponse } from "../__fixtures__/tmdb";
import { env } from "../env.mjs";
import { searchMovies } from "./tmdb";

describe("searchMovies", () => {
  it("returns movies correctly", async () => {
    const response = tmdbSearchResponse();
    const query = "test";
    const page = 1;

    nock("https://api.themoviedb.org")
      .get("/3/search/movie")
      .query({ query, page, api_key: env.TMDB_API_KEY })
      .reply(200, response);

    const data = await searchMovies({ query, page });

    expect(data).toEqual(response);
  });
  it("throws an error when the request fails", async () => {
    const query = "test";
    const page = 1;

    nock("https://api.themoviedb.org")
      .get("/3/search/movie")
      .query({ query, page, api_key: env.TMDB_API_KEY })
      .reply(500);

    await expect(searchMovies({ query, page })).rejects.toThrow("Network response was not ok");
  });

  it("throws if the response schema is invalid", async () => {
    const query = "test";
    const page = 1;

    nock("https://api.themoviedb.org")
      .get("/3/search/movie")
      .query({ query, page, api_key: env.TMDB_API_KEY })
      .reply(200, { ...tmdbSearchResponse(), results: [{ title: "test" }] }); // missing properties in results

    await expect(searchMovies({ query, page })).rejects.toThrow();
  });
});
