import { test, expect } from "@playwright/test";

test("page loads with header, hero, and footer", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Prove it. Reveal nothing.", level: 1 }),
  ).toBeVisible();
  await expect(page.locator(".fgs-header")).toBeVisible();
  await expect(page.locator(".fgs-footer")).toBeVisible();
});

test("hero generates a proof and produces a shareable URL", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Generate proof/ }).click();
  await expect(page.locator(".rp-output")).toBeVisible({ timeout: 10_000 });
  const shareUrl = await page.locator(".rp-share code").textContent();
  expect(shareUrl).toMatch(/\?verify=/);
});

test("verifier URL shows age confirmed", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Generate proof/ }).click();
  await expect(page.locator(".rp-share code")).toBeVisible({ timeout: 10_000 });
  const shareUrl = (await page.locator(".rp-share code").textContent()) ?? "";
  const pathWithQuery = new URL(shareUrl).pathname + new URL(shareUrl).search;
  await page.goto(pathWithQuery);
  await expect(
    page.getByRole("heading", { name: "Age 18+ confirmed" }),
  ).toBeVisible();
});

test("playground rejects out-of-range values", async ({ page }) => {
  await page.goto("/");
  await page.locator('.rp-playground-grid input[type="number"]').first().fill("150");
  await page.locator(".rp-playground-run").click();
  await expect(page.locator(".rp-playground-result.is-invalid")).toBeVisible();
});
