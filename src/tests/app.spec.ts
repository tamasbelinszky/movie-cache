import { expect, test } from "@playwright/test";

test("should be able to list movies", async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto("http://localhost:3000/movies");

  // TODO: home page
  const drawerBtn = page.locator("[data-testid=movie-search-drawer-btn]");

  // search for movies
  expect(drawerBtn).toBeVisible();
  await drawerBtn.click();
  await page.fill("input", "Lord");
  await page.press("input", "Enter");

  // first result
  await expect(page.locator("[data-testid=movie-data-source-indicator]")).toBeVisible();
  await expect(page.locator("[data-testid=movie-card]")).toHaveCount(20);

  const movieDataSourceIndicator = page.locator("[data-testid=movie-data-source-indicator]");
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
  expect(drawerBtn).toBeVisible();
  await drawerBtn.click();
  await page.fill("input", "jkshdjkfhdskfhdo9382y5iwehfeddsjhfkjdsfhkksajhdfk");
  await page.press("input", "Enter");

  const pageNumber = new URL(page.url()).searchParams.get("page");
  expect(pageNumber).toBeDefined();
  await expect(page.locator("[data-testid=movie-data-source-indicator]")).toBeVisible();
  await expect(page.locator("[data-testid=movie-card]")).toHaveCount(0);

  const missingPageNumber = new URL(page.url()).searchParams.get("page");
  expect(missingPageNumber).toBeNull();

  await expect(page.locator("h1")).toHaveText("Movie not found");

  await expect(firstPageButton).not.toBeVisible();
  await expect(previousPageButton).not.toBeVisible();
  await expect(nextPageButton).not.toBeVisible();
  await expect(lastPageButton).not.toBeVisible();

  // search for the a movie name that only has one result
  expect(drawerBtn).toBeVisible();
  await drawerBtn.click();
  await page.fill("input", "the hunt for the wilderpeople");
  await page.press("input", "Enter");

  const pageParam = new URL(page.url()).searchParams.get("page");
  expect(pageParam).toBe(null);
  await expect(page.locator("[data-testid=movie-card]")).toHaveCount(1);

  await expect(firstPageButton).not.toBeVisible();
  await expect(previousPageButton).not.toBeVisible();
  await expect(nextPageButton).not.toBeVisible();
  await expect(lastPageButton).not.toBeVisible();
});
