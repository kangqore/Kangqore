import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const OS_URL = import.meta.env.VITE_DASHBOARD_OS_URL || '';

/**
 * Maps a /dashboard/... path from the old frontend to its
 * equivalent path in the dashboard-os app.
 *
 * Portals keep the same sub-path structure:
 *   /dashboard/client/projects  →  /portal/client/projects
 *   /dashboard/partner/meetings →  /portal/partner/meetings
 *   /dashboard/investor/reports →  /portal/investor/reports
 *   /dashboard/careers/jobs     →  /portal/careers/jobs
 *
 * Admin paths map to /os/ modules:
 *   /dashboard/admin            →  /os/
 *   /dashboard/admin/leads      →  /os/leads
 *   /dashboard/admin/clients    →  /os/clients
 *   /dashboard/admin/partners   →  /os/partners
 *   /dashboard/admin/analytics  →  /os/analytics
 *   /dashboard/admin/finance    →  /os/finance
 *   /dashboard/admin/careers    →  /os/careers
 *   /dashboard/admin/projects   →  /os/projects
 *   /dashboard/admin/resources  →  /os/resources
 *   /dashboard/admin/kpi        →  /os/analytics
 *   /dashboard/admin/kimmp*     →  /os/kimmp
 *   /dashboard/admin/...other   →  /os/
 *
 * Settings/account paths:
 *   /dashboard/calendar         →  /os/settings/calendar
 *   /dashboard/webhooks         →  /os/settings/webhooks
 *   /dashboard/workflows        →  /os/settings/workflows
 *   /dashboard/email-templates  →  /os/settings/email-templates
 *   /dashboard/custom-domains   →  /os/settings/custom-domains
 */
function mapPath(pathname) {
  const p = pathname.replace(/\/+$/, ''); // strip trailing slash

  // ── Auth ──────────────────────────────────────────────────────────────────
  if (['/login', '/signup', '/forgot-password', '/reset-password'].includes(p)) {
    return p;
  }

  // ── Portal routes ─────────────────────────────────────────────────────────
  for (const role of ['client', 'partner', 'investor', 'careers']) {
    const prefix = `/dashboard/${role}`;
    if (p === prefix || p.startsWith(prefix + '/')) {
      return `/kangqore-view/${role}${p.slice(prefix.length) || '/'}`;
    }
  }

  // ── Settings routes (non-admin dashboard pages) ───────────────────────────
  const settingsMap = {
    '/dashboard/calendar':        '/kangqore-view/admin/settings/calendar',
    '/dashboard/webhooks':        '/kangqore-view/admin/settings/webhooks',
    '/dashboard/workflows':       '/kangqore-view/admin/settings/workflows',
    '/dashboard/email-templates': '/kangqore-view/admin/settings/email-templates',
    '/dashboard/custom-domains':  '/kangqore-view/admin/settings/custom-domains',
  };
  if (settingsMap[p]) return settingsMap[p];

  // ── Admin routes ──────────────────────────────────────────────────────────
  const adminPrefix = '/dashboard/admin';
  if (p === adminPrefix || p.startsWith(adminPrefix + '/')) {
    const sub = p.slice(adminPrefix.length + 1); // e.g. "leads", "clients/123"
    const adminModuleMap = {
      'leads':         '/kangqore-view/admin/leads',
      'clients':       '/kangqore-view/admin/clients',
      'partners':      '/kangqore-view/admin/partners',
      'analytics':     '/kangqore-view/admin/analytics',
      'kpi':           '/kangqore-view/admin/analytics',
      'finance':       '/kangqore-view/admin/finance',
      'billing':       '/kangqore-view/admin/finance',
      'careers':       '/kangqore-view/admin/careers',
      'projects':      '/kangqore-view/admin/projects',
      'resources':     '/kangqore-view/admin/resources',
      'departments':   '/kangqore-view/admin/departments',
      'marketing':     '/kangqore-view/admin/marketing',
      'kimmp-pages':   '/kangqore-view/admin/kangqore-immp',
      'kimmp':         '/kangqore-view/admin/kangqore-immp',
      'kangqore-immp': '/kangqore-view/admin/kangqore-immp',
      'investors':     '/kangqore-view/admin/investors',
      'strategy':      '/kangqore-view/admin/strategy',
      'workflows':     '/kangqore-view/admin/workflows',
      'comms':         '/kangqore-view/admin/comms',
      'consultations': '/kangqore-view/admin/consultations',
      'delivery':      '/kangqore-view/admin/delivery',
      'governance':    '/kangqore-view/admin/governance',
      'systems':       '/kangqore-view/admin/systems',
      'agent-logs':    '/kangqore-view/admin/agent-logs',
      'scheduling':    '/kangqore-view/admin/scheduling',
    };

    const firstSegment = sub.split('/')[0];
    if (firstSegment && adminModuleMap[firstSegment]) {
      const rest = sub.slice(firstSegment.length);
      return adminModuleMap[firstSegment] + rest;
    }

    return '/kangqore-view/admin';
  }

  // ── Fallback ──────────────────────────────────────────────────────────────
  return '/kangqore-view/admin';
}

/**
 * Builds a URL hash that carries the current auth session to dashboard-os.
 *
 * localStorage is origin-scoped (protocol + host + port). In production both
 * apps share the same origin via Nginx, so this is a no-op (OS_URL is empty).
 * In dev (different ports) we thread the token + user through the hash so the
 * user doesn't land on a login screen after redirect.
 *
 * dashboard-os reads and strips this hash on startup (see store/auth.ts).
 */
function buildAuthHash() {
  if (!OS_URL) return ''; // same origin in production — no forwarding needed
  try {
    const token = localStorage.getItem('token');
    const user  = localStorage.getItem('user');
    if (!token || !user) return '';
    const params = new URLSearchParams();
    params.set('_t', token);
    params.set('_u', user);
    return '#' + params.toString();
  } catch {
    return '';
  }
}

/**
 * Drop-in route component. Immediately redirects the browser to
 * the dashboard-os app at the mapped path.
 *
 * When OS_URL points to a different port (dev), the current auth session is
 * forwarded via URL hash so the user doesn't have to log in again.
 */
export default function DashboardRedirect() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const mappedPath = mapPath(pathname);
    const authHash   = buildAuthHash();
    const target     = `${OS_URL}${mappedPath}${search}${authHash}`;
    window.location.replace(target);
  }, [pathname, search]);

  return null;
}
