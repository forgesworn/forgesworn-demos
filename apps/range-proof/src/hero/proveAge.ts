import {
  createAgeRangeProof,
  verifyAgeRangeProof,
  serializeRangeProof,
  deserializeRangeProof,
  type RangeProof,
} from "@forgesworn/range-proof";

export type AgeCategory = "18+" | "under-18";

export interface AgeBand {
  /** Range string fed to @forgesworn/range-proof, e.g. "18+" or "0-17". */
  readonly range: string;
  /** Compact label for chips, e.g. "18+" / "Under 18". */
  readonly chip: string;
  /** Verifier heading, e.g. "Age 18+ confirmed". */
  readonly heading: string;
  /** Sentence for the certificate footer. */
  readonly statement: string;
}

/** The age bands the demo can prove. Add a band here to expose it everywhere. */
export const AGE_BANDS: Record<AgeCategory, AgeBand> = {
  "18+": {
    range: "18+",
    chip: "18+",
    heading: "Age 18+ confirmed",
    statement: "proves the holder is age 18 or over",
  },
  "under-18": {
    range: "0-17",
    chip: "Under 18",
    heading: "Under 18 confirmed",
    statement: "proves the holder is under 18",
  },
};

export const DEFAULT_CATEGORY: AgeCategory = "18+";

function isAgeCategory(value: unknown): value is AgeCategory {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(AGE_BANDS, value)
  );
}

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

export function proveAgeBand(
  birthday: string,
  category: AgeCategory = DEFAULT_CATEGORY,
  now: Date = new Date(),
): AgeProofBundle {
  const age = ageFromBirthday(birthday, now);
  const proof = createAgeRangeProof(age, AGE_BANDS[category].range);
  return {
    category,
    proof,
    issuedAt: now.toISOString(),
  };
}

export function verifyAgeBand(bundle: AgeProofBundle): boolean {
  if (!isAgeCategory(bundle.category)) return false;
  return verifyAgeRangeProof(bundle.proof, AGE_BANDS[bundle.category].range);
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
    category: unknown;
    proof: unknown;
    issuedAt: unknown;
  };
  if (!isAgeCategory(payload.category)) {
    throw new Error("Unknown age category in bundle");
  }
  if (typeof payload.issuedAt !== "string") {
    throw new Error("Missing issuedAt in bundle");
  }
  return {
    category: payload.category,
    proof: deserializeRangeProof(JSON.stringify(payload.proof)),
    issuedAt: payload.issuedAt,
  };
}
