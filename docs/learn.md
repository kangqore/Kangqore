# Learnings

The core learning file of the three Kangqore operating doctrines — the
**Closed-Loop Execution System** (`.claude/skills/kangqoreexecution/`), the
**Execution Protocol** (`.claude/skills/kangqoreexecutionmode/`), and the
**Completion Protocol** (`.claude/skills/kangqorecompletion/`). Every loop's
learning step writes here.

A mistake should not disappear after it is fixed — it should become organizational
knowledge. Step 9 of the loop records the learning here; step 10 changes the system
so the mistake is less likely to recur, and links back to the entry.

**How to use this file.** Append an entry whenever a cycle surfaces something worth
keeping: a mistake, a wrong assumption, a repeated problem, a successful pattern, or
a discovery. Keep entries short and specific. When step 10 acts on an entry, add the
**System change** line pointing at what was updated (an SOP, a skill, a checklist,
a gate, a memory file). Entries are permanent — this file is knowledge, not a
running TODO. Newest first.

Severity of the underlying issue: **P1** = caused or nearly caused user-visible
breakage · **P2** = real cost in time or trust · **P3** = friction / tidy-up.

---

## Entry format

```
## YYYY-MM-DD — <short title>  (P1|P2|P3)

**Context:** what was being worked on.
**What happened:** the mistake, assumption, or discovery — concretely.
**Why:** root cause, not just the symptom.
**Learning:** the general rule to carry forward.
**System change:** what was updated in step 10 so this is less likely to recur
(file / SOP / skill / gate / memory), or "none yet — <reason>".
```

---

<!-- Append entries below this line, newest first. -->

## 2026-08-31 — Service probes proved nothing about the screens  (P1)

**Context:** rebuilding the Work OS on the ontology, then adding dashboards.
**What happened:** four Work OS pages — Timeline, Workload, Goals, Portfolio —
crashed with "data.filter is not a function" while thirteen probes stayed green
and every endpoint returned 200. The rebuilt endpoints return an envelope
(`{ items }`, `{ buckets }`) and the pages still called array methods on the
response. I had corrected `items` and `board` at the time and never checked the
rest.
**Why:** the probes assert what a service RETURNS. Nothing asserted what a page
READS. A 200 with the wrong shape passes every check that exists.
**Learning:** an endpoint contract has two sides, and only one of them was
tested. When a response shape changes, the consumers are part of the change —
and shallow shape assertions catch this where richer behavioural tests do not.
**System change:** added `backend/src/kangqore-view/eof/scripts/api-contract-e2e.ts`,
which asserts bare-array-versus-envelope and the specific field names each
screen indexes.

## 2026-08-31 — The error display was the thing that crashed  (P1)

**Context:** the dashboard showed "Objects are not valid as a React child
(found: object with keys {message, stack})".
**What happened:** the backend has two error shapes — route handlers return
`{ error: "message" }`, the global express handler returns
`{ error: { message, stack } }` in development. Every error display read
`response.data.error` and rendered it, so a failed request produced a crash
screen instead of the failure.
**Why:** I wrote the extraction once and copied it into six components without
checking what the backend actually emits on the error path. The failure was
invisible in testing because my requests were succeeding.
**Learning:** error-handling code needs to be tested against a real error, not
assumed. When display code crashes it replaces the real problem with a worse
one.
**System change:** added `frontend/src/os/lib/errorMessage.ts`, which handles
every shape and can only return a string; all six call sites rewired.

## 2026-08-31 — Assertions pinned to magic numbers drift silently  (P2)

**Context:** inserting `Portfolio` at tier 4 shifted every tier below it.
**What happened:** a probe read `Project now occupies tier 5`. After the insert
Project is 6, so the assertion tested **Program** while still reading as though
it tested Project. A second assertion used `tiers.includes(5)` as a proxy for a
gap that no longer existed.
**Why:** both encoded a position as a literal rather than a relationship.
**Learning:** assert the relationship, not the number — "Project sits directly
below Program" survives a renumber; "tier 5" quietly starts testing something
else.
**System change:** both assertions rewritten positionally in
`introspection-e2e.ts`.

## 2026-08-31 — Vacuous green: every() over an empty array  (P2)

