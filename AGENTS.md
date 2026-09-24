# forgesworn-demos

Interactive, client-side demos for ForgeSworn cryptography libraries
(`@forgesworn/range-proof`, `@forgesworn/shamir-words`, `@forgesworn/ring-sig`).
pnpm workspace: three Vite + Preact apps under `apps/`, a shared UI package
and a shared tooling config package under `packages/`. No backend, no
persistence, no tracking; every demo runs entirely in the browser.

## Build & Test

| Command | Purpose |
|---------|---------|
| `pnpm install` | Install dependencies |
| `pnpm build` | Build all apps (`apps/*`) |
| `pnpm dev` | Run all apps in dev mode, in parallel |
| `pnpm test` | Run each app's Playwright tests |
| `pnpm lint` | Lint every workspace package |
| `pnpm typecheck` | Type-check every workspace package |

Per app, inside `apps/<demo>`: `pnpm dev`, `pnpm build` (`tsc --noEmit && vite build`), `pnpm test` (Playwright), `pnpm lint` (`eslint src`), `pnpm typecheck`.

## Structure

```
apps/range-proof/      prove an age range without revealing a birthday
apps/shamir-words/     split a seed into word cards, any threshold restores it
apps/ring-sig/         sign as a member of a ring without revealing which one
packages/ui/           shared Preact design system (@forgesworn-demos/ui)
packages/config/       shared tsconfig, ESLint and Prettier config (@forgesworn-demos/config)
```

Each app follows the same internal layout: `src/hero/` (landing animation and
the core demo logic), `src/playground/`, `src/verify/`, `src/walkthrough/`.

## Conventions

- British English in prose and comments.
- Node >=20, pnpm >=9 (`engines` in package.json); `pnpm@9.15.0` is pinned via `packageManager`.
- `engine-strict=true` and `auto-install-peers=false` in `.npmrc`: peer dependencies are not auto-installed.
- All apps are `"private": true` and are not published to npm.
- Each app depends on its published ForgeSworn library as a normal dependency (e.g. `@forgesworn/range-proof`) and on the shared workspace packages via `workspace:*`.

## Key Files

| File | Purpose |
|------|---------|
| `pnpm-workspace.yaml` | Declares `apps/*` and `packages/*` as workspace packages |
| `eslint.config.js` | Root ESLint config, re-exports `packages/config/eslint.config.js` |
| `packages/ui/src/index.ts` | Shared UI package entry point |
| `DEPLOY-RUNBOOK.md` | Cloudflare Pages deploy steps for the three demos |
| `LAUNCH-QA.md` | Pre-launch QA checklist |

## Common Pitfalls

- Each app builds independently with `tsc --noEmit && vite build`; a type error in one app does not stop the others via `pnpm -r`.
- The Cloudflare Pages build command for each demo runs from the monorepo root with `-F @forgesworn-demos/<demo>`, not from inside `apps/<demo>` (see `DEPLOY-RUNBOOK.md`).
- `packages/ui`'s `exports` map exposes individual components under `./components/*`; import from there rather than deep-importing `src/`.
