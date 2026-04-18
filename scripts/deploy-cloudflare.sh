#!/usr/bin/env bash
# Deploy all three demos to Cloudflare Pages via wrangler.
# Prereqs: `npx wrangler login` run once (opens browser OAuth). After that
# this script handles project creation, build, deploy, and custom-domain wiring.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

DEMOS=(range-proof shamir-words ring-sig)

echo "==> Checking wrangler auth"
if ! npx -y wrangler@latest whoami 2>&1 | grep -q "You are logged in"; then
  echo "✗ wrangler is not authenticated."
  echo "  Run: npx -y wrangler@latest login"
  echo "  Then re-run this script."
  exit 1
fi

echo "==> Building all three apps"
pnpm -F @forgesworn-demos/range-proof build > /dev/null
pnpm -F @forgesworn-demos/shamir-words build > /dev/null
pnpm -F @forgesworn-demos/ring-sig build > /dev/null
echo "  ✓ builds complete"

for demo in "${DEMOS[@]}"; do
  project="forgesworn-demos-$demo"
  domain="$demo.forgesworn.dev"

  echo ""
  echo "==> [$demo]"

  # Idempotent project creation — skip if already exists
  if npx wrangler pages project list 2>&1 | grep -q "$project"; then
    echo "  project $project already exists"
  else
    echo "  creating project $project …"
    npx wrangler pages project create "$project" \
      --production-branch main \
      --compatibility-date "$(date -u +%F)" \
      > /dev/null
    echo "  ✓ project created"
  fi

  # Deploy the dist directory
  echo "  deploying apps/$demo/dist …"
  npx wrangler pages deploy "apps/$demo/dist" \
    --project-name "$project" \
    --branch main \
    --commit-dirty=true 2>&1 | tail -3

  # Custom domain — idempotent
  if npx wrangler pages domain list --project-name "$project" 2>&1 | grep -q "$domain"; then
    echo "  custom domain $domain already bound"
  else
    echo "  adding custom domain $domain …"
    npx wrangler pages domain add "$domain" --project-name "$project" 2>&1 | tail -3 || \
      echo "  ⚠ domain-add may need a moment; re-run script to retry"
  fi
done

echo ""
echo "==> Verifying live URLs"
for demo in "${DEMOS[@]}"; do
  url="https://$demo.forgesworn.dev"
  code=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
  if [[ "$code" == "200" ]]; then
    echo "  ✓ $url → 200"
  else
    echo "  ⚠ $url → $code (DNS may still be propagating; wait 1-2 min)"
  fi
done

echo ""
echo "Done. Repeat this script any time you want to push fresh builds."
echo "For push-to-main auto-deploy, wire GitHub integration in each project's"
echo "dashboard → Settings → Builds & deployments → Git connection."
