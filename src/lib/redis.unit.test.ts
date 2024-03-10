import { faker } from "@faker-js/faker";
import { describe, expect, it } from "vitest";
import { vi } from "vitest";

import { tmdbMovie, tmdbSearchResponse } from "../__fixtures__/tmdb";
import * as movieCache from "./redis";

describe("createMovieCacheKey", () => {
  it("should return the correct string in lowercase", () => {
    const query = faker.string.alpha({ length: { min: 0, max: 50 } });
    const page = faker.number.int({ min: 0, max: 10000 });
    const key = movieCache.createMovieCacheKey({ query, page });
    expect(key).toBe(`${query.toLowerCase()}#${page}`);
  });

  it("should throw an error when the query is too long", () => {
    const query = faker.string.alpha({ length: { min: 51, max: 2000 } });
    const page = faker.number.int({ min: 0, max: 10000 });
    expect(() => movieCache.createMovieCacheKey({ query, page })).toThrow("Query length is too long");
  });
});

describe("getAndIncrementMovieCache", () => {
  it("should return null when the key is not found", async () => {
    const key = faker.string.alpha({ length: { min: 1, max: 50 } });
    const hget = vi.spyOn(movieCache.redis, "hget").mockResolvedValue(null);

    const result = await movieCache.getAndIncrementMovieCache(key);
    expect(hget).toHaveBeenCalledWith(key, "data");
    expect(hget).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });

  it("should return the movie cache when the key is found", async () => {
    const key = faker.string.alpha({ length: { min: 1, max: 50 } });
    const data = tmdbSearchResponse({
      results: [tmdbMovie()],
    });

    const hget = vi.spyOn(movieCache.redis, "hget").mockResolvedValue(data);
    const hincrby = vi.spyOn(movieCache.redis, "hincrby").mockResolvedValue(1);
    const expire = vi.spyOn(movieCache.redis, "expire").mockResolvedValue(1);

    const result = await movieCache.getAndIncrementMovieCache(key);
    expect(hget).toHaveBeenCalledWith(key, "data");
    expect(hget).toHaveBeenCalledTimes(1);
    expect(hincrby).toHaveBeenCalledWith(key, "hitCount", 1);
    expect(hincrby).toHaveBeenCalledTimes(1);
    expect(expire).toHaveBeenCalledWith(key, process.env.CACHE_TTL_SECONDS);
    expect(expire).toHaveBeenCalledTimes(1);
    expect(result).toEqual(data);
  });

  it("should throw an error when the response schema is invalid", async () => {
    const key = faker.string.alpha({ length: { min: 1, max: 50 } });
    const data = tmdbSearchResponse({
      // @ts-expect-error - missing properties in results
      results: [{ title: "test" }],
    });

    const hget = vi.spyOn(movieCache.redis, "hget").mockResolvedValue(data);
    const hincrby = vi.spyOn(movieCache.redis, "hincrby").mockResolvedValue(1);
    const expire = vi.spyOn(movieCache.redis, "expire").mockResolvedValue(1);

    await expect(movieCache.getAndIncrementMovieCache(key)).rejects.toThrow();
    expect(hget).toHaveBeenCalledWith(key, "data");
    expect(hget).toHaveBeenCalledTimes(1);
    expect(hincrby).not.toHaveBeenCalled();
    expect(expire).not.toHaveBeenCalled();
  });
});
