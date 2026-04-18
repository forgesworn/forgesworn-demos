// Ring presets shown in the hero. Each preset has a name, a human story,
// a trust indicator, and a set of real secp256k1 keypairs the demo signs with.
// The keys are deterministic throwaway fixtures — they have no provenance
// outside this demo.
//
// The private keys are embedded so the demo can actually sign from the chosen
// seat without the user holding a real key. This is safe because these are
// demonstration keys only — they guard nothing.

import { schnorr } from "@noble/curves/secp256k1";
import { bytesToHex } from "@noble/hashes/utils";

export type TrustLevel = "strong" | "moderate" | "literary" | "weak";

export interface RingMember {
  readonly id: string;
  readonly label: string;
  readonly bio: string;
  readonly privateKey: string;
  readonly publicKey: string;
}

export interface RingPreset {
  readonly id: string;
  readonly name: string;
  readonly blurb: string;
  readonly trust: TrustLevel;
  readonly trustSignals: readonly string[];
  readonly members: readonly RingMember[];
}

function deterministicMember(seed: string, label: string, bio: string): RingMember {
  const encoder = new TextEncoder();
  const input = encoder.encode(`${seed}:${label}`);
  const bytes = new Uint8Array(32);
  for (let i = 0; i < input.length; i++) {
    bytes[i % 32] = (bytes[i % 32]! + input[i]!) & 0xff;
  }
  bytes[0] = (bytes[0]! & 0x7f) | 0x01;
  const privateKey = bytesToHex(bytes);
  const publicKey = bytesToHex(schnorr.getPublicKey(privateKey));
  return { id: `${seed}:${label}`, label, bio, privateKey, publicKey };
}

export const RING_PRESETS: readonly RingPreset[] = [
  {
    id: "times-newsroom",
    name: "The Times newsroom",
    blurb: "Five credentialled journalists at a major paper.",
    trust: "strong",
    trustSignals: [
      "5 independent NIP-05 DNS anchors (fictional for demo)",
      "Each key has 6+ months of Nostr history",
      "Social-graph distance > 2 between members",
    ],
    members: [
      deterministicMember("times", "R. Hardy", "Investigations editor"),
      deterministicMember("times", "K. Osei", "Political correspondent"),
      deterministicMember("times", "J. Lindström", "Legal affairs"),
      deterministicMember("times", "A. Nakamura", "Business desk"),
      deterministicMember("times", "E. Kowalski", "Features"),
    ],
  },
  {
    id: "privacy-researchers",
    name: "Nostr privacy researchers",
    blurb: "Well-known pseudonymous researchers in the Nostr community.",
    trust: "moderate",
    trustSignals: [
      "Long-running pseudonyms with public track record",
      "No DNS anchors — social-graph-anchored only",
      "Low but non-zero sybil risk",
    ],
    members: [
      deterministicMember("researchers", "frost", "Threshold signatures"),
      deterministicMember("researchers", "orbit", "WoT aggregation"),
      deterministicMember("researchers", "mirror", "Anonymous credentials"),
      deterministicMember("researchers", "cipher", "ZK primitives"),
      deterministicMember("researchers", "kernel", "Relay operator"),
    ],
  },
  {
    id: "historical-pseudonyms",
    name: "Historical pseudonyms",
    blurb: "Famous collective pen names from literary history.",
    trust: "literary",
    trustSignals: [
      "Not a real-world trust claim — literary framing",
      "Used to demonstrate the concept of shared anonymous authorship",
      "300 years of precedent: Bronte sisters, George Eliot, Mark Twain\u2026",
    ],
    members: [
      deterministicMember("historical", "Currer Bell", "Charlotte Bront\u00eb's pen name"),
      deterministicMember("historical", "Ellis Bell", "Emily Bront\u00eb's pen name"),
      deterministicMember("historical", "Acton Bell", "Anne Bront\u00eb's pen name"),
      deterministicMember("historical", "George Eliot", "Mary Ann Evans's pen name"),
      deterministicMember("historical", "Mark Twain", "Samuel Clemens's pen name"),
    ],
  },
  {
    id: "random-ring",
    name: "A random ring",
    blurb: "Five arbitrary pubkeys. Could all be one person.",
    trust: "weak",
    trustSignals: [
      "No DNS anchors",
      "Keys created in the last 24 hours",
      "Identical social-graph footprint (zero followers, no history)",
      "Likely all controlled by one actor — this is theatre, not anonymity",
    ],
    members: [
      deterministicMember("random", "alpha", "Fresh throwaway key"),
      deterministicMember("random", "beta", "Fresh throwaway key"),
      deterministicMember("random", "gamma", "Fresh throwaway key"),
      deterministicMember("random", "delta", "Fresh throwaway key"),
      deterministicMember("random", "epsilon", "Fresh throwaway key"),
    ],
  },
];

export function sortedRingPubkeys(preset: RingPreset): readonly string[] {
  return [...preset.members.map((m) => m.publicKey)].sort();
}

export function memberIndexInSortedRing(preset: RingPreset, memberId: string): number {
  const sorted = sortedRingPubkeys(preset);
  const member = preset.members.find((m) => m.id === memberId);
  if (!member) throw new Error(`Unknown member: ${memberId}`);
  const index = sorted.indexOf(member.publicKey);
  if (index === -1) throw new Error(`Member not in ring: ${memberId}`);
  return index;
}
