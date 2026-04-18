import "./walkthrough.css";

export function Walkthrough() {
  return (
    <section class="rs-walk">
      <h2>How it works</h2>

      <article class="rs-walk-step">
        <h3>1. A ring is a claim, not consensus</h3>
        <p>
          Anyone can compose a ring of public keys — no consent is needed from
          the keys themselves. A valid ring signature proves <em>one of</em>{" "}
          these keys signed. It does not prove the ring is a real group. The
          weight of the signature depends entirely on how recognisable — and
          sybil-resistant — the ring members are.
        </p>
      </article>

      <article class="rs-walk-step">
        <h3>2. Signing, not encrypting</h3>
        <p>
          A ring signature is a <strong>signature</strong>. The message is in
          the clear. What is hidden is the <em>author</em>. If you need to hide
          the message too, layer encryption on top — NIP-44 for Nostr events,
          application-level encryption otherwise.
        </p>
      </article>

      <article class="rs-walk-step">
        <h3>3. Why LSAG? Intra-context linkability.</h3>
        <svg
          class="rs-walk-diagram"
          viewBox="0 0 200 200"
          role="img"
          aria-label="Five ring members connected in a closed cycle of challenges"
        >
          <defs>
            <marker id="rs-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <polygon points="0,0 8,4 0,8" fill="currentColor" />
            </marker>
          </defs>
          {[0, 1, 2, 3, 4].map((i) => {
            const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
            const cx = 100 + Math.cos(angle) * 70;
            const cy = 100 + Math.sin(angle) * 70;
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r="8" fill="currentColor" opacity="0.8" />
                <text
                  x={cx}
                  y={cy + 3}
                  font-family="var(--font-mono)"
                  font-size="9"
                  fill="var(--colour-bg-raised)"
                  text-anchor="middle"
                >
                  {i}
                </text>
              </g>
            );
          })}
          {[0, 1, 2, 3, 4].map((i) => {
            const a1 = (i / 5) * Math.PI * 2 - Math.PI / 2;
            const a2 = ((i + 1) / 5) * Math.PI * 2 - Math.PI / 2;
            const inset = 10;
            const x1 = 100 + Math.cos(a1) * (70 - inset);
            const y1 = 100 + Math.sin(a1) * (70 - inset);
            const x2 = 100 + Math.cos(a2) * (70 - inset);
            const y2 = 100 + Math.sin(a2) * (70 - inset);
            return (
              <line
                key={`e-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                stroke-width="1.2"
                opacity="0.45"
                marker-end="url(#rs-arrow)"
              />
            );
          })}
          {/* Pulse that travels around the ring once every 3 s */}
          <circle r="4" fill="var(--colour-crypto-highlight)">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(() => { const AM = "animateMotion" as any; return <AM dur="3s" repeatCount="indefinite" path="M 100 30 A 70 70 0 1 1 99.99 30 Z" />; })()}
          </circle>
        </svg>
        <p>
          A plain SAG ring signature is unlinkable — the same key signing twice
          produces signatures that look unrelated. LSAG adds a{" "}
          <strong>key image</strong>: a deterministic value for the
          (signer, context) pair. Within one context, same signer ⇒ same key image,
          so applications can detect duplicates (ballot-stuffing, double publication){" "}
          <em>without</em> unmasking anyone. Across different contexts, key images
          are independent.
        </p>
      </article>

      <article class="rs-walk-step">
        <h3>4. Sybil resistance is a separate layer</h3>
        <p>
          Ring-sig gives you anonymity <em>within</em> a chosen set. It does
          not tell you whether that set is one person in a trenchcoat. Real
          anonymity budgets combine ring-sig with something that anchors keys
          to distinct humans or organisations — NIP-05 DNS, social-graph
          distance, proof of history, proof of stake, or human verification.
        </p>
      </article>

      <article class="rs-walk-step">
        <h3>5. One application built on top: nostr-veil</h3>
        <p>
          If you want a complete example of layering ring-sig with sybil
          resistance, trust scores, and aggregation to produce privacy-preserving
          Nostr reputation data, look at{" "}
          <a href="https://github.com/forgesworn/nostr-veil">
            <code>nostr-veil</code>
          </a>
          . It takes NIP-85 trust assertions, wraps each contribution in an
          LSAG signature, aggregates by median, and publishes as a standard
          kind 30382 event. The full pattern, built on the same library you
          just played with.
        </p>
      </article>
    </section>
  );
}
