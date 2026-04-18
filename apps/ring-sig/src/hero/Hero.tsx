import { useState } from "preact/hooks";
import { RingPresetPicker } from "./RingPresetPicker.js";
import { SeatPicker } from "./SeatPicker.js";
import { ColumnComposer } from "./ColumnComposer.js";
import { signColumn, type SignedColumn } from "./signColumn.js";
import type { RingMember, RingPreset } from "./ringPresets.js";
import "./hero.css";

function newSessionContext(): string {
  return `session-${crypto.randomUUID()}`;
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

  const canCompose = Boolean(preset && member);

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
          <pre class="rs-columns-debug">
            {JSON.stringify(
              columns.map((c) => ({
                message: c.message,
                keyImage: c.keyImage.slice(0, 12) + "…",
                context: c.context.slice(0, 18) + "…",
              })),
              null,
              2,
            )}
          </pre>
        )}
      </div>
    </section>
  );
}
