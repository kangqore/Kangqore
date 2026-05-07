# Technology Stack - Approved Technologies

> [!IMPORTANT]
> This document defines the **ONLY** approved technologies for Kangqore. Using unapproved technologies requires formal Architecture Review Board approval.

---

## 📦 Stack Overview

| Layer | Primary Technology | Version | Status |
|-------|-------------------|---------|--------|
| **Frontend** | React | 18+ | ✅ Approved |
| **Core Backend** | Node.js + TypeScript | 20+ | ✅ Approved |
| **Intelligence Layer** | Python | 3.11+ | ✅ Approved |
| **Database** | PostgreSQL | 15+ | ✅ Approved |
| **ORM** | Prisma | 5+ | ✅ Approved |
| **Containerization** | Docker | 24+ | ✅ Approved |
| **Orchestration** | Docker Compose | 2.0+ | ✅ Approved |

---

## 🎨 Frontend Stack (React)

### ✅ Approved Core Technologies

| Technology | Version | Purpose | Mandatory |
|-----------|---------|---------|-----------|
| **React** | ^18.0 | UI Framework | ✅ Yes |
| **React Router** | ^6.0 | Client-side routing | ✅ Yes |
| **Axios** | Latest | HTTP client | ✅ Yes |
| **Vite** | Latest | Build tool | ✅ Yes |

### ✅ Approved State Management
- **React Context API** - For simple global state
- **React useState/useReducer** - For component state
- **Redux Toolkit** - ⚠️ Only for complex applications (requires approval)

### ✅ Approved UI Libraries
- **React Icons** - Icon library
- **Tailwind CSS** - Utility-first CSS (if needed)
- **React Hook Form** - Form validation
- **React Toastify** - Notifications

### ❌ Forbidden Frontend Technologies
- **Next.js** - Use React SPA only
- **Vue.js / Angular** - Use React only
- **jQuery** - Deprecated
- **Any backend logic in Frontend** - Violates architecture

