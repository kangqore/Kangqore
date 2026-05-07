# Kangqore Enterprise Website - PRD

## Original Problem Statement
Build and maintain a comprehensive enterprise website for Kangqore, featuring:
- Multi-role authentication system (Client, Partner, Investor, Job Seeker, Admin)
- Role-based dashboards with access control
- Content Management System (CMS) for Admins
- Content pages (blogs, case studies, white papers, events, brochures)
- Industry and service pages
- Corporate pages (About, Leadership, Partners, etc.)

## Core Requirements

### 1. Authentication & Access Control
- Five distinct user roles: CLIENT, PARTNER, INVESTOR, JOB_SEEKER, ADMIN
- Admin approval workflow for new user registrations
- Role-based dashboard access
- JWT-based authentication

### 2. Content Management System (Admin Only)
- Full CRUD for content (blogs, case studies, white papers, events, news, brochures)
- Rich text editor with formatting toolbar
- Image and document upload support (Media Library)
- Publish/Unpublish workflow
- Content filtering by type and status

### 3. Content Pages
- Blogs: 6 blog posts with detail pages
- Case Studies: 6 case studies with detail pages
- White Papers: 6 white papers with detail pages
- Events: 7 events (4 upcoming, 3 past) with detail pages
- Brochures: 6 downloadable brochures

### 4. UI/UX Features
- Video background hero section
- Redesigned feature cards with popup modals
- Knowledge Network community page
- Improved footer design
- **Social sharing buttons on all content pages**

## What's Been Implemented

### January 3, 2025 (Latest Session)

#### Services Page Implementation:
- [x] **Services Page Created** - New dedicated `/services` page:
  - Hero section with blue gradient background matching GlobalLogic design
  - Stats cards showing 15 Departments, 77 Services, 500+ Projects, 98% Satisfaction
  - "Explore our services" featured section with 6 highlighted departments
  - "15 Departments, 77 Services" accordion section - all departments expandable
  - "Why Choose Us" section with 4 feature cards
  - Bottom CTA section with contact links
  - Fully responsive (mobile-friendly)
- [x] **Navigation Links Updated**:
  - Header "What We Do" dropdown has "View All Services" button
  - Footer "What We Do" section has "View All Services →" link
  - ExploreServices component on homepage links to /services
  - Mobile menu has "View All Services" link

#### P1 Tasks Completed:
- [x] **Navigate Import Fix** - Fixed critical frontend crash
- [x] **Rich Text Editor for CMS** - Custom React 19-compatible RichTextEditor
- [x] **Dashboard Backend APIs** - All 4 non-admin dashboards connected to backend
- [x] **Admin Approval Workflow UI** - Already existed and verified working

#### P2 Tasks Completed:
- [x] **AdminDashboard Refactoring** - Split 900+ line file into smaller components:
  - `components/admin/UserManagement.jsx` - User stats and approvals
  - `components/admin/ContentManagement.jsx` - Content list and filters
  - `components/admin/ContentFormModal.jsx` - Content create/edit form
  - `components/admin/MediaLibrary.jsx` - Media library with upload
- [x] **App.js Routing Refactoring** - Split into modular route files:
  - `routes/authRoutes.jsx` - Auth and dashboard routes
  - `routes/publicRoutes.jsx` - General public pages
  - `routes/industryRoutes.jsx` - 12 industry pages
  - `routes/contentRoutes.jsx` - Insights, blogs, case studies, events, white papers
  - `routes/serviceRoutes.jsx` - 77 service pages
- [x] **Media Library** - Full-featured media management:
  - Backend: `/api/admin/media/*` endpoints (upload, list, delete, bulk-delete, stats)
  - Supports images (JPG, PNG, GIF, WebP, SVG) up to 10MB
  - Supports documents (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX) up to 50MB
  - Grid and list view, folder organization, search
  - New "Media Library" tab in Admin Dashboard
- [x] **Switch Dashboard View** - Enhanced admin sidebar with "Preview As" section:
  - Links to Client, Partner, Investor, Job Seeker dashboards
  - Icons and hover effects for each role
- [x] **Global Search** - Site-wide search functionality:
  - Backend: `/api/search` endpoint searching published content
  - Frontend: `GlobalSearch.jsx` modal component
  - Search icon in header opens modal
  - Searches across all published content types
  - Quick suggestions and empty state handling

#### Social Sharing Feature:
- [x] **ShareButtons Component** - Reusable social sharing for all content pages:
  - Platforms: Facebook, X (Twitter), LinkedIn, WhatsApp, Telegram, Reddit, Threads, Email
  - Copy link to clipboard functionality
  - Two variants: horizontal (inline) and floating (sidebar)
  - Integrated into `ContentDetailLayout.jsx` for automatic support in all content pages

