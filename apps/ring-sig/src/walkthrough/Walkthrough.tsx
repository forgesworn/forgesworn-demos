import "./walkthrough.css";

export function Walkthrough() {
  return (
    <section class="rs-walk">
      <h2>How it works</h2>

      <article class="rs-walk-step">
        <h3>1. A ring is a claim, not consensus</h3>
        <svg
          class="rs-walk-diagram"
          viewBox="0 0 200 120"
          role="img"
          aria-label="A composer picks five public keys and calls the result a ring — no consent is required"
        >
          <g font-family="var(--font-mono)" font-size="9" fill="currentColor">
            {/* Composer on the left */}
            <rect x="10" y="50" width="30" height="20" rx="2" fill="transparent" stroke="currentColor" stroke-width="1.5" />
            <text x="25" y="64" text-anchor="middle" fill="currentColor">you</text>

            {/* Five pubkeys on the right */}
            {[40, 55, 70, 85, 100].map((y, i) => (
              <g key={i}>
                <circle cx="160" cy={y - 10} r="6" fill="currentColor" opacity="0.8" />
                <text x="170" y={y - 7} fill="currentColor" opacity="0.5">key {i + 1}</text>
                <line x1="42" y1="60" x2="152" y2={y - 10} stroke="currentColor" stroke-width="0.8" opacity="0.3">
                  <animate attributeName="opacity" values="0;0.3;0.3" dur="2.4s" begin={`${i * 0.12}s`} repeatCount="indefinite" />
                </line>
              </g>
            ))}
          </g>
        </svg>
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
        <svg
          class="rs-walk-diagram"
          viewBox="0 0 320 90"
          role="img"
          aria-label="Ring signatures plus sybil resistance plus aggregation produce a trust score event"
        >
          <g font-family="var(--font-mono)" font-size="9" fill="currentColor">
            <g>
              <rect x="10" y="20" width="60" height="22" rx="3" fill="transparent" stroke="currentColor" stroke-width="1" />
              <text x="40" y="34" text-anchor="middle" fill="currentColor">ring-sig</text>
            </g>
            <g>
              <rect x="10" y="50" width="60" height="22" rx="3" fill="transparent" stroke="currentColor" stroke-width="1" opacity="0.5" />
              <text x="40" y="64" text-anchor="middle" fill="currentColor" opacity="0.6">sybil layer</text>
            </g>
            <line x1="75" y1="31" x2="140" y2="45" stroke="currentColor" stroke-width="1" opacity="0.5" />
            <line x1="75" y1="61" x2="140" y2="45" stroke="currentColor" stroke-width="1" opacity="0.5" />
            <rect x="140" y="30" width="70" height="30" rx="3" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.2" />
            <text x="175" y="48" text-anchor="middle" fill="currentColor">aggregate</text>
            <line x1="210" y1="45" x2="260" y2="45" stroke="currentColor" stroke-width="1.5">
              <animate attributeName="stroke-dasharray" values="0,50;50,0" dur="2.4s" repeatCount="indefinite" />
            </line>
            <circle cx="285" cy="45" r="14" fill="currentColor">
              <animate attributeName="r" values="10;16;10" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <text x="285" y="48" text-anchor="middle" fill="var(--colour-bg)">30382</text>
          </g>
        </svg>
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
