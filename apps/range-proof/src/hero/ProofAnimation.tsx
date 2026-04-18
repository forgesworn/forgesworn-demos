import { useEffect, useState } from "preact/hooks";
import "./proofAnimation.css";

type Stage = "idle" | "commit" | "decompose" | "challenge" | "compact" | "done";

const STAGES: readonly { id: Stage; label: string; durationMs: number }[] = [
  { id: "commit", label: "Forming Pedersen commitment", durationMs: 400 },
  { id: "decompose", label: "Bit-decomposing the value", durationMs: 500 },
  { id: "challenge", label: "Fiat-Shamir challenge", durationMs: 400 },
  { id: "compact", label: "Compacting proof", durationMs: 300 },
];

interface ProofAnimationProps {
  readonly active: boolean;
  readonly onComplete: () => void;
}

export function ProofAnimation({ active, onComplete }: ProofAnimationProps) {
  const [stage, setStage] = useState<Stage>("idle");

  useEffect(() => {
    if (!active) {
      setStage("idle");
      return;
    }
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    async function play() {
      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (!cancelled) {
          setStage("done");
          onComplete();
        }
        return;
      }
      for (const step of STAGES) {
        if (cancelled) return;
        setStage(step.id);
        await new Promise<void>((resolve) => {
          timeoutId = setTimeout(resolve, step.durationMs);
        });
      }
      if (!cancelled) {
        setStage("done");
        onComplete();
      }
    }

    void play();
    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [active, onComplete]);

  if (stage === "idle") return null;

  return (
    <div class="rp-proof-anim" role="status" aria-live="polite">
      <div class={`rp-proof-bits is-${stage}`}>
        {Array.from({ length: 32 }).map((_, index) => (
          <span class="rp-bit" style={{ animationDelay: `${index * 8}ms` }} />
        ))}
      </div>
      <div class="rp-proof-label">
        {STAGES.find((s) => s.id === stage)?.label ?? "Done"}
      </div>
    </div>
  );
}
