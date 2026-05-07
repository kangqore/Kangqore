# API Governance - Versioning & Breaking Change Rules

> [!IMPORTANT]
> This document establishes **non-negotiable rules** for API design, versioning, and managing breaking changes. All API changes must comply with these rules.

---

## 🎯 Core Principles

1. **Backward Compatibility**: Never break existing clients
2. **Explicit Versioning**: All APIs are versioned
3. **Deprecation Grace Period**: Minimum 90 days notice
4. **Documentation First**: Document before deploying
5. **Contract Testing**: All changes must pass contract tests

---

## 📌 API Versioning Strategy

### Current Strategy: URL Path Versioning

**Format**: `/api/v{version}/{resource}`

```
✅ CORRECT:
- /api/v1/auth/login
- /api/v1/dashboard/insights
- /api/v2/users/profile

❌ WRONG:
- /api/auth/login (no version)
- /v1/api/auth/login (version before api)
- /api/auth/v1/login (version after resource)
```

### Versioning Rules

| Version Type | Increment | Example | When to Use |
|--------------|-----------|---------|-------------|
| **Major (v1 → v2)** | Breaking changes | /api/v1 → /api/v2 | Changed response structure, removed fields, changed data types |
| **Minor (same version)** | Additive changes | Add new field to response | New optional fields, new endpoints |
| **Patch (same version)** | Bug fixes | Fix response bug | Internal fixes, no API contract change |

---

## 🔄 What Constitutes a Breaking Change?

### ❌ Breaking Changes (Require New Major Version)

1. **Removing a Field from Response**
   ```json
   // v1 Response
   {
     "id": 123,
     "name": "John",
     "email": "john@example.com"  // ❌ Removing this is breaking
   }
   
   // v2 Response (NEW VERSION REQUIRED)
   {
     "id": 123,
     "name": "John"
   }
   ```

2. **Changing Data Type**
   ```json
   // v1
   { "id": "123" }  // string
   
   // v2 - BREAKING
   { "id": 123 }    // number
   ```

3. **Renaming a Field**
   ```json
   // v1
   { "user_name": "John" }
   
   // v2 - BREAKING
   { "username": "John" }  // Must release v2
   ```

4. **Changing URL Structure**
   ```
   v1: GET /api/v1/users/:id
   v2: GET /api/v2/users/:id/profile  // BREAKING
   ```

5. **Removing an Endpoint**
   ```typescript
   // ❌ BREAKING: Deleting endpoint
   // DELETE /api/v1/old-endpoint
   ```

6. **Making Optional Field Required**
   ```typescript
   // v1 - Optional
   interface CreateUserRequest {
     email: string;
     phone?: string;  // Optional
   }
   
   // v2 - BREAKING
   interface CreateUserRequest {
     email: string;
     phone: string;  // Now required!
   }
   ```

7. **Changing Error Response Format**
   ```json
   // v1
   { "error": "User not found" }
   
   // v2 - BREAKING
   { "errors": [{ "message": "User not found", "code": 404 }] }
   ```

### ✅ Non-Breaking Changes (Same Version)

1. **Adding New Optional Fields**
   ```json
   // v1
   { "id": 123, "name": "John" }
   
   // v1 (still compatible)
   { "id": 123, "name": "John", "avatar": "url" }  // ✅ OK
   ```

2. **Adding New Endpoints**
   ```
   v1: GET /api/v1/users
   v1: GET /api/v1/users/:id/preferences  // ✅ NEW, but not breaking
   ```

3. **Making Required Field Optional**
   ```typescript
   // v1
   interface UpdateUserRequest {
     name: string;
   }
   
   // v1 (still compatible)
   interface UpdateUserRequest {
     name?: string;  // ✅ More permissive, not breaking
   }
   ```

4. **Adding New Query Parameters (optional)**
   ```
   v1: GET /api/v1/users
   v1: GET /api/v1/users?limit=10  // ✅ Optional param, OK
   ```

