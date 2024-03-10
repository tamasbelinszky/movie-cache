import { expect, test } from "@playwright/test";

test("should be able to list movies", async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto("http://localhost:3000/");

  // initial state
  await expect(page.locator("input")).toBeVisible();
  const movieDataSourceIndicator = page.locator("[data-testid=movie-data-source-indicator]");
  await expect(movieDataSourceIndicator).toBeVisible();
  await expect(movieDataSourceIndicator).toHaveText("Start typing to search for movies.");

  // search for movies
  await page.fill("input", "Lord of the Rings");

  await page.press("input", "Enter");

  // first result
  await expect(page.locator("[data-testid=movie-data-source-indicator]")).toBeVisible();
  await expect(page.locator("[data-testid=movie-card]")).toHaveCount(20);
  await expect(movieDataSourceIndicator).toContainText(["Source:"]);

  // pagination: first page
  const firstPageButton = page.locator("[data-testid=first-page-pagination-button]");
  const previousPageButton = page.locator("[data-testid=previous-page-pagination-button]");
  const nextPageButton = page.locator("[data-testid=next-page-pagination-button]");
  const lastPageButton = page.locator("[data-testid=last-page-pagination-button]");

  await expect(firstPageButton).toBeVisible();
  await expect(firstPageButton).toBeDisabled();

  await expect(previousPageButton).toBeVisible();
  await expect(previousPageButton).toBeDisabled();

  await expect(nextPageButton).toBeVisible();
  await expect(nextPageButton).toBeEnabled();
  await expect(lastPageButton).toBeVisible();
  await expect(lastPageButton).toBeEnabled();

  // pagination: second page
  await nextPageButton.click();
  await expect(firstPageButton).toBeVisible();
  await expect(firstPageButton).toBeEnabled();
  await expect(previousPageButton).toBeVisible();
  await expect(previousPageButton).toBeEnabled();

  // go back to first page and than go to last page
  await firstPageButton.click();
  await expect(firstPageButton).toBeVisible();
  await expect(firstPageButton).toBeDisabled();
  await expect(previousPageButton).toBeVisible();
  await expect(previousPageButton).toBeDisabled();

  await lastPageButton.click();
  await expect(nextPageButton).toBeVisible();
  await expect(nextPageButton).toBeDisabled();
  await expect(lastPageButton).toBeVisible();
  await expect(lastPageButton).toBeDisabled();

  // go back to previous page
  await previousPageButton.click();
  await expect(nextPageButton).toBeVisible();
  await expect(nextPageButton).toBeEnabled();
  await expect(lastPageButton).toBeVisible();
  await expect(lastPageButton).toBeEnabled();

  // search for movies that don't exist
  await page.fill("input", "asdasdasdasd");
  await page.press("input", "Enter");
  await expect(page.locator("[data-testid=movie-data-source-indicator]")).toBeVisible();
  await expect(page.locator("[data-testid=movie-card]")).toHaveCount(0);
  await expect(movieDataSourceIndicator).toContainText(["Source:"]);

  await expect(firstPageButton).toBeVisible();
  await expect(firstPageButton).toBeDisabled();
  await expect(previousPageButton).toBeVisible();
  await expect(previousPageButton).toBeDisabled();
  await expect(nextPageButton).toBeVisible();
  await expect(nextPageButton).toBeDisabled();
  await expect(lastPageButton).toBeVisible();
  await expect(lastPageButton).toBeDisabled();
});