**Context:** the dashboard probe asserted that every empty panel explains itself.
**What happened:** no panels were empty, so `empties.every(...)` passed
trivially and reported a green check for behaviour never exercised.
**Why:** the assertion depended on the fixture happening to contain the case.
**Learning:** a test for a condition must force the condition. If a check can
pass because nothing matched, it is not a check.
**System change:** `dashboard-e2e.ts` now creates a goal with nothing attached to
force the empty path.

## 2026-08-31 — Endpoint 200s are not page verification  (P1)

**Context:** the Outcome Risk page shipped in #467 and was blank on direct load
for days.
**What happened:** I verified its API exhaustively and never once loaded it in a
browser. The crash was a hooks-order violation in `eROOT`, latent on all 106
`/kangqore-view` routes.
**Why:** I treated "the endpoint returns correct data" as evidence the screen
works.
**Learning:** frontend work is verified by loading the page. A browser sweep of
every tab in a module takes two minutes and found four crashes that thirteen
probes and every gate missed.
**System change:** added `frontend/e2e/work-os.spec.ts` — every Work OS tab plus
Outcome Risk, asserting no uncaught error and no error boundary, running in the
existing `os-smoke` CI job.

**Follow-on learning:** the first version of that test was worthless, and I only
found out by deliberately reintroducing a crash and watching it stay green.
Without a backend the pages sit in a loading state, so the data path never runs.
It now serves captured fixtures, and was re-verified by reproducing the original
failure — "items.map is not a function" — before being committed. **A test that
has not been seen to fail has not been tested.**


## 2026-09-02 — A rename has no single seam unless someone built one  (P1)

**Context:** renaming AEGIS → HANUMANAS. 15 commits, ~470k DB rows, code +
frontend + docs.
**What happened:** the subsystem name lived as a bare string literal in ~250
code spots, ~70 DB columns, every agent's LLM prompt, and both frozen specs.
Each layer was its own pass; "done" kept moving.
**Why:** the name was never declared once. `shield: 'AEGIS'`,
`actorType: 'AEGIS'`, `name: 'AEGIS'`, `You are AEGIS` — all independent.
**Learning:** the cost of a rename is set years earlier, by whether the name has
a canonical source. Ours didn't, so the rename also had to *create* one
(`esf/hanumanas/identity.ts`), then prove it by flipping the constant and
running `tsc` (0 errors = everything follows).
**System change:** `identity.ts` (backend) + `os/lib/hanumanas.ts` (frontend)
now own the name. New rule for any new subsystem: declare its identity in one
`const` on day one — never inline the name.

## 2026-09-02 — Estimate the blast radius from the schema, not from memory  (P1)

**Context:** the historical-data rewrite step.
**What happened:** I told the user "~35k rows of prose." A full
`information_schema` scan then found ~200k more across ~70 columns
(notifications, orchestration, decisions, knowledge base). The estimate was 6×
low and the user had already approved based on it.
**Why:** I counted the tables I remembered touching, not every text/jsonb/array
column in the database.
**Learning:** before quoting the size of a data migration, run the loop over
`information_schema.columns` and count for real. A number given to the user is a
commitment; deriving it from recall makes it a guess dressed as a fact.
**System change:** the pattern — a `DO $$ ... information_schema.columns ... $$`
scan — is now in migration `20260902150000` as a reusable template.

## 2026-09-02 — BSD sed silently ignores `\b`  (P2)

**Context:** a scoped identifier rename on macOS.
**What happened:** `sed -i '' -E 's/\baegisAuditLog\b/.../'` reported success and
changed nothing. 190 occurrences untouched, no error.
**Why:** BSD sed has no `\b`; it treats the whole pattern as non-matching and
exits 0.
**Learning:** on macOS, `\b` in `sed` is a silent no-op, not an error. Use
`[[:<:]]`/`[[:>:]]`, or `token([A-Za-z])` capture groups, or `perl -pi`. And
after any bulk `sed`, grep for the *old* string — exit code 0 is not proof.

## 2026-09-03 — "genN" was three concepts wearing one name  (P1)

