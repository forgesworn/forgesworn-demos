import { useState } from "preact/hooks";
import { SeedInput } from "./SeedInput.js";
import { splitSeed } from "./splitSeed.js";
import "./hero.css";

const DEMO_SEED =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

export function Hero() {
  const [seed, setSeed] = useState(DEMO_SEED);
  const [shares, setShares] = useState<readonly string[][] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSplit() {
    setError(null);
    try {
      setShares(splitSeed(seed, 3, 5));
    } catch (err) {
      setShares(null);
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <section class="sw-hero">
      <div class="sw-hero-copy">
        <h1>Any three of five.</h1>
        <p class="sw-hero-lede">
          Split a 12-word seed into five word-list shares. Any three reconstruct
          it. Two or fewer reveal nothing — not even one word of the original.
        </p>
      </div>
      <div class="sw-hero-interact">
        <SeedInput value={seed} onChange={setSeed} demoValue={DEMO_SEED} />
        <button type="button" class="sw-split" onClick={handleSplit}>
          Split into 5 shares →
        </button>
        {error && <div class="sw-error" role="alert">{error}</div>}
        {shares && (
          <div class="sw-shares-raw" role="status">
            <div class="sw-output-label">5 shares produced — drag-restore UI lands in Task 2.3</div>
            {shares.map((share, index) => (
              <details key={index} class="sw-share-debug">
                <summary>Share {index + 1}</summary>
                <pre>{share.join(" ")}</pre>
              </details>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
