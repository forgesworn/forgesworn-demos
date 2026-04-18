import type { RingMember, RingPreset } from "./ringPresets.js";
import "./seatPicker.css";

interface Props {
  readonly preset: RingPreset;
  readonly selectedMemberId: string | null;
  readonly onSelect: (member: RingMember) => void;
}

function ChairGlyph({ active }: { readonly active: boolean }) {
  return (
    <svg
      class={`rs-chair${active ? " is-active" : ""}`}
      viewBox="0 0 40 48"
      aria-hidden="true"
    >
      {/* Backrest */}
      <rect x="10" y="4" width="20" height="14" rx="2" />
      {/* Seat */}
      <rect x="6" y="20" width="28" height="6" rx="1.5" />
      {/* Legs */}
      <line x1="10" y1="26" x2="10" y2="44" />
      <line x1="30" y1="26" x2="30" y2="44" />
    </svg>
  );
}

export function SeatPicker({ preset, selectedMemberId, onSelect }: Props) {
  return (
    <div class="rs-seat-picker">
      <div class="rs-seat-label">Step 2 — Pick your seat</div>
      <p class="rs-seat-hint">
        You are one of these {preset.members.length} members. Your identity is
        known only to you — the signature will prove a ring member signed, but
        not which one.
      </p>
      <div class="rs-seats">
        {preset.members.map((member) => {
          const isSelected = member.id === selectedMemberId;
          return (
            <button
              type="button"
              key={member.id}
              class={`rs-seat${isSelected ? " is-selected" : ""}`}
              onClick={() => onSelect(member)}
              aria-pressed={isSelected}
            >
              <ChairGlyph active={isSelected} />
              <span class="rs-seat-label-name">{member.label}</span>
              <span class="rs-seat-bio">{member.bio}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
