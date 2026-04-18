import { describe, it, expect } from "vitest";
import { generateColumnPdf } from "./generateColumnPdf.js";
import { signColumn } from "./signColumn.js";
import { RING_PRESETS } from "./ringPresets.js";

describe("generateColumnPdf", () => {
  it("produces a valid A4 PDF with QR", async () => {
    const preset = RING_PRESETS[0]!;
    const member = preset.members[0]!;
    const column = signColumn(preset, member, "Test column", "ctx");
    const pdf = await generateColumnPdf(column, "https://example.com/verify?c=abc");
    const header = new TextDecoder().decode(pdf.slice(0, 5));
    expect(header).toBe("%PDF-");
    expect(pdf.byteLength).toBeGreaterThan(2000);
  });
});
