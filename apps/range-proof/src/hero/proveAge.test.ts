import { describe, it, expect } from "vitest";
import { proveAgeBand, verifyAgeBand } from "./proveAge.js";

describe("proveAgeBand — 18+", () => {
  it("produces a verifying proof for someone over 18", () => {
    // Birthday in 1990 — clearly over 18 in 2026
    const proof = proveAgeBand("1990-01-01", "18+", new Date("2026-04-18"));
    expect(verifyAgeBand(proof)).toBe(true);
  });

  it("throws for someone under 18", () => {
    // Birthday in 2015 — 11 years old in 2026
    expect(() => proveAgeBand("2015-01-01", "18+", new Date("2026-04-18"))).toThrow(
      /not within the specified range/i,
    );
  });

  it("throws for invalid date strings", () => {
    expect(() => proveAgeBand("not-a-date", "18+", new Date("2026-04-18"))).toThrow();
  });
});

describe("proveAgeBand — under-18", () => {
  it("produces a verifying proof for a child", () => {
    // Birthday in 2015 — 11 years old in 2026
    const proof = proveAgeBand("2015-01-01", "under-18", new Date("2026-04-18"));
    expect(proof.category).toBe("under-18");
    expect(verifyAgeBand(proof)).toBe(true);
  });

  it("throws for an adult trying to prove they are under 18", () => {
    expect(() => proveAgeBand("1990-01-01", "under-18", new Date("2026-04-18"))).toThrow(
      /not within the specified range/i,
    );
  });
});
