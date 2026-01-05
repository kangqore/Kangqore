# Admin Roles

This document defines administrative roles for the Kangqore backend.

Roles are intentionally minimal to prevent ambiguity and scope creep.

---

## 1. Current Role (Phase 1)

### Admin

The **Admin** role is the only active role in Phase 1.

Admins can:
- Authenticate into the backend
- Create and manage other admins
- Change admin passwords
- Access internal insights
- Perform controlled uploads
- View operational logs

Admins have full internal access.

---

## 2. Responsibility Model

With full access comes responsibility.

Admins are expected to:
- Follow internal security guidelines
- Avoid sharing credentials
- Use uploads and insights only for business purposes
- Treat backend access as privileged

All admin actions are logged.

---

## 3. Future Roles (Explicitly Not Implemented)

The following roles are **documented for future clarity only**:

- **Editor**  
  Would manage content and uploads without admin privileges

- **Viewer**  
  Would have read-only access to insights

These roles:
- Do NOT exist in Phase 1
- Are NOT implemented in code
- Require explicit PO approval to introduce

---

## 4. Non-Goals

- No role-based permissions beyond Admin in Phase 1
- No external user roles
- No customer or partner access
- No dynamic role creation

Role expansion is intentionally deferred.
