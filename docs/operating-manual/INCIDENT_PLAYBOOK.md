# Incident Playbook - What Happens When Things Break

> [!IMPORTANT]
> This document defines **incident response procedures** for the Kangqore system. When things break, follow this playbook to restore service quickly and safely.

---

## 🎯 Incident Management Principles

1. **Safety First**: Protect user data and system integrity
2. **Communicate Early**: Notify stakeholders immediately
3. **Contain, Then Fix**: Stop the bleeding before diagnosis
4. **Document Everything**: Log all actions for post-mortem
5. **Learn and Improve**: Every incident is a learning opportunity

---

## 🚨 Incident Severity Levels

| Severity | Impact | Response Time | Examples |
|----------|--------|---------------|----------|
| **P0 - Critical** | System down, data loss, security breach | < 15 minutes | Database crash, authentication broken, data breach |
| **P1 - High** | Major feature broken, affects >50% users | < 1 hour | Payment processing down, can't create accounts |
| **P2 - Medium** | Minor feature broken, affects <50% users | < 4 hours | Search not working, slow page loads |
| **P3 - Low** | Cosmetic issues, affects <10% users | < 24 hours | UI glitch, typo, minor styling issue |

---

## 📞 Incident Response Team

### On-Call Rotation
- **Primary**: Senior Backend Engineer
- **Secondary**: DevOps Engineer
- **Escalation**: Tech Lead / CTO

### Contact Information
```
Primary On-Call: on-call@kangqore.com
Incident Slack: #incidents
Emergency Hotline: [REDACTED]
Status Page: https://status.kangqore.com
```

---

## 🔥 P0 - CRITICAL INCIDENT

### Definition
- **Complete system outage**
- **Data loss or corruption**
- **Security breach**
- **Authentication broken**

### Immediate Actions (First 5 Minutes)

#### 1. Acknowledge the Incident
```bash
# Post in #incidents Slack channel
@here P0 INCIDENT: [Brief description]
On-call engineer: [Your name]
Started at: [Timestamp]
Status page updated: [YES/NO]
```

#### 2. Update Status Page
```
Title: Service Disruption
Status: Investigating
Message: "We are currently experiencing technical difficulties. 
         Our team is investigating and will provide updates shortly."
Affected Components: [Core Backend / Intelligence Layer / Frontend]
```

#### 3. Assess the Situation
```bash
# Check service health
curl https://app.kangqore.com/api/health

# Check database connection
docker exec -it kangqore-postgres psql -U kangqore_user -c "SELECT 1;"

# Check logs (last 100 lines)
docker logs --tail 100 kangqore-core-backend
docker logs --tail 100 kangqore-intelligence-layer

# Check error rates in monitoring
```

---

### Diagnosis (First 15 Minutes)

#### Common P0 Scenarios & Quick Fixes

#### Scenario 1: Database Connection Failure
**Symptoms**: All API requests return 500, logs show database connection errors

**Quick Fix**:
```bash
# Check if database is running
docker ps | grep postgres

# If not running, restart
docker-compose restart postgres

# Verify connection
docker exec -it kangqore-postgres psql -U kangqore_user -c "SELECT NOW();"

# Restart backend
docker-compose restart core-backend
```

#### Scenario 2: Core Backend Crashed
**Symptoms**: 502/503 errors, backend container not responding

**Quick Fix**:
```bash
# Check backend status
docker ps | grep core-backend

# View crash logs
docker logs kangqore-core-backend --tail 50

# Restart backend
docker-compose restart core-backend

# Monitor restart
docker logs -f kangqore-core-backend
```

#### Scenario 3: Out of Memory / Disk Space
**Symptoms**: Services crashing, slow performance

**Quick Fix**:
```bash
# Check disk space
df -h

# Check memory
free -h

# Clean up logs (if disk full)
docker system prune -a --volumes

# Restart services
docker-compose restart
```

#### Scenario 4: Recent Deployment Broke Production
**Symptoms**: Issues started immediately after deployment

**Quick Fix**:
```bash
# ROLLBACK IMMEDIATELY
git checkout v1.1.0  # Previous version

# Restart services
docker-compose down
docker-compose up -d

# Verify health
curl https://app.kangqore.com/api/health

# Update status page
Status: Monitoring
Message: "Issue resolved. We've rolled back to previous version. 
         Monitoring for stability."
```

---

### Communication (Throughout Incident)

#### Every 15 Minutes (Until Resolved)
```
#incidents Slack Update:
[T+15min] Still investigating. [Brief findings]
[T+30min] Root cause identified: [Description]. Implementing fix.
[T+45min] Fix deployed. Monitoring for stability.
[T+60min] Incident resolved. Post-mortem scheduled.
```

#### Status Page Updates
```
T+0:   Status: Investigating
T+15:  Status: Identified - [Brief cause]
T+30:  Status: Monitoring - Fix deployed
T+45:  Status: Resolved
```

---

### Resolution & Post-Mortem

#### After Incident Resolved

