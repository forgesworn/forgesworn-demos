import { useMemo } from "preact/hooks";
import type { AgeProofBundle } from "./proveAge.js";
import "./proofArtefact.css";

interface Props {
  readonly bundle: AgeProofBundle;
}

// 32-cell hex fingerprint — each cell's opacity maps from a byte's value (0–255 → 0.15–1.0).
// Byte source: the first 32 bytes of the proof's commitment hex (or whatever first hex-like
// string the bundle exposes). Visual says "binary data", doesn't pretend to be meaningful.
function fingerprintCells(bundle: AgeProofBundle): number[] {
  const proof = bundle.proof as unknown as Record<string, unknown>;
  // Pull whatever hex-ish strings we can find from the proof object, join them.
  const pieces: string[] = [];
  function walk(v: unknown) {
    if (typeof v === "string" && /^[0-9a-fA-F]{8,}$/.test(v)) pieces.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v as Record<string, unknown>).forEach(walk);
  }
  walk(proof);
  const hex = pieces.join("").padEnd(64, "0").slice(0, 64);
  const cells: number[] = [];
  for (let i = 0; i < 32; i++) {
    const byte = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    cells.push(byte);
  }
  return cells;
}

// Byte-length of the serialised proof, formatted as "~2.4 kB".
function proofSize(bundle: AgeProofBundle): string {
  const bytes = new Blob([JSON.stringify(bundle.proof)]).size;
  if (bytes < 1024) return `${bytes} B`;
  return `~${(bytes / 1024).toFixed(1)} kB`;
}

function shortHex(s: string, head = 6, tail = 4): string {
  if (!s) return "—";
  return s.length <= head + tail + 1 ? s : `${s.slice(0, head)}…${s.slice(-tail)}`;
}

export function ProofArtefact({ bundle }: Props) {
  const cells = useMemo(() => fingerprintCells(bundle), [bundle]);
  const size = useMemo(() => proofSize(bundle), [bundle]);

  // Pull the commitment hex if present; otherwise fall back to a stringified first field.
  const proof = bundle.proof as unknown as Record<string, unknown>;
  const firstHex = Object.values(proof)
    .flat()
    .find((v) => typeof v === "string" && /^[0-9a-fA-F]{16,}$/.test(v as string)) as string | undefined;

  return (
    <div class="rp-artefact" role="group" aria-label="Range proof artefact">
      <div class="rp-artefact-header">
        <div>
          <div class="rp-artefact-label">Range proof</div>
          <div class="rp-artefact-size">{size}</div>
        </div>
        <div class="rp-artefact-category">{bundle.category}</div>
      </div>

      <svg
        class="rp-artefact-fingerprint"
        viewBox="0 0 8 4"
        role="img"
        aria-label="Byte fingerprint of the proof"
      >
        {cells.map((byte, index) => {
          const x = index % 8;
          const y = Math.floor(index / 8);
          const opacity = 0.15 + (byte / 255) * 0.85;
          return (
            <rect
              key={index}
              x={x}
              y={y}
              width="1"
              height="1"
              fill="currentColor"
              opacity={opacity}
            />
          );
        })}
      </svg>

      <dl class="rp-artefact-meta">
        <div>
          <dt>Issued</dt>
          <dd>{new Date(bundle.issuedAt).toLocaleString("en-GB")}</dd>
        </div>
        {firstHex && (
          <div>
            <dt>Commitment</dt>
            <dd class="is-mono">{shortHex(firstHex, 10, 6)}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
