import { useState } from "preact/hooks";
import { splitSeed, restoreSeed } from "../hero/splitSeed.js";
import "./playground.css";

const DEMO =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

export function Playground() {
  const [threshold, setThreshold] = useState(3);
  const [total, setTotal] = useState(5);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function run() {
    setResult(null);
    setError(null);
    try {
      const shares = splitSeed(DEMO, threshold, total);
      const indices = [...shares.keys()].sort(() => Math.random() - 0.5).slice(0, threshold);
      const picked = indices.map((index) => shares[index]!);
      const restored = restoreSeed(picked);
      if (restored !== DEMO) {
        setError("Restored seed did not match (bug?)");
      } else {
        setResult(`Split ${total} ways, restored from random ${threshold} of ${total}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <section class="sw-playground">
      <h2>Playground</h2>
      <p class="sw-playground-lede">
        Try different thresholds (2-of-3 up to 5-of-7). The demo seed is used
        for safety; the split itself is real cryptography over GF(256).
      </p>
      <div class="sw-playground-controls">
        <label>
          <span>Threshold</span>
          <input
            type="range"
            min={2}
            max={Math.min(total, 5)}
            value={threshold}
            onInput={(e) => setThreshold(Number((e.target as HTMLInputElement).value))}
          />
          <output>{threshold}</output>
        </label>
        <label>
          <span>Total shares</span>
          <input
            type="range"
            min={threshold}
            max={7}
            value={total}
            onInput={(e) => setTotal(Number((e.target as HTMLInputElement).value))}
          />
          <output>{total}</output>
        </label>
      </div>
      <button type="button" class="sw-playground-run" onClick={run}>
        Split and restore
      </button>
      {result && <p class="sw-playground-ok">{result}</p>}
      {error && <p class="sw-playground-err">{error}</p>}
    </section>
  );
}
