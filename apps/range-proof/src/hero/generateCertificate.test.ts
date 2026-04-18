import { describe, it, expect } from "vitest";
import { generateCertificate } from "./generateCertificate.js";
import { proveAgeOver18 } from "./proveAge.js";

describe("generateCertificate", () => {
  it("produces a non-empty PDF", async () => {
    const bundle = proveAgeOver18("1990-01-01", new Date("2026-04-18"));
    const pdf = await generateCertificate(bundle, "https://range-proof.forgesworn.dev/?verify=xyz");
    // PDFs start with "%PDF-"
    const firstFive = new TextDecoder().decode(pdf.slice(0, 5));
    expect(firstFive).toBe("%PDF-");
    expect(pdf.byteLength).toBeGreaterThan(1000);
  });
});
