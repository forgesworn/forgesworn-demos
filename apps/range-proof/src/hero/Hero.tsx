import { useState } from "preact/hooks";
import { InstallRow } from "@forgesworn-demos/ui";
import { DateInput } from "./DateInput.js";
import { ProofAnimation } from "./ProofAnimation.js";
import { ProofArtefact } from "./ProofArtefact.js";
import {
  proveAgeBand,
  encodeBundle,
  AGE_BANDS,
  DEFAULT_CATEGORY,
  type AgeCategory,
  type AgeProofBundle,
} from "./proveAge.js";
import "./hero.css";

const DEMO_BIRTHDAYS: Record<AgeCategory, string> = {
  "18+": "1998-06-15",
  "under-18": "2014-06-15",
};

export function Hero() {
  const [category, setCategory] = useState<AgeCategory>(DEFAULT_CATEGORY);
  const [birthday, setBirthday] = useState<string>(DEMO_BIRTHDAYS[DEFAULT_CATEGORY]);
  const [bundle, setBundle] = useState<AgeProofBundle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);

  function selectCategory(next: AgeCategory) {
    setCategory(next);
    setBirthday(DEMO_BIRTHDAYS[next]);
    setBundle(null);
    setError(null);
  }

  function handleGenerate() {
    setError(null);
    setBundle(null);
    setAnimating(true);
  }

  function handleAnimationComplete() {
    setAnimating(false);
    try {
      const result = proveAgeBand(birthday, category);
      setBundle(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
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
          Prove your age is in a range without revealing the value — over 18, or{" "}
          <strong>under 18</strong> for a space built for children. Either way,
          the birthday never leaves your device.
        </p>
        <InstallRow
          packageName="@forgesworn/range-proof"
          githubUrl="https://github.com/forgesworn/range-proof"
        />
      </div>
      <div class="rp-hero-interact">
        <div class="rp-band-toggle" role="group" aria-label="What to prove">
          {(Object.keys(AGE_BANDS) as AgeCategory[]).map((c) => (
            <button
              key={c}
              type="button"
              class={`rp-band-option ${c === category ? "is-active" : ""}`}
              aria-pressed={c === category}
              onClick={() => selectCategory(c)}
            >
              {AGE_BANDS[c].chip}
            </button>
          ))}
        </div>
        <DateInput
          value={birthday}
          onChange={setBirthday}
          demoValue={DEMO_BIRTHDAYS[category]}
        />
        <button
          type="button"
          class="rp-generate"
          onClick={handleGenerate}
          disabled={animating}
        >
          {animating ? "Generating…" : "Generate proof →"}
        </button>
        <ProofAnimation active={animating} onComplete={handleAnimationComplete} />
        {error && <div class="rp-error" role="alert">{error}</div>}
        {bundle && !animating && (
          <>
            <ProofArtefact bundle={bundle} />
            {shareUrl && (
              <div class="rp-actions">
                <button
                  type="button"
                  class="rp-action-primary"
                  onClick={async () => {
                    if (!bundle || !shareUrl) return;
                    try {
                      const { generateCertificate, downloadCertificate } = await import(
                        "./generateCertificate.js"
                      );
                      const pdf = await generateCertificate(bundle, shareUrl);
                      downloadCertificate(pdf);
                    } catch (err) {
                      setError(err instanceof Error ? err.message : String(err));
                    }
                  }}
                >
                  Download certificate (PDF)
                </button>
                <button
                  type="button"
                  class="rp-action-secondary"
                  onClick={() => navigator.clipboard.writeText(shareUrl)}
                >
                  Copy verify URL
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
