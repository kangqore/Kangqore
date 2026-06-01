# Scheduling — Calendly + Zoho Parity Roadmap

_Last updated: 2026-06-01 · Branch: `main`_

This roadmap closes the gap between Kangqore's current scheduling system and
full **Calendly + Zoho Bookings feature parity**. It is sequenced by business
impact — each phase is independently shippable and delivers value on its own.

---

## What is already shipped ✅

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

## Phase 1 — Core Parity ✅ Complete

| Item | Status | Notes |
|---|---|---|
| **1A — Google Calendar OAuth + sync** | ✅ Done | Real OAuth 2.0 flow; freebusy API; exports events; token refresh |
| **1A — Outlook / MS 365 OAuth + sync** | ✅ Done | MSAL + Graph API; getSchedule; exports events; token refresh |
| **1A — iCal feed** | ✅ Done | `/api/scheduling/feed/:token` — read-only subscribe URL |
| **1A — External conflict detection** | ✅ Done | Slot generator calls `CalendarSyncService.getExternalBusySlots()` per user |
| **1B — Multiple durations** | ✅ Done | `durationOptions` on EventType; duration picker in BookingWidget |
| **1C — Accept-invite page** | ✅ Done | `/accept-invite/:token` — validates, creates membership, redirects |
| **1D — Embed widget** | ✅ Done | `public/embed.js` drops iframe at `/schedule/:slug` on any site |
| **1E — Booking confirmation page** | ✅ Done | `/booking/:id` — shareable; shows join/reschedule/cancel links |

**Required env vars for calendar sync:**
```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/scheduling/calendar-integrations/callback/google

MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
MICROSOFT_TENANT_ID=common
MICROSOFT_REDIRECT_URI=https://yourdomain.com/api/scheduling/calendar-integrations/callback/outlook
```

---

## Phase 2 — Monetization & Workflows ✅ Complete

| Item | Status | Notes |
|---|---|---|
| **2A — Stripe payments** | ⛔ Skipped | Booking is free — not required |
| **2B — Custom email templates** | ✅ Done | DB model, CRUD API, template variables, per-event-type override, admin editor |
| **2C — Workflow builder** | ✅ Done | Triggers (booking events + time offsets), actions (email + webhook), executor cron |
| **2D — Outbound webhooks** | ✅ Done | HMAC-SHA256 signed, 3-retry backoff, delivery log, admin UI |
| **2E — SMS reminders (Twilio)** | ✅ Done | Real Twilio integration, graceful no-creds fallback, 24h + 1h reminders |

**Required env vars for SMS:**
```
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM=+1...
```

---

## Phase 3 — Team Scheduling ✅ Complete

| Item | Status | Notes |
|---|---|---|
| **3A — Round-robin + load balancing** | ✅ Done | Weight-based fewest-bookings-first assignment; `lastAssignedMemberId` updated |
| **3B — Collective availability** | ✅ Done | Slot intersection across all team members; all hosts shown on booking page |
| **3C — Load balancing** | ✅ Done | Part of round-robin; weight field on `EventTypeTeamMember` |
| **3D — Host picker on booking page** | ✅ Done | "Pick your consultant" step in BookingWidget; "No preference" → round-robin fallback |

---

## Phase 4 — Analytics & Admin ✅ Complete

| Item | Status | Notes |
|---|---|---|
| **4A — Booking analytics dashboard** | ✅ Done | `/dashboard/admin/scheduling-analytics` — volume, no-show rate, busiest times |
| **4B — CSV export** | ✅ Done | `/api/scheduling/export` — date range + status filter |
| **4C — Audit log** | ✅ Done | `AuditLog` model; `/dashboard/admin/scheduling-audit` admin view |

---

## Phase 5 — Integrations ✅ Mostly Complete

### 5A — Zoom / Google Meet Auto-Create ✅ Done

| Item | Status | Detail |
|---|---|---|
| Zoom OAuth + meeting creation | ✅ Done | `zoom.service.ts` — full OAuth, token refresh, meeting API |
| Google Meet auto-create | ✅ Done | GCal export with `conferenceDataVersion=1`; Meet link stored back |
| Per-event-type video provider | ✅ Done | `videoProvider` field (JITSI \| ZOOM \| GOOGLE_MEET) on EventType |
| Provider picker in event type UI | ✅ Done | `SchedulingManagement.jsx` create/edit modal |
| Jitsi fallback | ✅ Done | Used when no provider configured or Zoom call fails |

**Required env vars:**
```
ZOOM_CLIENT_ID=
ZOOM_CLIENT_SECRET=
ZOOM_REDIRECT_URI=https://yourdomain.com/api/scheduling/zoom/callback
```

### 5B — HubSpot / Salesforce Sync ✅ Done

| Item | Status | Detail |
|---|---|---|
| HubSpot OAuth + contact sync | ✅ Done | `hubspot.service.ts` — upsert contact, log note activity |
| Salesforce OAuth + contact sync | ✅ Done | `salesforce.service.ts` — upsert Contact, create Event activity |
| Auto-sync on every booking | ✅ Done | Fire-and-forget in `scheduling.service.ts` after booking created |
| Settings UI | ✅ Done | `CalendarSettings.jsx` — unified Integrations page (calendar + video + CRM + iCal) |

**Required env vars:**
```
HUBSPOT_CLIENT_ID=
HUBSPOT_CLIENT_SECRET=
HUBSPOT_REDIRECT_URI=https://yourdomain.com/api/scheduling/crm/hubspot/callback

SALESFORCE_CLIENT_ID=
SALESFORCE_CLIENT_SECRET=
SALESFORCE_REDIRECT_URI=https://yourdomain.com/api/scheduling/crm/salesforce/callback
SALESFORCE_BASE_URL=https://login.salesforce.com
```

### 5C — Zapier / Make Native Trigger

| Item | Status | Detail |
|---|---|---|
| Generic webhook (Phase 2D) | ✅ Done | Covers Make, n8n, Zapier webhooks |
| Native Zapier partner app | ❌ Not started | Requires Zapier partner account + app review |

### 5D — Custom Domain

| Item | Status | Detail |
|---|---|---|
| `book.yourdomain.com` CNAME | ❌ Not started | DNS CNAME → Kangqore platform |
| SSL provisioning | ❌ Not started | Let's Encrypt via ACME on custom hostname |
| White-label booking page | ❌ Not started | Host logo, brand colours, no Kangqore branding |

---

## Sequencing Rule

> Phases 1–4 are fully shipped. Build 5A (Zoom/Meet) before 5D (custom domain).
> 5B (CRM) can run in parallel with 5A.

---

_Owner: Kangqore Engineering · Status: Phases 1–5A/5B complete · Remaining: 5C (Zapier app), 5D (custom domain)_
