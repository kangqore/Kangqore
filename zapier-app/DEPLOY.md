# Kangqore Zapier App — Deployment Guide

## What this is

A Zapier integration that lets users trigger automations from Kangqore scheduling events
without needing to configure webhooks manually. Built on Zapier's REST Hooks pattern —
subscriptions are stored as `Webhook` records in the Kangqore database.

## Triggers

| Trigger | Fires when |
|---|---|
| **New Booking** | An invitee books a consultation |
| **Cancelled Booking** | A booking is cancelled by host or invitee |
| **Rescheduled Booking** | A booking is moved to a new time |
| **No-Show** | A host marks an invitee as a no-show |

## Local development

```bash
cd zapier-app
npm install

# Copy and fill in your local credentials
cp .env.example .env   # then edit .env

# Run tests against your local backend
npm test
```

## One-time setup (requires Zapier partner account)

1. Create a Zapier developer account at https://developer.zapier.com
2. Install the Zapier CLI globally:
   ```bash
   npm install -g zapier-platform-cli
   ```
3. Log in:
   ```bash
   zapier login
   ```
4. Register the app (first time only):
   ```bash
   cd zapier-app
   zapier register "Kangqore"
   ```
   Zapier will assign an `id` — paste it into `.zapierapprc`.

## Deploy / update

```bash
cd zapier-app
npm install
zapier push          # deploys a new version
zapier promote <v>   # promotes a version to production
```

## Testing in Zapier UI

After `zapier push`:
- Go to https://zapier.com/app/zaps/new
- Search for "Kangqore" (appears in your private apps)
- Connect with an API key from `/dashboard/settings`
- Pick a trigger and map fields

## Authentication

Users authenticate with their Kangqore **API key** (`X-Api-Key` header).
Keys are tied to a user's `customId` in the `users` table.

## Backend endpoints (already live)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/scheduling/zapier/subscribe` | Register hook |
| `DELETE` | `/api/scheduling/zapier/subscribe` | Unregister hook |
| `GET` | `/api/scheduling/zapier/sample/:event` | Sample payload |
| `GET` | `/api/scheduling/zapier/events` | List supported events |