**Context:** renaming the Krisnam model lineage "Gen 1/2" → "0.1.0/0.1.1".
**What happened:** the first inventory conflated (a) the Krisnam model version,
(b) the router A/B arms where `gen1` = the *Claude baseline*, not Krisnam 0.1.0,
and (c) the WAANDA evolution-roadmap generations (32 `Gen3/4/5*Page.tsx`, the
`gen4_*`/`gen5_*` tables, `gen3Executor`). A mechanical `genN → v0_1_(N-1)` would
have made "0.1.4" mean both a model and a roadmap phase, and turned the A/B
control arm into a wrong version label.
**Learning:** before a namespace rename, classify every hit by *which concept* it
serves, not by its spelling. Here the split was: live model layer → concept names
+ a `version` field; A/B arms → `baseline`/`candidate`; roadmap → left untouched.
**System change:** the Krisnam↔roadmap boundary is now documented in
`krisnam-0-1-0` memory and PR #508's description so the next person doesn't
re-conflate them.

## 2026-09-03 — a second agent was resetting the working tree mid-task  (P2)

**Context:** mid-refactor, `git branch --show-current` changed between two
commands; uncommitted files appeared that weren't mine; `main` moved backwards.
**Why:** another session was doing branch checkouts / resets in the same clone.
**Learning:** when `rg`/`grep` give inconsistent results and HEAD moves on its
own, stop — a concurrent session is editing the tree. Re-verify `git status`,
`reflog`, and `origin/main` before trusting any inventory, and branch off
`origin/main` (a fixed ref) rather than local `main`.

## 2026-09-03 — the working layer nobody could reach  (P1)

**Context:** BoardService — boards as saved queries over the ontology, columns
derived from each type's schema, per-board ordering, writes through the
gateway — was complete, persisted, and had a passing 18-assertion probe. It had
**zero frontend consumers**. The Work OS shipped `WorkViewService` alongside it:
a second, narrower view layer hardcoded to one shape, and that is the one all
sixteen screens use. Two systems built to fit each other, never joined.
**Why it survived:** every gate was green. Probes proved the backend worked, the
smoke test proved the pages rendered, and neither could see that the pages and
the backend were not talking about the same thing. "Both halves pass" is not
"the halves are connected."
**Learning:** a probe that instantiates a service directly will pass forever on
code no user can reach. For any new service, assert **who calls it** — a grep for
consumers is a cheaper and better test than another assertion about its output.
**System change:** `/work/boards` now consumes it, and its smoke test
auto-selects a board so the render path is exercised rather than the empty list.

## 2026-09-03 — the filter that replaced the type instead of joining it  (P1)

**Context:** `BoardService.createBoard` built its query from `input.where` when
one was given — dropping the root-type filter entirely. A board over `Project`
filtered by status returned **34 rows, 17 of them Contracts, Customers, Goals,
Cases and Outcomes**. It looked completely plausible.
**Why:** the same bug fixed in `IntentCompiler.compileBound` hours earlier, in a
file I did not re-check. Every existing board assertion created boards *without*
a `where`, so the broken branch had no coverage at all.
**Learning:** after fixing a bug, grep for the *shape* of it, not the file. The
tell here is a ternary where one branch builds a query and the other builds a
type filter — the two should never be alternatives.
**System change:** `board-layer-e2e` §8 covers the filtered branch, and was
verified to fail (19/1) with the fix reverted before being trusted.

## 2026-09-03 — a marketing scroll animation was hiding the whole app  (P0)

**Context:** the OS home rendered cards with badges, scores, progress bars and
values, but no lead names, no goal titles, no alert text, no activity messages.
Reported as "never gets load in one go".
**Cause:** `GlobalScrollAnimations` is mounted app-wide in `App.jsx` and hides
every `h1-h4 / p / li / .card` with `gsap.set({opacity:0, y:30})`, revealing each
on a **window** scroll event. The OS lays out as a fixed frame with an inner
scrolling pane, so `document.scrollHeight === clientHeight` and that event can
never fire. 103 of 155 tagged elements stayed invisible **permanently**. Which
ones varied per load, because the pass runs on a 400ms timer and catches whatever
had rendered by then — hence the "sometimes different" symptom.
**Why it hid for so long:** every check was of *data*. The API returned all 8
leads with names; probes were green; the smoke test asserted no crash and
`chars > 200`, which a page with two thirds of its text at opacity 0 satisfies
easily. Nothing asserted that fetched content was actually **painted**.
**Learning:** "the endpoint returns it" and "the component renders it" still do
not mean a person can see it. When content is missing, read the computed style of
the element before questioning the data — the DOM said `opacity: 0` in one query
and would have saved an hour of theorising about joins and colour tokens.
**System change:** app-shell routes and any element inside an inner scroll
container are excluded from the reveal, and `work-os.spec.ts` now asserts zero
`[data-gsap]` elements in the shell — confirmed failing with the guards removed.
## 2026-09-03 — one rate-limit bucket for the entire installation  (P1)

