import "./walkthrough.css";

const PRIOR_ART = [
  {
    name: "Pedersen commitments",
    href: "https://elementsproject.org/features/confidential-transactions/investigation",
    body:
      "A commitment hides a value but still lets algebraic relationships be checked. Confidential Transactions uses this foundation for private amounts.",
  },
  {
    name: "CDS partial-knowledge proofs",
    href: "https://link.springer.com/chapter/10.1007/3-540-48658-5_19",
    body:
      "The bit checks use the Cramer, Damgard and Schoenmakers OR-composition pattern: prove one branch is valid without disclosing the witness.",
  },
  {
    name: "Bulletproofs",
    href: "https://crypto.stanford.edu/~dabo/pubs/abstracts/bulletproofs.html",
    body:
      "Modern confidential-transaction systems usually use more compact range proofs. Bulletproofs are the obvious reference point for that line of work.",
  },
  {
    name: "Monero and Elements",
    href: "https://www.getmonero.org/2020/12/24/Bulletproofs%2B-in-Monero.html",
    body:
      "Production privacy systems have been using range proofs for years. This demo is not claiming to be first; it is making the primitive easy to inspect.",
  },
] as const;

const LIVE_NEIGHBOURS = [
  { name: "Privado ID", href: "https://docs.privado.id/docs/verifier/query-builder/" },
  { name: "Self", href: "https://docs.self.xyz/" },
  { name: "zkPass", href: "https://zkpass.org/" },
  { name: "Anon Aadhaar", href: "https://documentation.anon-aadhaar.pse.dev/docs/intro" },
] as const;

