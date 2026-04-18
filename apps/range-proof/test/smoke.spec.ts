import { test, expect } from "@playwright/test";

test("page loads with header, hero, and footer", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Prove it. Reveal nothing.", level: 1 }),
  ).toBeVisible();
  await expect(page.locator(".fgs-header")).toBeVisible();
  await expect(page.locator(".fgs-footer")).toBeVisible();
});

test("hero generates a proof and shows the artefact", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Generate proof/ }).click();
  await expect(page.locator(".rp-artefact")).toBeVisible({ timeout: 10_000 });
  await expect(page.locator(".rp-artefact-size")).toContainText("kB");
});

test("verifier URL shows age confirmed", async ({ page }) => {
  // Intercept clipboard.writeText to capture the URL without needing read permissions.
  await page.goto("/");
  await page.evaluate(() => {
    (window as unknown as Record<string, unknown>).__clipboardCapture = "";
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: (text: string) => {
          (window as unknown as Record<string, unknown>).__clipboardCapture = text;
          return Promise.resolve();
        },
      },
      configurable: true,
    });
  });
  await page.getByRole("button", { name: /Generate proof/ }).click();
  await expect(page.locator(".rp-artefact")).toBeVisible({ timeout: 10_000 });
  await page.getByRole("button", { name: /Copy verify URL/ }).click();
  const shareUrl = await page.evaluate(
    () => (window as unknown as Record<string, unknown>).__clipboardCapture as string,
  );
  expect(shareUrl).toMatch(/\?verify=/);
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
