# Kangqore Operating Manual

> [!IMPORTANT]
> **THIS IS THE SINGLE SOURCE OF TRUTH FOR ALL TEAMS**
> 
> No debate. No reinterpretation. No drift.

---

## 📖 Purpose

This Operating Manual establishes **mandatory governance rules** for the Kangqore engineering organization. All technical decisions, processes, and operations must comply with these documents.

**When in doubt, refer to this manual first.**

---

## 📚 Manual Contents

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Mental model & system boundaries | When designing features, making architectural decisions |
| **[STACK.md](./STACK.md)** | Approved technology stack | Before adding any new dependency or technology |
| **[LANGUAGE_RULES.md](./LANGUAGE_RULES.md)** | When to use Node.js vs Python vs others | When deciding which language to write code in |
| **[API_GOVERNANCE.md](./API_GOVERNANCE.md)** | API versioning & breaking changes | When creating/modifying any API endpoint |
| **[DATA_GOVERNANCE.md](./DATA_GOVERNANCE.md)** | Database ownership & access rules | When working with data or database |
| **[DEPLOYMENT_RULES.md](./DEPLOYMENT_RULES.md)** | Deployment processes & authority | Before deploying to any environment |
| **[INCIDENT_PLAYBOOK.md](./INCIDENT_PLAYBOOK.md)** | What to do when things break | When an incident occurs or during on-call |

---

## 🎯 Quick Reference

### For Backend Engineers
1. **Starting a new feature?** → Read [ARCHITECTURE.md](./ARCHITECTURE.md) + [LANGUAGE_RULES.md](./LANGUAGE_RULES.md)
2. **Creating an API?** → Read [API_GOVERNANCE.md](./API_GOVERNANCE.md)
3. **Working with database?** → Read [DATA_GOVERNANCE.md](./DATA_GOVERNANCE.md)
4. **Adding a library?** → Check [STACK.md](./STACK.md) first

### For Frontend Engineers
1. **UI feature?** → Read [ARCHITECTURE.md](./ARCHITECTURE.md) (Frontend boundaries)
2. **Calling an API?** → Read [API_GOVERNANCE.md](./API_GOVERNANCE.md) (API contracts)
3. **Adding a package?** → Check [STACK.md](./STACK.md) first

### For DevOps Engineers
1. **Deploying?** → Read [DEPLOYMENT_RULES.md](./DEPLOYMENT_RULES.md)
2. **Incident?** → Read [INCIDENT_PLAYBOOK.md](./INCIDENT_PLAYBOOK.md)
3. **Infrastructure change?** → Check [STACK.md](./STACK.md) + [ARCHITECTURE.md](./ARCHITECTURE.md)

### For Product Managers
1. **Understanding system capabilities?** → Read [ARCHITECTURE.md](./ARCHITECTURE.md)
2. **Planning releases?** → Read [DEPLOYMENT_RULES.md](./DEPLOYMENT_RULES.md)
3. **API changes impact?** → Read [API_GOVERNANCE.md](./API_GOVERNANCE.md)

---

## 🔑 Core Rules (Mission Critical)

### Rule #1: Architecture Boundaries
- Frontend talks ONLY to Node.js Core Backend
- Intelligence Layer is called ONLY by Node.js (never by Frontend)
- Only Node.js writes to the database

**Violation**: Deployment rejected

### Rule #2: Approved Technologies Only
- All technologies must be listed in [STACK.md](./STACK.md)
- Adding new tech requires Architecture Review Board approval
- Using unapproved tech = deployment rejected

**Violation**: Code review rejected

### Rule #3: API Versioning is Mandatory
- All APIs must be versioned (e.g., `/api/v1/...`)
- Breaking changes require new version
- 90-day deprecation period for old versions

**Violation**: API changes rejected

### Rule #4: Database Access Control
- Only Core Backend can write to database (via Prisma)
- No raw SQL (except migrations)
- All schema changes via Prisma migrations

**Violation**: Deployment rejected

### Rule #5: Deployment Approval Required
- Development: No approval needed
- Staging: Code review + 1 approval
- Production: Code review + 2 approvals + testing in staging

**Violation**: Deployment blocked

---

## 🚦 Decision Flowcharts

### "Should I use Node.js or Python?"
```
Does it involve UI, Auth, or Database writes?
    ↓ YES → Node.js
    ↓ NO
Does it involve Analytics, ML, or heavy computation?
    ↓ YES → Python (Intelligence Layer)
    ↓ NO → Re-evaluate need
```

### "Can I deploy to production?"
```
Has this been tested in staging for 24+ hours?
    ↓ NO → Cannot deploy
    ↓ YES
Do I have 2+ approvals?
    ↓ NO → Cannot deploy
    ↓ YES
Is there a rollback plan?
    ↓ NO → Cannot deploy
    ↓ YES → ✅ Deploy
```

### "Is this a breaking API change?"
```
Am I removing a field, changing a type, or renaming?
    ↓ YES → Breaking change → Requires new version
    ↓ NO
Am I adding a new required field?
    ↓ YES → Breaking change → Requires new version
    ↓ NO → Non-breaking → Can deploy in same version
```

---

## 📋 Checklists

