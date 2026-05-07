# API Module

This folder organizes all API routes by domain:

```
api/
├── v1/
│   ├── auth.ts       - Authentication routes
│   ├── admin.ts      - Admin routes
│   ├── users.ts      - User management
│   └── ...
└── index.ts          - Route aggregator
```

## Usage

```typescript
import apiRouter from './api';
app.use('/api', apiRouter);
```