**Context:** while diagnosing a UI problem, the whole API started returning 429
to everything — including my own browser session, from a handful of curl calls.
**Cause:** the global limiter keyed on `req.ip` with no `trust proxy`. Behind
Docker's published port, and behind any load balancer, every client arrives from
the same address, so **all users shared one 1000-request/15-minute window**.
Proven, not assumed: 1000 requests from the host returned 429 to everything while
a request originating inside the container still returned 200. With the OS home
costing 24 API calls, that is ~41 page loads across the entire system before
everyone is locked out, and one polling tab can do it alone.
**Second-order symptom:** partial page loads. Some panels resolve and some 429,
differently each time, which reads as flakiness rather than as throttling.
**Learning:** an IP-keyed limiter is only per-client if the server can actually
see distinct client IPs. Behind any proxy it silently becomes a global cap — the
failure is invisible until traffic grows, and then it looks like instability.
**System change:** two buckets — verified user id for authenticated traffic,
IP for everything else, anonymous limit unchanged. The key must come from a
**verified** token; keying on the raw Authorization header would let anyone mint
unlimited windows, which is worse than the shared bucket. `rate-limit-e2e`
asserts that specific evasion and was confirmed catching it.

## 2026-09-03 — "Applications" was a nav entry with no route behind it  (P1)

