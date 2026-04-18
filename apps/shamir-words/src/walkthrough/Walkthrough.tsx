import "./walkthrough.css";

export function Walkthrough() {
  return (
    <section class="sw-walk">
      <h2>How it works</h2>

      <article class="sw-walk-step">
        <h3>1. Shamir over GF(256)</h3>
        <svg
          class="sw-walk-diagram"
          viewBox="0 0 320 120"
          role="img"
          aria-label="A polynomial passing through the secret at x equals zero and five share points"
        >
          <defs>
            <linearGradient id="sw-axis" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="currentColor" stop-opacity="0.2" />
              <stop offset="1" stop-color="currentColor" stop-opacity="0.4" />
            </linearGradient>
          </defs>
          <line x1="20" y1="100" x2="300" y2="100" stroke="url(#sw-axis)" stroke-width="1" />
          <line x1="40" y1="20" x2="40" y2="108" stroke="url(#sw-axis)" stroke-width="1" />

          {/* Polynomial curve (static shape) */}
          <path
            d="M 40 60 Q 100 10 160 70 T 290 40"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          />

          {/* Secret point at x=0 (the constant term) */}
          <circle cx="40" cy="60" r="5" fill="currentColor">
            <animate attributeName="r" values="3;6;3" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <text x="14" y="64" font-family="var(--font-mono)" font-size="10" fill="currentColor">S</text>

          {/* Share points along the curve (x = 1..5) */}
          {[
            { x: 90, y: 33, label: "1" },
            { x: 130, y: 50, label: "2" },
            { x: 175, y: 71, label: "3" },
            { x: 220, y: 58, label: "4" },
            { x: 265, y: 45, label: "5" },
          ].map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="3.5" fill="currentColor" opacity="0.7">
                <animate
                  attributeName="opacity"
                  values="0;0.7;0.7"
                  dur="2.4s"
                  begin={`${i * 0.12}s`}
                  repeatCount="indefinite"
                />
              </circle>
              <text
                x={p.x + 6}
                y={p.y - 4}
                font-family="var(--font-mono)"
                font-size="9"
                fill="currentColor"
                opacity="0.6"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>
        <p>
          The secret is split into shares using Shamir's secret sharing over the
          finite field <code>GF(256)</code>. A polynomial of degree{" "}
          <code>threshold - 1</code> is constructed with the secret bytes as the
          constant term; each share is the polynomial evaluated at a distinct
          non-zero x-coordinate.
        </p>
      </article>

      <article class="sw-walk-step">
        <h3>2. Lagrange reconstruction</h3>
        <svg
          class="sw-walk-diagram"
          viewBox="0 0 320 120"
          role="img"
          aria-label="Three highlighted share points converge on the secret at x equals zero"
        >
          <line x1="20" y1="100" x2="300" y2="100" stroke="currentColor" stroke-width="1" opacity="0.3" />
          <line x1="40" y1="20" x2="40" y2="108" stroke="currentColor" stroke-width="1" opacity="0.3" />

          <path
            d="M 40 60 Q 100 10 160 70 T 290 40"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            opacity="0.35"
          />

          {[
            { x: 90, y: 33, on: true, label: "1" },
            { x: 130, y: 50, on: false, label: "2" },
            { x: 175, y: 71, on: true, label: "3" },
            { x: 220, y: 58, on: false, label: "4" },
            { x: 265, y: 45, on: true, label: "5" },
          ].map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={p.on ? 5 : 3} fill="currentColor" opacity={p.on ? 1 : 0.3} />
              <text x={p.x + 6} y={p.y - 6} font-family="var(--font-mono)" font-size="9" fill="currentColor" opacity={p.on ? 0.8 : 0.3}>
                {p.label}
              </text>
              {p.on && (
                <line x1={p.x} y1={p.y} x2="40" y2="60" stroke="currentColor" stroke-width="0.8" opacity="0.25" stroke-dasharray="2 3">
                  <animate attributeName="opacity" values="0;0.25;0.25" dur="2.8s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
                </line>
              )}
            </g>
          ))}

          <circle cx="40" cy="60" r="6" fill="currentColor">
            <animate attributeName="r" values="3;7;3" dur="2.8s" repeatCount="indefinite" />
          </circle>
          <text x="14" y="64" font-family="var(--font-mono)" font-size="10" fill="currentColor">S</text>
        </svg>
        <p>
          Given any <code>threshold</code> shares, Lagrange interpolation
          recovers the polynomial's constant term — the original secret. Fewer
          shares leave the polynomial under-determined: any secret byte is
          equally plausible.
        </p>
      </article>

      <article class="sw-walk-step">
        <h3>3. BIP-39 word encoding</h3>
        <svg
          class="sw-walk-diagram"
          viewBox="0 0 320 90"
          role="img"
          aria-label="Raw bytes are repacked into eleven-bit groups and each group picks a BIP-39 word"
        >
          <g font-family="var(--font-mono)" font-size="9" fill="currentColor">
            {/* Byte row */}
            <text x="6" y="20" fill="currentColor" opacity="0.6">bytes</text>
            {Array.from({ length: 11 }).map((_, i) => (
              <rect key={`b-${i}`} x={40 + i * 22} y="10" width="20" height="16" rx="2" fill="currentColor" opacity={0.1 + (i % 3) * 0.15} stroke="currentColor" stroke-width="0.8" />
            ))}

            {/* 11-bit group divider row */}
            <text x="6" y="55" fill="currentColor" opacity="0.6">11-bit</text>
            {Array.from({ length: 8 }).map((_, i) => (
              <rect key={`g-${i}`} x={40 + i * 30} y="44" width="27" height="16" rx="2" fill="transparent" stroke="currentColor" stroke-width="1" opacity="0.7" />
            ))}

            {/* Word row */}
            <text x="6" y="85" fill="currentColor" opacity="0.6">word</text>
            {["abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract"].map((w, i) => (
              <text key={`w-${i}`} x={40 + i * 30 + 13} y="83" font-family="var(--font-mono)" font-size="7" fill="currentColor" opacity="0.75" text-anchor="middle">
                {w}
              </text>
            ))}
          </g>
        </svg>
        <p>
          Raw byte shares are error-prone to transcribe and impossible to read
          aloud. shamir-words packs each share with a length prefix, threshold,
          share ID, and SHA-256 checksum byte, then encodes the byte stream as
          an 11-bit-per-word BIP-39 phrase — the same wordlist Bitcoin wallets
          have trained users on for a decade.
        </p>
      </article>

      <article class="sw-walk-step">
        <h3>4. Why BIP-39 rather than SLIP-39</h3>
        <p>
          SLIP-39 (the Trezor-native Shamir scheme) uses its own 1024-word list
          and a specific group/share hierarchy. It's a well-designed spec, but
          it's also tightly coupled to a particular hardware-vendor workflow.
          shamir-words reuses BIP-39 words devs and users already know, and has
          no opinion about hierarchy — split any bytes any way.
        </p>
      </article>

      <article class="sw-walk-step">
        <h3>5. Operational reality</h3>
        <p>
          Splitting a seed is the easy part. Distributing cards to custodians,
          recovering when one is lost, resisting collusion between custodians,
          and testing the restore path — that's where most operational failure
          happens. shamir-words gives you the primitive; the human process is
          yours to design.
        </p>
      </article>
    </section>
  );
}
