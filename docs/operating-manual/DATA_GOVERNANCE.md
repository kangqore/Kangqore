# Data Governance - Database Ownership & Access Rules

> [!IMPORTANT]
> This document establishes **strict rules** for database access, ownership, and data management. Violations compromise system integrity and security.

---

## 🎯 Core Data Principles

1. **Single Source of Truth**: PostgreSQL is the ONLY persistent data store
2. **Node.js Owns Data**: Only Core Backend can write to the database
3. **Prisma as ORM**: All database access via Prisma (no raw SQL except migrations)
4. **Schema as Contract**: Database schema is the source of truth
5. **Zero Direct Access**: No direct database connections from Frontend or Intelligence Layer

---

## 🗄️ Database Architecture

### Current Database Setup

**Database**: PostgreSQL 15+  
**Schema**: `kangqore_core`  
**User**: `kangqore_user`  
**Port**: 5432 (Docker internal), mapped externally for development  
**ORM**: Prisma 5+

### Database Ownership Matrix

| Component | Read Access | Write Access | Method |
|-----------|-------------|--------------|--------|
| **Core Backend (Node.js)** | ✅ Full | ✅ Full | Prisma ORM |
| **Intelligence Layer (Python)** | ⚠️ Limited (via API) | ❌ None | HTTP requests to Node.js |
| **Frontend (React)** | ❌ None | ❌ None | HTTP requests to Node.js |
| **Admin Tools (pgAdmin)** | ✅ Full (Dev only) | ⚠️ Manual (Dev only) | Direct connection |

---

## 🔒 Access Control Rules

### Rule 1: Core Backend Owns All Writes
**Mandate**: ONLY Node.js Core Backend can INSERT, UPDATE, DELETE in the database.

```typescript
// ✅ CORRECT: Write in Core Backend
app.post('/api/users', async (req, res) => {
  const user = await prisma.user.create({
    data: {
      email: req.body.email,
      passwordHash: await bcrypt.hash(req.body.password, 10)
    }
  });
  res.json(user);
});
```

```python
# ❌ FORBIDDEN: Write in Intelligence Layer
# DO NOT DO THIS
def create_user(email: str, password: str):
    # NO DATABASE WRITES FROM PYTHON
    db.execute("INSERT INTO users ...")
```

### Rule 2: Intelligence Layer Gets Data via API
**Mandate**: Python does NOT connect to database directly. It receives data from Node.js.

```typescript
// ✅ CORRECT: Node.js sends data to Python
app.get('/api/analytics/compute', async (req, res) => {
  // Fetch data from DB
  const users = await prisma.user.findMany({
    include: { orders: true }
  });
  
  // Send to Python for analysis
  const analytics = await axios.post(`${PYTHON_SERVICE_URL}/analytics/process`, {
    users: users
  });
  
  res.json(analytics.data);
});
```

```python
# ✅ CORRECT: Python receives data, doesn't query DB
@app.post("/analytics/process")
def process_analytics(request: AnalyticsRequest):
    users = request.users  # Data comes from Node.js
    # Perform analysis
    return {"insights": compute_insights(users)}
```

### Rule 3: Frontend Never Touches Database
**Mandate**: Frontend makes HTTP requests to Core Backend. NO direct database access.

```javascript
// ✅ CORRECT: API call
axios.get('/api/users').then(response => {
  setUsers(response.data);
});

// ❌ FORBIDDEN: Direct database access
// const db = new PostgresClient(); // NEVER DO THIS
```

---

## 📋 Database Schema Management

### Schema Ownership
**Owner**: Core Backend Team  
**Tool**: Prisma Migrate  
**Process**: All schema changes go through migration files

### Schema Change Process

#### Step 1: Define Schema in Prisma
```prisma
// prisma/schema.prisma
model User {
  id            Int       @id @default(autoincrement())
  email         String    @unique
  passwordHash  String
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  orders        Order[]
  
  @@index([email])
}

enum Role {
  USER
  ADMIN
  MODERATOR
}
```

#### Step 2: Create Migration
```bash
cd core-backend
npx prisma migrate dev --name add_user_role
```

#### Step 3: Review Generated Migration
```sql
-- migrations/20260108_add_user_role/migration.sql
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'MODERATOR');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "role" "Role" NOT NULL DEFAULT 'USER';
```