export function Walkthrough() {
  return (
    <section class="rp-walk">
      <div class="rp-section-intro">
        <p class="rp-section-kicker">Mechanics</p>
        <h2>How it works</h2>
        <p>
          A range proof answers a narrow question: is the hidden value inside a
          public range? For the age demo that means 18+ or Under 18. It does not
          reveal the date of birth.
        </p>
      </div>

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
          <code>C = v·G + r·H</code>. This is a point on the secp256k1 curve where{" "}
          <code>v</code> is the secret value and <code>r</code> is a random blinding
          factor. Two generators: <code>G</code> is the standard curve generator,{" "}
          <code>H</code> is derived from a nothing-up-my-sleeve hash so no one knows{" "}
          <code>log_G(H)</code>.
        </p>
      </article>

      <article class="rp-walk-step">
        <h3>2. Bit decomposition</h3>
        <svg
          class="rp-walk-diagram"
          viewBox="0 0 320 80"
          role="img"
          aria-label="A value decomposed into eight bits, each proven to be zero or one"
        >
          {Array.from({ length: 8 }).map((_, i) => {
            const x = 20 + i * 36;
            const bit = [1, 0, 1, 1, 0, 1, 0, 1][i] ?? 0;
            return (
              <g key={i}>
                <rect x={x} y="24" width="24" height="24" rx="3" fill={bit ? "currentColor" : "transparent"} stroke="currentColor" stroke-width="1.5">
                  <animate attributeName="opacity" values="0.3;1;1" dur="2.4s" begin={`${i * 0.15}s`} repeatCount="indefinite" />
                </rect>
                <text x={x + 12} y="42" font-family="var(--font-mono)" font-size="12" fill={bit ? "var(--colour-bg)" : "currentColor"} text-anchor="middle">
                  {bit}
                </text>
              </g>
            );
          })}
        </svg>
        <p>
          To prove <code>0 ≤ v &lt; 2^n</code> without revealing{" "}
          <code>v</code>, we express <code>v</code> as its bits and prove each
          bit is either 0 or 1 using a CDS OR-composition Schnorr proof.
          A separate sum-binding proof ties the bits back to the commitment.
        </p>
      </article>

      <article class="rp-walk-step">
        <h3>3. Fiat-Shamir</h3>
        <svg
          class="rp-walk-diagram"
          viewBox="0 0 320 90"
          role="img"
          aria-label="Three commitments feed into a hash which emits a single challenge"
        >
          <g font-family="var(--font-mono)" font-size="10" fill="currentColor">
            <circle cx="30" cy="25" r="8" fill="currentColor" opacity="0.6" />
            <text x="30" y="28" text-anchor="middle" fill="var(--colour-bg)">A</text>
            <circle cx="30" cy="55" r="8" fill="currentColor" opacity="0.6" />
            <text x="30" y="58" text-anchor="middle" fill="var(--colour-bg)">B</text>
            <circle cx="30" cy="85" r="8" fill="currentColor" opacity="0.6" />
            <text x="30" y="88" text-anchor="middle" fill="var(--colour-bg)">C</text>

            <line x1="42" y1="25" x2="140" y2="50" stroke="currentColor" stroke-width="1.2" opacity="0.4" />
            <line x1="42" y1="55" x2="140" y2="50" stroke="currentColor" stroke-width="1.2" opacity="0.4" />
            <line x1="42" y1="85" x2="140" y2="50" stroke="currentColor" stroke-width="1.2" opacity="0.4" />

            <rect x="140" y="35" width="80" height="30" rx="4" fill="transparent" stroke="currentColor" stroke-width="1.5" />
            <text x="180" y="55" text-anchor="middle" font-family="var(--font-mono)" font-size="11" fill="currentColor">H(·)</text>

            <line x1="220" y1="50" x2="280" y2="50" stroke="currentColor" stroke-width="1.5">
              <animate attributeName="stroke-dasharray" values="0,60;60,0" dur="2.4s" repeatCount="indefinite" />
            </line>
            <circle cx="290" cy="50" r="8" fill="currentColor">
              <animate attributeName="r" values="5;10;5" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <text x="290" y="53" text-anchor="middle" fill="var(--colour-bg)">e</text>
          </g>
        </svg>
        <p>
          The interactive proof is made non-interactive by hashing all
          commitments into a single challenge. No verifier needs to be online
          to generate a fresh challenge. Domain separators prevent cross-protocol
          replay.
        </p>
      </article>

      <article class="rp-walk-step">
        <h3>4. Why this is honest</h3>
        <p>
          The verifier sees only the commitment and the proof. Even with
          unlimited computation, they cannot distinguish <code>v = 10</code>{" "}
          from <code>v = 42</code>, as long as both are in the proven range.
          This is <strong>information-theoretic hiding</strong>: the same proof
          would be produced for any valid value.
        </p>
      </article>

      <section class="rp-boundary" aria-labelledby="rp-boundary-title">
        <div class="rp-section-intro">
          <p class="rp-section-kicker">Trust boundary</p>
          <h2 id="rp-boundary-title">What this proves, and what it does not</h2>
          <p>
            The cryptography is precise. The product boundary needs to be just
            as precise.
          </p>
        </div>

        <div class="rp-boundary-grid">
          <article>
            <h3>It proves a predicate</h3>
            <p>
              The hidden age is inside the selected range under this proof's
              public parameters.
            </p>
          </article>
          <article>
            <h3>It hides the input</h3>
            <p>
              The verifier receives a commitment and proof. The birthday and
              blinding factor stay off the wire.
            </p>
          </article>
          <article>
            <h3>It needs an issuer in real use</h3>
            <p>
              This page uses a self-entered birthday. Production systems need a
              signed credential, subject key, or other trusted source for the
              hidden value.
            </p>
          </article>
        </div>
      </section>

      <section class="rp-prior" aria-labelledby="rp-prior-title">
        <div class="rp-section-intro">
          <p class="rp-section-kicker">Prior art</p>
          <h2 id="rp-prior-title">Standing on established work</h2>
          <p>
            This is not a new proof system. The useful part here is the shape:
            a small TypeScript range-proof library for secp256k1, designed to
            run in a browser and to be read without a SNARK toolchain.
          </p>
        </div>

        <div class="rp-prior-grid">
          {PRIOR_ART.map((item) => (
            <a href={item.href} target="_blank" rel="noreferrer" key={item.name}>
              <span>{item.name}</span>
              <p>{item.body}</p>
            </a>
          ))}
        </div>
      </section>

      <section class="rp-neighbours" aria-labelledby="rp-neighbours-title">
        <div>
          <p class="rp-section-kicker">Current landscape</p>
          <h2 id="rp-neighbours-title">There are other systems doing this class of work</h2>
        </div>
        <p>
          Privado ID, Self, zkPass and Anon Aadhaar are examples of broader
          zero-knowledge credential or attestation systems. They solve more of
          the credential workflow. This repo is narrower: a range-proof
          primitive and a demo that shows the privacy boundary directly.
        </p>
        <ul>
          {LIVE_NEIGHBOURS.map((item) => (
            <li key={item.name}>
              <a href={item.href} target="_blank" rel="noreferrer">
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
