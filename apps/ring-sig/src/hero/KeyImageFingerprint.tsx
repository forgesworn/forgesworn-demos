import type { JSX } from "preact";
import "./keyImageFingerprint.css";

interface Props {
  readonly keyImage: string;
  readonly size?: number;
  readonly accentColour: string;
}

// Build an 8-cell-wide × 4-cell-tall glyph mirrored horizontally around the centre.
// Each of the 16 unique cells is filled based on a bit of the keyImage.
// 16 bits come from the first 4 hex bytes of the key image. Deterministic, unique-ish.
function gridCells(keyImage: string): boolean[] {
  const hex = keyImage.replace(/^0x/, "").padStart(8, "0").slice(0, 8);
  const bits: boolean[] = [];
  for (const ch of hex) {
    const n = parseInt(ch, 16);
    bits.push(Boolean(n & 0b1000));
    bits.push(Boolean(n & 0b0100));
    bits.push(Boolean(n & 0b0010));
    bits.push(Boolean(n & 0b0001));
  }
  // bits has 32 entries; we want 16 unique cells (left half of an 8-col × 4-row grid).
  return bits.slice(0, 16);
}

export function KeyImageFingerprint({ keyImage, size = 32, accentColour }: Props) {
  const cells = gridCells(keyImage);
  const cellSize = 1;

  // Render 8×4 grid; x in [0..7], y in [0..3]. Mirror left (x in [0..3]) to right (x in [4..7]).
  const squares: JSX.Element[] = [];
  for (let y = 0; y < 4; y++) {
    for (let xLeft = 0; xLeft < 4; xLeft++) {
      const index = y * 4 + xLeft;
      if (!cells[index]) continue;
      const xRight = 7 - xLeft;
      squares.push(
        <rect
          key={`l-${index}`}
          x={xLeft * cellSize}
          y={y * cellSize}
          width={cellSize}
          height={cellSize}
          fill={accentColour}
        />,
      );
      squares.push(
        <rect
          key={`r-${index}`}
          x={xRight * cellSize}
          y={y * cellSize}
          width={cellSize}
          height={cellSize}
          fill={accentColour}
        />,
      );
    }
  }

  return (
    <svg
      class="rs-fingerprint"
      viewBox="0 0 8 4"
      width={size}
      height={Math.round(size / 2)}
      role="img"
      aria-label={`Key-image fingerprint ${keyImage.slice(0, 8)}`}
    >
      {squares}
    </svg>
  );
}
