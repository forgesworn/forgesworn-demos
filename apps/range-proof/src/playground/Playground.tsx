import { useState } from "preact/hooks";
import {
  createRangeProof,
  verifyRangeProof,
} from "@forgesworn/range-proof";
import "./playground.css";

export function Playground() {
  const [value, setValue] = useState(42);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const [context, setContext] = useState("");
  const [result, setResult] = useState<{ ok: boolean; size: number; error?: string } | null>(null);

  function run() {
    setResult(null);
    try {
      const proof = createRangeProof(value, min, max, context || undefined);
      const size = JSON.stringify(proof).length;
      const ok = verifyRangeProof(proof, min, max, context || undefined);
      setResult({ ok, size });
    } catch (err) {
      setResult({
        ok: false,
        size: 0,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return (
    <section class="rp-playground">
      <h2>Playground</h2>
      <p class="rp-playground-lede">
        Try any range, any value, any binding context. See proof size scale with
        range magnitude.
      </p>
      <div class="rp-playground-grid">
        <label>
          <span>Value</span>
          <input
            type="number"
            value={value}
            onInput={(e) => setValue(Number((e.target as HTMLInputElement).value))}
          />
        </label>
        <label>
          <span>Min</span>
          <input
            type="number"
            value={min}
            onInput={(e) => setMin(Number((e.target as HTMLInputElement).value))}
          />
        </label>
        <label>
          <span>Max</span>
          <input
            type="number"
            value={max}
            onInput={(e) => setMax(Number((e.target as HTMLInputElement).value))}
          />
        </label>
        <label class="rp-playground-context">
          <span>
            Binding context (optional)
            <em>— proofs bound to this context will not verify under a different one</em>
          </span>
          <input
            type="text"
            placeholder="e.g. subject-pubkey or session-id"
            value={context}
            onInput={(e) => setContext((e.target as HTMLInputElement).value)}
          />
        </label>
      </div>
      <button type="button" class="rp-playground-run" onClick={run}>
        Run
      </button>
      {result && (
        <div class={`rp-playground-result ${result.ok ? "is-valid" : "is-invalid"}`}>
          {result.error ? (
            <>
              <strong>Failed:</strong> {result.error}
            </>
          ) : (
            <>
              <strong>{result.ok ? "Valid proof" : "Invalid proof"}</strong>
              <span>— size {result.size} bytes (JSON-encoded)</span>
            </>
          )}
        </div>
      )}
    </section>
  );
}
