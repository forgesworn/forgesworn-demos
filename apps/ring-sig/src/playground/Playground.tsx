import { useState } from "preact/hooks";
import { signColumn, verifyColumn } from "../hero/signColumn.js";
import { RING_PRESETS } from "../hero/ringPresets.js";
import "./playground.css";

const PRESET = RING_PRESETS[0]!;
const MEMBER = PRESET.members[0]!;

interface Demo {
  readonly label: string;
  readonly run: () => Promise<{ ok: boolean; detail: string }>;
}

const DEMOS: readonly Demo[] = [
  {
    label: "Sign + verify a round-trip",
    run: async () => {
      const signed = signColumn(PRESET, MEMBER, "round-trip test", "ctx-1");
      const ok = verifyColumn(signed);
      return { ok, detail: ok ? "Signature valid." : "Signature invalid." };
    },
  },
  {
    label: "Same (seat, context) → same key image",
    run: async () => {
      const a = signColumn(PRESET, MEMBER, "A", "ctx-same");
      const b = signColumn(PRESET, MEMBER, "B", "ctx-same");
      const ok = a.keyImage === b.keyImage;
      return {
        ok,
        detail: `a.keyImage  ${a.keyImage.slice(0, 16)}…\nb.keyImage  ${b.keyImage.slice(0, 16)}…`,
      };
    },
  },
  {
    label: "Different context → different key image",
    run: async () => {
      const a = signColumn(PRESET, MEMBER, "msg", "ctx-one");
      const b = signColumn(PRESET, MEMBER, "msg", "ctx-two");
      const ok = a.keyImage !== b.keyImage;
      return {
        ok,
        detail: `a (ctx-one)  ${a.keyImage.slice(0, 16)}…\nb (ctx-two)  ${b.keyImage.slice(0, 16)}…`,
      };
    },
  },
  {
    label: "Tampered message fails verification",
    run: async () => {
      const signed = signColumn(PRESET, MEMBER, "truth", "ctx");
      const tampered = { ...signed, message: "lies" };
      const ok = !verifyColumn(tampered);
      return { ok, detail: ok ? "Tampered message correctly rejected." : "Bug: tampered verified." };
    },
  },
];

export function Playground() {
  const [results, setResults] = useState<Record<number, { ok: boolean; detail: string }>>({});

  async function runDemo(index: number) {
    const demo = DEMOS[index]!;
    const result = await demo.run();
    setResults((prev) => ({ ...prev, [index]: result }));
  }

  return (
    <section class="rs-playground">
      <h2>Playground</h2>
      <p class="rs-playground-lede">
        Demonstrations of LSAG properties — run each and see the output.
      </p>
      <ul class="rs-playground-demos">
        {DEMOS.map((demo, index) => (
          <li key={index}>
            <button type="button" onClick={() => runDemo(index)}>
              {demo.label}
            </button>
            {results[index] && (
              <pre class={results[index]!.ok ? "is-ok" : "is-err"}>
                {results[index]!.detail}
              </pre>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
