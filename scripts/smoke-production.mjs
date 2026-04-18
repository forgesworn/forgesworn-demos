// Post-deploy live smoke: hits the three production URLs and runs the full hero flow
// against each. Confirms the CF Pages deploys + custom domains + OG meta are all live.

import { chromium, devices } from "@playwright/test";

const DEMOS = [
  { name: "range-proof", url: "https://range-proof.forgesworn.dev" },
  { name: "shamir-words", url: "https://shamir-words.forgesworn.dev" },
  { name: "ring-sig", url: "https://ring-sig.forgesworn.dev" },
];

const results = [];

async function check(app) {
  const r = {
    name: app.name,
    url: app.url,
    status: null,
    ogImage: null,
    title: null,
    heroOk: false,
    error: null,
  };

  // HTTP status
  try {
    const res = await fetch(app.url);
    r.status = res.status;
    if (res.status !== 200) {
      r.error = `HTTP ${res.status}`;
      return r;
    }
    const html = await res.text();
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    if (titleMatch) r.title = titleMatch[1];
    const ogMatch = html.match(/og:image"[^>]+content="([^"]+)"/);
    if (ogMatch) r.ogImage = ogMatch[1];

    // Verify the OG image resolves
    if (r.ogImage) {
      const ogRes = await fetch(r.ogImage);
      if (ogRes.status !== 200) {
        r.error = `OG image returns ${ogRes.status}`;
      }
    }
  } catch (err) {
    r.error = `fetch: ${String(err).slice(0, 120)}`;
    return r;
  }

  // Hero-flow smoke via Playwright
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext(devices["iPhone 14"]);
    const page = await ctx.newPage();
    await page.goto(app.url, { waitUntil: "networkidle", timeout: 30_000 });
    if (app.name === "range-proof") {
      await page.getByRole("button", { name: /Generate proof/ }).click();
      await page.waitForSelector(".rp-artefact", { timeout: 15_000 });
    } else if (app.name === "shamir-words") {
      await page.getByRole("button", { name: /Split into 5 shares/ }).click();
      await page.waitForSelector(".sw-card", { timeout: 15_000 });
    } else if (app.name === "ring-sig") {
      await page.locator(".rs-preset").first().click();
      await page.locator(".rs-seat").first().click();
      await page.locator(".rs-composer-input").fill("production smoke");
      await page.getByRole("button", { name: /Publish anonymously/ }).click();
      await page.waitForSelector(".rs-column", { timeout: 15_000 });
    }
    r.heroOk = true;
  } catch (err) {
    r.error = `hero flow: ${String(err).slice(0, 150)}`;
  } finally {
    await browser.close();
  }
  return r;
}

for (const app of DEMOS) {
  const r = await check(app);
  results.push(r);
  const status = r.heroOk && !r.error ? "✓" : "✗";
  console.log(`${status} ${r.name}: HTTP ${r.status}, OG ${r.ogImage ? "present" : "missing"}, hero ${r.heroOk ? "passed" : "failed"}${r.error ? " — " + r.error : ""}`);
}

const allGood = results.every((r) => r.heroOk && !r.error);
if (allGood) {
  console.log("\n✓ All three demos live and functional in production.");
  process.exit(0);
} else {
  console.log("\n✗ One or more checks failed.");
  process.exit(1);
}
