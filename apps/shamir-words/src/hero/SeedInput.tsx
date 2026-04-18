import { useState } from "preact/hooks";

interface SeedInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly demoValue: string;
}

export function SeedInput({ value, onChange, demoValue }: SeedInputProps) {
  const [useDemo, setUseDemo] = useState(true);
  const effectiveValue = useDemo ? demoValue : value;

  return (
    <div class="sw-seed-input">
      <label class="sw-seed-label">
        <span>12-word seed phrase</span>
        <textarea
          rows={3}
          value={effectiveValue}
          disabled={useDemo}
          onInput={(e) => onChange((e.target as HTMLTextAreaElement).value)}
          spellcheck={false}
          autocorrect="off"
          autocapitalize="off"
        />
      </label>
      <label class="sw-demo-toggle">
        <input
          type="checkbox"
          checked={useDemo}
          onChange={() => setUseDemo((v) => !v)}
        />
        <span>Use a demo seed (never a real wallet)</span>
      </label>
    </div>
  );
}