1. **Final Communication**
```
Status Page:
Title: Service Restored
Status: Resolved
Message: "The issue has been resolved. All services are operating normally. 
         We will publish a detailed post-mortem within 48 hours."
```

2. **Document Incident**
```markdown
# Incident Report: [Date] - [Brief Title]

## Summary
- **Severity**: P0
- **Duration**: [Start] to [End] (X hours Y minutes)
- **Affected Users**: ~X% of users
- **Root Cause**: [Description]

## Timeline
- T+0: Incident detected
- T+5: On-call engineer acknowledged
- T+15: Root cause identified
- T+30: Fix deployed
- T+45: Service restored

## Impact
- User logins: Failed for 45 minutes
- Data loss: None
- Revenue impact: Estimated $X

## Root Cause
[Detailed technical explanation]

## Resolution
[What was done to fix it]

## Action Items
- [ ] Fix underlying issue permanently
- [ ] Add monitoring for early detection
- [ ] Update runbooks
- [ ] Improve deployment process
```

3. **Schedule Post-Mortem Meeting** (within 24 hours)
   - Review timeline
   - Identify root cause
   - Create action items
   - Assign owners
   - Set deadlines

---

## 🔴 P1 - HIGH SEVERITY INCIDENT

### Definition
- Major feature broken
- Affects >50% of users
- Payment processing down
- Can't create accounts

### Response Time: < 1 Hour

### Example: Payment Processing Down

#### 1. Acknowledge & Communicate
```
#incidents:
P1 INCIDENT: Payment processing failing
Owner: [Your name]
Impact: Users cannot complete purchases
Started: [Timestamp]
```

#### 2. Diagnose
```bash
# Check payment API logs
docker logs kangqore-core-backend | grep "payment"

# Check third-party payment provider status
curl https://status.stripe.com

# Check database for failed transactions
docker exec -it kangqore-postgres psql -U kangqore_user -d kangqore_core -c \
  "SELECT COUNT(*) FROM orders WHERE status='FAILED' AND created_at > NOW() - INTERVAL '1 hour';"
```

#### 3. Temporary Mitigation
```typescript
// If third-party payment provider is down
// Enable maintenance mode for checkout
app.use('/api/checkout', (req, res) => {
  res.status(503).json({
    error: 'Payment processing temporarily unavailable',
    message: 'Please try again in a few minutes',
    retry_after: 300
  });
});
```

#### 4. Implement Fix
```typescript
// Add retry logic
async function processPayment(order: Order) {
  const maxRetries = 3;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await paymentProvider.charge(order);
      return result;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(1000 * (i + 1));  // Exponential backoff
    }
  }
}
```

---

## 🟡 P2 - MEDIUM SEVERITY INCIDENT

### Definition
- Minor feature broken
- Affects <50% of users
- Search not working
- Slow page loads

### Response Time: < 4 Hours

### Example: Slow Dashboard Loading

#### 1. Diagnose Performance Issue
```bash
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s https://app.kangqore.com/api/dashboard/insights

# Check database query performance
docker exec -it kangqore-postgres psql -U kangqore_user -d kangqore_core -c \
  "SELECT query, mean_exec_time, calls FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;"

# Check for N+1 queries
docker logs kangqore-core-backend | grep "prisma:query"
```

#### 2. Identify Slow Query
```sql
-- Found: slow query in dashboard insights
SELECT * FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.created_at > NOW() - INTERVAL '30 days';
-- Takes 5+ seconds
```

#### 3. Optimize Query
```typescript
// Before (slow)
const users = await prisma.user.findMany({
  where: { createdAt: { gte: thirtyDaysAgo } },
  include: { orders: true }
});

// After (fast) - Add index and limit results
const users = await prisma.user.findMany({
  where: { createdAt: { gte: thirtyDaysAgo } },
  take: 100,  // Limit results
  include: {
    orders: {
      take: 10  // Limit related records
    }
  }
});

// Add database index
// In prisma/schema.prisma
model User {
  // ...
  @@index([createdAt])
}
```

---

## 🟢 P3 - LOW SEVERITY INCIDENT

### Definition
- Cosmetic issues
- Affects <10% of users
- UI glitch
- Typo

### Response Time: < 24 Hours

### Handle During Business Hours
- No immediate action required
- Create ticket in issue tracker
- Schedule fix in next sprint

---

## 🔍 Debugging Toolkit

### Essential Commands

#### Check Service Health
```bash
# All services
docker ps

# Health endpoints
curl http://localhost:3001/api/health
curl http://localhost:8000/health

# Database connectivity
docker exec -it kangqore-postgres psql -U kangqore_user -c "SELECT 1;"
```

#### View Logs
```bash
# Real-time logs
docker logs -f kangqore-core-backend
docker logs -f kangqore-intelligence-layer

# Last 100 lines
docker logs --tail 100 kangqore-core-backend

# Logs with timestamps
docker logs --timestamps kangqore-core-backend

# Search logs
docker logs kangqore-core-backend 2>&1 | grep "ERROR"
```

