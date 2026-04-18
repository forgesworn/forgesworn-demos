import { RING_PRESETS, type RingPreset, type TrustLevel } from "./ringPresets.js";
import "./ringPresets.css";

const TRUST_COLOUR: Record<TrustLevel, string> = {
  strong: "#16a34a",
  moderate: "#ca8a04",
  literary: "#9333ea",
  weak: "#dc2626",
};

const TRUST_LABEL: Record<TrustLevel, string> = {
  strong: "Strong",
  moderate: "Moderate",
  literary: "Literary",
  weak: "Weak",
};

interface Props {
  readonly selectedId: string | null;
  readonly onSelect: (preset: RingPreset) => void;
}

export function RingPresetPicker({ selectedId, onSelect }: Props) {
  return (
    <div class="rs-preset-picker">
      <div class="rs-preset-label">Step 1 — Choose your ring</div>
      <div class="rs-presets">
        {RING_PRESETS.map((preset) => (
          <button
            type="button"
            key={preset.id}
            class={`rs-preset${preset.id === selectedId ? " is-selected" : ""}`}
            onClick={() => onSelect(preset)}
            aria-pressed={preset.id === selectedId}
          >
            <div class="rs-preset-head">
              <span class="rs-preset-name">{preset.name}</span>
              <span
                class="rs-preset-trust"
                style={{ "--rs-trust": TRUST_COLOUR[preset.trust] }}
              >
                {TRUST_LABEL[preset.trust]}
              </span>
            </div>
            <p class="rs-preset-blurb">{preset.blurb}</p>
            <details class="rs-preset-signals">
              <summary>Why {TRUST_LABEL[preset.trust].toLowerCase()}?</summary>
              <ul>
                {preset.trustSignals.map((signal, index) => (
                  <li key={index}>{signal}</li>
                ))}
              </ul>
            </details>
          </button>
        ))}
      </div>
    </div>
  );
}
