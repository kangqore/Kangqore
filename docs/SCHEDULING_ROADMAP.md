# Scheduling — Calendly + Zoho Parity Roadmap

_Last updated: 2026-06-01 · Status: Phases 1–5B complete_

This roadmap closes the gap between Kangqore's current scheduling system and
full **Calendly + Zoho Bookings feature parity**.

---

## Shipped ✅ (pre-roadmap baseline)

| Feature | Detail |
|---|---|
| Booking flow (3-step) | Date picker → form → confirmation |
| Reschedule (token) | Public self-serve reschedule page |
| Cancel (token) | Public self-serve cancel + reason |
| Availability rules | Weekly schedule + date overrides |
| Buffer times | Before/after per event type |
| Min notice / max advance | Configurable per event type |
| Max per day | Booking caps |
| Custom intake questions | Per event type (text, select, radio) |
| Routing forms | Conditional routing to event types |
| Scheduling links | Expiry, max-uses, prefill fields |
| ICS calendar invite | .ics attachment on every confirmation email |
| Reminder cron | 24h and 1h pre-meeting emails |
| No-show tracking | Mark + undo no-show per invitee |
| Jitsi auto-URL | Auto-generated meet link, no auth needed |
| Org members + invitations | Roles (OWNER / ADMIN / MEMBER), 7-day invite expiry, invitation email |
| eQORE AI automation | NLP scheduling intent → slot offer → booking |
| NLP date parser | Client + server (chrono-node) |
| Admin views | Bookings management, event type management |
| Booking confirmation page | Public `/booking/:id` with join/reschedule/cancel links |
| Browser timezone detection | Auto-detected and sent with every booking |

---

## Phase 1 — Core Parity ✅

| Item | Status |
|---|---|
| Google Calendar OAuth + freebusy + export | ✅ |
| Outlook / MS 365 OAuth + Graph API + export | ✅ |
| iCal subscribe feed | ✅ |
| External conflict detection in slot generator | ✅ |
| Multiple durations on one event type | ✅ |
| Accept-invite page (`/accept-invite/:token`) | ✅ |
| Embed widget (`public/embed.js`) | ✅ |
| Booking confirmation public page (`/booking/:id`) | ✅ |

**Env vars required:**
```
GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REDIRECT_URI
MICROSOFT_CLIENT_ID / MICROSOFT_CLIENT_SECRET / MICROSOFT_TENANT_ID / MICROSOFT_REDIRECT_URI
```

---

## Phase 2 — Monetization & Workflows ✅

| Item | Status |
|---|---|
| Stripe payments | ⛔ Skipped — booking is free |
| Custom email templates (editor + variables + per-event-type) | ✅ |
| Workflow builder (triggers + email/webhook actions + cron executor) | ✅ |
| Outbound webhooks (HMAC-signed, 3-retry, delivery log) | ✅ |
| SMS reminders via Twilio (24h + 1h, graceful no-creds fallback) | ✅ |

**Env vars required:**
```
TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_FROM
```

---

## Phase 3 — Team Scheduling ✅

| Item | Status |
|---|---|
| Round-robin assignment with weight-based load balancing | ✅ |
| Collective availability (slot intersection across all team members) | ✅ |
| Host picker on booking page ("No preference" → round-robin fallback) | ✅ |
| `EventTypeTeamMember` schema + `assignmentStrategy` field | ✅ |

---

## Phase 4 — Analytics & Admin ✅

| Item | Status |
|---|---|
| Booking analytics dashboard (`/dashboard/admin/scheduling-analytics`) | ✅ |
| CSV export (`/api/scheduling/export`) | ✅ |
| Audit log (model + route + `/dashboard/admin/scheduling-audit`) | ✅ |

---

## Phase 5 — Integrations

### 5A — Video Conferencing ✅

| Item | Status |
|---|---|
| Zoom OAuth + meeting creation on booking + token refresh | ✅ |
| Google Meet auto-create via GCal `conferenceDataVersion=1` | ✅ |
| `videoProvider` field on EventType (JITSI \| ZOOM \| GOOGLE_MEET) | ✅ |
| Provider picker in event type create/edit modal | ✅ |
| Jitsi fallback when no provider configured | ✅ |

**Env vars required:**
```
ZOOM_CLIENT_ID / ZOOM_CLIENT_SECRET / ZOOM_REDIRECT_URI
```

### 5B — CRM Integrations ✅

| Item | Status |
|---|---|
| HubSpot OAuth + contact upsert + note activity on booking | ✅ |
| Salesforce OAuth + Contact upsert + Event activity on booking | ✅ |
| Auto-sync fire-and-forget in `scheduling.service.ts` | ✅ |
| Unified Integrations settings page (Calendar + Video + CRM + iCal) | ✅ |

**Env vars required:**
```
HUBSPOT_CLIENT_ID / HUBSPOT_CLIENT_SECRET / HUBSPOT_REDIRECT_URI
SALESFORCE_CLIENT_ID / SALESFORCE_CLIENT_SECRET / SALESFORCE_REDIRECT_URI / SALESFORCE_BASE_URL
```

### 5C — Zapier / Make Trigger ⬜ In progress

| Item | Status |
|---|---|
| Generic outbound webhook (Phase 2D) — covers Make, n8n, Zapier webhooks | ✅ |
| `/api/scheduling/zapier/subscribe` REST trigger endpoint | ⬜ |
| Zapier native partner app submission | ❌ Requires Zapier partner account |

### 5D — Custom Domain ⬜ In progress

| Item | Status |
|---|---|
| `CustomDomain` model + migration | ⬜ |
| Domain registration + CNAME verification API | ⬜ |
| Hostname-aware routing middleware | ⬜ |
| White-label booking page (host logo + brand colours) | ⬜ |
| SSL provisioning | ❌ Infrastructure — handled by reverse proxy (Caddy/nginx) |
| Frontend custom domain settings page | ⬜ |

---

## Remaining work summary

| Item | Effort | Value |
|---|---|---|
| 5C — Zapier subscribe endpoint | ~1 day | Medium |
| 5D — Custom domain (app layer) | ~3 days | Medium-High |
| 5D — SSL provisioning | Infrastructure only | — |

---

_Owner: Kangqore Engineering_
