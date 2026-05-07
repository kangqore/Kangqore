# Backend Folder Structure

This folder organizes auth-related logic:

- `middleware.ts` - Authentication middleware (JWT verification, authorize)
- `strategies/` - OAuth strategies (Google, LinkedIn, etc.)
- `guards/` - Route protection utilities

## Usage

```typescript
import { authenticate, authorize } from './auth';
import { requireAuth } from './auth/middleware';
```
