import { useState } from "preact/hooks";
import { RingPresetPicker } from "./RingPresetPicker.js";
import { SeatPicker } from "./SeatPicker.js";
import type { RingMember, RingPreset } from "./ringPresets.js";
import "./hero.css";

export function Hero() {
  const [preset, setPreset] = useState<RingPreset | null>(null);
  const [member, setMember] = useState<RingMember | null>(null);

  function handlePresetSelect(next: RingPreset) {
    setPreset(next);
    setMember(null);
  }

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
        <RingPresetPicker selectedId={preset?.id ?? null} onSelect={handlePresetSelect} />
        {preset && (
          <SeatPicker
            preset={preset}
            selectedMemberId={member?.id ?? null}
            onSelect={setMember}
          />
        )}
        {preset && member && (
          <p class="rs-next-hint">
            You are seated as <strong>{member.label}</strong>. Next: write your column. (Task 3.3)
          </p>
        )}
      </div>
    </section>
  );
}
