import { DEMOS, type DemoName } from "../types.js";

interface TryMoreDemosProps {
  readonly current: DemoName;
}

export function TryMoreDemos({ current }: TryMoreDemosProps) {
  const others = DEMOS.filter((d) => d.name !== current);
  return (
    <section class="fgs-more" aria-label="More demos">
      <h2 class="fgs-more-title">Keep exploring</h2>
      <div class="fgs-more-grid">
        {others.map((demo) => (
          <a key={demo.name} class="fgs-more-card" href={demo.url}>
            <span class="fgs-more-name">{demo.label}</span>
            <span class="fgs-more-hero">{demo.hero}</span>
            <span class="fgs-more-cta">Try it →</span>
          </a>
        ))}
      </div>
    </section>
  );
}
