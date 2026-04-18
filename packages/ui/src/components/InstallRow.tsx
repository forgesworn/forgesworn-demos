import { useState } from "preact/hooks";

interface InstallRowProps {
  readonly packageName: string; // e.g. "@forgesworn/range-proof"
  readonly githubUrl: string;   // e.g. "https://github.com/forgesworn/range-proof"
}

export function InstallRow({ packageName, githubUrl }: InstallRowProps) {
  const [copied, setCopied] = useState(false);
  const command = `npm install ${packageName}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Older browsers without clipboard permission — silent no-op.
    }
  }

  return (
    <div class="fgs-install-row" role="group" aria-label={`Install ${packageName}`}>
      <button type="button" class="fgs-install-cmd" onClick={copy} aria-live="polite">
        <span class="fgs-install-prompt" aria-hidden="true">$</span>
        <code>{command}</code>
        <span class="fgs-install-status">{copied ? "Copied" : "Copy"}</span>
      </button>
      <a class="fgs-install-source" href={githubUrl} target="_blank" rel="noreferrer">
        Source on GitHub →
      </a>
    </div>
  );
}
