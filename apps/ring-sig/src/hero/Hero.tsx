import { useState } from "preact/hooks";
import { RingPresetPicker } from "./RingPresetPicker.js";
import type { RingPreset } from "./ringPresets.js";
import "./hero.css";

export function Hero() {
  const [preset, setPreset] = useState<RingPreset | null>(null);
  return (
    <section class="rs-hero">
      <div class="rs-hero-copy">
        <h1>Sign as The Insider.</h1>
        <p class="rs-hero-lede">
          Publish a column under a shared pseudonym. Your message is readable; what's
          hidden is <em>which</em> of the five members wrote it.
        </p>
      </div>
      <div class="rs-hero-interact">
        <RingPresetPicker selectedId={preset?.id ?? null} onSelect={setPreset} />
        {preset && (
          <p class="rs-next-hint">
            Next: pick your seat in the {preset.name} ring. (Task 3.2)
          </p>
        )}
      </div>
    </section>
  );
}
