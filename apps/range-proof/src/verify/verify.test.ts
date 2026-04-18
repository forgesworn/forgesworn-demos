import { describe, it, expect } from "vitest";
import { proveAgeOver18, encodeBundle, decodeBundle, verifyAgeOver18 } from "../hero/proveAge.js";

describe("encode → decode → verify round-trip", () => {
  it("decodes and verifies a freshly encoded bundle", () => {
    const bundle = proveAgeOver18("1990-01-01", new Date("2026-04-18"));
    const encoded = encodeBundle(bundle);
    const decoded = decodeBundle(encoded);
    expect(verifyAgeOver18(decoded)).toBe(true);
    expect(decoded.issuedAt).toBe(bundle.issuedAt);
    expect(decoded.category).toBe("18+");
  });

  it("fails to decode/verify tampered input", () => {
    const bundle = proveAgeOver18("1990-01-01", new Date("2026-04-18"));
    const encoded = encodeBundle(bundle);
    // Flip one character in the middle — either decode throws, or verify returns false.
    const tampered = encoded.slice(0, 32) + (encoded[32] === "A" ? "B" : "A") + encoded.slice(33);
    let ok = true;
    try {
      const decoded = decodeBundle(tampered);
      ok = verifyAgeOver18(decoded);
    } catch {
      ok = false;
    }
    expect(ok).toBe(false);
  });
});
