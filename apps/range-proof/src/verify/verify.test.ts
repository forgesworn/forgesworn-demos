import { describe, it, expect } from "vitest";
import { proveAgeBand, encodeBundle, decodeBundle, verifyAgeBand } from "../hero/proveAge.js";

describe("encode → decode → verify round-trip", () => {
  it("decodes and verifies a freshly encoded 18+ bundle", () => {
    const bundle = proveAgeBand("1990-01-01", "18+", new Date("2026-04-18"));
    const encoded = encodeBundle(bundle);
    const decoded = decodeBundle(encoded);
    expect(verifyAgeBand(decoded)).toBe(true);
    expect(decoded.issuedAt).toBe(bundle.issuedAt);
    expect(decoded.category).toBe("18+");
  });

  it("round-trips an under-18 bundle", () => {
    const bundle = proveAgeBand("2015-01-01", "under-18", new Date("2026-04-18"));
    const decoded = decodeBundle(encodeBundle(bundle));
    expect(decoded.category).toBe("under-18");
    expect(verifyAgeBand(decoded)).toBe(true);
  });

  it("fails to decode/verify tampered input", () => {
    const bundle = proveAgeBand("1990-01-01", "18+", new Date("2026-04-18"));
    const encoded = encodeBundle(bundle);
    // Flip one character in the middle — either decode throws, or verify returns false.
    const tampered = encoded.slice(0, 32) + (encoded[32] === "A" ? "B" : "A") + encoded.slice(33);
    let ok = true;
    try {
      const decoded = decodeBundle(tampered);
      ok = verifyAgeBand(decoded);
    } catch {
      ok = false;
    }
    expect(ok).toBe(false);
  });
});
