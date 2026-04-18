import { useState } from "preact/hooks";

interface DateInputProps {
  readonly value: string; // ISO yyyy-mm-dd
  readonly onChange: (value: string) => void;
  readonly demoValue: string;
}

export function DateInput({ value, onChange, demoValue }: DateInputProps) {
  const [useDemo, setUseDemo] = useState(true);

  const effectiveValue = useDemo ? demoValue : value;

  return (
    <div class="rp-date-input">
      <label class="rp-date-label">
        <span>Your birthday</span>
        <input
          type="date"
          value={effectiveValue}
          disabled={useDemo}
          max={new Date().toISOString().slice(0, 10)}
          onInput={(event) => onChange((event.target as HTMLInputElement).value)}
        />
      </label>
      <label class="rp-demo-toggle">
        <input
          type="checkbox"
          checked={useDemo}
          onChange={() => setUseDemo((prev) => !prev)}
        />
        <span>Use a demo date ({demoValue})</span>
      </label>
    </div>
  );
}
