# Deployment Rules - Environments & Release Authority

> [!IMPORTANT]
> This document establishes **deployment governance** rules. All deployments must follow these procedures to ensure system stability and security.

---

## 🎯 Core Deployment Principles

1. **Progressive Deployment**: Test in lower environments first
2. **Rollback Readiness**: Every deployment must be reversible
3. **Change Approval**: Production requires explicit approval
4. **Zero Downtime**: All deployments must minimize service interruption
5. **Audit Trail**: All deployments are logged and tracked

---

## 🌍 Environment Definitions

### Environment Hierarchy

```
Development (Local) → Staging → Production
     ↓                  ↓            ↓
  Individual        Team-wide     Customer-
  Developer         Testing       Facing
```

---

## 💻 Development Environment (Local)

### Purpose
- Individual developer testing
- Rapid iteration
- Debugging

### Configuration
- **Frontend**: `localhost:3000` or `localhost:5500`
- **Core Backend**: `localhost:3001`
- **Intelligence Layer**: `localhost:8000`
- **Database**: `localhost:5432` (Docker PostgreSQL)

### Deployment Authority
- **Who**: Any developer
- **Approval**: None required
- **Frequency**: On-demand

### Setup Commands
```bash
# Start all services
docker-compose up -d

# Frontend
cd frontend
npm install
npm run dev

# Access
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# Python API: http://localhost:8000
```

### Environment Variables (`.env`)
```bash
# Core Backend (.env)
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://kangqore_user:kangqore_password@localhost:5432/kangqore_core
JWT_SECRET=dev-secret-change-in-production
PYTHON_SERVICE_URL=http://localhost:8000
CORS_ORIGINS=http://localhost:3000,http://localhost:5500

# Intelligence Layer (.env)
ENVIRONMENT=development
PORT=8000
CORE_BACKEND_URL=http://localhost:3001

# Frontend (.env)
VITE_API_URL=http://localhost:3001
```

### Development Rules
✅ **Allowed**:
- Experiment freely
- Use test/dummy data
- Hot reload enabled
- Detailed error logging

❌ **Forbidden**:
- Connect to production database
- Use production API keys
- Test with real user data
- Commit `.env` files to git

---

## 🧪 Staging Environment

### Purpose
- Pre-production testing
- QA validation
- Performance testing
- Integration testing

### Configuration
- **URL**: `https://staging.kangqore.com`
- **Database**: Dedicated staging PostgreSQL instance
- **Infrastructure**: Mirrors production setup
- **Data**: Anonymized production data or synthetic data

### Deployment Authority
- **Who**: Tech Lead or designated Release Manager
- **Approval**: Code review + 1 approval required
- **Frequency**: Daily or on-demand
- **Trigger**: Merge to `staging` branch

### Deployment Process

#### Step 1: Code Review & Merge
```bash
# Create PR to staging branch
git checkout -b feature/new-feature
git push origin feature/new-feature

# After approval
git checkout staging
git merge feature/new-feature
git push origin staging
```

#### Step 2: Automated CI/CD (GitHub Actions)
```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging

on:
  push:
    branches: [staging]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Tests
        run: |
          npm test
          pytest
      
      - name: Build Backend
        run: |
          cd core-backend
          npm run build
      
      - name: Build Frontend
        run: |
          cd frontend
          npm run build
      
      - name: Deploy to Staging Server
        run: |
          # SSH and deploy
          ssh deploy@staging.kangqore.com 'bash /deploy/staging_deploy.sh'
```

#### Step 3: Database Migration (Manual Approval)
```bash
# SSH to staging server
ssh deploy@staging.kangqore.com

# Run migrations
cd /app/core-backend
npx prisma migrate deploy

# Verify migration
npx prisma db seed  # If needed
```

#### Step 4: Smoke Tests
```bash
# Automated health checks
curl https://staging.kangqore.com/api/health
curl https://staging.kangqore.com/api/v1/health

# Manual checks
- Login flow works
- Critical user flows tested
- No console errors
```

### Staging Rules
✅ **Allowed**:
- Test breaking changes
- Performance profiling
- Load testing
- Third-party integrations testing

❌ **Forbidden**:
- Use real customer data
- Share staging URLs publicly
- Skip testing before promoting to production

---

## 🚀 Production Environment

