import { describe, it, expect } from "vitest";
import { generateCertificate } from "./generateCertificate.js";
import { proveAgeBand, encodeBundle } from "./proveAge.js";

describe("generateCertificate", () => {
  it("produces a non-empty PDF", async () => {
    const bundle = proveAgeBand("1990-01-01", "18+", new Date("2026-04-18"));
    const pdf = await generateCertificate(bundle, "https://range-proof.forgesworn.dev/?verify=xyz");
    // PDFs start with "%PDF-"
    const firstFive = new TextDecoder().decode(pdf.slice(0, 5));
    expect(firstFive).toBe("%PDF-");
    expect(pdf.byteLength).toBeGreaterThan(1000);
  });

  it("produces a PDF even when the verify URL overflows a QR code", async () => {
    // The real verify URL embeds the whole proof (several KB) — far beyond a QR
    // code's ~2.9 KB capacity. The certificate must still generate (the QR falls
    // back to the site origin) rather than throwing.
    const bundle = proveAgeBand("1990-01-01", "18+", new Date("2026-04-18"));
    const longUrl = "https://range-proof.forgesworn.dev/?verify=" + encodeBundle(bundle);
    expect(longUrl.length).toBeGreaterThan(3000);
    const pdf = await generateCertificate(bundle, longUrl);
    const firstFive = new TextDecoder().decode(pdf.slice(0, 5));
    expect(firstFive).toBe("%PDF-");
  });
});
