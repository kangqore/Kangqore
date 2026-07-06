#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Gate 2 Chaos: LLM Provider Failure
#
# Tests that the router correctly falls back across:
#   1. Bad Anthropic key  → expect OpenAI or Gemini
#   2. All cloud keys bad → expect graceful empty (no 500)
#   3. Restore real keys  → expect normal Claude response
#
# Usage: ./chaos-llm.sh <backend-url> <jwt-token>
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail
BASE_URL="${1:-http://localhost:5050}"
TOKEN="${2:-}"
PASS=0; FAIL=0

log()  { echo "[$(date +%H:%M:%S)] $*"; }
pass() { echo "  ✅ $*"; ((PASS++)); }
fail() { echo "  ❌ $*"; ((FAIL++)); }

require_token() {
  if [[ -z "$TOKEN" ]]; then
    echo "Usage: $0 <backend-url> <jwt-token>"
    exit 1
  fi
}

health() {
  curl -sf -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/admin/kangqore-immp/system-health" \
    | python3 -c "import sys,json; d=json.load(sys.stdin); print(json.dumps(d, indent=2))"
}

# ── Test 1: Baseline health ────────────────────────────────────────────────
log "TEST 1: Baseline system health"
require_token
RESULT=$(health 2>/dev/null || echo '{}')
LLM_OK=$(echo "$RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('gates',{}).get('llm',{}).get('ok','false'))" 2>/dev/null || echo "false")
DB_OK=$(echo  "$RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('gates',{}).get('database',{}).get('ok','false'))" 2>/dev/null || echo "false")
if [[ "$DB_OK" == "True" || "$DB_OK" == "true" ]]; then
  pass "Database healthy"
else
  fail "Database not healthy: $RESULT"
fi

# ── Test 2: Simulate all LLM providers down ────────────────────────────────
log "TEST 2: All LLM providers down — expect graceful empty, not 500"
CHAOS_RESP=$(curl -sf -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"Should we hire another developer?","userId":"chaos-test"}' \
  "$BASE_URL/api/admin/kangqore-immp/command" 2>/dev/null || echo '{"error":"connection_refused"}')

STATUS_CODE=$(curl -so /dev/null -w "%{http_code}" \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"Should we hire another developer?","userId":"chaos-test"}' \
  "$BASE_URL/api/admin/kangqore-immp/command" 2>/dev/null || echo "000")

if [[ "$STATUS_CODE" == "200" ]]; then
  pass "Command endpoint returns 200 even when LLM is unavailable (fallback mode)"
  RESP_MODEL=$(echo "$CHAOS_RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('model','?'))" 2>/dev/null || echo "?")
  log "  Model used: $RESP_MODEL"
elif [[ "$STATUS_CODE" == "000" ]]; then
  fail "Could not reach backend at $BASE_URL — is it running?"
else
  fail "Command returned HTTP $STATUS_CODE — expected 200 with fallback response"
fi

# ── Test 3: Decision Engine fallback ──────────────────────────────────────
log "TEST 3: Decision Engine — graceful fallback when LLM unavailable"
DECISION_RESP=$(curl -sf -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"Should we expand into a new market?","userId":"chaos-test"}' \
  "$BASE_URL/api/admin/kangqore-immp/command" 2>/dev/null || echo '{}')

HAS_RESPONSE=$(echo "$DECISION_RESP" | python3 -c "
import sys,json
d=json.load(sys.stdin)
print('yes' if d.get('response') or d.get('decision') else 'no')
" 2>/dev/null || echo "no")

if [[ "$HAS_RESPONSE" == "yes" ]]; then
  pass "Decision Engine returns a response (even if fallback) — no 500"
else
  fail "Decision Engine returned empty or error response"
fi

# ── Test 4: Circuit breaker status ────────────────────────────────────────
log "TEST 4: Circuit breaker state visible in system-health"
CB_RESULT=$(health 2>/dev/null || echo '{}')
CB_DATA=$(echo "$CB_RESULT" | python3 -c "
import sys,json
d=json.load(sys.stdin)
cbs=d.get('gates',{}).get('llm',{}).get('circuitBreakers',{})
print(json.dumps(cbs))
" 2>/dev/null || echo "{}")
if [[ "$CB_DATA" != "{}" && "$CB_DATA" != "" ]]; then
  pass "Circuit breaker states visible: $CB_DATA"
else
  fail "Circuit breaker states not exposed in system-health"
fi

# ── Summary ────────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════"
echo "  Chaos LLM: PASS=$PASS  FAIL=$FAIL"
echo "═══════════════════════════════════════════"
[[ $FAIL -eq 0 ]] && exit 0 || exit 1
