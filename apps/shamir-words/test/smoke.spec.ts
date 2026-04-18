import { test, expect } from "@playwright/test";

test("page loads", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Any three of five.", level: 1 }),
  ).toBeVisible();
});

test("split produces 5 cards", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Split into 5 shares/ }).click();
  await expect(page.locator(".sw-card")).toHaveCount(5);
});

test("selecting 3 cards restores the seed", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Split into 5 shares/ }).click();
  await expect(page.locator(".sw-card")).toHaveCount(5);
  for (const index of [0, 2, 4]) {
    await page.locator(".sw-card").nth(index).click();
  }
  const seed = await page.locator(".sw-tray-seed").textContent();
  expect(seed).toContain("abandon");
});

test("selecting 2 cards reveals nothing", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Split into 5 shares/ }).click();
  for (const index of [0, 2]) {
    await page.locator(".sw-card").nth(index).click();
  }
  await expect(page.locator(".sw-tray-need-more")).toBeVisible();
  await expect(page.locator(".sw-tray-seed")).toHaveCount(0);
});
