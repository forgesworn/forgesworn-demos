import { describe, it, expect } from "vitest";
import { splitSeed, restoreSeed } from "./splitSeed.js";

const DEMO_SEED =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

describe("splitSeed / restoreSeed", () => {
  it("splits a valid BIP-39 phrase into 5 word-list shares", () => {
    const shares = splitSeed(DEMO_SEED, 3, 5);
    expect(shares).toHaveLength(5);
    for (const share of shares) {
      expect(share.length).toBeGreaterThan(0);
    }
  });

  it("restores from any 3 of 5 shares", () => {
    const shares = splitSeed(DEMO_SEED, 3, 5);
    const restored = restoreSeed([shares[0]!, shares[2]!, shares[4]!]);
    expect(restored).toBe(DEMO_SEED);
  });

  it("refuses to restore with fewer than threshold shares", () => {
    const shares = splitSeed(DEMO_SEED, 3, 5);
    expect(() => restoreSeed([shares[0]!, shares[1]!])).toThrow();
  });

  it("rejects invalid seed phrases", () => {
    expect(() => splitSeed("not a real seed", 3, 5)).toThrow();
  });
});
