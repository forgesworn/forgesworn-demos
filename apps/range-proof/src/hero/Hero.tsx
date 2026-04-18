import { useState } from "preact/hooks";
import { DateInput } from "./DateInput.js";
import "./hero.css";

const DEMO_BIRTHDAY = "1998-06-15"; // age ~28 as of 2026

export function Hero() {
  const [birthday, setBirthday] = useState<string>(DEMO_BIRTHDAY);
  const [proof, setProof] = useState<string | null>(null);

  function handleGenerate() {
    // Library integration lands in Task 1.2.
    setProof("placeholder — proof generation lands in Task 1.2");
  }

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
        <button type="button" class="rp-generate" onClick={handleGenerate}>
          Generate proof →
        </button>
        {proof && (
          <div class="rp-output">
            <pre>{proof}</pre>
          </div>
        )}
      </div>
    </section>
  );
}
