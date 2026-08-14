# Kangqore

Kangqore is an enterprise AI operating system built for professional services firms. It combines a full-stack work management platform with a native AI brain — **WAANDA** (commercial) / **KIMMP** (engineering) — that reasons over live business data to surface insights, generate recommendations, and execute actions autonomously under governance control.

---

## What it is

Kangqore is not a workflow tool or a dashboard. It is an operating environment — every authenticated route lives under `/kangqore-view/*` — where AI and human work happen in the same space. The platform replaces fragmented point solutions (CRM, PMO, HR, finance, governance) with a single ontology-backed data layer that the AI brain can read, reason over, and act on.

---

## Core systems

### WAANDA / KIMMP — The AI Brain

The intelligence engine powering every AI interaction across the platform. WAANDA is the commercial identity; KIMMP is the engineering runtime. All AI calls route through KIMMP's unified gateway, which enforces token budgets, logs every LLM call, and applies AEGIS governance before any action executes.

- **WAANDAx** — local Llama 3.2-3B (via MLX) for low-latency reasoning; Claude (Anthropic) as the primary engine; Gen5 Foundation Model in training
- **WAANDA Studio** → **WAANDA OS Engine** → **KIMMP Runtime** — the full execution stack
- **WVIS (WAANDA Graph)** — visual intelligence canvas: 11 intelligence node types, 7 operational node types, dependency mapping, AI explain drawer

### AEGIS — Governance & Security Layer

Sits above KIMMP. Every AI action passes through AEGIS before execution.

- **OntologyGateway** — 4-stage pipeline: data marking → policy check → cardinality enforcement → commit
- **CardinalityEngine** — enforces ONE_TO_ONE / ONE_TO_MANY / MANY_TO_ONE / MANY_TO_MANY relationship rules
- **PendingApproval** — human-in-the-loop gate; high-risk actions physically cannot bypass it
- **AEGIS Compliance Suite** — 12 adversarial tests covering boundary checks, bypass attempts, and approval flows

### Intelligence OS — 4-Layer Enterprise Brain

Layered signal-to-action pipeline running over live platform data:

| Layer | Name | What it answers |
| ----- | ---- | --------------- |
| 1 | Descriptive | What is happening right now? |
| 2 | Predictive | What will happen? (sigmoid velocity model, churn probability) |
| 3 | Prescriptive | What should we do? (ranked, one-click executable recommendations) |
| 4 | Autonomous | Do it — full Reason → Propose → Govern → Approve → Execute → Learn loop |

### BIDS™ — Business Intelligence & Diagnostic System

16-pillar diagnostic framework for assessing and improving client organisations. Delivered as structured engagements with scored pillars, prescribed actions, and AI-generated reports. Available in vertical editions (ARIA for HealthTech, LEX for LegalTech, FINX for FinTech).

### Work OS

Ontology-backed work management — every `WorkItem` is an `OntologyObject` with typed enterprise relationships. Nine views: Board, Table, Timeline, Dependency Graph, Workload, Goals, Portfolio, Executive Command Center, Automations.

### Ontology Engine

Universal schema layer. Every business object (Project, Client, StaffMember, Decision, Risk, etc.) is an `OntologyObject` with typed relationships. The ontology is the single source of truth the AI reads from and writes to.

---

## Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                    Kangqore OS                          │
│              (/kangqore-view/admin/*)                   │
├──────────────┬──────────────┬──────────────┬────────────┤
│  Work OS     │  Intelligence│  WAANDA      │  Ontology  │
│  (WorkItems) │  OS (4 layers│  Studio      │  Engine    │
│              │  )           │              │            │
├──────────────┴──────────────┴──────────────┴────────────┤
│                  KIMMP Runtime                          │
│   MissionDispatcher · Action Engine · Prompt Registry   │
├─────────────────────────────────────────────────────────┤
│                  AEGIS Layer                            │
│   Gateway · Cardinality · Policy · Approval Gate        │
├─────────────────────────────────────────────────────────┤
│              Data Layer (Prisma + PostgreSQL)            │
│      pgvector HNSW index · Redis · BullMQ queues        │
└─────────────────────────────────────────────────────────┘
```

---

## Tech stack

### Backend

- Node.js ≥ 22, TypeScript, Express
- Prisma ORM → PostgreSQL 15 with pgvector extension
- Redis 7 + BullMQ for async queues
- Anthropic SDK (Claude), local MLX server (WAANDAx)
- Passport.js — local, Google, LinkedIn, Apple, SAML/SSO
- Socket.io for real-time

### Frontend

- React 18, Vite, TypeScript
- TailwindCSS, Radix UI, Framer Motion
- TanStack Query v5 for data fetching
- Phosphor Icons, Lucide React

### Infrastructure

- Docker Compose (backend + Postgres + Redis)
- GitHub Actions CI — build, audit gates, redirect checks, sitemap validation
- Nginx reverse proxy

---

## Repository structure

```text
Kangqore/
├── backend/              Express API + Prisma schema
│   ├── prisma/           schema.prisma + seed scripts
│   └── src/
│       ├── routes/       REST API routes
│       ├── services/     Business logic
│       ├── kangqore-aegis/   AEGIS governance layer
│       ├── kangqore-immp/    KIMMP AI runtime
│       └── waanda/       WAANDA bootstrap + router
├── frontend/             React app (Vite)
│   └── src/
│       ├── os/           Kangqore OS modules (authenticated)
│       │   ├── features/ One directory per OS module
│       │   └── lib/      Shared OS utilities + nav config
│       └── components/   Public-facing components
├── intelligence-layer/   Python services (embeddings, ML)
├── sdk/                  TypeScript SDK for platform API
├── scripts/              CI audit scripts
├── shared/               Shared data (service index, redirects)
└── docker-compose.yml
```

---

## Local development

**Prerequisites:** Node.js ≥ 22, Docker, npm

```bash
# Start the database and Redis
docker compose up -d

# Backend
cd backend
npm install
npx prisma db push
npm run dev          # runs on :3000

# Frontend (separate terminal)
cd frontend
npm install
npm run dev          # runs on :3001
```

The OS is accessible at `http://localhost:3001/kangqore-view/admin`.

See [LOCAL_SETUP_GUIDE.md](LOCAL_SETUP_GUIDE.md) for environment variables and seed accounts.

---

## CI gates

Every PR runs the full `Production Build & Test` workflow:

- Redirect mirror sync check
- Sitemap drift check
- SEO data completeness audit
- Legacy URL coverage audit
- Page-source SEO surface audit
- Copy consistency audit (US spelling, numeric claims)
- Design token audit (type scale ≥ 11px, section rhythm)
- Backend TypeScript build
- Frontend Vite build
- Legacy redirect smoke tests
- Data architecture invariants

---

## Security

See [SECURITY.md](SECURITY.md) for the vulnerability disclosure policy.
