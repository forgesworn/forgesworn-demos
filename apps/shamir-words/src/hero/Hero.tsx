import { useState } from "preact/hooks";
import { SeedInput } from "./SeedInput.js";
import "./hero.css";

const DEMO_SEED =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

export function Hero() {
  const [seed, setSeed] = useState(DEMO_SEED);
  const [shares, setShares] = useState<readonly string[][] | null>(null);

  function handleSplit() {
    // Real split lands in Task 2.2.
    setShares([["placeholder"]]);
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
        {shares && <div class="sw-placeholder">Split result lands in Task 2.2</div>}
      </div>
    </section>
  );
}
