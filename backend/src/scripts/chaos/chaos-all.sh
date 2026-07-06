#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Gate 2: Full Chaos Suite
# Runs all chaos scenarios and prints a consolidated report.
#
# Usage: ./chaos-all.sh <backend-url> <jwt-token>
#        ./chaos-all.sh http://localhost:5050 eyJhbGc...
#
# Env overrides:
#   REDIS_CONTAINER   default: kangqore-redis
#   PG_CONTAINER      default: kangqore-postgres
# ─────────────────────────────────────────────────────────────────────────────

set -uo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

BASE_URL="${1:-http://localhost:5050}"
TOKEN="${2:-}"
REDIS_CONTAINER="${REDIS_CONTAINER:-kangqore-redis}"
PG_CONTAINER="${PG_CONTAINER:-kangqore-postgres}"

if [[ -z "$TOKEN" ]]; then
  echo "Usage: $0 <backend-url> <jwt-token>"
  echo "Example: $0 http://localhost:5050 'eyJhbGc...'"
  exit 1
fi

TOTAL_PASS=0
TOTAL_FAIL=0
RESULTS=()

run_chaos() {
  local name="$1"; local script="$2"; shift 2
  echo ""
  echo "┌─────────────────────────────────────┐"
  echo "│  CHAOS: $name"
  echo "└─────────────────────────────────────┘"
  set +e
  bash "$SCRIPT_DIR/$script" "$@" 2>&1
  local exit_code=$?
  set -e
  if [[ $exit_code -eq 0 ]]; then
    RESULTS+=("✅ $name")
  else
    RESULTS+=("❌ $name (exit $exit_code)")
    ((TOTAL_FAIL++))
  fi
}

run_chaos "LLM Provider Failure"   chaos-llm.sh      "$BASE_URL" "$TOKEN"
run_chaos "Redis Failure"          chaos-redis.sh     "$BASE_URL" "$TOKEN" "$REDIS_CONTAINER"
run_chaos "PostgreSQL Failure"     chaos-postgres.sh  "$BASE_URL" "$TOKEN" "$PG_CONTAINER"
run_chaos "AI Runtime Scenarios"   chaos-ai.sh        "$BASE_URL" "$TOKEN"

echo ""
echo "═══════════════════════════════════════════════════"
echo "  GATE 2 — INFRASTRUCTURE RESILIENCE REPORT"
echo "═══════════════════════════════════════════════════"
for r in "${RESULTS[@]}"; do echo "  $r"; done
echo ""
if [[ $TOTAL_FAIL -eq 0 ]]; then
  echo "  🟢 Gate 2 PASSED — platform is resilient to infrastructure failures"
  exit 0
else
  echo "  🔴 Gate 2 FAILED — $TOTAL_FAIL scenario(s) need attention"
  exit 1
fi
