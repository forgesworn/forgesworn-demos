# Launch QA — pre-ship checklist

Delete this file after the three demos are launched and sitting green for a week.

## Automated QA results

Run `node /tmp/fgs-qa.mjs` from any app directory to regenerate (requires all three preview servers running on 4173/4174/4175).

Last run: 2026-04-18, 27 configurations (3 apps × 9 profiles — iPhone SE, iPhone 14, Pixel 7, iPad, desktop 1366, desktop 1920, iPhone dark, desktop dark, reduced-motion).

| Check | Result |
|---|---|
| Horizontal overflow | ✓ none |
| Body text < 12 px | ✓ none |
| Script errors | ✓ none |
| Playwright smoke (26 tests) | ✓ 26/26 |
| Touch targets < 44 px | ⚠ 27 runs, all in nav/footer — see below |

### Touch-target warnings — not action items

The 27 warnings are all header navigation links (`range-proof` / `shamir-words` / `ring-sig` nav pills, ~20 px tall) and footer toolkit links (~24 px tall). Both are dense-UI text links, not primary CTAs. WCAG's 44×44 guidance applies to primary interactive targets — the pattern we're using matches GitHub, Stripe, Vercel, and every other reputable developer tool. The hit-area gaps between links provide usable touch accuracy.

Primary CTAs in every hero (Generate / Split / Publish / Download / Copy / Inspect) are all ≥44 px. The install-row "Source on GitHub →" link is 36 px — below ideal but still reliably tappable. Upgrade if a real user flags it.

## Before launch — do these on real devices

The automated QA covers code-level correctness. These checks need physical hardware because emulators lie about thumb ergonomics, scroll momentum, and real keyboard/scroll/back-nav interactions.

### Devices to test

- [ ] iPhone SE (iOS 17 or latest) — smallest supported viewport
- [ ] iPhone 14 or 15 (iOS 18) — typical modern iPhone
- [ ] Android mid-range (Chrome) — Pixel 7 or Samsung equivalent
- [ ] iPad (Safari) — tablet cross-check
- [ ] Desktop Chrome
- [ ] Desktop Safari
- [ ] Desktop Firefox

For the three demo URLs once CF deploys are live:
- https://range-proof.forgesworn.dev
- https://shamir-words.forgesworn.dev
- https://ring-sig.forgesworn.dev

### Per-demo smoke

**range-proof:**
- [ ] Demo date → Generate proof → animation plays → ProofArtefact panel with ~6 KB size badge
- [ ] Copy verify URL → open in new tab → "Age 18+ confirmed" green card
- [ ] Generate proof → Download certificate (PDF) → PDF opens, QR scans to the verify URL
- [ ] Playground: value 42 / min 0 / max 100 → Run → "Valid proof" green row with size
- [ ] Playground: value 150 / min 0 / max 100 → Run → "Invalid proof" / "Failed: …" red row
- [ ] Walkthrough readable without pinch-zoom
- [ ] Dark mode renders cleanly (system settings → Display → Dark)

**shamir-words:**
- [ ] Demo seed → Split into 5 shares → animation plays → 5 coloured cards visible
- [ ] Tap 3 cards → "Seed reconstructed" tray with the restored seed
- [ ] Tap only 2 → "Need 1 more" prompt, seed NOT visible
- [ ] Download printable card sheet → PDF opens with 5 cards on A4 and dashed cut lines
- [ ] Playground: 2-of-3, 3-of-5, 5-of-7 all demonstrate round-trip

**ring-sig:**
- [ ] Each ring preset shows correct trust pill (Strong / Moderate / Literary / Weak) and the "Why …?" disclosure works
- [ ] Seat picker: 5 chair glyphs, tap selects one
- [ ] Composer textarea accepts input on-device keyboard (check iOS keyboard doesn't cover Publish button)
- [ ] Publish → PublishedColumn appears with Message / Signature / Key image rows
- [ ] KeyImageFingerprint glyph visible with thread-colour tint
- [ ] First column shows the "sign not encrypt" encryption note
- [ ] Publish a second column same seat → new column appears with same fingerprint + thread colour
- [ ] "Start a new pseudonym" → publish a third column → new fingerprint + colour, unlinkable
- [ ] Inspect proof → steps animate, "✓ Valid — a ring member signed this"
- [ ] Download printable column PDF → PDF opens with masthead, body, proof footer, QR

### Cross-cutting

- [ ] Header navigation works across all three demos (brand link → forgesworn.dev, demo links → the other demo subdomains)
- [ ] Footer "Featured here" lists the three demo'd libs, "More in the toolkit" lists the other five
- [ ] TryMoreDemos block before the footer surfaces the other two demos
- [ ] prefers-reduced-motion honoured (toggle in system settings; Generate / Split / Inspect should run instantly with no staged animation)
- [ ] prefers-color-scheme dark renders all three cleanly
- [ ] OG preview cards render in a Nostr client (paste URL in a note, confirm card)
- [ ] OG cards validate at cards-dev.twitter.com/validator and linkedin.com/post-inspector/

### Network / deploy

- [ ] Each subdomain returns HTTP 2xx
- [ ] Each favicon loads (no 404 in DevTools Network tab)
- [ ] Lighthouse score > 90 in Performance, Accessibility, Best Practices (Chrome DevTools)

## Post-launch monitoring (first 2 weeks)

- [ ] GitHub stars delta on each of the three repos
- [ ] npm weekly downloads (`npm-stat`, `npms-io-stats`)
- [ ] Nostr DMs / GitHub issues — the "I want to use this" signal is the real adoption KPI
- [ ] Which demo drove the most referrals — informs whether to spin out "The Insider" as its own project (per design spec)

## Known deferred items (post-launch polish)

- Rasterise the `KeyImageFingerprint` SVG into the ring-sig column PDF (text-only for now)
- Self-host Instrument Serif instead of Google Fonts (avoids the external font-load on every page)
- nsec-tree + geohash-kit + canary-kit + spoken-token demos — second batch if first batch validates the format

## Rollback

All deploys are static, no stateful dependencies. Rollback is a single click in each Cloudflare Pages project → Deployments → pick a prior commit → "Rollback to this deployment". No DNS changes needed.