**Context:** asked to make the existing "Applications" rail item show the
marketplace. `nav.ts` declared it (`defaultPath: .../applications`), but no
`<Route path="applications/*">` existed anywhere — clicking it had always gone
nowhere. Checked before building anything, the same way BoardService turned out
to have zero consumers earlier today.
**Fix:** mounted it on the same `MarketplaceModule` already at `marketplace/*`,
rather than a second copy — one component, two entry points, so the names can't
drift into two different screens.
**Found on the way:** the Revenue tab inside that marketplace crashed on every
real load. Its interface named fields — `totalPlatformFee`, `netRevenue`,
`refundRate`, `byListing` — the backend (`kimmp/routes.ts:3746`) has never sent;
it sends `totalRevenue` (already net of fee), `totalRefunds`, `totalInstalls`,
`listings`. `Cannot read properties of undefined (reading 'toFixed')` every
time, caught by nothing because the marketplace had 0 real installs, so no one
had opened that tab with data behind it.
**Why the frontend build didn't catch it:** `vite build` transpiles TypeScript,
it does not type-check it (no local `tsc` on this project — noted before in
`local-dev-tooling-notes`). A bare reference to an undeclared name, or a field
that was never in the interface's actual source, passes the build silently and
only throws in the browser at the exact line that evaluates it.
**Learning:** "the build succeeded" is not evidence a TS file is even
internally consistent here. When a component reads fields from an API response,
diff the interface against the ACTUAL handler return statement, not against
what the interface author believed it returned.
**System change:** rewrote the interface and render to the real response shape;
`marketplace.spec.ts` opens the Revenue tab specifically, and was confirmed
failing (with the crash's original boundary text) against the pre-fix code.

## 2026-09-03 — a fixed sleep hid a cold-chunk race, and passed anyway on the second try  (P2)

**Context:** `marketplace.spec.ts` (PR #513) failed in CI — 2 failures, both landing
on `/login` — while passing every time locally and matching `work-os.spec.ts`'s
own auth-warmup pattern exactly (same `demo-token`, same 1500ms sleep).
**Cause:** the warmup slept a fixed 1500ms instead of waiting for a real signal.
Locally and for already-established routes this margin was always enough; in CI,
loading the marketplace page's chunk for the first time ever (new in this PR,
~870KB gzipped, no cache) took longer, and the sleep expired before the SPA had
even mounted the target route — landing on whatever the router's fallback was.
**A dead end I ruled out first, and should record:** `ProtectedRoute` reads
`localStorage` synchronously with no network dependency, and the axios 401
interceptor explicitly skips its logout path when `isDemo()` is true — so
neither auth guard could have caused this. Reading both before touching the test
avoided "fixing" the wrong layer.
**A verification mistake worth naming:** the first attempt to prove the fix
mattered used `git stash` on a file with no uncommitted diff — the fix was
already committed on this branch, so nothing was reverted and the "red" run
silently tested the already-fixed code. Caught by noticing the revert produced
no failure where one was expected, not by trusting the green result.
**Learning:** copying a working test's timing constant does not copy its
reliability — the constant was tuned for chunks that were already warm. Wait on
an observable signal (a real element appearing), not a duration. And `git stash`
only ever reverts an UNCOMMITTED diff — on a branch where the target file is
already committed, it silently no-ops instead of testing the negative case.
**System change:** `waitForAuthenticatedShell()` polls for the topbar search
control (`toBeVisible`, 20s) instead of sleeping; per-page assertions replaced
their own sleeps with the same pattern. Confirmed failing against a genuinely
reintroduced bug (editing the file directly, not stashing) before trusting green.

## 2026-09-03 — a global, unguarded auth effect racing every OS smoke test  (P1)

**Context:** #513's marketplace tests still failed in CI after the sleep→signal
fix (`waitForAuthenticatedShell`) — landing on `/login`, confirmed by an
artifact-less run reproduced locally (`npm run build && CI=true
DISABLE_API_PROXY=true npx playwright test`, matching the workflow exactly,
since GitHub had uploaded no report to inspect).
**Cause:** `src/context/AuthContext.jsx` mounts once for the WHOLE app —
public site and OS both — and independent of any OS route, fires a bare
`axios.get('/api/auth/me')` with no CI guard. `vite preview` (the production
server this CI job runs, not `vite dev`) serves its SPA history fallback —
200 + `index.html` — for any unmocked GET to a non-file path. `response.data`
is that HTML string; `.user` off a string is `undefined`;
`localStorage.setItem('user', JSON.stringify(undefined))` stores the literal
STRING `"undefined"`. The next time `ProtectedRoute`'s synchronous
localStorage check runs anywhere, `JSON.parse("undefined")` throws, is
swallowed as "malformed session", and the route bounces to `/login`.
**Why the previous fix made it MORE likely to reproduce, not less:** this is a
race against an UNRELATED global effect resolving, not against the target
page's own load. Waiting longer for a "more robust" signal gave that effect
more wall-clock time to complete and corrupt localStorage before the next
check — the opposite of what a "give it more time" fix assumes, and the
opposite of the theory (cold-chunk loading) the first fix was built on, which
had never been checked against an actual downloaded artifact.
**Learning:** when a fix based on a theory doesn't resolve a CI failure,
download the actual artifact / reproduce the exact recipe locally before
extending the theory further. `npm run build && CI=true DISABLE_API_PROXY=true
npx playwright test` reproduced it deterministically in under a minute;
guessing at a second timing tweak would not have found the real cause. This is
also the second time in the two fixes for #513 that a plausible-sounding
timing theory was wrong — worth treating "it's probably just slow CI" as a
hypothesis to disprove, not a default explanation.
**Not fixed (deliberately, scope):** `AuthContext.jsx`'s unguarded fetchUser is
a latent bug independent of this PR — any smoke test with enough dwell time
before its assertions is exposed to it, not just this one. `work-os.spec.ts`
and `smoke.spec.ts` are fast enough to mostly avoid the race, not immune to it.
**System change:** `marketplace.spec.ts`'s `mockApi()` also stubs
`/api/auth/me` with a valid `{ user }` shape, closing the corruption at its
source rather than out-waiting it. Confirmed failing without the mock (5/5
across repeats) and passing with it (8/8 across repeats), both under the exact
CI recipe run locally — not the dev server.
