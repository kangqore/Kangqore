/**
 * Auth & Dashboard Routes
 *
 * Auth pages (login, signup, etc.) are served by this frontend.
 *
 * ALL /dashboard/* routes redirect to the dashboard-os app.
 * The DashboardRedirect component maps old paths to their dashboard-os equivalents:
 *
 *   /dashboard/admin/*          →  /kangqore-view/admin/...
 *   /dashboard/client/*         →  /kangqore-view/client/...
 *   /dashboard/partner/*        →  /kangqore-view/partner/...
 *   /dashboard/investor/*       →  /kangqore-view/investor/...
 *   /dashboard/careers/*        →  /kangqore-view/careers/...
 *   /dashboard/calendar         →  /kangqore-view/admin/settings/calendar
 *   /dashboard/webhooks         →  /kangqore-view/admin/settings/webhooks
 *   /dashboard/workflows        →  /kangqore-view/admin/settings/workflows
 *   /dashboard/email-templates  →  /kangqore-view/admin/settings/email-templates
 *   /dashboard/custom-domains   →  /kangqore-view/admin/settings/custom-domains
 */

import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import DashboardRedirect from '../components/DashboardRedirect';

const Login         = React.lazy(() => import('../pages/Login'));
const DevAdminLogin = React.lazy(() => import('../pages/DevAdminLogin'));
const AuthCallback  = React.lazy(() => import('../pages/AuthCallback'));
const ForgotPassword = React.lazy(() => import('../pages/ForgotPassword'));
const ResetPassword  = React.lazy(() => import('../pages/ResetPassword'));
const ChangePassword = React.lazy(() => import('../pages/ChangePassword'));
const SSOCallbackPage = React.lazy(() => import('../os/pages/auth/SSOCallbackPage').then(m => ({ default: m.SSOCallbackPage })));

// KangqoreVis — Visibility Intelligence admin pages (separate product, not in dashboard-os)
import { kangqoreVisAdminRoutes } from '../kangqore-vis';

export const authRoutes = [

  // ── Auth pages ────────────────────────────────────────────────────────────
  <Route key="auth-callback"   path="/auth/callback"     element={<AuthCallback />}   />,
  <Route key="sso-callback"    path="/sso/callback"      element={<SSOCallbackPage />} />,
  <Route key="dev-admin-login" path="/dev-admin-login"   element={<DevAdminLogin />}   />,
  <Route key="login"           path="/login"              element={<Login />}           />,
  <Route key="register"        path="/register"           element={<Navigate to="/login" replace />} />,
  <Route key="signup"          path="/signup"             element={<Navigate to="/login" replace />} />,
  <Route key="forgot-password" path="/forgot-password"   element={<ForgotPassword />}  />,
  <Route key="reset-password"  path="/reset-password"    element={<ResetPassword />}   />,
  <Route key="change-password" path="/change-password"   element={<ChangePassword />}  />,

  // ── Legacy convenience redirects ─────────────────────────────────────────
  <Route key="settings-redirect"    path="/settings"      element={<DashboardRedirect />} />,
  <Route key="profile-redirect"     path="/profile"       element={<DashboardRedirect />} />,
  <Route key="client-portal-redirect" path="/client-portal" element={<Navigate to="/dashboard/client" replace />} />,

  // ── Dashboard → dashboard-os (catch-all wildcards) ───────────────────────
  // Settings pages
  <Route key="dashboard-calendar"       path="/dashboard/calendar"        element={<DashboardRedirect />} />,
  <Route key="dashboard-email-templates"path="/dashboard/email-templates" element={<DashboardRedirect />} />,
  <Route key="dashboard-webhooks"       path="/dashboard/webhooks"        element={<DashboardRedirect />} />,
  <Route key="dashboard-workflows"      path="/dashboard/workflows"       element={<DashboardRedirect />} />,
  <Route key="dashboard-custom-domains" path="/dashboard/custom-domains"  element={<DashboardRedirect />} />,

  // Role-based portals and admin — single wildcard per role
  <Route key="dashboard-admin"    path="/dashboard/admin/*"    element={<DashboardRedirect />} />,
  <Route key="dashboard-client"   path="/dashboard/client/*"   element={<DashboardRedirect />} />,
  <Route key="dashboard-partner"  path="/dashboard/partner/*"  element={<DashboardRedirect />} />,
  <Route key="dashboard-investor" path="/dashboard/investor/*" element={<DashboardRedirect />} />,
  <Route key="dashboard-careers"  path="/dashboard/careers/*"  element={<DashboardRedirect />} />,

  // Bare /dashboard and /dashboard/<anything-unmatched>
  <Route key="dashboard-bare"     path="/dashboard"    element={<DashboardRedirect />} />,
  <Route key="dashboard-catchall" path="/dashboard/*"  element={<DashboardRedirect />} />,

  // Legacy /admin/dashboard path
  <Route key="admin-dashboard-old" path="/admin/dashboard" element={<DashboardRedirect />} />,

  // KangqoreVis — still served from this frontend (separate product)
  ...kangqoreVisAdminRoutes,
];

export default authRoutes;
