# Kangqore Backend

This backend supports **internal Kangqore operations only**.
It is not a public API and must not be exposed externally.

---

## 1. Purpose
The backend provides:
- Admin authentication & management
- Internal insights APIs
- Controlled file uploads
- Operational logging

---

## 2. Prerequisites
- Python 3.x
- Virtual environment
- PostgreSQL (or configured DB)
- Environment variables set via `.env`

---

## 3. Setup & Run

1. Create and activate a virtual environment
2. Install dependencies:
3. Copy environment file:
4. Update `.env` with real values
5. Run the server:

Server starts on the configured port.

---

## 4. Authentication

- All protected endpoints require an admin token
- Token is passed via:

Unauthenticated requests receive `401 Unauthorized`.

---

## 5. Core Endpoints (Internal)

> Exact routes may vary; this list documents intent.

### Auth
- `POST /auth/login`
- `POST /auth/change-password`

### Admin Management
- `POST /admins/create`
- `POST /admins/disable`
- `GET /admins/list`

### Insights
- `GET /insights`

### Uploads
- `POST /uploads`

---

## 6. Error Handling

- Authentication errors return `401`
- Authorization errors return `403`
- Validation errors return `400`
- Server errors return `500`

Responses do not expose internal stack traces.

---

## 7. Operational Notes

- Internal use only
- No public exposure
- No customer data
- All activity is logged
## Admin Roles & Permissions

Administrative access is governed by:
- `docs/ADMIN_ROLES.md`

Role expansion is intentionally deferred and requires Product Owner approval.