### December 2024-January 2025 (Previous)
- [x] Enterprise authentication system (5 roles)
- [x] User approval workflow with Approve/Reject buttons
- [x] Role-based login and registration pages
- [x] Five dashboard shells (now connected to APIs)
- [x] Homepage redesign with video hero
- [x] Footer UI improvements
- [x] Content Management System (CMS) in Admin Dashboard
- [x] Enterprise Content Detail Pages Redesign
- [x] Investor Relations Page Redesign

## Prioritized Backlog

### P3 - Future Enhancements
- [ ] Add real-time notifications system
- [ ] Email notifications for user approvals
- [ ] Analytics dashboard for admins
- [ ] Advanced content scheduling (publish date/time)
- [ ] Content versioning/revision history
- [ ] User activity logging

## Key Files Reference

### Frontend - Components
- `/app/frontend/src/components/ShareButtons.jsx` - **NEW** Social sharing component
- `/app/frontend/src/components/GlobalSearch.jsx` - **NEW** Global search modal
- `/app/frontend/src/components/RichTextEditor.jsx` - Rich text editor
- `/app/frontend/src/components/ContentDetailLayout.jsx` - Content page layout (with sharing)
- `/app/frontend/src/components/DashboardLayout.jsx` - Dashboard layout (with role switcher)
- `/app/frontend/src/components/Header.jsx` - Header with search button

### Frontend - Admin Components
- `/app/frontend/src/components/admin/UserManagement.jsx`
- `/app/frontend/src/components/admin/ContentManagement.jsx`
- `/app/frontend/src/components/admin/ContentFormModal.jsx`
- `/app/frontend/src/components/admin/MediaLibrary.jsx`

### Frontend - Routes
- `/app/frontend/src/routes/authRoutes.jsx`
- `/app/frontend/src/routes/publicRoutes.jsx`
- `/app/frontend/src/routes/industryRoutes.jsx`
- `/app/frontend/src/routes/contentRoutes.jsx`
- `/app/frontend/src/routes/serviceRoutes.jsx`

### Frontend - Pages
- `/app/frontend/src/pages/dashboards/AdminDashboard.jsx` - Refactored admin dashboard
- `/app/frontend/src/pages/dashboards/ClientDashboard.jsx` - API-connected
- `/app/frontend/src/pages/dashboards/PartnerDashboard.jsx` - API-connected
- `/app/frontend/src/pages/dashboards/InvestorDashboard.jsx` - API-connected
- `/app/frontend/src/pages/dashboards/CareersDashboard.jsx` - API-connected

### Backend
- `/app/backend/routes/media.py` - **NEW** Media library API
- `/app/backend/routes/search.py` - **NEW** Global search API
- `/app/backend/routes/dashboard.py` - Dashboard data APIs
- `/app/backend/routes/content.py` - Content CRUD API
- `/app/backend/routes/auth.py` - Authentication API

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/me` - Current user
- `GET /api/auth/admin/stats` - Admin statistics
- `PUT /api/auth/admin/users/{id}/approve` - Approve user
- `PUT /api/auth/admin/users/{id}/reject` - Reject user

### Content Management (Admin Only)
- `GET/POST /api/admin/content` - List/Create content
- `GET/PUT/DELETE /api/admin/content/{id}` - CRUD content
- `POST /api/admin/content/{id}/publish` - Publish
- `POST /api/admin/content/{id}/unpublish` - Unpublish

### Media Library (Admin Only)
- `POST /api/admin/media/upload` - Upload media
- `GET /api/admin/media` - List media with filters
- `GET /api/admin/media/stats` - Media statistics
- `DELETE /api/admin/media/{id}` - Delete media
- `POST /api/admin/media/bulk-delete` - Bulk delete

### Search (Public)
- `GET /api/search?q={query}` - Search published content
- `GET /api/search/suggestions?q={query}` - Search suggestions

### Dashboard Data (Role-Protected)
- `GET /api/dashboard/client/*` - Client dashboard data
- `GET /api/dashboard/partner/*` - Partner dashboard data
- `GET /api/dashboard/investor/*` - Investor dashboard data
- `GET /api/dashboard/careers/*` - Job seeker dashboard data

## Test Credentials
- **Admin**: admin@kangqore.com / AdminAccess@2025

## Test Reports
- `/app/test_reports/iteration_3.json` - P1 features test
- `/app/test_reports/iteration_4.json` - P2 features test (in progress)

## Technical Notes
- Frontend: React 19 + React Router + Tailwind CSS + Shadcn/UI
- Backend: FastAPI + MongoDB + Motor (async)
- Rich Text: Custom contentEditable-based editor (React 19 compatible)
- Media uploads stored in `/app/backend/uploads/`
- Social sharing via native share URLs (no third-party SDK required)
