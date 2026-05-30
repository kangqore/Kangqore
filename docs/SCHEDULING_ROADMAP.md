# Scheduling — Calendly + Zoho Parity Roadmap

_Last updated: 2026-05-29 · Branch: `feat/dashboard-os-phase-1a`_

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
| Org members + invitations | Roles (OWNER / ADMIN / MEMBER), 7-day invite expiry |
| eQORE AI automation | NLP scheduling intent → slot offer → booking |
| NLP date parser | Client + server (chrono-node) |
| Admin views | Bookings management, event type management |

---

## Phase 1 — Core Parity

> **Goal:** eliminate the blockers that make the product feel incomplete day-to-day.
> Unlocks: no double-bookings, embeddable anywhere, invitees can actually accept org invites.

### 1A — Calendar Integrations

| Item | Detail |
|---|---|
| Google Calendar sync | OAuth 2.0 → import blocked slots, export bookings as GCal events |
| Outlook / MS 365 sync | Microsoft Graph API → same bi-directional sync |
| iCal feed (subscribe URL) | Read-only `.ics` feed at `/api/scheduling/feed/:token` — host subscribes any calendar app |
| Conflict detection with external calendars | Slot generator marks slots busy if they overlap an imported external event |

**Files to create/modify:**
- `backend/src/services/googleCalendar.service.ts`
- `backend/src/services/outlookCalendar.service.ts`
- `backend/src/routes/scheduling/calendar-integrations.ts`
- `backend/src/routes/scheduling/feed.ts` (iCal feed endpoint)
- `backend/prisma/schema.prisma` — add `CalendarIntegration` model
- `frontend/src/pages/settings/CalendarSettings.jsx`

### 1B — Multiple Durations on One Event Type

| Item | Detail |
|---|---|
| Duration options array | Host defines `[15, 30, 60]` min options on one event type |
| Duration picker on booking page | Invitee selects duration before choosing a slot |
| Slot generation respects selected duration | Each duration produces its own slot grid |

**Files to modify:**
- `backend/prisma/schema.prisma` — add `durationOptions` JSON to `EventType`
- `backend/src/services/availability.service.ts` — accept `duration` param override
- `frontend/src/components/scheduling/BookingWidget.jsx` — add duration selector step

### 1C — Accept-Invite Page

| Item | Detail |
|---|---|
| `/accept-invite/:id` route | Validates invitation ID, creates OrgMembership, marks invitation accepted |
| Expiry + already-accepted guard | 400 if expired, 200 if already accepted |
| Post-accept redirect | → login or dashboard depending on whether user exists |

**Files to create:**
- `frontend/src/pages/AcceptInvitePage.jsx`
- `backend/src/routes/scheduling/accept-invite.ts`

### 1D — Embed Widget

| Item | Detail |
|---|---|
| Embeddable booking widget | `<script src="…/embed.js" data-slug="…"></script>` drops widget on any site |
| Inline + popup modes | Inline renders in-place; popup opens on button click |
| CORS-safe | Backend allows embed origin requests |

**Files to create:**
- `frontend/src/embed/BookingEmbed.jsx` (standalone React bundle)
- `frontend/src/embed/embed-entry.js` (vanilla JS loader)
- `backend/src/middleware/corsEmbedAllowlist.ts`

### 1E — Booking Confirmation Public Page

| Item | Detail |
|---|---|
| `/booking/:id` public page | Shows event details after booking (shareable URL) |
| Links to reschedule / cancel / join | Same tokens from confirmation email |

**Files to create:**
- `frontend/src/pages/BookingConfirmationPage.jsx`

---

## Phase 2 — Monetization & Workflows

> **Goal:** charge for time, automate follow-up, connect to external systems.

### 2A — Stripe Payment on Booking (SKIPPED)

*Cancelled: Booking is free, no payment processing required.*

### 2B — Custom Email Templates

| Item | Detail |
|---|---|
| Template editor (admin) | Rich text editor for confirmation, reminder, cancellation, follow-up |
| Template variables | `{{invitee_name}}`, `{{event_name}}`, `{{date}}`, `{{time}}`, `{{join_url}}`, etc. |
| Per-event-type override | Each event type can have its own template or inherit default |
| Preview mode | Send test email to host before activating template |

