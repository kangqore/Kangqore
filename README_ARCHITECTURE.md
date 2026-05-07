# Kangqore Backend Architecture

## Final Architecture Overview

This repository implements a dual-backend architecture following the separation of concerns principle:

```
┌─────────────────┐    HTTP/REST     ┌──────────────────────┐
│   Frontend      │ ───────────────► │   Node.js Core       │
│   (React/Vue)   │                  │   Backend            │
│                 │ ◄────────────── │   (Product Engine)   │
│                 │                  │   Port: 3001         │
└─────────────────┘                  └──────────────────────┘
                                             │
                                             │ HTTP/REST
                                             ▼
                                   ┌──────────────────────┐
                                   │   Python Intelligence│
                                   │   Layer              │
                                   │   (AI/ML Engine)     │
                                   │   Port: 8000         │
                                   └──────────────────────┘
```

## 🔷 Core Backend — Node.js (Product Engine)

**Port**: 3001  
**Technology**: Node.js + TypeScript + Express + PostgreSQL + Prisma

### Responsibilities
- **Authentication & Authorization** - JWT-based user management
- **Frontend APIs** - All client-facing endpoints
- **Business Logic** - Core application workflows
- **CMS Operations** - Content management and media handling
- **Database Operations** - PostgreSQL via Prisma ORM
- **Intelligence Proxy** - Proxies "Insight" requests to Python layer

### API Endpoints
```
POST /api/auth/login
POST /api/auth/register

GET /api/dashboard/insights (Proxies to Python)
GET /api/dashboard/admin/stats

GET /api/admin/content (CMS CRUD)
POST /api/admin/content
```

## 🟣 Intelligence Layer — Python (AI/ML Engine)

**Port**: 8000  
**Technology**: Python + FastAPI + Pandas + NumPy + Scikit-learn

### Responsibilities
- **Analytics Aggregation**
- **Insights Computation**
- **ML Experiments**
- **Recommendations**

**Rule**: This service is called ONLY by Node.js, never by the Frontend directly.

## 🚀 Deployment

### Development Setup
```bash
# Start Docker (Postgres, Core Backend, Intelligence Layer)
docker-compose up -d

# Frontend
cd frontend
npm start
``` 
