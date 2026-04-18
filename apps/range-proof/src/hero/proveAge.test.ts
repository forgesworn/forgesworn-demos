import { describe, it, expect } from "vitest";
import { proveAgeOver18, verifyAgeOver18 } from "./proveAge.js";

describe("proveAgeOver18", () => {
  it("produces a verifying proof for someone over 18", () => {
    // Birthday in 1990 — clearly over 18 in 2026
    const proof = proveAgeOver18("1990-01-01", new Date("2026-04-18"));
    expect(verifyAgeOver18(proof)).toBe(true);
  });

  it("throws for someone under 18", () => {
    // Birthday in 2015 — 11 years old in 2026
    expect(() => proveAgeOver18("2015-01-01", new Date("2026-04-18"))).toThrow(
      /not within the specified range/i,
    );
  });

  it("throws for invalid date strings", () => {
    expect(() => proveAgeOver18("not-a-date", new Date("2026-04-18"))).toThrow();
  });
});
