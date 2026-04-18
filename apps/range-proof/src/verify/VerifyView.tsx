import { useMemo } from "preact/hooks";
import { decodeBundle, verifyAgeOver18 } from "../hero/proveAge.js";
import "./verify.css";

interface VerifyViewProps {
  readonly encoded: string;
}

interface VerifyResult {
  readonly ok: boolean;
  readonly issuedAt?: string;
  readonly error?: string;
}

function verify(encoded: string): VerifyResult {
  try {
    const bundle = decodeBundle(encoded);
    const ok = verifyAgeOver18(bundle);
    return { ok, issuedAt: bundle.issuedAt };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export function VerifyView({ encoded }: VerifyViewProps) {
  const result = useMemo(() => verify(encoded), [encoded]);

  return (
    <section class="rp-verify">
      <div class={`rp-verify-card ${result.ok ? "is-valid" : "is-invalid"}`}>
        <div class="rp-verify-badge">
          {result.ok ? "✓ Verified" : "✗ Invalid"}
        </div>
        <h1>{result.ok ? "Age 18+ confirmed" : "Proof could not be verified"}</h1>
        {result.ok && result.issuedAt && (
          <p class="rp-verify-meta">
            Proof issued {new Date(result.issuedAt).toLocaleString("en-GB")} —
            birthday not disclosed.
          </p>
        )}
        {!result.ok && result.error && (
          <details class="rp-verify-technical">
            <summary>Technical detail</summary>
            <pre>{result.error}</pre>
          </details>
        )}
        <a href={typeof window !== "undefined" ? window.location.pathname : "/"} class="rp-verify-back">
          ← Make your own proof
        </a>
      </div>
    </section>
  );
}
