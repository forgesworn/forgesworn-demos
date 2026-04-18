import { describe, it, expect } from "vitest";
import { generateCardSheet } from "./generateCardSheet.js";
import { splitSeed } from "./splitSeed.js";

const DEMO =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

describe("generateCardSheet", () => {
  it("produces a valid A4 PDF containing 5 cards", async () => {
    const shares = splitSeed(DEMO, 3, 5);
    const pdf = await generateCardSheet(shares, 3, 5);
    const header = new TextDecoder().decode(pdf.slice(0, 5));
    expect(header).toBe("%PDF-");
    expect(pdf.byteLength).toBeGreaterThan(2000);
  });
});
