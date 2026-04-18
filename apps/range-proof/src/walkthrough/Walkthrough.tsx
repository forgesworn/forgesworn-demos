import "./walkthrough.css";

export function Walkthrough() {
  return (
    <section class="rp-walk">
      <h2>How it works</h2>

      <article class="rp-walk-step">
        <h3>1. Pedersen commitment</h3>
        <svg
          class="rp-walk-diagram"
          viewBox="0 0 320 120"
          role="img"
          aria-label="v·G plus r·H equals C: two vectors combine to form a commitment point"
        >
          <defs>
            <marker id="rp-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <polygon points="0,0 8,4 0,8" fill="currentColor" />
            </marker>
          </defs>
          <g transform="translate(40,60)">
            <line x1="0" y1="0" x2="80" y2="-30" stroke="currentColor" stroke-width="1.5" marker-end="url(#rp-arrow)">
              <animate attributeName="x2" from="0" to="80" dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="y2" from="0" to="-30" dur="1.6s" repeatCount="indefinite" />
            </line>
            <text x="42" y="-18" font-family="var(--font-mono)" font-size="10" fill="currentColor">v·G</text>
          </g>
          <g transform="translate(120,30)">
            <line x1="0" y1="0" x2="80" y2="30" stroke="currentColor" stroke-width="1.5" marker-end="url(#rp-arrow)">
              <animate attributeName="x2" from="0" to="80" dur="1.6s" begin="0.4s" repeatCount="indefinite" />
              <animate attributeName="y2" from="0" to="30" dur="1.6s" begin="0.4s" repeatCount="indefinite" />
            </line>
            <text x="42" y="30" font-family="var(--font-mono)" font-size="10" fill="currentColor">r·H</text>
          </g>
          <g transform="translate(200,60)">
            <circle cx="0" cy="0" r="6" fill="currentColor">
              <animate attributeName="r" from="2" to="6" dur="1.6s" begin="0.8s" repeatCount="indefinite" />
            </circle>
            <text x="12" y="4" font-family="var(--font-mono)" font-size="11" fill="currentColor">C</text>
          </g>
        </svg>
        <p>
          To hide the value while committing to it, we form{" "}
          <code>C = v·G + r·H</code> — a point on the secp256k1 curve where{" "}
          <code>v</code> is the secret value and <code>r</code> is a random blinding
          factor. Two generators: <code>G</code> is the standard curve generator,{" "}
          <code>H</code> is derived from a nothing-up-my-sleeve hash so no one knows{" "}
          <code>log_G(H)</code>.
        </p>
      </article>

      <article class="rp-walk-step">
        <h3>2. Bit decomposition</h3>
        <p>
          To prove <code>0 ≤ v &lt; 2^n</code> without revealing{" "}
          <code>v</code>, we express <code>v</code> as its bits and prove each
          bit is either 0 or 1 using a CDS OR-composition Schnorr proof.
          A separate sum-binding proof ties the bits back to the commitment.
        </p>
      </article>

      <article class="rp-walk-step">
        <h3>3. Fiat-Shamir</h3>
        <p>
          The interactive proof is made non-interactive by hashing all
          commitments into a single challenge — no verifier needs to be online
          to generate a fresh challenge. Domain separators prevent cross-protocol
          replay.
        </p>
      </article>

      <article class="rp-walk-step">
        <h3>4. Why this is honest</h3>
        <p>
          The verifier sees only the commitment and the proof. Even with
          unlimited computation, they cannot distinguish <code>v = 10</code>{" "}
          from <code>v = 42</code> — as long as both are in the proven range.
          This is <strong>information-theoretic hiding</strong>: the same proof
          would be produced for any valid value.
        </p>
      </article>

      <article class="rp-walk-step">
        <h3>5. What this is <em>not</em></h3>
        <p>
          This is not a full confidential-transaction system. It does not prove
          that the subject actually holds the value they claim — that is the
          job of the <em>issuer</em> of the input. Range proofs sit alongside
          credential systems (verifiable credentials, EUDI wallets) that
          attest to the inputs.
        </p>
      </article>
    </section>
  );
}