### Purpose
- Live customer-facing application
- Real user traffic
- Revenue-generating operations

### Configuration
- **URL**: `https://app.kangqore.com`
- **Database**: Production PostgreSQL (managed, replicated)
- **Infrastructure**: High availability, load-balanced
- **Monitoring**: 24/7 monitoring enabled

### Deployment Authority

| Change Type | Approver | Notice Period | Allowed Window |
|-------------|----------|---------------|----------------|
| **Hotfix** (Critical bug) | Tech Lead | None | Anytime |
| **Minor Release** (Features) | Tech Lead + Product Owner | 24 hours | Business hours (M-F, 9am-5pm) |
| **Major Release** (Breaking changes) | CTO + Product Owner | 1 week | Planned maintenance window |
| **Database Migration** | Tech Lead + DBA | 48 hours | Low-traffic window (Sat 2am-6am) |

### Deployment Process

#### Step 1: Pre-Deployment Checklist
- [ ] Tested in staging for at least 24 hours
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code reviewed and approved (2+ approvals)
- [ ] Database migration tested in staging
- [ ] Rollback plan documented
- [ ] Stakeholders notified
- [ ] Maintenance window scheduled (if needed)

#### Step 2: Create Release
```bash
# Tag release
git checkout main
git pull origin main
git tag -a v1.2.0 -m "Release v1.2.0: Add user recommendations"
git push origin v1.2.0
```

#### Step 3: Deploy to Production
```bash
# Automated deployment (GitHub Actions)
# Triggered by tag push to `main` branch

# Manual verification
ssh deploy@prod.kangqore.com
cd /app/current
git fetch --tags
git checkout v1.2.0
```

#### Step 4: Database Migration (Production)
```bash
# ⚠️ REQUIRES MANUAL APPROVAL

# Backup first
pg_dump kangqore_prod > backup_pre_v1.2.0_$(date +%Y%m%d_%H%M%S).sql

# Run migration
cd /app/core-backend
npx prisma migrate deploy

# Verify
npx prisma db pull  # Check schema matches
```

#### Step 5: Restart Services (Zero Downtime)
```bash
# Rolling restart (blue-green deployment)
# 1. Start new instances
docker-compose -f docker-compose.prod.yml up -d --scale core-backend=2

# 2. Wait for health check
curl https://app.kangqore.com/api/health

# 3. Route traffic to new instances
# 4. Stop old instances
docker-compose -f docker-compose.prod.yml down old_instance
```

#### Step 6: Post-Deployment Verification
```bash
# Automated health checks
curl https://app.kangqore.com/api/health
# Expected: {"status": "healthy", "version": "v1.2.0"}

# Monitor logs
tail -f /var/log/kangqore/app.log

# Check error rates (should be < 1%)
# Check response times (should be < 500ms p95)
```

#### Step 7: Monitor for 1 Hour
- Watch error rates
- Monitor response times
- Check user reports
- Verify critical flows (login, checkout, etc.)

### Production Rules
✅ **Allowed**:
- Deploy during business hours (for visibility)
- Rollback immediately if issues detected
- Hotfix critical bugs anytime

❌ **Forbidden**:
- Deploy untested code
- Skip database backups
- Deploy on Friday afternoons (risky timing)
- Make manual database changes (must use migrations)

---

## 🔄 Rollback Procedures

### When to Rollback
- Error rate > 5%
- Critical feature broken
- Data corruption detected
- Performance degradation > 50%
- Security vulnerability introduced

### Rollback Process

#### Option 1: Revert to Previous Version (Fast)
```bash
# 1. Switch to previous tag
git checkout v1.1.0

# 2. Restart services
docker-compose -f docker-compose.prod.yml restart

# 3. Verify
curl https://app.kangqore.com/api/health
```

#### Option 2: Database Rollback (If Migration Ran)
```bash
# ⚠️ DANGEROUS - Only if absolutely necessary

# 1. Stop application
docker-compose down

# 2. Restore database backup
psql kangqore_prod < backup_pre_v1.2.0_20260108_020000.sql

# 3. Revert code
git checkout v1.1.0

# 4. Restart
docker-compose up -d

# 5. Verify data integrity
npx prisma db pull
```