### 📋 Frontend Dependencies Template
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
```

---

## 🟢 Core Backend Stack (Node.js)

### ✅ Approved Core Technologies

| Technology | Version | Purpose | Mandatory |
|-----------|---------|---------|-----------|
| **Node.js** | 20+ LTS | Runtime | ✅ Yes |
| **TypeScript** | ^5.0 | Type safety | ✅ Yes |
| **Express** | ^4.18 | Web framework | ✅ Yes |
| **Prisma** | ^5.0 | ORM | ✅ Yes |
| **PostgreSQL Client** | via Prisma | Database driver | ✅ Yes |

### ✅ Approved Authentication & Security
- **jsonwebtoken** - JWT generation/validation
- **bcryptjs** - Password hashing
- **helmet** - Security headers
- **cors** - CORS management
- **express-rate-limit** - Rate limiting

### ✅ Approved Utilities
- **dotenv** - Environment variables
- **joi** or **zod** - Input validation
- **winston** - Logging
- **axios** - HTTP client (for Intelligence Layer calls)

### ❌ Forbidden Backend Technologies
- **Python** for Core Backend - Use Python only for Intelligence Layer
- **MongoDB** - Use PostgreSQL only
- **Sequelize** - Use Prisma only
- **Mongoose** - PostgreSQL only, no MongoDB
- **GraphQL** - REST only (unless approved)

### 📋 Core Backend Dependencies Template
```json
{
  "dependencies": {
    "@prisma/client": "^5.8.0",
    "express": "^4.18.2",
    "typescript": "^5.3.3",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1",
    "axios": "^1.6.5",
    "zod": "^3.22.4",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.6",
    "prisma": "^5.8.0",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.2"
  }
}
```

---

## 🐍 Intelligence Layer Stack (Python)

### ✅ Approved Core Technologies

| Technology | Version | Purpose | Mandatory |
|-----------|---------|---------|-----------|
| **Python** | 3.11+ | Runtime | ✅ Yes |
| **FastAPI** | ^0.108 | Web framework | ✅ Yes |
| **Uvicorn** | Latest | ASGI server | ✅ Yes |
| **Pydantic** | ^2.0 | Data validation | ✅ Yes |

### ✅ Approved Data & Analytics Libraries
- **Pandas** - Data manipulation
- **NumPy** - Numerical computing
- **Scikit-learn** - Machine learning
- **Matplotlib / Plotly** - Data visualization (if needed)
- **Requests** - HTTP client

### ✅ Approved ML/AI Libraries (with approval)
- **TensorFlow** - Deep learning (requires justification)
- **PyTorch** - Deep learning (requires justification)
- **Transformers** - NLP (requires justification)

### ❌ Forbidden Intelligence Layer Technologies
- **Flask** - Use FastAPI only
- **Django** - Use FastAPI only
- **Any authentication libraries** - Auth belongs in Node.js
- **SQLAlchemy** - Intelligence Layer should not write to DB

### 📋 Intelligence Layer Dependencies Template
```txt
fastapi==0.108.0
uvicorn[standard]==0.25.0
pydantic==2.5.0
pandas==2.1.4
numpy==1.26.2
scikit-learn==1.3.2
requests==2.31.0
python-dotenv==1.0.0
```

---

## 🗄️ Database Stack

### ✅ Approved Database
- **PostgreSQL 15+** - ONLY approved RDBMS

### ✅ Approved Database Tools
- **Prisma ORM** - Database access from Node.js
- **pg_dump / pg_restore** - Backup/restore
- **pgAdmin** - Database administration (local dev)

### ❌ Forbidden Database Technologies
- **MySQL** - Use PostgreSQL
- **MongoDB** - Use PostgreSQL
- **SQLite** - Use PostgreSQL (even for local dev)
- **Redis** - ⚠️ Requires approval for caching use cases

---

## 🐳 DevOps & Deployment Stack

### ✅ Approved Containerization
- **Docker** (24+)
- **Docker Compose** (2.0+)

### ✅ Approved CI/CD (when implemented)
- **GitHub Actions** - Preferred
- **GitLab CI** - Approved alternative

### ✅ Approved Hosting (Production)
- **AWS** (ECS, RDS, S3) - Preferred
- **DigitalOcean** - Approved alternative
- **Google Cloud** - Requires approval

### ❌ Forbidden Deployment Tools
- **Heroku** - Insufficient control
- **Vercel** - Frontend-only deployments not allowed (violates architecture)

---

## 🧪 Testing Stack

### ✅ Approved Testing Frameworks

**Frontend**:
- **Vitest** - Unit testing
- **React Testing Library** - Component testing

**Core Backend**:
- **Jest** - Unit/integration testing
- **Supertest** - API testing

**Intelligence Layer**:
- **pytest** - Unit/integration testing

---

## 🛠️ Development Tools

### ✅ Approved IDEs & Editors
- **Visual Studio Code** - Recommended
- **WebStorm** - Approved
- **PyCharm** - Approved for Intelligence Layer

### ✅ Approved Version Control
- **Git** - ONLY approved VCS
- **GitHub** / **GitLab** - Repository hosting

### ✅ Approved Code Quality Tools
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **Black** - Python code formatting
- **Pylint** - Python linting
- **TypeScript** - Type checking

---

## 📌 Technology Addition Process

### To Add a New Technology:
1. **Document Justification**
   - Why is it needed?
   - What problem does it solve?
   - Why can't existing stack handle it?

2. **Security Review**
   - Is it actively maintained?
   - Any known vulnerabilities?
   - License compatibility?

3. **Architecture Review**
   - Does it fit the mental model?
   - Any boundary violations?

4. **Get Approval**
   - Submit to Architecture Review Board
   - Wait for written approval
   - Update this document

### ❌ Unauthorized Technology = Deployment Rejected

---

## 🔄 Stack Update Policy

### Patch Updates (e.g., 5.8.0 → 5.8.1)
- **Auto-approved** for security patches
- Update within 1 week of release

### Minor Updates (e.g., 5.8.0 → 5.9.0)
- **Review required**
- Test before deploying to production

### Major Updates (e.g., 5.8.0 → 6.0.0)
- **Full approval required**
- Requires testing plan
- Gradual rollout strategy

---

## 📊 Current Stack Versions (as of 2026-01-08)

```yaml
frontend:
  react: "^18.2.0"
  node: "20+"
  
core-backend:
  node: "20.10.0"
  typescript: "^5.3.3"
  express: "^4.18.2"
  prisma: "^5.8.0"
  
intelligence-layer:
  python: "3.11.7"
  fastapi: "0.108.0"
  pandas: "2.1.4"
  
database:
  postgresql: "15"
  
infrastructure:
  docker: "24.0+"
  docker-compose: "2.23+"
```

---

**Last Updated**: 2026-01-08  
**Authority**: Architecture Review Board  
**Status**: MANDATORY - Deviations require formal approval