#### Step 4: Apply to Production
```bash
npx prisma migrate deploy
```

### Migration Best Practices

✅ **DO**:
- Create migration for every schema change
- Use descriptive migration names
- Test migrations in development first
- Review generated SQL before deploying
- Back up database before production migrations

❌ **DON'T**:
- Make manual schema changes in production
- Skip migrations and modify schema directly
- Delete old migrations
- Edit applied migrations
- Use raw SQL without migration files (except for complex operations)

---

## 🗂️ Data Models & Relationships

### Core Entities

```prisma
// User Management
model User {
  id            Int       @id @default(autoincrement())
  email         String    @unique
  passwordHash  String
  name          String?
  role          Role      @default(USER)
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  sessions      Session[]
  orders        Order[]
  
  @@index([email])
  @@map("users")
}

// Authentication
model Session {
  id            String    @id @default(uuid())
  userId        Int
  token         String    @unique
  expiresAt     DateTime
  createdAt     DateTime  @default(now())
  
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([token])
  @@map("sessions")
}

// Content Management
model Content {
  id            Int       @id @default(autoincrement())
  title         String
  body          String
  authorId      Int
  status        ContentStatus @default(DRAFT)
  publishedAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  author        User      @relation(fields: [authorId], references: [id])
  
  @@index([authorId])
  @@index([status])
  @@map("content")
}

enum ContentStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

---

## 🔐 Data Security Rules

### Rule 1: Never Expose Sensitive Fields
```typescript
// ❌ WRONG: Exposing password hash
app.get('/api/users/:id', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) }
  });
  res.json(user); // Includes passwordHash!
});

// ✅ CORRECT: Exclude sensitive fields
app.get('/api/users/:id', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      // passwordHash NOT included
    }
  });
  res.json(user);
});
```

### Rule 2: Validate All Inputs
```typescript
// ✅ CORRECT: Input validation
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional()
});

app.post('/api/users', async (req, res) => {
  try {
    const validated = createUserSchema.parse(req.body);
    
    const user = await prisma.user.create({
      data: {
        email: validated.email,
        passwordHash: await bcrypt.hash(validated.password, 10),
        name: validated.name
      }
    });
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
  }
});
```

### Rule 3: Use Parameterized Queries (Prisma Does This)
```typescript
// ✅ CORRECT: Prisma prevents SQL injection
const user = await prisma.user.findUnique({
  where: { email: userInput } // Safely parameterized
});

// ❌ FORBIDDEN: Raw SQL with user input
// await prisma.$executeRawUnsafe(
//   `SELECT * FROM users WHERE email = '${userInput}'`
// ); // SQL INJECTION RISK!
```

---

## 📊 Data Access Patterns

### Pattern 1: CRUD Operations (Core Backend Only)

```typescript
// Create
const user = await prisma.user.create({
  data: { email: 'user@example.com', passwordHash: hash }
});

// Read
const user = await prisma.user.findUnique({
  where: { id: 123 }
});

// Update
const updated = await prisma.user.update({
  where: { id: 123 },
  data: { name: 'New Name' }
});

// Delete
await prisma.user.delete({
  where: { id: 123 }
});
```

### Pattern 2: Intelligence Layer Data Access

```typescript
// ✅ CORRECT: Node.js sends data to Python
app.get('/api/analytics/user-trends', async (req, res) => {
  // Fetch from DB
  const users = await prisma.user.findMany({
    select: {
      id: true,
      createdAt: true,
      orders: {
        select: {
          amount: true,
          createdAt: true
        }
      }
    }
  });
  
  // Send to Python for analysis
  const trends = await axios.post(`${PYTHON_SERVICE_URL}/analytics/trends`, {
    users: users
  });
  
  res.json(trends.data);
});
```

```python
# Python receives data, processes it
@app.post("/analytics/trends")
def compute_trends(request: TrendsRequest):
    df = pd.DataFrame(request.users)
    # Analysis logic
    return {"trends": analyze_trends(df)}
```

### Pattern 3: Pagination & Filtering

```typescript
// ✅ CORRECT: Efficient pagination
app.get('/api/users', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count()
  ]);
  
  res.json({
    data: users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});
