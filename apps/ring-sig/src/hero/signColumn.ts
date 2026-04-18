import { lsagSign, lsagVerify, type LsagSignature } from "@forgesworn/ring-sig";
import type { RingMember, RingPreset } from "./ringPresets.js";
import { memberIndexInSortedRing, sortedRingPubkeys } from "./ringPresets.js";

export interface SignedColumn {
  readonly presetId: string;
  readonly ring: readonly string[];
  readonly message: string;
  readonly context: string;
  readonly signature: LsagSignature;
  readonly keyImage: string;
  readonly issuedAt: string;
}

export function signColumn(
  preset: RingPreset,
  member: RingMember,
  message: string,
  context: string,
): SignedColumn {
  const ring = sortedRingPubkeys(preset);
  const index = memberIndexInSortedRing(preset, member.id);
  const signature = lsagSign(message, [...ring], index, member.privateKey, context);
  return {
    presetId: preset.id,
    ring,
    message,
    context,
    signature,
    keyImage: signature.keyImage,
    issuedAt: new Date().toISOString(),
  };
}

export function verifyColumn(signed: SignedColumn): boolean {
  try {
    return lsagVerify({ ...signed.signature, message: signed.message });
  } catch {
    return false;
  }
}
