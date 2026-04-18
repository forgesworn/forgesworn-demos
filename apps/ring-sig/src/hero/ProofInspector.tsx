import { useState } from "preact/hooks";
import type { SignedColumn } from "./signColumn.js";
import { verifyColumn } from "./signColumn.js";
import "./proofInspector.css";

interface Props {
  readonly column: SignedColumn;
}

type Stage =
  | { id: "idle" }
  | { id: "running"; step: number }
  | { id: "done"; valid: boolean };

const STEPS: readonly { label: string; description: string }[] = [
  {
    label: "Parse ring",
    description: "Loading the sorted ring of public keys.",
  },
  {
    label: "Walk challenge chain",
    description:
      "Each link in the ring verifies: the challenge for member i is a hash of the previous member's commitment.",
  },
  {
    label: "Close the ring",
    description:
      "The chain must return to where it started. If any link is broken, the proof is invalid.",
  },
  {
    label: "Check key image",
    description:
      "The key image is deterministic per (signer, context). Duplicates within the same context mean the same member signed twice.",
  },
  {
    label: "Verdict",
    description: "One of the ring members signed — unknowable which one.",
  },
];

export function ProofInspector({ column }: Props) {
  const [stage, setStage] = useState<Stage>({ id: "idle" });

  async function run() {
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reducedMotion ? 0 : 350;
    setStage({ id: "running", step: 0 });
    for (let step = 0; step < STEPS.length; step++) {
      setStage({ id: "running", step });
      if (delay > 0) await new Promise((r) => setTimeout(r, delay));
    }
    setStage({ id: "done", valid: verifyColumn(column) });
  }

  return (
    <div class="rs-inspector">
      <button type="button" class="rs-inspector-btn" onClick={run}>
        {stage.id === "idle"
          ? "Inspect proof"
          : stage.id === "running"
          ? `Verifying step ${stage.step + 1}/${STEPS.length}\u2026`
          : stage.valid
          ? "\u2713 Valid \u2014 a ring member signed this"
          : "\u2717 Invalid"}
      </button>
      {stage.id !== "idle" && (
        <ol class="rs-inspector-steps">
          {STEPS.map((step, index) => {
            const completed =
              (stage.id === "running" && index < stage.step) ||
              stage.id === "done";
            const active = stage.id === "running" && index === stage.step;
            return (
              <li
                key={index}
                class={`rs-inspector-step${completed ? " is-complete" : ""}${active ? " is-active" : ""}`}
              >
                <strong>{step.label}</strong>
                <span>{step.description}</span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