#### Option 3: Forward Fix (Preferred for Minor Issues)
```bash
# 1. Create hotfix branch
git checkout -b hotfix/fix-critical-bug

# 2. Fix the issue
# ... make changes ...

# 3. Fast-track to production
git tag -a v1.2.1 -m "Hotfix: Critical bug fix"
git push origin v1.2.1

# Deploy follows same process
```

---

## 📊 Deployment Tracking

### Deployment Log Format
```yaml
Deployment ID: DEPLOY-2026-01-08-001
Version: v1.2.0
Environment: Production
Deployed By: john.doe@kangqore.com
Approved By: jane.smith@kangqore.com
Timestamp: 2026-01-08T02:00:00Z
Status: SUCCESS
Rollback Available: YES
Backup ID: backup_pre_v1.2.0_20260108_020000.sql
Changes:
  - Added user recommendation feature
  - Fixed login bug
  - Updated dependencies
Health Check: PASSED
Error Rate: 0.3% (acceptable)
Response Time: 320ms p95 (acceptable)
```

### Deployment Metrics
Track these metrics for every deployment:
- Deployment duration
- Error rate (before vs after)
- Response time (before vs after)
- Rollback count
- Time to rollback

---

## 🛠️ Infrastructure as Code

### Docker Compose (Production)
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_DB: kangqore_core
      POSTGRES_USER: kangqore_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}  # From secrets
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - kangqore-network

  core-backend:
    image: kangqore-backend:v1.2.0
    restart: always
    environment:
      NODE_ENV: production
      PORT: 3001
      DATABASE_URL: postgresql://kangqore_user:${DB_PASSWORD}@postgres:5432/kangqore_core
      JWT_SECRET: ${JWT_SECRET}
      PYTHON_SERVICE_URL: http://intelligence-layer:8000
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - intelligence-layer
    networks:
      - kangqore-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  intelligence-layer:
    image: kangqore-intelligence:v1.2.0
    restart: always
    environment:
      ENVIRONMENT: production
      PORT: 8000
    ports:
      - "8000:8000"
    networks:
      - kangqore-network

volumes:
  postgres_data:

networks:
  kangqore-network:
    driver: bridge
```

---

## 🔐 Secrets Management

### Production Secrets
- **Storage**: AWS Secrets Manager or HashiCorp Vault
- **Access**: Only CI/CD pipeline and production servers
- **Rotation**: Every 90 days

### Never Commit to Git:
- `.env` files
- Database passwords
- JWT secrets
- API keys
- SSL certificates

### Secrets Injection
```bash
# GitHub Secrets → Environment Variables
# Set in GitHub repo settings → Secrets

# Access in deployment
docker-compose --env-file .env.production up -d
```

---

## 📅 Deployment Schedule

### Regular Releases
- **Minor Releases**: Every 2 weeks (Tuesday 10am)
- **Major Releases**: Monthly (First Saturday 2am)
- **Hotfixes**: As needed (within 2 hours of discovery)

### Blackout Periods (No Deployments)
- December 20 - January 5 (Holiday freeze)
- Black Friday weekend
- Major company events
- During active incidents

---

## ✅ Pre-Deployment Checklist

Before ANY production deployment:
- [ ] Code reviewed and approved (2+ approvals)
- [ ] All tests passing (unit, integration, E2E)
- [ ] Tested in staging for 24+ hours
- [ ] Database migration tested
- [ ] Rollback plan documented
- [ ] Database backup taken
- [ ] Stakeholders notified
- [ ] Health checks configured
- [ ] Monitoring alerts active
- [ ] Documentation updated

---

## 🚨 Emergency Deployment (Hotfix)

### Criteria for Emergency Deployment:
- **Security vulnerability** (CVSS > 7.0)
- **Critical bug** affecting > 50% of users
- **Data integrity issue**
- **System outage**

### Fast-Track Process:
1. **Immediate**: Create hotfix branch
2. **10 min**: Implement fix
3. **15 min**: Test in local + staging
4. **20 min**: Get verbal approval from Tech Lead
5. **25 min**: Deploy to production
6. **30 min**: Monitor for 30 minutes
7. **Post**: Document incident & fix

### Reduced Requirements:
- Approval: 1 (instead of 2)
- Staging time: 15 minutes (instead of 24 hours)
- Testing: Critical path only
- Notice: Notify during deployment

---

**Last Updated**: 2026-01-08  
**Authority**: DevOps & Release Management Team  
**Status**: MANDATORY - All deployments must comply