```

---

## 🛡️ Data Retention & Privacy

### Retention Policies

| Data Type | Retention Period | Action After Period |
|-----------|------------------|---------------------|
| User Account Data | Until account deletion | Hard delete |
| Session Tokens | 30 days | Auto-delete expired |
| Audit Logs | 1 year | Archive to cold storage |
| Analytics Data | 2 years | Aggregate & anonymize |
| Soft-Deleted Records | 90 days | Hard delete |

### Soft Delete Pattern
```typescript
// Add deletedAt to schema
model User {
  id          Int       @id
  email       String
  deletedAt   DateTime?
  
  @@map("users")
}

// Soft delete
await prisma.user.update({
  where: { id: userId },
  data: { deletedAt: new Date() }
});

// Exclude soft-deleted by default
const activeUsers = await prisma.user.findMany({
  where: { deletedAt: null }
});
```

---

## 📈 Performance Guidelines

### Rule 1: Use Indexes Wisely
```prisma
model User {
  id       Int    @id
  email    String @unique  // Auto-indexed
  name     String
  city     String
  
  // Add index for frequent queries
  @@index([city])
  @@index([createdAt])
}
```

### Rule 2: Avoid N+1 Queries
```typescript
// ❌ WRONG: N+1 query
const users = await prisma.user.findMany();
for (const user of users) {
  const orders = await prisma.order.findMany({
    where: { userId: user.id }
  });
}

// ✅ CORRECT: Use include
const users = await prisma.user.findMany({
  include: { orders: true }
});
```

### Rule 3: Use Transactions for Multi-Step Operations
```typescript
// ✅ CORRECT: Atomic transaction
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { email: 'user@example.com', passwordHash: hash }
  });
  
  await tx.session.create({
    data: { userId: user.id, token: generateToken() }
  });
});
```

---

## 🔍 Monitoring & Auditing

### Database Metrics to Monitor
- Query execution time
- Connection pool usage
- Slow queries (> 1 second)
- Failed queries
- Database size

### Audit Logging
```typescript
// Log all data modifications
const auditLog = await prisma.auditLog.create({
  data: {
    userId: req.user.id,
    action: 'UPDATE',
    tableName: 'users',
    recordId: userId,
    changes: JSON.stringify(changes),
    timestamp: new Date()
  }
});
```

---

## 🚨 Database Emergency Procedures

### Procedure 1: Database Backup
```bash
# Daily automated backup
pg_dump -U kangqore_user -d kangqore_core > backup_$(date +%Y%m%d).sql

# Restore from backup
psql -U kangqore_user -d kangqore_core < backup_20260108.sql
```

### Procedure 2: Rollback Migration
```bash
# If migration fails
npx prisma migrate resolve --rolled-back <migration_name>
```

### Procedure 3: Data Corruption Response
1. **Immediately** stop writes to affected table
2. Restore from last known good backup
3. Document incident
4. Post-mortem within 24 hours

---

## ✅ Data Governance Checklist

Before any database operation:
- [ ] Is this operation in Core Backend (Node.js)?
- [ ] Using Prisma ORM (not raw SQL)?
- [ ] Sensitive fields excluded from response?
- [ ] Input validation implemented?
- [ ] Indexes planned for query performance?
- [ ] Migration created for schema changes?
- [ ] Backup taken (for production changes)?

---

## 📚 Common Patterns Reference

### Creating a User with Related Data
```typescript
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    passwordHash: hash,
    orders: {
      create: [
        { amount: 100, status: 'PENDING' }
      ]
    }
  },
  include: { orders: true }
});
```

### Conditional Queries
```typescript
const users = await prisma.user.findMany({
  where: {
    AND: [
      { isActive: true },
      { deletedAt: null },
      {
        OR: [
          { role: 'ADMIN' },
          { role: 'MODERATOR' }
        ]
      }
    ]
  }
});
```

### Aggregations
```typescript
const stats = await prisma.order.aggregate({
  _sum: { amount: true },
  _avg: { amount: true },
  _count: true,
  where: { status: 'COMPLETED' }
});
```

---

**Last Updated**: 2026-01-08  
**Authority**: Data Governance Board  
**Status**: MANDATORY - All database access must comply
