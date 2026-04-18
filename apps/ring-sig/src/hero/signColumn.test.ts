import { describe, it, expect } from "vitest";
import { signColumn, verifyColumn } from "./signColumn.js";
import { RING_PRESETS } from "./ringPresets.js";

const preset = RING_PRESETS[0]!;
const member = preset.members[2]!;

describe("signColumn / verifyColumn", () => {
  it("signs with LSAG and verifies", () => {
    const signed = signColumn(preset, member, "Hello, world.", "session-context");
    expect(verifyColumn(signed)).toBe(true);
  });

  it("produces the same key image for the same (seat, context) — LSAG linkability", () => {
    const a = signColumn(preset, member, "Post A", "ctx-1");
    const b = signColumn(preset, member, "Post B", "ctx-1");
    expect(a.keyImage).toBe(b.keyImage);
  });

  it("produces a different key image for a different context", () => {
    const a = signColumn(preset, member, "Post", "ctx-1");
    const b = signColumn(preset, member, "Post", "ctx-2");
    expect(a.keyImage).not.toBe(b.keyImage);
  });

  it("tampered message fails verification", () => {
    const signed = signColumn(preset, member, "Hello, world.", "ctx");
    const tampered = { ...signed, message: "Goodbye, world." };
    expect(verifyColumn(tampered)).toBe(false);
  });
});