### New Feature Checklist
- [ ] Design reviewed against [ARCHITECTURE.md](./ARCHITECTURE.md)
- [ ] Language choice follows [LANGUAGE_RULES.md](./LANGUAGE_RULES.md)
- [ ] All dependencies approved in [STACK.md](./STACK.md)
- [ ] APIs follow [API_GOVERNANCE.md](./API_GOVERNANCE.md)
- [ ] Database changes follow [DATA_GOVERNANCE.md](./DATA_GOVERNANCE.md)
- [ ] Tests written (unit + integration)
- [ ] Code reviewed (2+ approvals)
- [ ] Tested in staging
- [ ] Documentation updated

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Tested in staging for 24+ hours
- [ ] Database migration tested
- [ ] Rollback plan documented
- [ ] Stakeholders notified
- [ ] Deployment approved per [DEPLOYMENT_RULES.md](./DEPLOYMENT_RULES.md)

### Incident Response Checklist
- [ ] Severity assigned (P0/P1/P2/P3)
- [ ] Status page updated
- [ ] On-call engineer notified
- [ ] Incident logged in #incidents
- [ ] Followed [INCIDENT_PLAYBOOK.md](./INCIDENT_PLAYBOOK.md) procedures
- [ ] Post-mortem scheduled (for P0/P1)

---

## 🆘 Emergency Contacts

| Role | Contact | Response Time |
|------|---------|---------------|
| **Primary On-Call** | on-call@kangqore.com | < 15 minutes |
| **Tech Lead** | [REDACTED] | < 30 minutes |
| **CTO** | [REDACTED] | < 1 hour |
| **Incident Channel** | #incidents (Slack) | Immediate |
| **Status Page** | https://status.kangqore.com | - |

---

## 🔄 Manual Updates

### How to Update This Manual
1. Create PR with proposed changes
2. Request review from Architecture Review Board
3. Minimum 3 approvals required
4. Announce changes in #engineering channel
5. Update "Last Updated" date in each document

### Manual Version
- **Created**: 2026-01-08
- **Last Updated**: 2026-01-08
- **Version**: 1.0.0

---

## 🎓 Onboarding

### New Team Member Checklist
**Week 1**:
- [ ] Read entire Operating Manual (all 7 documents)
- [ ] Set up local development environment
- [ ] Review [ARCHITECTURE.md](./ARCHITECTURE.md) with mentor
- [ ] Review [LANGUAGE_RULES.md](./LANGUAGE_RULES.md) with mentor

**Week 2**:
- [ ] Review [API_GOVERNANCE.md](./API_GOVERNANCE.md)
- [ ] Review [DATA_GOVERNANCE.md](./DATA_GOVERNANCE.md)
- [ ] Make first small contribution (following all rules)

**Week 3**:
- [ ] Review [DEPLOYMENT_RULES.md](./DEPLOYMENT_RULES.md)
- [ ] Shadow a deployment to staging
- [ ] Review [INCIDENT_PLAYBOOK.md](./INCIDENT_PLAYBOOK.md)

**Week 4**:
- [ ] Make first significant feature contribution
- [ ] Shadow on-call engineer
- [ ] Quiz: Test knowledge of Operating Manual

---

## ⚖️ Governance

### Architecture Review Board
**Members**: Tech Lead, Senior Backend Engineer, Senior Frontend Engineer, DevOps Lead

**Responsibilities**:
- Approve/reject technology additions
- Review architectural decisions
- Update Operating Manual
- Resolve disputes

**Meeting**: Weekly on Wednesdays at 2pm

### Approval Requirements

| Change Type | Approvals Required | Authority |
|-------------|-------------------|-----------|
| **Operating Manual Update** | 3 ARB members | Architecture Review Board |
| **New Technology** | 3 ARB members | Architecture Review Board |
| **Breaking API Change** | 2 engineers + Tech Lead | API Governance Board |
| **Production Deployment** | 2 engineers | Release Manager |
| **Emergency Hotfix** | 1 Tech Lead | On-Call Engineer |

---

## 🚫 Non-Negotiable Rules

These rules have **ZERO exceptions**:

1. ✅ Frontend ONLY calls Node.js Core Backend
2. ✅ Only Node.js writes to database
3. ✅ All technologies must be approved
4. ✅ All APIs must be versioned
5. ✅ All database changes via migrations
6. ✅ Production requires 2+ approvals
7. ✅ Breaking changes require 90-day deprecation

**Violations will result in**:
- Deployment blocked
- Code review rejected
- Escalation to CTO

---

## 📞 Getting Help

### Questions?
- **Architecture**: Post in #architecture-help
- **Deployment**: Post in #devops-help
- **APIs**: Post in #backend-help
- **Database**: Post in #database-help
- **Incident**: Post in #incidents

### Disputes?
- Escalate to Architecture Review Board
- Email: arb@kangqore.com
- Decision communicated within 48 hours

---

## 📊 Metrics & Compliance

We track compliance with this Operating Manual:

| Metric | Target | Current |
|--------|--------|---------|
| **Code reviews following rules** | 100% | - |
| **Deployments without rollback** | >95% | - |
| **Incidents with proper post-mortem** | 100% | - |
| **Unapproved tech in codebase** | 0 | - |

---

## 🎯 Success Criteria

You understand this Operating Manual when you can:
- ✅ Explain the architecture mental model to a new hire
- ✅ Decide whether to use Node.js or Python for a feature
- ✅ Determine if an API change is breaking
- ✅ Deploy to production without assistance
- ✅ Respond to a P0 incident following the playbook

---

## 🔐 Confidentiality

- **Distribution**: Internal to Kangqore engineering team only
- **Do Not Share**: Outside the company without approval
- **Updates**: Communicated via #engineering channel

---

**Remember**: When in doubt, refer to this manual. No debate. No reinterpretation. No drift.

---

**Status**: ✅ ACTIVE - MANDATORY COMPLIANCE REQUIRED  
**Last Updated**: 2026-01-08  
**Authority**: CTO & Architecture Review Board
