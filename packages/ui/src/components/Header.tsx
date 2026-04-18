import { DEMOS, type DemoName } from "../types.js";

interface HeaderProps {
  readonly current: DemoName;
}

export function Header({ current }: HeaderProps) {
  return (
    <header class="fgs-header">
      <a href="https://forgesworn.dev" class="fgs-brand">
        forgesworn
      </a>
      <nav class="fgs-demo-nav" aria-label="Demos">
        {DEMOS.map((demo) => (
          <a
            href={demo.url}
            key={demo.name}
            class={`fgs-demo-link${demo.name === current ? " is-current" : ""}`}
            aria-current={demo.name === current ? "page" : undefined}
          >
            {demo.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
