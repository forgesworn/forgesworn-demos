import { useMemo } from "preact/hooks";
import { restoreSeed } from "./splitSeed.js";
import "./restoreTray.css";

interface RestoreTrayProps {
  readonly shares: readonly string[][];
  readonly selected: ReadonlySet<number>;
  readonly threshold: number;
}

type RestoreState =
  | { kind: "empty" }
  | { kind: "need-more"; need: number }
  | { kind: "restored"; seed: string }
  | { kind: "error"; error: string };

export function RestoreTray({ shares, selected, threshold }: RestoreTrayProps) {
  const state = useMemo<RestoreState>(() => {
    if (selected.size === 0) return { kind: "empty" };
    if (selected.size < threshold) {
      return { kind: "need-more", need: threshold - selected.size };
    }
    try {
      const picked = [...selected].map((index) => shares[index]!);
      const seed = restoreSeed(picked);
      return { kind: "restored", seed };
    } catch (err) {
      return {
        kind: "error",
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }, [shares, selected, threshold]);

  return (
    <div class={`sw-tray sw-tray-${state.kind}`} role="status" aria-live="polite">
      {state.kind === "empty" && (
        <p class="sw-tray-prompt">Select three cards to restore the seed.</p>
      )}
      {state.kind === "need-more" && (
        <p class="sw-tray-prompt">
          Need <strong>{state.need}</strong> more card{state.need > 1 ? "s" : ""}.
          Two cards reveal nothing — not even one word of the original.
        </p>
      )}
      {state.kind === "restored" && (
        <>
          <p class="sw-tray-label">Seed reconstructed</p>
          <pre class="sw-tray-seed">{state.seed}</pre>
        </>
      )}
      {state.kind === "error" && (
        <p class="sw-tray-error">Restore failed: {state.error}</p>
      )}
    </div>
  );
}
