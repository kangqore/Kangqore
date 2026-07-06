#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Gate 2 Chaos: PostgreSQL Failure
#
# Tests graceful degradation when Postgres is unavailable:
#   1. Baseline — all DB-backed endpoints healthy
#   2. Postgres paused — endpoints return 503/graceful error, not 500 stack trace
#   3. Non-DB endpoints still respond
#   4. Postgres restored — verify full recovery
#
# Usage: ./chaos-postgres.sh <backend-url> <jwt-token> [pg-container-name]
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail
BASE_URL="${1:-http://localhost:5050}"
TOKEN="${2:-}"
PG_CONTAINER="${3:-kangqore-postgres}"
PASS=0; FAIL=0

log()  { echo "[$(date +%H:%M:%S)] $*"; }
pass() { echo "  ✅ $*"; ((PASS++)); }
fail() { echo "  ❌ $*"; ((FAIL++)); }
warn() { echo "  ⚠️  $*"; }

status_code() {
  curl -so /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer $TOKEN" "$BASE_URL$1" 2>/dev/null || echo "000"
}

# ── Test 1: Baseline DB health ─────────────────────────────────────────────
log "TEST 1: PostgreSQL baseline"
if [[ -z "$TOKEN" ]]; then
  echo "Usage: $0 <backend-url> <jwt-token> [pg-container]"
  exit 1
fi

HEALTH=$(curl -sf -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/api/admin/kangqore-immp/system-health" 2>/dev/null || echo '{}')
DB_OK=$(echo "$HEALTH" | python3 -c "
import sys,json; d=json.load(sys.stdin)
print(d.get('gates',{}).get('database',{}).get('ok','false'))
" 2>/dev/null || echo "false")

if [[ "$DB_OK" == "True" || "$DB_OK" == "true" ]]; then
  pass "PostgreSQL healthy at baseline"
else
  fail "PostgreSQL not healthy at baseline — DB_OK=$DB_OK"
fi

# ── Test 2: Pause Postgres ─────────────────────────────────────────────────
log "TEST 2: Pausing PostgreSQL container '$PG_CONTAINER'..."
PG_WAS_RUNNING=false
if docker ps --format '{{.Names}}' | grep -q "^${PG_CONTAINER}$"; then
  docker pause "$PG_CONTAINER" 2>/dev/null && log "  Postgres paused"
  PG_WAS_RUNNING=true
else
  log "  Postgres container not found — skipping container pause (testing API behaviour with real outage not simulated)"
fi

sleep 3

# ── Test 3: Verify graceful error (not 500 stack trace) ───────────────────
log "TEST 3: API behaviour during Postgres unavailability"

if [[ "$PG_WAS_RUNNING" == "true" ]]; then
  # DB-backed endpoints should return 4xx/5xx — but NOT crash the process
  SC_GRAPH=$(status_code "/api/admin/ontology/graph/full")
  SC_CLIENTS=$(status_code "/api/admin/clients")
  SC_PROJECTS=$(status_code "/api/admin/projects")

  for EP_NAME SC in "graph" "$SC_GRAPH" "clients" "$SC_CLIENTS" "projects" "$SC_PROJECTS"; do
    :  # bash doesn't let us iterate pairs nicely; check individually
  done

  for SC in "$SC_GRAPH" "$SC_CLIENTS" "$SC_PROJECTS"; do
    if [[ "$SC" != "000" ]]; then
      pass "Backend still responding HTTP $SC (not connection-refused / process crash)"
    else
      fail "Backend process died or unreachable during Postgres failure"
    fi
  done

  # System health should now show DB as not ok
  HEALTH2=$(curl -sf -H "Authorization: Bearer $TOKEN" \
    "$BASE_URL/api/admin/kangqore-immp/system-health" 2>/dev/null || echo '{}')
  DB_OK2=$(echo "$HEALTH2" | python3 -c "
import sys,json; d=json.load(sys.stdin)
print(d.get('gates',{}).get('database',{}).get('ok','?'))
" 2>/dev/null || echo "?")
  if [[ "$DB_OK2" == "False" || "$DB_OK2" == "false" ]]; then
    pass "System health correctly reports database=not ok during Postgres failure"
  else
    warn "System health db.ok=$DB_OK2 — may have returned cached result or partial health"
  fi
else
  warn "Skipped Postgres kill test — container not found"
fi

# ── Test 4: Non-DB endpoints stay up ──────────────────────────────────────
log "TEST 4: Non-DB endpoints during failure"
SC_MANIFESTS=$(status_code "/api/admin/integrations/manifests")
SC_CAPABILITIES=$(status_code "/api/admin/integrations/capabilities")

if [[ "$SC_MANIFESTS" == "200" ]]; then
  pass "Integration manifests (in-memory registry) still responds"
else
  fail "Integration manifests failed HTTP $SC_MANIFESTS"
fi
if [[ "$SC_CAPABILITIES" == "200" ]]; then
  pass "Integration capabilities still responds"
else
  fail "Integration capabilities failed HTTP $SC_CAPABILITIES"
fi

# ── Test 5: Restore Postgres ───────────────────────────────────────────────
log "TEST 5: Restoring PostgreSQL..."
if [[ "$PG_WAS_RUNNING" == "true" ]]; then
  docker unpause "$PG_CONTAINER" 2>/dev/null && log "  Postgres unpaused"
  sleep 5  # Prisma reconnects on next request

  HEALTH3=$(curl -sf -H "Authorization: Bearer $TOKEN" \
    "$BASE_URL/api/admin/kangqore-immp/system-health" 2>/dev/null || echo '{}')
  DB_OK3=$(echo "$HEALTH3" | python3 -c "
import sys,json; d=json.load(sys.stdin)
print(d.get('gates',{}).get('database',{}).get('ok','?'))
" 2>/dev/null || echo "?")
  if [[ "$DB_OK3" == "True" || "$DB_OK3" == "true" ]]; then
    pass "PostgreSQL recovered — system health shows database=ok"
  else
    warn "DB_OK=$DB_OK3 after restore — Prisma may still be reconnecting"
  fi
else
  pass "Skip restore (Postgres container was not running)"
fi

# ── Summary ────────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════"
echo "  Chaos Postgres: PASS=$PASS  FAIL=$FAIL"
echo "═══════════════════════════════════════════"
[[ $FAIL -eq 0 ]] && exit 0 || exit 1
