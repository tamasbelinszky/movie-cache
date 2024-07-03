import { expect, test } from "@playwright/test";

const viewports = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "mobile", width: 375, height: 667 }, // iPhone 6 dimensions
  { name: "tablet", width: 768, height: 1024 }, // iPad dimensions
];

test.describe("Movie listing tests", () => {
  for (const viewport of viewports) {
    test.describe(`Viewport: ${viewport.name}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto("http://localhost:3000/movies");
      });

      test("should display movie search drawer button", async ({ page }) => {
        const drawerBtn = page.locator("[data-testid=movie-search-drawer-btn]");
        await expect(drawerBtn).toBeVisible();
      });

      test("should list movies when searching for 'Lord'", async ({ page }) => {
        const drawerBtn = page.locator("[data-testid=movie-search-drawer-btn]");
        await drawerBtn.click();
        await page.fill("input", "Lord");
        await page.press("input", "Enter");

        await expect(page.locator("[data-testid=movie-data-source-indicator]")).toBeVisible();
        await expect(page.locator("[data-testid=movie-card]")).toHaveCount(20);
      });

      test("should display pagination buttons correctly", async ({ page }) => {
        const drawerBtn = page.locator("[data-testid=movie-search-drawer-btn]");
        await drawerBtn.click();
        await page.fill("input", "Lord");
        await page.press("input", "Enter");

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

        await nextPageButton.click();
        await expect(firstPageButton).toBeVisible();
        await expect(firstPageButton).toBeEnabled();
        await expect(previousPageButton).toBeVisible();
        await expect(previousPageButton).toBeEnabled();

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

        await previousPageButton.click();
        await expect(nextPageButton).toBeVisible();
        await expect(nextPageButton).toBeEnabled();
        await expect(lastPageButton).toBeVisible();
        await expect(lastPageButton).toBeEnabled();
      });

      test("should handle no results found", async ({ page }) => {
        const firstPageButton = page.locator("[data-testid=first-page-pagination-button]");
        const previousPageButton = page.locator("[data-testid=previous-page-pagination-button]");
        const nextPageButton = page.locator("[data-testid=next-page-pagination-button]");
        const lastPageButton = page.locator("[data-testid=last-page-pagination-button]");

        const drawerBtn = page.locator("[data-testid=movie-search-drawer-btn]");
        await drawerBtn.click();
        await page.fill("input", "jkshdjkfhdskfhdo9382y5iwehfeddsjhfkjdsfhkksajhdfk");
        await page.press("input", "Enter");

        await expect(page.locator("h1")).toHaveText("Movie not found");

        await expect(firstPageButton).not.toBeVisible();
        await expect(previousPageButton).not.toBeVisible();
        await expect(nextPageButton).not.toBeVisible();
        await expect(lastPageButton).not.toBeVisible();
      });

      test("should list a single movie when searching for 'the hunt for the wilderpeople'", async ({ page }) => {
        const drawerBtn = page.locator("[data-testid=movie-search-drawer-btn]");
        await drawerBtn.click();
        await page.fill("input", "the hunt for the wilderpeople");
        await page.press("input", "Enter");

        const pageParam = new URL(page.url()).searchParams.get("page");
        expect(pageParam).toBe(null);
        await expect(page.locator("[data-testid=movie-card]")).toHaveCount(1);

        const firstPageButton = page.locator("[data-testid=first-page-pagination-button]");
        const previousPageButton = page.locator("[data-testid=previous-page-pagination-button]");
        const nextPageButton = page.locator("[data-testid=next-page-pagination-button]");
        const lastPageButton = page.locator("[data-testid=last-page-pagination-button]");

        await expect(firstPageButton).not.toBeVisible();
        await expect(previousPageButton).not.toBeVisible();
        await expect(nextPageButton).not.toBeVisible();
        await expect(lastPageButton).not.toBeVisible();
      });
    });
  }
});
