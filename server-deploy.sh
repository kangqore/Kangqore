#!/bin/bash
# server-deploy.sh — run this on the production server after SSH'ing in.
# Handles: path rename, build, seed, nginx reload.
set -e

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
WWW_OLD="/var/www/dashboard-os"
WWW_NEW="/var/www/kangqore-view"

echo "=== Kangqore Production Deploy ==="

# ── 1. Rename /var/www/dashboard-os → /var/www/kangqore-view ───────────────
if [ -d "$WWW_OLD" ] && [ ! -d "$WWW_NEW" ]; then
  echo "Renaming $WWW_OLD → $WWW_NEW..."
  mv "$WWW_OLD" "$WWW_NEW"
elif [ -d "$WWW_NEW" ]; then
  echo "✓ $WWW_NEW already exists, skipping rename."
else
  echo "Creating $WWW_NEW..."
  mkdir -p "$WWW_NEW"
fi

# ── 2. Build kangqore-view ─────────────────────────────────────────────────
echo "Building kangqore-view..."
cd "$REPO_DIR/kangqore-view"
npm ci --silent
npm run build
cp -r dist/. "$WWW_NEW/"
echo "✓ kangqore-view deployed to $WWW_NEW"

# ── 3. Build backend ───────────────────────────────────────────────────────
echo "Building backend..."
cd "$REPO_DIR/backend"
npm ci --silent
npm run build

# ── 4. Run Prisma db push (no migration runner needed) ─────────────────────
echo "Syncing database schema..."
npx prisma db push --accept-data-loss
npx prisma generate

# ── 5. Seed new tables if empty ────────────────────────────────────────────
echo "Seeding departments & marketing..."
npx ts-node --skip-project prisma/seedDepartmentsMarketing.ts || echo "Seed already applied or skipped."

# ── 6. Test and reload nginx ───────────────────────────────────────────────
echo "Reloading nginx..."
nginx -t && nginx -s reload
echo "✓ nginx reloaded"

echo ""
echo "=== Deploy complete ==="
echo "  Admin OS:        https://kangqore.com/os/"
echo "  Client portal:   https://kangqore.com/portal/client"
echo "  Partner portal:  https://kangqore.com/portal/partner"
echo "  Investor portal: https://kangqore.com/portal/investor"
echo "  Careers portal:  https://kangqore.com/portal/careers"
