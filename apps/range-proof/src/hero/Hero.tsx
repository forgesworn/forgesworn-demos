import { useState } from "preact/hooks";
import { DateInput } from "./DateInput.js";
import { proveAgeOver18, encodeBundle, type AgeProofBundle } from "./proveAge.js";
import "./hero.css";

const DEMO_BIRTHDAY = "1998-06-15";

export function Hero() {
  const [birthday, setBirthday] = useState<string>(DEMO_BIRTHDAY);
  const [bundle, setBundle] = useState<AgeProofBundle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    setError(null);
    setBundle(null);
    setGenerating(true);
    try {
      // setTimeout yields to the event loop so the spinner paints before the
      // synchronous crypto work blocks for a few hundred ms on slower devices.
      await new Promise((resolve) => setTimeout(resolve, 16));
      const result = proveAgeOver18(birthday);
      setBundle(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setGenerating(false);
    }
  }

  const shareUrl =
    bundle && typeof window !== "undefined"
      ? `${window.location.origin}/?verify=${encodeBundle(bundle)}`
      : null;

  return (
    <section class="rp-hero">
      <div class="rp-hero-copy">
        <h1>Prove it. Reveal nothing.</h1>
        <p class="rp-hero-lede">
          A Pedersen commitment range proof proves your value is within a range
          without disclosing the value. Here, we prove you are over 18 — without
          revealing your birthday.
        </p>
      </div>
      <div class="rp-hero-interact">
        <DateInput
          value={birthday}
          onChange={setBirthday}
          demoValue={DEMO_BIRTHDAY}
        />
        <button
          type="button"
          class="rp-generate"
          onClick={handleGenerate}
          disabled={generating}
        >
          {generating ? "Generating…" : "Generate proof →"}
        </button>
        {error && <div class="rp-error" role="alert">{error}</div>}
        {bundle && (
          <div class="rp-output">
            <div class="rp-output-label">Proof bundle</div>
            <pre>{JSON.stringify(bundle.proof, null, 2).slice(0, 400)}…</pre>
            {shareUrl && (
              <div class="rp-share">
                <div class="rp-output-label">Shareable verifier URL</div>
                <code>{shareUrl}</code>
                <button
                  type="button"
                  class="rp-copy"
                  onClick={() => navigator.clipboard.writeText(shareUrl)}
                >
                  Copy URL
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