---

## 📋 API Lifecycle Management

### Stage 1: Active (Current Version)
- **Status**: Fully supported
- **SLA**: 99.9% uptime
- **Updates**: Bug fixes + new features
- **Example**: `/api/v2/...`

### Stage 2: Deprecated
- **Status**: Supported but not recommended
- **SLA**: 99.5% uptime
- **Updates**: Critical bug fixes only
- **Duration**: Minimum 90 days
- **Example**: `/api/v1/...` (marked deprecated)

```typescript
// Response includes deprecation warning
{
  "data": {...},
  "meta": {
    "deprecated": true,
    "sunset_date": "2026-06-01",
    "migration_guide": "https://docs.kangqore.com/migrate-v1-to-v2"
  }
}
```

### Stage 3: Sunset (Removed)
- **Status**: No longer available
- **Returns**: `410 Gone` status
- **Happens**: After 90-day deprecation period

```json
// After sunset
{
  "error": "This API version has been sunset",
  "details": "Please migrate to /api/v2",
  "sunset_date": "2026-06-01",
  "migration_guide": "https://docs.kangqore.com/migrate-v1-to-v2"
}
```

---

## 🔧 Breaking Change Process

### Step 1: Document the Change
Create a migration guide in `/docs/api-migrations/`:
```markdown
# Migration Guide: v1 to v2

## Breaking Changes
- `user_name` renamed to `username`
- `phone` field now required

## Migration Steps
1. Update client to use `username` instead of `user_name`
2. Ensure `phone` is provided in all requests

## Timeline
- v2 Released: 2026-03-01
- v1 Deprecated: 2026-03-01
- v1 Sunset: 2026-06-01
```

### Step 2: Implement New Version
```typescript
// app.ts
// v1 - Keep existing
app.use('/api/v1', v1Router);

// v2 - New version
app.use('/api/v2', v2Router);
```

### Step 3: Mark Old Version as Deprecated
```typescript
// v1Router.ts
app.use((req, res, next) => {
  res.setHeader('Warning', '299 - "Deprecated. Migrate to /api/v2 by 2026-06-01"');
  res.setHeader('Sunset', 'Sat, 01 Jun 2026 00:00:00 GMT');
  next();
});
```

### Step 4: Communicate to Stakeholders
- Email to all API consumers
- Update documentation
- Add banner to docs site
- Post in Slack/Teams

### Step 5: Monitor Migration Progress
Track v1 vs v2 usage:
```typescript
// Logging middleware
app.use((req, res, next) => {
  const version = req.path.includes('/v1/') ? 'v1' : 'v2';
  logger.info({ version, endpoint: req.path });
  next();
});
```

### Step 6: Sunset Old Version (After 90 Days)
```typescript
// v1Router.ts - After sunset date
app.use((req, res) => {
  res.status(410).json({
    error: 'This API version has been sunset',
    migration_guide: 'https://docs.kangqore.com/migrate-v1-to-v2'
  });
});
```

---

## 📐 API Design Standards

### RESTful Conventions

| HTTP Method | Action | URL Pattern | Response Code |
|-------------|--------|-------------|---------------|
| `GET` | Retrieve | `/api/v1/users` | 200 OK |
| `GET` | Retrieve One | `/api/v1/users/:id` | 200 OK / 404 Not Found |
| `POST` | Create | `/api/v1/users` | 201 Created |
| `PUT` | Replace | `/api/v1/users/:id` | 200 OK / 404 Not Found |
| `PATCH` | Update | `/api/v1/users/:id` | 200 OK / 404 Not Found |
| `DELETE` | Delete | `/api/v1/users/:id` | 204 No Content / 404 Not Found |

