import { useState } from "preact/hooks";
import { InstallRow } from "@forgesworn-demos/ui";
import { DateInput } from "./DateInput.js";
import { ProofAnimation } from "./ProofAnimation.js";
import { ProofArtefact } from "./ProofArtefact.js";
import { proveAgeOver18, encodeBundle, type AgeProofBundle } from "./proveAge.js";
import "./hero.css";

const DEMO_BIRTHDAY = "1998-06-15";

export function Hero() {
  const [birthday, setBirthday] = useState<string>(DEMO_BIRTHDAY);
  const [bundle, setBundle] = useState<AgeProofBundle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);

  function handleGenerate() {
    setError(null);
    setBundle(null);
    setAnimating(true);
  }

  function handleAnimationComplete() {
    setAnimating(false);
    try {
      const result = proveAgeOver18(birthday);
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
          A Pedersen commitment range proof proves your value is within a range
          without disclosing the value. Here, we prove you are over 18 — without
          revealing your birthday.
        </p>
        <InstallRow
          packageName="@forgesworn/range-proof"
          githubUrl="https://github.com/forgesworn/range-proof"
        />
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
                    const { generateCertificate, downloadCertificate } = await import(
                      "./generateCertificate.js"
                    );
                    const pdf = await generateCertificate(bundle, shareUrl);
                    downloadCertificate(pdf);
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
