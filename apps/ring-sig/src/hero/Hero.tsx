import { useState } from "preact/hooks";
import { InstallRow } from "@forgesworn-demos/ui";
import { RingPresetPicker } from "./RingPresetPicker.js";
import { SeatPicker } from "./SeatPicker.js";
import { ColumnComposer } from "./ColumnComposer.js";
import { PublishedColumn } from "./PublishedColumn.js";
import { signColumn, type SignedColumn } from "./signColumn.js";
import type { RingMember, RingPreset } from "./ringPresets.js";
import "./hero.css";

function newSessionContext(): string {
  return `session-${crypto.randomUUID()}`;
}

function colourForKeyImage(keyImage: string): string {
  const hex = keyImage.replace(/^0x/, "").padEnd(6, "0");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const hue = (r + g * 256 + b) % 360;
  return `hsl(${hue}deg 60% 45%)`;
}

export function Hero() {
  const [preset, setPreset] = useState<RingPreset | null>(null);
  const [member, setMember] = useState<RingMember | null>(null);
  const [context, setContext] = useState<string>(newSessionContext());
  const [columns, setColumns] = useState<readonly SignedColumn[]>([]);

  function handleRingChange(next: RingPreset) {
    setPreset(next);
    setMember(null);
    setColumns([]);
    setContext(newSessionContext());
  }

  function handlePublish(message: string) {
    if (!preset || !member) return;
    const signed = signColumn(preset, member, message, context);
    setColumns((prev) => [...prev, signed]);
  }

  function rotatePseudonym() {
    setContext(newSessionContext());
  }

  const canCompose = Boolean(preset && member);

  return (
    <section class="rs-hero">
      <div class="rs-hero-copy">
        <h1>Sign as The Insider.</h1>
        <p class="rs-hero-lede">
          Sign a column under a shared pseudonym. The message is public. What's
          hidden is <em>which</em> of the five members wrote it.
        </p>
        <InstallRow
          packageName="@forgesworn/ring-sig"
          githubUrl="https://github.com/forgesworn/ring-sig"
        />
      </div>

      <div class="rs-hero-interact">
        <RingPresetPicker selectedId={preset?.id ?? null} onSelect={handleRingChange} />
        {preset && (
          <SeatPicker
            preset={preset}
            selectedMemberId={member?.id ?? null}
            onSelect={setMember}
          />
        )}
        {canCompose && <ColumnComposer onPublish={handlePublish} />}
        {columns.length > 0 && (
          <div class="rs-rotate">
            <button type="button" class="rs-rotate-btn" onClick={rotatePseudonym}>
              Start a new pseudonym →
            </button>
            <span class="rs-rotate-hint">
              Same seat, different context → different key image → unlinkable
              to your previous columns.
            </span>
          </div>
        )}
        {columns.length > 0 && (
          <div class="rs-columns">
            <div class="rs-columns-label">
              Step 4 — Your published columns (shown only in this session)
            </div>
            {columns.map((column, index) => (
              <PublishedColumn
                key={column.keyImage + column.issuedAt}
                column={column}
                threadColour={colourForKeyImage(column.keyImage)}
                showEncryptionNote={index === 0}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