### URL Naming Conventions
```
✅ CORRECT:
- /api/v1/users
- /api/v1/users/:id
- /api/v1/users/:id/posts
- /api/v1/posts/:postId/comments

❌ WRONG:
- /api/v1/getUsers (verb in URL)
- /api/v1/user (singular)
- /api/v1/Users (capitalized)
- /api/v1/user_posts (snake_case)
```

### Request/Response Format

**Consistent Success Response**:
```json
{
  "data": {...},
  "meta": {
    "timestamp": "2026-01-08T10:00:00Z",
    "version": "v1"
  }
}
```

**Consistent Error Response**:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  },
  "meta": {
    "timestamp": "2026-01-08T10:00:00Z",
    "version": "v1"
  }
}
```

---

## 🛡️ Authentication & Authorization

### API Authentication
- **Method**: JWT Bearer Token
- **Header**: `Authorization: Bearer <token>`
- **Token Expiry**: 24 hours
- **Refresh Token**: 30 days

```typescript
// Middleware
app.use('/api/v1', authenticate);

async function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

---

## 📊 Rate Limiting

### Standard Rate Limits
- **Authenticated Users**: 1000 requests/hour
- **Unauthenticated**: 100 requests/hour
- **Admin Users**: 5000 requests/hour

**Response Headers**:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 1641638400
```

**When Exceeded**:
```json
// 429 Too Many Requests
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "retry_after": 3600
  }
}
```

---

## 📝 Documentation Requirements

### Every Endpoint Must Have:
1. **Description**: What it does
2. **Auth Required**: Yes/No + required role
3. **URL**: Full path with version
4. **Method**: GET, POST, etc.
5. **Request Schema**: Body, query, path params
6. **Response Schema**: Success + error responses
7. **Examples**: Request + response examples
8. **Status Codes**: All possible codes

**Example Documentation**:
```markdown
### Get User Profile

**Auth Required**: Yes (Any authenticated user)

**Endpoint**: `GET /api/v1/users/:id`

**Path Parameters**:
- `id` (integer, required): User ID

**Response** (200 OK):
```json
{
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Not authorized to view this user
- `404 Not Found`: User does not exist
```

---

## ✅ Pre-Release Checklist

Before deploying any API change:
- [ ] Is it a breaking change?
  - [ ] If yes, increment major version
  - [ ] If no, can use same version
- [ ] Documentation updated
- [ ] Migration guide created (if breaking)
- [ ] Deprecated version marked with headers
- [ ] Sunset date set (90+ days)
- [ ] Stakeholders notified
- [ ] Contract tests passing
- [ ] Rate limits configured
- [ ] Error responses standardized

---

## 🚨 Emergency Breaking Change

If a **critical security vulnerability** requires immediate breaking change:

1. **Immediate Action**:
   - Deploy fix to new version (e.g., v1.1)
   - Return `410 Gone` for vulnerable endpoint

2. **Communication** (within 1 hour):
   - Email all API consumers
   - Post incident report
   - Provide emergency migration guide

3. **Grace Period**: Reduced to 7 days (instead of 90)

4. **Post-Mortem**: Document why emergency change was needed

---

## 📈 Versioning Examples

### Example 1: Adding Optional Field (Non-Breaking)
```typescript
// v1 - Original
interface User {
  id: number;
  name: string;
}

// v1 - Updated (still v1, backward compatible)
interface User {
  id: number;
  name: string;
  avatar?: string;  // ✅ Optional, non-breaking
}
```

### Example 2: Renaming Field (Breaking)
```typescript
// v1 - Original
interface User {
  user_name: string;
}

// v2 - New version required
interface User {
  username: string;  // ❌ Breaking, needs v2
}
```

### Example 3: Changing Response Structure (Breaking)
```json
// v1
{
  "users": [...]
}

// v2 - Breaking
{
  "data": {
    "users": [...],
    "total": 100
  }
}
```

---

**Last Updated**: 2026-01-08  
**Authority**: API Governance Board  
**Status**: MANDATORY - All APIs must comply
