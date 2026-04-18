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
        <p>
          A plain SAG ring signature is unlinkable — the same key signing twice
          produces signatures that look unrelated. LSAG adds a{" "}
          <strong>key image</strong>: a deterministic value for the
          (signer, context) pair. Within one context, same signer ⇒ same key
          image, so applications can detect duplicates (ballot-stuffing, double
          publication) <em>without</em> unmasking anyone. Across different
          contexts, key images are independent.
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