**Files to create:**
- `backend/prisma/schema.prisma` — add `EmailTemplate` model
- `backend/src/routes/scheduling/email-templates.ts`
- `backend/src/services/email.service.ts` — template rendering
- `frontend/src/pages/admin/EmailTemplates.jsx`

### 2C — Workflow Builder

| Item | Detail |
|---|---|
| Trigger events | `booking.created`, `booking.cancelled`, `booking.rescheduled`, `X hours before`, `X hours after` |
| Actions | Send email (to invitee or host), send webhook POST |
| Workflow model in DB | `Workflow { id, eventTypeId, trigger, offsetMinutes, action, actionConfig }` |
| Workflow executor (cron) | Runs every 15 min, finds pending workflow jobs, executes |

**Files to create:**
- `backend/prisma/schema.prisma` — add `Workflow`, `WorkflowJob` models
- `backend/src/services/workflow.service.ts`
- `backend/src/jobs/WorkflowExecutor.ts`
- `frontend/src/pages/admin/WorkflowBuilder.jsx`

### 2D — Outbound Webhooks

| Item | Detail |
|---|---|
| Webhook endpoints config | Host registers URL + secret per event type or org-wide |
| Events fired | `booking.created`, `booking.cancelled`, `booking.rescheduled`, `booking.no_show` |
| HMAC-SHA256 signature | `X-Kangqore-Signature` header for verification |
| Retry with backoff | 3 retries on non-2xx response |
| Delivery log | Store last 100 delivery attempts per webhook |

**Files to create:**
- `backend/prisma/schema.prisma` — add `Webhook`, `WebhookDelivery` models
- `backend/src/services/webhook.service.ts`
- `backend/src/routes/scheduling/webhooks.ts`
- `frontend/src/pages/admin/WebhooksSettings.jsx`

### 2E — SMS Reminders (Twilio)

