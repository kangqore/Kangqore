# System Architecture - Mental Model & Boundaries

> [!IMPORTANT]
> This document defines the **mental model** that drives all architectural decisions in Kangqore. Any deviation from these principles requires explicit approval from the Architecture Review Board.

## 🎯 Core Mental Model

Kangqore follows a **Dual-Backend Architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│                        KANGQORE SYSTEM                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐                                          │
│  │   Frontend       │    User Interface Layer                  │
│  │   (React)        │    • Single Page Application             │
│  │   Port: 3000     │    • User Interactions                   │
│  └────────┬─────────┘    • UI State Management                 │
│           │                                                     │
│           │ HTTP/REST (ONLY)                                   │
│           ▼                                                     │
│  ┌──────────────────┐                                          │
│  │   Core Backend   │    Product Engine (Node.js)              │
│  │   (Node.js)      │    • Authentication & Authorization      │
│  │   Port: 3000     │    • Business Logic                      │
│  └────────┬─────────┘    • Data Persistence (PostgreSQL)       │
│           │               • CMS Operations                      │
│           │               • API Gateway                         │
│           │                                                     │
│           │ HTTP/REST (Internal)                               │
│           ▼                                                     │
│  ┌──────────────────┐                                          │
│  │ Intelligence     │    AI/ML Engine (Python)                 │
│  │ Layer (Python)   │    • Analytics & Insights                │
│  │ Port: 8000       │    • ML Computations                     │
│  └──────────────────┘    • Recommendations                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🧱 System Boundaries

### 1. Frontend Layer
**Technology**: React  
**Port**: 3000 (development), 5500 (alternate)  
**Responsibility**: User Interface Only

#### What Frontend MUST Do:
- Render UI components
- Handle user interactions
- Maintain UI state (React state, Context API)
- Make HTTP requests to Core Backend
- Display data from API responses
- Client-side routing

#### What Frontend MUST NOT Do:
- **Never** call Intelligence Layer directly
- **Never** contain business logic
- **Never** access database directly
- **Never** implement authentication logic (only store/send tokens)
- **Never** perform data transformations beyond display formatting

---

### 2. Core Backend (Product Engine)
**Technology**: Node.js + TypeScript + Express + Prisma  
**Port**: 3000  
**Database**: PostgreSQL  
**Responsibility**: Application Core

#### What Core Backend MUST Do:
- **Own** all authentication & authorization (JWT)
- **Own** all business logic
- **Own** all database interactions (via Prisma ORM)
- Expose RESTful APIs to Frontend
- Proxy "insight/analytics" requests to Intelligence Layer
- Handle file uploads and CMS operations
- Implement all CRUD operations
- Validate all user inputs
- Enforce data integrity rules

#### What Core Backend MUST NOT Do:
- **Never** implement ML/AI logic
- **Never** perform heavy computational analytics
- **Never** use libraries like Pandas, NumPy, Scikit-learn
- **Never** expose Intelligence Layer URLs to Frontend

---

### 3. Intelligence Layer (AI/ML Engine)
**Technology**: Python + FastAPI + Pandas + NumPy + Scikit-learn  
**Port**: 8000  
**Responsibility**: Intelligence Operations

#### What Intelligence Layer MUST Do:
- Compute analytics and insights
- Run ML models and predictions
- Aggregate large datasets
- Generate recommendations
- Perform statistical analysis

#### What Intelligence Layer MUST NOT Do:
- **Never** accept requests from Frontend directly
- **Never** manage authentication (trusts Core Backend)
- **Never** persist data to database (read-only or return results)
- **Never** implement business rules
- **Never** handle file uploads

---

## 🔒 Boundary Enforcement Rules

### Rule 1: Single Entry Point
**Mandate**: Frontend communicates ONLY with Core Backend (Port 3001).

```
✅ ALLOWED:   Frontend → Core Backend
❌ FORBIDDEN: Frontend → Intelligence Layer
❌ FORBIDDEN: Frontend → Database
```

### Rule 2: Intelligence Proxy Pattern
**Mandate**: All AI/ML requests are proxied through Core Backend.

