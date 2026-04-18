interface ToolkitEntry {
  readonly name: string;
  readonly url: string;
  readonly what: string;
}

const FEATURED: readonly ToolkitEntry[] = [
  { name: "range-proof", url: "https://github.com/forgesworn/range-proof", what: "Pedersen commitment range proofs" },
  { name: "shamir-words", url: "https://github.com/forgesworn/shamir-words", what: "Shamir secret sharing with BIP-39 encoding" },
  { name: "ring-sig", url: "https://github.com/forgesworn/ring-sig", what: "SAG/LSAG ring signatures on secp256k1" },
];

const MORE: readonly ToolkitEntry[] = [
  { name: "nsec-tree", url: "https://github.com/forgesworn/nsec-tree", what: "Deterministic sub-identity derivation" },
  { name: "canary-kit", url: "https://github.com/forgesworn/canary-kit", what: "Coercion-resistant spoken verification" },
  { name: "spoken-token", url: "https://github.com/forgesworn/spoken-token", what: "Human-speakable verification tokens" },
  { name: "nostr-attestations", url: "https://github.com/forgesworn/nostr-attestations", what: "NIP-VA verifiable attestations" },
  { name: "nostr-veil", url: "https://github.com/forgesworn/nostr-veil", what: "Privacy-preserving Web of Trust" },
];

export function Footer() {
  return (
    <footer class="fgs-footer">
      <h2 class="fgs-footer-title">Part of the ForgeSworn Toolkit</h2>
      <p class="fgs-footer-lede">
        Open-source cryptographic identity, payments, and coordination tools.
      </p>

      <div class="fgs-footer-subtitle">Featured here</div>
      <ul class="fgs-toolkit is-featured">
        {FEATURED.map((entry) => (
          <li key={entry.name}>
            <a href={entry.url}>{entry.name}</a>
            <span>{entry.what}</span>
          </li>
        ))}
      </ul>

      <div class="fgs-footer-subtitle">More in the toolkit</div>
      <ul class="fgs-toolkit">
        {MORE.map((entry) => (
          <li key={entry.name}>
            <a href={entry.url}>{entry.name}</a>
            <span>{entry.what}</span>
          </li>
        ))}
      </ul>

      <p class="fgs-footer-licence">
        MIT · <a href="https://forgesworn.dev">forgesworn.dev</a>
      </p>
    </footer>
  );
}
