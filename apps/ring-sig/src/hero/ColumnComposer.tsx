import { useState } from "preact/hooks";
import "./columnComposer.css";

interface Props {
  readonly onPublish: (message: string) => void;
  readonly disabled?: boolean;
}

const PLACEHOLDER = "The CEO knew about the safety report in February…";

export function ColumnComposer({ onPublish, disabled }: Props) {
  const [message, setMessage] = useState("");

  return (
    <div class="rs-composer">
      <div class="rs-composer-label">Step 3 — Write your column</div>
      <div class="rs-composer-byline">The Insider</div>
      <textarea
        class="rs-composer-input"
        rows={5}
        value={message}
        onInput={(e) => setMessage((e.target as HTMLTextAreaElement).value)}
        placeholder={PLACEHOLDER}
        disabled={disabled}
        aria-label="Column text"
      />
      <button
        type="button"
        class="rs-composer-publish"
        disabled={disabled || message.trim().length < 3}
        onClick={() => {
          onPublish(message.trim());
          setMessage("");
        }}
      >
        Publish anonymously →
      </button>
    </div>
  );
}
