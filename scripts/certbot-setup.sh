#!/bin/bash
# ─── Kangqore HTTPS Setup ─────────────────────────────────────────────────────
# Run this ONCE on the server after DNS is pointing to this machine.
# Prereq: docker compose is running, ports 80 + 443 are open in firewall.
#
# Usage:
#   chmod +x scripts/certbot-setup.sh
#   sudo ./scripts/certbot-setup.sh kangqore.com your@email.com
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

DOMAIN="${1:-kangqore.com}"
EMAIL="${2:-kangqore@gmail.com}"
COMPOSE_FILE="$(dirname "$0")/../docker-compose.yml"

echo "▶ Kangqore HTTPS setup for $DOMAIN"

# 1. Install certbot if not present
if ! command -v certbot &>/dev/null; then
  echo "▶ Installing certbot..."
  apt-get update -qq && apt-get install -y -qq certbot
fi

# 2. Stop nginx so certbot can bind port 80 in standalone mode
echo "▶ Stopping nginx container..."
docker compose -f "$COMPOSE_FILE" stop nginx

# 3. Obtain certificate
echo "▶ Obtaining Let's Encrypt certificate..."
certbot certonly \
  --standalone \
  --non-interactive \
  --agree-tos \
  --email "$EMAIL" \
  -d "$DOMAIN" \
  -d "www.$DOMAIN"

echo "✓ Certificate issued at /etc/letsencrypt/live/$DOMAIN/"

# 4. Restart nginx — it now picks up certs via the volume mount
echo "▶ Restarting nginx..."
docker compose -f "$COMPOSE_FILE" start nginx

echo "✓ nginx running with HTTPS"

# 5. Set up auto-renewal via cron (runs twice daily, standard certbot schedule)
CRON_JOB="0 3 * * * certbot renew --pre-hook 'docker compose -f $COMPOSE_FILE stop nginx' --post-hook 'docker compose -f $COMPOSE_FILE start nginx' --quiet"

if ! crontab -l 2>/dev/null | grep -q "certbot renew"; then
  (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
  echo "✓ Auto-renewal cron registered (daily at 03:00)"
else
  echo "  Auto-renewal cron already present — skipping"
fi

echo ""
echo "─────────────────────────────────────────────────────"
echo "✓ Done. https://$DOMAIN is live."
echo ""
echo "  Next: update CORS_ORIGINS in .env.production:"
echo "  CORS_ORIGINS=https://$DOMAIN,https://www.$DOMAIN"
echo ""
echo "  Then rebuild backend:"
echo "  docker compose up --build -d core-backend"
echo "─────────────────────────────────────────────────────"
