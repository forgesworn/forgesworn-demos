// Shared types across demo apps.

export type DemoName = "range-proof" | "shamir-words" | "ring-sig";

export interface DemoMeta {
  readonly name: DemoName;
  readonly label: string;
  readonly url: string;
  readonly hero: string;
}

export const DEMOS: readonly DemoMeta[] = [
  {
    name: "range-proof",
    label: "range-proof",
    url: "https://range-proof.forgesworn.dev",
    hero: "Prove your age without revealing your birthday.",
  },
  {
    name: "shamir-words",
    label: "shamir-words",
    url: "https://shamir-words.forgesworn.dev",
    hero: "Split a seed into cards. Any threshold restores.",
  },
  {
    name: "ring-sig",
    label: "ring-sig",
    url: "https://ring-sig.forgesworn.dev",
    hero: "Sign as The Insider. Hidden within a group.",
  },
];