```javascript
// ✅ CORRECT Pattern (in Core Backend)
app.get('/api/dashboard/insights', authenticate, async (req, res) => {
  const userId = req.user.id;
  
  // Fetch user context from DB
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  // Proxy to Intelligence Layer with enriched context
  const insights = await axios.get(`${PYTHON_SERVICE_URL}/analytics/insights`, {
    params: { userId, userRole: user.role }
  });
  
  res.json(insights.data);
});
```

### Rule 3: Data Ownership
**Mandate**: Only Core Backend writes to the database.

- **Core Backend**: Full CRUD access
- **Intelligence Layer**: Read-only (or no direct access, receives data as parameters)
- **Frontend**: No database access

### Rule 4: Authentication Boundary
**Mandate**: Authentication happens ONLY in Core Backend.

- Frontend sends JWT token in `Authorization` header
- Core Backend validates token before processing requests
- Intelligence Layer **trusts** Core Backend (no token validation)

---

## 📋 Data Flow Examples

### Example 1: User Login
```
1. Frontend → POST /api/auth/login → Core Backend
2. Core Backend validates credentials (check DB)
3. Core Backend generates JWT token
4. Core Backend ← Returns {token, user} ← Frontend
```

### Example 2: Fetch Dashboard Insights
```
1. Frontend → GET /api/dashboard/insights (with JWT) → Core Backend
2. Core Backend validates JWT
3. Core Backend → GET /analytics/insights?userId=123 → Intelligence Layer
4. Intelligence Layer computes insights
5. Intelligence Layer ← Returns insights ← Core Backend
6. Core Backend ← Returns insights ← Frontend
```

### Example 3: Create Content (CMS)
```
1. Frontend → POST /api/admin/content (with JWT + data) → Core Backend
2. Core Backend validates JWT + permissions
3. Core Backend validates input data
4. Core Backend saves to PostgreSQL (via Prisma)
5. Core Backend ← Returns created content ← Frontend
```

---

## 🚫 Anti-Patterns & Violations

### ❌ VIOLATION 1: Frontend Calling Python Directly
```javascript
// ❌ NEVER DO THIS
axios.get('http://localhost:8000/analytics/insights')
```

### ❌ VIOLATION 2: Intelligence Layer Managing Auth
```python
# ❌ NEVER DO THIS in Intelligence Layer
@app.get("/insights")
def get_insights(token: str):
    user = verify_jwt(token)  # AUTH LOGIC BELONGS IN NODE.JS
    ...
```

### ❌ VIOLATION 3: Frontend Business Logic
```javascript
// ❌ NEVER DO THIS
function calculateDiscount(user, product) {
  // Business logic belongs in Core Backend
  if (user.isPremium && product.price > 100) {
    return product.price * 0.2;
  }
}
```

---

## 🎓 Mental Model Summary

Think of the system as:
- **Frontend** = The face that users see
- **Core Backend** = The brain that makes decisions
- **Intelligence Layer** = The specialized analyst who provides insights when asked

**Communication Flow**:
```
User talks to Face → Face asks Brain → Brain consults Analyst → Analyst gives answer → Brain decides → Face shows result
```

---

## 📏 Architectural Principles

1. **Separation of Concerns**: Each layer has ONE job
2. **Single Source of Truth**: Core Backend owns application state
3. **Defense in Depth**: Security at every layer
4. **Fail Securely**: Default to denying access
5. **Explicit Over Implicit**: No hidden dependencies
6. **Stateless Services**: Intelligence Layer has no session state

---

## ✅ Compliance Checklist

Before deploying any feature:
- [ ] Frontend only calls Core Backend APIs
- [ ] Authentication happens in Core Backend
- [ ] Intelligence Layer has no direct Frontend exposure
- [ ] Business logic resides in Core Backend
- [ ] Database writes happen only in Core Backend
- [ ] All boundaries are respected

---

**Last Updated**: 2026-01-08  
**Authority**: Architecture Review Board  
**Status**: MANDATORY - No Exceptions
