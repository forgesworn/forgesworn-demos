import "./walkthrough.css";

export function Walkthrough() {
  return (
    <section class="sw-walk">
      <h2>How it works</h2>

      <article class="sw-walk-step">
        <h3>1. Shamir over GF(256)</h3>
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
        <p>
          Given any <code>threshold</code> shares, Lagrange interpolation
          recovers the polynomial's constant term — the original secret. Fewer
          shares leave the polynomial under-determined: any secret byte is
          equally plausible.
        </p>
      </article>

      <article class="sw-walk-step">
        <h3>3. BIP-39 word encoding</h3>
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
