import { test, expect } from "@playwright/test";

test("page loads with header, hero, footer", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".fgs-header")).toBeVisible();
  await expect(page.locator(".fgs-footer")).toBeVisible();
  await expect(page.getByRole("heading", { name: "shamir-words", level: 1 })).toBeVisible();
});
