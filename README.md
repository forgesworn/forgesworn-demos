# forgesworn-demos

Interactive demos for the [ForgeSworn](https://forgesworn.dev) crypto toolkit.

| Demo | Library | URL |
|------|---------|-----|
| Prove your age without revealing your birthday | [`@forgesworn/range-proof`](https://github.com/forgesworn/range-proof) | https://range-proof.forgesworn.dev |
| Split a seed into cards, any threshold restores | [`@forgesworn/shamir-words`](https://github.com/forgesworn/shamir-words) | https://shamir-words.forgesworn.dev |
| Sign as The Insider — anonymous within a ring | [`@forgesworn/ring-sig`](https://github.com/forgesworn/ring-sig) | https://ring-sig.forgesworn.dev |

All demos are client-side. No backend, no persistence, no tracking.

## Repository layout

```
apps/            Three Vite apps, one per demo
packages/ui      Shared design system (Preact components + CSS)
packages/config  Shared ESLint, Prettier, tsconfig base
```

## Development

```bash
pnpm install
pnpm -F @forgesworn-demos/range-proof dev
```

## Licence

[MIT](./LICENCE)
