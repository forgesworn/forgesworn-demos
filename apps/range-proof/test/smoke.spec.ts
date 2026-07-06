import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("page loads with header, hero, and footer", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Private age checks in the browser", level: 1 }),
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

test("certificate download produces a PDF", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Generate proof/ }).click();
  await expect(page.locator(".rp-artefact")).toBeVisible({ timeout: 10_000 });

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download certificate (PDF)" }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe("age-certificate.pdf");
  const filePath = testInfo.outputPath("age-certificate.pdf");
  await download.saveAs(filePath);
  const pdf = await readFile(filePath);
  expect(pdf.subarray(0, 5).toString("utf8")).toBe("%PDF-");
  expect(pdf.byteLength).toBeGreaterThan(1_000);
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
