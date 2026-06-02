#!/bin/bash
# First-time server setup script.
# Run this ONCE on a fresh Ubuntu 22.04 server as root.
# After this, CI/CD handles all future deploys automatically.
set -e

REPO_URL="https://github.com/kangqore/Kangqore.git"
REPO_PATH="/opt/kangqore"
DEPLOY_USER="deploy"

echo "=== Kangqore Server Setup ==="

# ── 1. System packages ────────────────────────────────────────────────────────
apt-get update -qq
apt-get install -y -qq git curl ufw

# ── 2. Install Docker + Docker Compose ────────────────────────────────────────
if ! command -v docker &>/dev/null; then
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
fi

# ── 3. Create deploy user ────────────────────────────────────────────────────
if ! id "$DEPLOY_USER" &>/dev/null; then
  useradd -m -s /bin/bash "$DEPLOY_USER"
  usermod -aG docker "$DEPLOY_USER"
fi

# ── 4. Add SSH public key for the deploy user ─────────────────────────────────
mkdir -p /home/$DEPLOY_USER/.ssh
cat >> /home/$DEPLOY_USER/.ssh/authorized_keys << 'PUBKEY'
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAdoJa6LCTTOEKNTTV0ZWaPYRJEondY6gjzEJ0X3caeE kangqore-deploy
PUBKEY
chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh
chmod 700 /home/$DEPLOY_USER/.ssh
chmod 600 /home/$DEPLOY_USER/.ssh/authorized_keys

# ── 5. Clone the repo ─────────────────────────────────────────────────────────
if [ ! -d "$REPO_PATH" ]; then
  git clone "$REPO_URL" "$REPO_PATH"
  chown -R $DEPLOY_USER:$DEPLOY_USER "$REPO_PATH"
fi

# ── 6. Firewall ───────────────────────────────────────────────────────────────
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

# ── 7. Create .env for backend ───────────────────────────────────────────────
if [ ! -f "$REPO_PATH/backend/.env" ]; then
  cat > "$REPO_PATH/backend/.env" << 'ENV'
DATABASE_URL=postgresql://kangqore:CHANGE_ME@postgres:5432/kangqore_core
REDIS_URL=redis://redis:6379
JWT_SECRET=CHANGE_ME_TO_RANDOM_STRING
PORT=5050
ENV
  echo "⚠  Edit $REPO_PATH/backend/.env with real values before starting!"
fi

# ── 8. First Docker build ────────────────────────────────────────────────────
cd "$REPO_PATH"
sudo -u $DEPLOY_USER docker compose up --build -d

echo ""
echo "=== Setup complete ==="
echo "  Deploy user: $DEPLOY_USER"
echo "  Repo path:   $REPO_PATH"
echo "  Next: add GitHub secret SERVER_REPO_PATH=$REPO_PATH"
echo "  Next: set SERVER_USER=$DEPLOY_USER"
echo "  Next: edit $REPO_PATH/backend/.env with real DB/Redis/JWT values"
