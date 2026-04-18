import {
  createAgeRangeProof,
  verifyAgeRangeProof,
  serializeRangeProof,
  deserializeRangeProof,
  type RangeProof,
} from "@forgesworn/range-proof";

export type AgeCategory = "18+";

export interface AgeProofBundle {
  readonly category: AgeCategory;
  readonly proof: RangeProof;
  readonly issuedAt: string; // ISO timestamp
}

function ageFromBirthday(birthday: string, now: Date): number {
  const bd = new Date(birthday);
  if (Number.isNaN(bd.getTime())) {
    throw new Error(`Invalid birthday: ${birthday}`);
  }
  const ageMs = now.getTime() - bd.getTime();
  const years = ageMs / (1000 * 60 * 60 * 24 * 365.25);
  return Math.floor(years);
}

export function proveAgeOver18(
  birthday: string,
  now: Date = new Date(),
): AgeProofBundle {
  const age = ageFromBirthday(birthday, now);
  const proof = createAgeRangeProof(age, "18+");
  return {
    category: "18+",
    proof,
    issuedAt: now.toISOString(),
  };
}

export function verifyAgeOver18(bundle: AgeProofBundle): boolean {
  return verifyAgeRangeProof(bundle.proof, bundle.category);
}

export function encodeBundle(bundle: AgeProofBundle): string {
  const payload = {
    category: bundle.category,
    proof: JSON.parse(serializeRangeProof(bundle.proof)) as unknown,
    issuedAt: bundle.issuedAt,
  };
  const json = JSON.stringify(payload);
  return btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeBundle(encoded: string): AgeProofBundle {
  const normalised = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalised + "=".repeat((4 - (normalised.length % 4)) % 4);
  const json = atob(padded);
  const payload = JSON.parse(json) as {
    category: AgeCategory;
    proof: unknown;
    issuedAt: string;
  };
  return {
    category: payload.category,
    proof: deserializeRangeProof(JSON.stringify(payload.proof)),
    issuedAt: payload.issuedAt,
  };
}