| Item | Detail |
|---|---|
| Twilio integration | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM` env vars |
| SMS opt-in at booking | Checkbox on booking form (default opt-in) |
| 24h + 1h SMS reminders | Parallel to email reminders in existing cron |
| Invitee phone required | Uses `requirePhone` flag already on `EventType` |

**Files to modify:**
- `backend/src/services/sms.service.ts` (new)
- `backend/src/jobs/CronManager.ts` — add SMS to reminder job
- `frontend/src/components/scheduling/BookingWidget.jsx` — SMS opt-in checkbox

---

## Phase 3 — Team Scheduling

> **Goal:** distribute bookings across staff; let invitees pick who they meet.

### 3A — Round-Robin Assignment

| Item | Detail |
|---|---|
| Team event type | `EventType.assignmentStrategy: ROUND_ROBIN | COLLECTIVE | HOST_PICK` |
| Member pool | `EventTypeTeamMember` join table (eventTypeId, userId, weight) |
| Slot generation | Union of all members' availability; assigned to next-in-rotation member |
| Rotation state | `lastAssignedMemberId` on event type, incremented on each booking |
| Booking shows assigned host | Invitee sees host name + avatar on confirmation |

### 3B — Collective Availability

| Item | Detail |
|---|---|
| All-team event | Slot only shown if ALL team members are free at that time |
| Availability intersection | Slot generator intersects each member's schedule |
| Invitee sees all hosts on page | Sidebar shows all team members who will attend |

### 3C — Load Balancing

| Item | Detail |
|---|---|
| Fewest-bookings-first | When distributing, prefer member with fewest active bookings this week |
| Weight-based distribution | Admin can set a weight (e.g. 2× for senior staff) |
| Dashboard | Admin sees per-member booking count and utilization % |

### 3D — Host Selection on Booking Page

| Item | Detail |
|---|---|
| "Pick your consultant" step | Optional step on booking page to choose a specific team member |
| Per-member availability | Slot grid updates based on selected member |
| Skip option | "No preference" falls back to round-robin |

**Files to create/modify (Phase 3 overall):**
- `backend/prisma/schema.prisma` — add `assignmentStrategy`, `EventTypeTeamMember`, `lastAssignedMemberId`
- `backend/src/services/availability.service.ts` — multi-member slot intersection
- `backend/src/services/scheduling.service.ts` — assignment logic
- `frontend/src/components/scheduling/BookingWidget.jsx` — host picker step
- `frontend/src/pages/admin/TeamScheduling.jsx`

---

## Phase 4 — Analytics & Admin

> **Goal:** give hosts the data to improve their scheduling operation.

### 4A — Booking Analytics Dashboard

| Item | Detail |
|---|---|
| Metrics | Total bookings, no-show rate, cancellation rate, reschedule rate |
| Time series charts | Bookings per day/week/month |
| Busiest days/times heatmap | 7-day × 24-hour grid coloured by booking volume |
| Per-event-type breakdown | Metrics filtered by event type |
| Invitee geography | Timezone distribution of invitees |

### 4B — CSV Export

| Item | Detail |
|---|---|
| Export bookings | Date range + status filter → `.csv` download |
| Export invitees | Full invitee list with all fields + custom question responses |

### 4C — Audit Log

| Item | Detail |
|---|---|
| Events logged | booking.created, booking.cancelled, booking.rescheduled, event_type.updated, availability.updated |
| Actor + timestamp | Who did what and when |
| Admin view | Filterable log table in admin dashboard |

**Files to create:**
- `backend/src/routes/scheduling/analytics.ts`
- `backend/prisma/schema.prisma` — add `AuditLog` model
- `frontend/src/pages/admin/SchedulingAnalytics.jsx`

---

## Phase 5 — Integrations

> **Goal:** connect the scheduling system to the tools teams already use.

### 5A — Zoom / Google Meet Auto-Create

| Item | Detail |
|---|---|
| Zoom OAuth | On booking, create Zoom meeting via API; store `joinUrl` |
| Google Meet | Requires Google Calendar integration (Phase 1A) — meeting created alongside GCal event |
| Per-event-type config | Host selects video provider on event type settings |
| Jitsi remains default | If no provider is connected, Jitsi is the fallback |

### 5B — HubSpot / Salesforce Sync

| Item | Detail |
|---|---|
| Contact sync | On booking, create or update CRM contact with invitee data |
| Activity log | Log booking as a CRM activity/deal stage update |
| OAuth setup per org | Admin connects CRM account in Settings |

### 5C — Zapier / Make Webhook

| Item | Detail |
|---|---|
| Native Zapier app | Triggers: new booking, cancellation, reschedule |
| Generic webhook (Phase 2D) | Covers Make, n8n, and any other automation platform |

### 5D — Custom Domain

| Item | Detail |
|---|---|
| `book.yourdomain.com` | CNAME → Kangqore platform |
| SSL provisioning | Let's Encrypt via ACME on custom domain |
| White-label booking page | Host logo, brand colours, no Kangqore branding |

---

## Effort & Priority Matrix

| Phase | Complexity | Business Impact | Ships in |
|---|---|---|---|
| 1A — Calendar sync | High | Critical (blocks double-booking) | ~2 weeks |
| 1B — Multi-duration | Low | High | ~2 days |
| 1C — Accept-invite page | Low | Medium | ~1 day |
| 1D — Embed widget | Medium | High (distribution) | ~1 week |
| 1E — Confirmation page | Low | Medium | ~1 day |
| 2A — Stripe payments | Medium | High (revenue) | ~1 week |
| 2B — Email templates | Medium | Medium | ~1 week |
| 2C — Workflow builder | High | High | ~2 weeks |
| 2D — Webhooks | Medium | High (integrations) | ~1 week |
| 2E — SMS reminders | Low | Medium | ~2 days |
| 3A — Round-robin | High | High (team use) | ~2 weeks |
| 3B — Collective availability | Medium | Medium | ~1 week |
| 3C — Load balancing | Medium | Medium | ~1 week |
| 3D — Host picker | Low | Medium | ~2 days |
| 4A — Analytics dashboard | Medium | High | ~1 week |
| 4B — CSV export | Low | Medium | ~1 day |
| 4C — Audit log | Low | Low-Medium | ~2 days |
| 5A — Zoom / Meet | Medium | High | ~1 week |
| 5B — HubSpot / Salesforce | High | Medium-High | ~2 weeks |
| 5C — Zapier | Low | Medium | ~2 days |
| 5D — Custom domain | High | Low-Medium | ~2 weeks |

---

## Sequencing Rule

> Build Phase 1 before Phase 2. Build Phase 2 before Phase 3.
> Phases 4 and 5 can run in parallel with Phase 3.
> Within a phase, items labelled Low complexity should ship first to build momentum.

---

_Owner: Kangqore Engineering · Status: Planning_
