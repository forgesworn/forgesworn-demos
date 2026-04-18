import { test, expect } from "@playwright/test";

test("landing page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".fgs-header")).toBeVisible();
  await expect(page.locator(".rs-preset-picker")).toBeVisible();
});

test("full hero flow: pick ring, pick seat, publish column", async ({ page }) => {
  await page.goto("/");
  await page.locator(".rs-preset").first().click();
  await expect(page.locator(".rs-seat").first()).toBeVisible();
  await page.locator(".rs-seat").first().click();
  await page.locator(".rs-composer-input").fill("Test column from the Insider.");
  await page.getByRole("button", { name: /Publish anonymously/ }).click();
  await expect(page.locator(".rs-column").first()).toBeVisible();
  await expect(page.locator(".rs-column-body").first()).toContainText("Test column");
});

test("two columns same seat same context share a key image (thread colour)", async ({ page }) => {
  await page.goto("/");
  await page.locator(".rs-preset").first().click();
  await page.locator(".rs-seat").first().click();
  await page.locator(".rs-composer-input").fill("Column A");
  await page.getByRole("button", { name: /Publish anonymously/ }).click();
  await page.locator(".rs-composer-input").fill("Column B");
  await page.getByRole("button", { name: /Publish anonymously/ }).click();
  const colours = await page.locator(".rs-column").evaluateAll((nodes) =>
    nodes.map((n) => (n as HTMLElement).style.getPropertyValue("--rs-thread")),
  );
  expect(colours).toHaveLength(2);
  expect(colours[0]).toBe(colours[1]);
});

test("'Start a new pseudonym' produces a different key image", async ({ page }) => {
  await page.goto("/");
  await page.locator(".rs-preset").first().click();
  await page.locator(".rs-seat").first().click();
  await page.locator(".rs-composer-input").fill("Column A");
  await page.getByRole("button", { name: /Publish anonymously/ }).click();
  await page.getByRole("button", { name: /Start a new pseudonym/ }).click();
  await page.locator(".rs-composer-input").fill("Column B");
  await page.getByRole("button", { name: /Publish anonymously/ }).click();
  const colours = await page.locator(".rs-column").evaluateAll((nodes) =>
    nodes.map((n) => (n as HTMLElement).style.getPropertyValue("--rs-thread")),
  );
  expect(colours[0]).not.toBe(colours[1]);
});

test("proof inspector verdict shows valid", async ({ page }) => {
  await page.goto("/");
  await page.locator(".rs-preset").first().click();
  await page.locator(".rs-seat").first().click();
  await page.locator(".rs-composer-input").fill("Inspect me");
  await page.getByRole("button", { name: /Publish anonymously/ }).click();
  await page.getByRole("button", { name: /^Inspect proof$/ }).click();
  await expect(page.getByRole("button", { name: /Valid — a ring member signed this/ })).toBeVisible({ timeout: 10_000 });
});
