import type { SignedColumn } from "./signColumn.js";
import { ProofInspector } from "./ProofInspector.js";
import "./publishedColumn.css";

interface Props {
  readonly column: SignedColumn;
  readonly threadColour: string;
  readonly showEncryptionNote: boolean;
}

function short(hex: string, head = 6, tail = 4): string {
  return hex.length <= head + tail + 1 ? hex : `${hex.slice(0, head)}…${hex.slice(-tail)}`;
}

export function PublishedColumn({ column, threadColour, showEncryptionNote }: Props) {
  return (
    <article class="rs-column" style={{ "--rs-thread": threadColour }}>
      <header class="rs-column-byline">
        <span class="rs-column-author">The Insider</span>
        <time class="rs-column-time">
          {new Date(column.issuedAt).toLocaleString("en-GB")}
        </time>
      </header>

      <div class="rs-column-body">{column.message}</div>

      <footer class="rs-column-proof">
        <div class="rs-column-proof-row">
          <span class="rs-column-proof-label">Message</span>
          <span class="rs-column-proof-value plain">Publicly readable, not encrypted</span>
        </div>
        <div class="rs-column-proof-row">
          <span class="rs-column-proof-label">Signature</span>
          <span class="rs-column-proof-value mono">
            {short(column.signature.c0, 10, 6)} · ring of {column.ring.length}
          </span>
        </div>
        <div class="rs-column-proof-row">
          <span class="rs-column-proof-label">Key image</span>
          <span class="rs-column-proof-value mono" style={{ color: threadColour }}>
            {short(column.keyImage, 10, 6)}
          </span>
        </div>
        {showEncryptionNote && (
          <p class="rs-column-encryption-note">
            <strong>Ring signatures sign — they do not encrypt.</strong> The
            message above is public. What is hidden is <em>which</em> of the{" "}
            {column.ring.length} ring members wrote it. To hide the content too,
            layer NIP-44 encryption on top (a separate concern).
          </p>
        )}
      </footer>
      <ProofInspector column={column} />
    </article>
  );
}
