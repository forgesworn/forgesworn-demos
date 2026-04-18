import type { RingMember, RingPreset } from "./ringPresets.js";
import "./seatPicker.css";

interface Props {
  readonly preset: RingPreset;
  readonly selectedMemberId: string | null;
  readonly onSelect: (member: RingMember) => void;
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
              <span class="rs-seat-label-name">{member.label}</span>
              <span class="rs-seat-bio">{member.bio}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
