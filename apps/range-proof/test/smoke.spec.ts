import { test, expect } from "@playwright/test";

test("page loads with header, hero, and footer", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Prove it. Reveal nothing.", level: 1 })).toBeVisible();
  await expect(page.locator(".fgs-header")).toBeVisible();
  await expect(page.locator(".fgs-footer")).toBeVisible();
  await expect(page.locator(".fgs-demo-link.is-current")).toHaveText("range-proof");
});

test("toolkit footer lists all 8 libraries", async ({ page }) => {
  await page.goto("/");
  const toolkitLinks = page.locator(".fgs-toolkit a");
  await expect(toolkitLinks).toHaveCount(8);
});
