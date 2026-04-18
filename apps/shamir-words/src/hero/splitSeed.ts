import {
  splitSecret,
  reconstructSecret,
  shareToWords,
  wordsToShare,
} from "@forgesworn/shamir-words";
import { mnemonicToEntropy, entropyToMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";

function mnemonicToBytes(mnemonic: string): Uint8Array {
  const trimmed = mnemonic.trim().replace(/\s+/g, " ");
  return mnemonicToEntropy(trimmed, wordlist);
}

function bytesToMnemonic(entropy: Uint8Array): string {
  return entropyToMnemonic(entropy, wordlist);
}

export function splitSeed(
  mnemonic: string,
  threshold: number,
  shareCount: number,
): readonly string[][] {
  const entropy = mnemonicToBytes(mnemonic);
  const shares = splitSecret(entropy, threshold, shareCount);
  return shares.map(shareToWords);
}

export function restoreSeed(wordShares: readonly string[][]): string {
  if (wordShares.length === 0) {
    throw new Error("Need at least one share to attempt restore");
  }
  const shares = wordShares.map(wordsToShare);
  const threshold = shares[0]!.threshold;
  if (shares.length < threshold) {
    throw new Error(`Need at least ${threshold} shares to restore`);
  }
  const entropy = reconstructSecret(shares, threshold);
  return bytesToMnemonic(entropy);
}