#### Check Resource Usage
```bash
# Container resource usage
docker stats

# Disk space
df -h

# Memory usage
free -h

# Database size
docker exec -it kangqore-postgres psql -U kangqore_user -d kangqore_core -c \
  "SELECT pg_size_pretty(pg_database_size('kangqore_core'));"
```

#### Database Debugging
```bash
# Active connections
docker exec -it kangqore-postgres psql -U kangqore_user -d kangqore_core -c \
  "SELECT count(*) FROM pg_stat_activity;"

# Slow queries
docker exec -it kangqore-postgres psql -U kangqore_user -d kangqore_core -c \
  "SELECT pid, now() - query_start as duration, query 
   FROM pg_stat_activity 
   WHERE state = 'active' AND now() - query_start > interval '5 seconds';"

# Kill long-running query
docker exec -it kangqore-postgres psql -U kangqore_user -d kangqore_core -c \
  "SELECT pg_terminate_backend(PID);"
```

---

## 🛠️ Common Issues & Solutions

### Issue 1: "Cannot connect to database"
```bash
# Diagnosis
docker ps | grep postgres  # Is it running?
docker logs kangqore-postgres  # Any errors?

# Solution
docker-compose restart postgres
docker-compose restart core-backend
```

### Issue 2: "Port already in use"
```bash
# Diagnosis
lsof -i :3001  # What's using the port?

# Solution
kill -9 [PID]  # Kill the process
docker-compose up -d
```

### Issue 3: "Out of memory"
```bash
# Diagnosis
docker stats  # Which container?
free -h  # System memory

# Solution
docker-compose down
docker system prune -a  # Free up space
docker-compose up -d
```

### Issue 4: "Migration failed"
```bash
# Diagnosis
npx prisma migrate status

# Solution (if safe)
npx prisma migrate resolve --rolled-back [migration_name]

# Or restore backup
psql kangqore_core < backup.sql
```

---

## 📋 Incident Response Checklist

### During Incident
- [ ] Acknowledged in #incidents Slack channel
- [ ] Status page updated
- [ ] Severity assigned (P0/P1/P2/P3)
- [ ] On-call engineer assigned
- [ ] Logs reviewed
- [ ] Root cause identified
- [ ] Fix implemented
- [ ] Fix verified
- [ ] Stakeholders notified
- [ ] Status page updated to "Resolved"

### After Incident
- [ ] Incident report documented
- [ ] Post-mortem meeting scheduled
- [ ] Action items created
- [ ] Owners assigned
- [ ] Runbooks updated
- [ ] Monitoring improved
- [ ] Related tickets closed

---

## 🔄 Rollback Decision Tree

```
Incident Detected
    ↓
Is it caused by recent deployment?
    ↓ YES
ROLLBACK IMMEDIATELY
    ↓ NO
Can you identify root cause in < 15 min?
    ↓ YES
Is fix simple (< 5 min)?
    ↓ YES → Implement fix
    ↓ NO  → ROLLBACK, then fix properly
    ↓ NO (to root cause)
ROLLBACK to known good state
```

---

## 📞 Escalation Path

```
Incident Detected
    ↓
Primary On-Call (responds in 15 min)
    ↓ (if no response or can't resolve)
Secondary On-Call (responds in 15 min)
    ↓ (if critical or can't resolve)
Tech Lead (responds in 30 min)
    ↓ (if data loss or security breach)
CTO (responds in 1 hour)
```

---

## 🎓 Post-Mortem Template

```markdown
# Post-Mortem: [Incident Title]

**Date**: 2026-01-08  
**Severity**: P0  
**Duration**: 45 minutes  
**Owner**: [Name]

## What Happened
[Brief description of the incident]

## Impact
- **Users Affected**: 80% of active users
- **Duration**: 45 minutes
- **Data Loss**: None
- **Revenue Impact**: $500 (estimated)

## Timeline
| Time | Event |
|------|-------|
| 14:00 | Deployment v1.2.0 started |
| 14:05 | Error rate spiked to 95% |
| 14:10 | Incident detected, on-call notified |
| 14:15 | Rollback initiated |
| 14:20 | Services restored |
| 14:45 | Monitoring confirmed stability |

## Root Cause
[Detailed technical explanation]

## What Went Well
- Fast detection (5 minutes)
- Quick rollback (10 minutes)
- Good communication

## What Went Wrong
- Insufficient staging testing
- No automated rollback
- Monitoring alert delay

## Action Items
| Action | Owner | Deadline | Status |
|--------|-------|----------|--------|
| Add integration test for broken feature | @backend-team | 2026-01-15 | Open |
| Implement automated rollback | @devops | 2026-01-22 | Open |
| Improve staging environment | @devops | 2026-02-01 | Open |
| Update deployment checklist | @tech-lead | 2026-01-10 | Done |

## Lessons Learned
[Key takeaways]
```

---

**Last Updated**: 2026-01-08  
**Authority**: Incident Response Team  
**Status**: MANDATORY - Follow this playbook during incidents
