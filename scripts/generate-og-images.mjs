import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// __dirname is scripts/, so ROOT is the monorepo root
const ROOT = resolve(__dirname, "..");

const DEMOS = [
  {
    name: "range-proof",
    headline: "Prove it. Reveal nothing.",
    lede: "Zero-knowledge range proofs on secp256k1.",
    accent: "#2d5a87",
    bg: "#f5f5f7",
    ink: "#0d0d0d",
    muted: "#555",
    visual: "fingerprint",
  },
  {
    name: "shamir-words",
    headline: "Any three of five.",
    lede: "Shamir secret sharing with BIP-39 encoding.",
    accent: "#9c5c1f",
    bg: "#f5f1e6",
    ink: "#1a1207",
    muted: "#6b4e2a",
    visual: "cards",
  },
  {
    name: "ring-sig",
    headline: "Sign as The Insider.",
    lede: "SAG/LSAG ring signatures on secp256k1.",
    accent: "#1a2d4a",
    bg: "#f1f1f4",
    ink: "#0d0d0d",
    muted: "#555",
    visual: "ring",
  },
];

function visualSvg(v, accent) {
  if (v === "fingerprint") {
    // 4×8 symmetric pixel glyph like KeyImageFingerprint, large
    const cells = [
      [1, 0, 1, 1, 1, 1, 0, 1],
      [0, 1, 1, 0, 0, 1, 1, 0],
      [1, 1, 0, 1, 1, 0, 1, 1],
      [1, 0, 1, 0, 0, 1, 0, 1],
    ];
    let rects = "";
    cells.forEach((row, y) => {
      row.forEach((c, x) => {
        if (c) rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${accent}" />`;
      });
    });
    return `<svg viewBox="0 0 8 4" width="320" height="160">${rects}</svg>`;
  }
  if (v === "cards") {
    // 5 small rounded rects in a row, each with a coloured top bar
    const colours = ["#b0632e", "#8a4a2a", "#c08840", "#9c5c1f", "#7a4420"];
    let cards = "";
    for (let i = 0; i < 5; i++) {
      const x = i * 64;
      cards += `
        <rect x="${x}" y="0" width="56" height="80" rx="4" fill="#fff" stroke="${accent}" stroke-width="1.5" />
        <rect x="${x}" y="0" width="56" height="6" fill="${colours[i]}" />
        <rect x="${x + 8}" y="18" width="20" height="3" fill="${accent}" opacity="0.4" />
        <rect x="${x + 8}" y="26" width="30" height="3" fill="${accent}" opacity="0.4" />
        <rect x="${x + 8}" y="34" width="26" height="3" fill="${accent}" opacity="0.4" />
        <rect x="${x + 8}" y="42" width="34" height="3" fill="${accent}" opacity="0.4" />
      `;
    }
    return `<svg viewBox="0 0 312 80" width="390" height="100">${cards}</svg>`;
  }
  if (v === "ring") {
    // 5 circles arranged in a ring with arrows
    const cx = 100, cy = 100, r = 70;
    let circles = "";
    let arrows = "";
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const px = cx + Math.cos(a) * r;
      const py = cy + Math.sin(a) * r;
      circles += `<circle cx="${px}" cy="${py}" r="10" fill="${accent}" />`;
    }
    for (let i = 0; i < 5; i++) {
      const a1 = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const a2 = ((i + 1) / 5) * Math.PI * 2 - Math.PI / 2;
      const inset = 12;
      const x1 = cx + Math.cos(a1) * (r - inset);
      const y1 = cy + Math.sin(a1) * (r - inset);
      const x2 = cx + Math.cos(a2) * (r - inset);
      const y2 = cy + Math.sin(a2) * (r - inset);
      arrows += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${accent}" stroke-width="1.5" opacity="0.5" />`;
    }
    return `<svg viewBox="0 0 200 200" width="220" height="220">${arrows}${circles}</svg>`;
  }
  return "";
}

function htmlFor(d) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; }
  body {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    align-items: stretch;
    background: ${d.bg};
    color: ${d.ink};
    font-family: "Inter", sans-serif;
    padding: 80px;
    gap: 40px;
  }
  .copy { display: flex; flex-direction: column; justify-content: space-between; }
  .brand {
    font-family: "JetBrains Mono", monospace;
    font-size: 20px;
    letter-spacing: 0.04em;
    color: ${d.muted};
    text-transform: uppercase;
  }
  h1 {
    font-family: "Instrument Serif", serif;
    font-size: 96px;
    font-weight: 500;
    letter-spacing: -0.025em;
    line-height: 0.98;
    color: ${d.ink};
  }
  .lede {
    font-size: 28px;
    color: ${d.muted};
    line-height: 1.35;
    margin-top: 20px;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding-top: 20px;
    border-top: 1px solid ${d.accent};
  }
  .demo-name {
    font-family: "JetBrains Mono", monospace;
    font-size: 22px;
    color: ${d.accent};
    letter-spacing: 0.02em;
  }
  .url {
    font-family: "JetBrains Mono", monospace;
    font-size: 18px;
    color: ${d.muted};
  }
  .visual {
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${d.accent};
    color: ${d.bg};
    border-radius: 16px;
    padding: 40px;
  }
  .visual svg { max-width: 100%; height: auto; }
  .visual-bg { background: ${d.bg}; color: ${d.accent}; }
</style>
</head>
<body>
  <div class="copy">
    <div class="brand">forgesworn</div>
    <div>
      <h1>${d.headline}</h1>
      <p class="lede">${d.lede}</p>
    </div>
    <div class="footer">
      <span class="demo-name">${d.name}</span>
      <span class="url">${d.name}.forgesworn.dev</span>
    </div>
  </div>
  <div class="visual ${d.visual === "cards" ? "visual-bg" : ""}">
    ${visualSvg(d.visual, d.visual === "cards" ? d.accent : d.bg)}
  </div>
</body>
</html>`;
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 2, // retina output — 2400×1260 internal, we'll downscale to 1200×630 on save
  });
  for (const d of DEMOS) {
    const page = await context.newPage();
    const html = htmlFor(d);
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.waitForTimeout(800); // let fonts load
    const outDir = resolve(ROOT, "apps", d.name, "public");
    mkdirSync(outDir, { recursive: true });
    const outPath = resolve(outDir, "og.png");
    await page.screenshot({
      path: outPath,
      clip: { x: 0, y: 0, width: 1200, height: 630 },
      type: "png",
    });
    await page.close();
    console.log(`✓ ${outPath}`);
  }
  await browser.close();
}

await main();
