import { useState } from "preact/hooks";
import { InstallRow } from "@forgesworn-demos/ui";
import { SeedInput } from "./SeedInput.js";
import { Cards } from "./Cards.js";
import { splitSeed } from "./splitSeed.js";
import { RestoreTray } from "./RestoreTray.js";
import "./hero.css";

const DEMO_SEED =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

export function Hero() {
  const [seed, setSeed] = useState(DEMO_SEED);
  const [shares, setShares] = useState<readonly string[][] | null>(null);
  const [selected, setSelected] = useState<ReadonlySet<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  function handleSplit() {
    setError(null);
    setSelected(new Set());
    try {
      setShares(splitSeed(seed, 3, 5));
    } catch (err) {
      setShares(null);
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  function toggleCard(index: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <section class="sw-hero">
      <div class="sw-hero-copy">
        <h1>Any three of five.</h1>
        <p class="sw-hero-lede">
          Split a 12-word seed into five word-list shares. Any three reconstruct
          it. Two or fewer reveal nothing — not even one word of the original.
        </p>
        <InstallRow
          packageName="@forgesworn/shamir-words"
          githubUrl="https://github.com/forgesworn/shamir-words"
        />
      </div>
      <div class="sw-hero-interact">
        <SeedInput value={seed} onChange={setSeed} demoValue={DEMO_SEED} />
        <button type="button" class="sw-split" onClick={handleSplit}>
          Split into 5 shares →
        </button>
        {error && <div class="sw-error" role="alert">{error}</div>}
        {shares && (
          <>
            <Cards shares={shares} selected={selected} onToggle={toggleCard} />
            <RestoreTray shares={shares} selected={selected} threshold={3} />
            <button
              type="button"
              class="sw-download"
              onClick={async () => {
                if (!shares) return;
                const { generateCardSheet, downloadCardSheet } = await import(
                  "./generateCardSheet.js"
                );
                const pdf = await generateCardSheet(shares, 3, 5);
                downloadCardSheet(pdf);
              }}
            >
              Download printable card sheet (PDF)
            </button>
          </>
        )}
      </div>
    </section>
  );
}
