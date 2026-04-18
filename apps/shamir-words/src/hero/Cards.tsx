import "./cards.css";

const CARD_ACCENTS = ["#e94560", "#0f3460", "#16c79a", "#f5a623", "#9b59b6"] as const;

interface CardsProps {
  readonly shares: readonly string[][];
  readonly selected: ReadonlySet<number>;
  readonly onToggle: (index: number) => void;
}

export function Cards({ shares, selected, onToggle }: CardsProps) {
  return (
    <div class="sw-cards" role="listbox" aria-label="Shamir shares">
      {shares.map((share, index) => {
        const accent = CARD_ACCENTS[index % CARD_ACCENTS.length]!;
        const isSelected = selected.has(index);
        return (
          <button
            type="button"
            key={index}
            class={`sw-card${isSelected ? " is-selected" : ""}`}
            style={{ "--sw-accent": accent, "--sw-delay": `${index * 80}ms` }}
            onClick={() => onToggle(index)}
            aria-pressed={isSelected}
          >
            <div class="sw-card-label">Share {index + 1}</div>
            <div class="sw-card-words">
              {share.slice(0, 6).map((word, wordIndex) => (
                <span key={wordIndex}>{word}</span>
              ))}
              {share.length > 6 && (
                <span class="sw-card-more">+{share.length - 6} more</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
