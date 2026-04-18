# Cloudflare Pages deploy runbook

Follow this to wire up the three demo deploys. ~15 minutes total.

Prerequisites:

- `forgesworn.dev` is already on Cloudflare DNS (confirmed — `dig +short NS forgesworn.dev` returns `liv.ns.cloudflare.com` / `piers.ns.cloudflare.com`). Custom domains will be added automatically, no manual CNAME needed.
- Repo `forgesworn/forgesworn-demos` is live on GitHub with 45+ commits on `main`.

## The template — repeat three times

For each of range-proof / shamir-words / ring-sig:

1. Open <https://dash.cloudflare.com/> → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Authorise GitHub if prompted. Select the repo `forgesworn/forgesworn-demos`.
3. Fill in:

| Field | Value (substitute `<demo>` per row below) |
|---|---|
| Project name | `forgesworn-demos-<demo>` |
| Production branch | `main` |
| Build command | `corepack enable && pnpm install --frozen-lockfile && pnpm -F @forgesworn-demos/<demo> build` |
| Build output directory | `apps/<demo>/dist` |
| Root directory | *(leave blank — monorepo root)* |

4. **Environment variables:**
   - `NODE_VERSION` = `20`
   - `PNPM_VERSION` = `9.15.0`

5. **Save and Deploy.** First deploy takes 3-5 min.

6. Once the deploy succeeds, go to the project's **Custom domains** tab → **Set up a custom domain** → enter `<demo>.forgesworn.dev`. Cloudflare auto-adds the CNAME because DNS is on-network.

## The three demos — fill in the values

### 1. range-proof

- Project name: `forgesworn-demos-range-proof`
- Build command: `corepack enable && pnpm install --frozen-lockfile && pnpm -F @forgesworn-demos/range-proof build`
- Output directory: `apps/range-proof/dist`
- Custom domain: `range-proof.forgesworn.dev`

### 2. shamir-words

- Project name: `forgesworn-demos-shamir-words`
- Build command: `corepack enable && pnpm install --frozen-lockfile && pnpm -F @forgesworn-demos/shamir-words build`
- Output directory: `apps/shamir-words/dist`
- Custom domain: `shamir-words.forgesworn.dev`

### 3. ring-sig

- Project name: `forgesworn-demos-ring-sig`
- Build command: `corepack enable && pnpm install --frozen-lockfile && pnpm -F @forgesworn-demos/ring-sig build`
- Output directory: `apps/ring-sig/dist`
- Custom domain: `ring-sig.forgesworn.dev`

## After all three are live — verification

Run from anywhere:

```bash
for d in range-proof shamir-words ring-sig; do
  echo "=== $d ==="
  curl -sI https://$d.forgesworn.dev | head -3
done
```

Each should return `HTTP/2 200` with a `cf-ray` header.

Then, visually: open each subdomain in a browser. OG-card validators to confirm social previews:

- <https://cards-dev.twitter.com/validator>
- <https://www.linkedin.com/post-inspector/>
- Nostr clients render OG previews automatically — paste a URL in a note and confirm the card shows

## Optional — script via wrangler CLI instead

If you'd rather skip the dashboard, auth wrangler once:

```bash
npx -y wrangler@latest login
```

Then ping me and I'll script the three project creations via `wrangler pages project create` + GitHub integration.

## Deploy already configured

Once the three projects exist, they auto-build on every push to `main`. PR preview deploys are automatic too — every PR gets its own `forgesworn-demos-<demo>-<hash>.pages.dev` URL.

## Cost and scale

All three are within Cloudflare Pages' free tier:

- 500 builds/month
- Unlimited bandwidth on static assets
- 100K requests/day per project before any paid tier kicks in

The demos are fully static — no Workers, no Durable Objects, no KV — so there's no server cost to worry about.
