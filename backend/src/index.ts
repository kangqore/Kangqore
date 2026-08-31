import './config/https-fix';
import './config/env';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import passport from 'passport';

import authRoutes from './routes/auth';
import oauthRoutes from './routes/oauth';
import samlRoutes from './routes/saml';
import './config/passport'; // Init strategies
import sessionRoutes from './routes/sessions';
import profileRoutes from './routes/profile';
import consultationRoutes from './routes/consultations';
import contactRoutes from './routes/contact';
import careersRoutes from './routes/careers';
import chatbotRoutes from './routes/chatbot';
import aiConciergeRoutes from './routes/ai-concierge';
import adminConciergeRoutes from './routes/admin-concierge';
import projectRoutes from './routes/projects';
import dashboardRoutes from './routes/dashboard';
import mediaRoutes from './routes/media';
import contentRoutes from './routes/content';
import uploadRoutes from './routes/uploads';
import searchRoutes from './routes/search';
import adminRoutes from './routes/admin';
import analyticsRoutes from './routes/analytics';
import newsletterRoutes from './routes/newsletter';
import notificationRoutes from './routes/notifications';
import metricsRoutes from './routes/metrics';
import recommendationsRoutes from './routes/recommendations';
import meetingsRoutes from './routes/meetings';
import clientRoutes from './routes/client';
import teamProvisioningRoutes from './routes/team-provisioning';
import messagesRoutes from './routes/messages';
import investorRoutes from './routes/investor'; // NEW // NEW // NEW
import partnerRoutes from './routes/partner'; // NEW // NEW // NEW
import ticketsRoutes from './routes/tickets'; // NEW
import riskRoutes from './routes/risks'; // NEW
import decisionRoutes from './routes/decisions'; // NEW
import invoiceRoutes from './routes/invoices'; // NEW
import expenseRoutes from './routes/expenses';
import documentRoutes from './routes/documents'; // NEW
import deliverablesRoutes from './routes/deliverables'; // NEW
import clientProfileRoutes from './routes/clientProfile'; // NEW (MNC Pillar 1)
import clientWaandaRoutes from './routes/client-waanda';
import accountabilityRoutes from './routes/accountability'; // NEW (MNC Shared Layer)
import feedbackRoutes from './routes/feedback'; // NEW
import schedulingRoutes from './routes/scheduling';
import { eqorePublicRoutes } from './eqore/routes';
import { eqoreLeadIntelligenceRoutes } from './eqore-lead-intelligence';
import './eqore/queue/shadowLead.worker';  // instantiates EqoreShadowWorker — listens on eqore-shadow-analysis queue
import './eqore/queue/nurture.worker';     // instantiates EqoreNurtureWorker  — listens on eqore-nurture queue
import { alisRouter } from './kangqore-alis';
import { kangqoreImmpRoutes } from './kangqore-immp';
import { urgiRoutes } from './kangqore-immp/relationship-intelligence/api/urgi.routes';
import { aegisRouter, aegisShield, aegisAccessLogger, aegisEgressMonitor } from './kangqore-aegis';
import { waandaRouter } from './kangqore-view/waanda/waandaRoutes';
import { waandaTrainingRouter } from './kangqore-view/waanda/training';
import { dataPrivacyRouter } from './routes/data-privacy';
import { communitiesRouter } from './communities/routes';
import { developerRouter } from './routes/developer';
import { itilRouter } from './routes/itil';
import orgsRouter from './routes/orgs';
import integrationsRouter   from './routes/integrations';
import semanticMappingRouter from './routes/semanticMapping';
import packsRouter           from './routes/packs';
import cdcRouter             from './routes/cdc';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import { WAANDA } from './kangqore-view/waanda/WaandaBootstrap';
import { hyperGraphDaemon } from './kangqore-view/kernel/hypergraph/hyperGraphSync.daemon';
import { authenticate, authorize } from './middleware/auth';
import { apiKeyAuth } from './middleware/apiKeyAuth';
import { v1RateLimiter } from './middleware/v1RateLimiter';
import { v1Router } from './v1/router';

import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { legacyRedirectsMiddleware } from './middleware/legacyRedirects';
import { dashboardRedirectMiddleware } from './middleware/dashboardRedirect';
import { customDomainRouter } from './middleware/customDomainRouter';
import { initializeSocket } from './socket';
import { initializeVoiceGateway } from './voice/voiceGateway';


// Server restart trigger 12345678901234567890
// Initialize Prisma Client
import { prisma } from './lib/prisma';
import { sendPushToAll } from './kangqore-view/awareness/notifications/PushNotificationService';
export { prisma };

// S82 — Push notifications: intercept all KimmpSignal creates, push on HIGH/CRITICAL
(prisma as any).$use(async (params: any, next: (p: any) => Promise<any>) => {
  const result = await next(params)
  if (params.model === 'KimmpSignal' && params.action === 'create') {
    const sig = result
    if (sig?.priority === 'critical' || sig?.priority === 'high') {
      sendPushToAll({
        title: `KIMMP Signal: ${sig.title ?? sig.type}`,
        body: sig.summary ?? sig.title ?? '',
        type: sig.type,
        url: '/kangqore-view/admin/kangqore-immp/signals',
      }).catch(() => {})
    }
  }
  return result
})

// Environment Variable Validation
const requiredEnvVars = ['DATABASE_URL', 'REDIS_URL'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error(`FATAL: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for serving frontend
  crossOriginEmbedderPolicy: false,
  frameguard: false // Allow embedding in iframes for the scheduling widget
}));
app.use(passport.initialize());
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5500', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'http://10.23.184.152:3000', 'http://10.23.184.152:3001'],
  credentials: true
}));
// S88: capture raw body for Stripe webhook signature verification (must precede express.json)
app.use('/api/admin/kangqore-immp/billing/webhook', express.raw({ type: 'application/json' }), (req: any, _res: any, next: any) => {
  req.rawBody = req.body
  next()
})
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));

// Custom domain detection — attaches req.customDomain for white-label booking pages
app.use(customDomainRouter);

// Rate limiting
app.use(rateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/test-restart', (req, res) => {
  res.json({ message: 'RESTARTED' });
});

// API Routes
app.use('/api/documents', documentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/team', teamProvisioningRoutes);
app.use('/api/auth/saml', samlRoutes);
app.use('/api/oauth', oauthRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/careers', careersRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/accountability', accountabilityRoutes); // Shared Accountability Layer
app.use('/api/admin', adminRoutes);

import adminPmoRoutes from './routes/admin-pmo'; // Phase 3
app.use('/api/admin/pmo', adminPmoRoutes); // New PMO Route

import adminVendorRoutes from './routes/admin-vendors'; // Phase 3
app.use('/api/admin/vendors', adminVendorRoutes); // New Vendor Route

import adminServiceRoutes from './routes/admin-services'; // Phase 3
app.use('/api/admin/services', adminServiceRoutes); // New Service Route

import publicContentRoutes from './routes/public_content';
// ...
app.use('/api/admin/media', mediaRoutes);
app.use('/api/admin/content', contentRoutes);
// admin-ip routes (reserved for future use)
import koreRoutes from './kangqore-view/kore/api/kore.routes'; // NEW KEOS Layer

// SECURITY: do not re-mount kangqoreImmpRoutes here. It is already mounted below
// at /api/admin/kangqore-immp behind aegisAccessLogger + aegisEgressMonitor; a second,
// unwrapped mount would let every KIMMP route bypass AEGIS governance logging entirely.
app.use('/api/kangqore/urgi', authenticate, urgiRoutes);
app.use('/api/kangqore/kore', koreRoutes); // Mount KEOS KORE APIs

app.use('/api/content', publicContentRoutes); // Public access
app.use('/api/communities', communitiesRouter); // S71 — real communities backend
app.use('/api/uploads', uploadRoutes);
app.use('/api/search', searchRoutes);
import developerRoutes from './routes/developer.routes';
import agentUxRoutes from './routes/agentUx.routes';
import decisionEngineRoutes from './routes/decisionEngine.routes';
// Phase 5 — single mount. Auth is applied per-route inside the router: human
// developers via `authenticate`, installed apps via OAuth bearer introspection,
// and only the OAuth token endpoint is public. Previously this was mounted
// twice (the second at /api/marketplace produced /api/marketplace/marketplace/*)
// and with no auth at all, exposing app-credential creation.
app.use('/api/developer', developerRoutes);
app.use('/api/agent-ux', agentUxRoutes);
app.use('/api/decision-engine', decisionEngineRoutes);
app.use('/api/admin/analytics', analyticsRoutes); // NEW
app.use('/api/analytics', analyticsRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/ai/concierge', aiConciergeRoutes);
app.use('/api/admin/concierge', adminConciergeRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/client/metrics', metricsRoutes); // Gap 31: Translation Layer
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/meetings', meetingsRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/investor', investorRoutes); // NEW // NEW // NEW
app.use('/api/partner', partnerRoutes);   // NEW // NEW // NEW
app.use('/api/tickets', ticketsRoutes);     // NEW
app.use('/api/risks', riskRoutes);          // NEW
app.use('/api/decisions', decisionRoutes);  // NEW
app.use('/api/invoices', invoiceRoutes);    // NEW
app.use('/api/expenses', expenseRoutes);
app.use('/api/partner', partnerRoutes);       // NEW
app.use('/api/deliverables', deliverablesRoutes); // NEW
app.use('/api/client-profiles', clientProfileRoutes); // NEW (MNC Pillar 1)
import changeRequestRoutes from './routes/changeRequest'; // NEW
app.use('/api/change-requests', changeRequestRoutes); // NEW
import contextRoutes from './routes/context'; // NEW (MNC Pillar 2)
app.use('/api', contextRoutes); 
import adminStrategyRoutes from './routes/admin-strategy'; // Phase 4
app.use('/api/admin/clients', adminStrategyRoutes); 
app.use('/api/feedback', feedbackRoutes); // NEW
app.use('/api/scheduling', schedulingRoutes);

// Comms email routes — client/partner/investor/career threads + reply
import { clientEmailRouter, partnerEmailRouter, investorEmailRouter, careerEmailRouter } from './routes/admin-emails';
app.use('/api/admin/client-emails',     clientEmailRouter);
app.use('/api/admin/partner-emails',    partnerEmailRouter);
app.use('/api/admin/investor-emails',   investorEmailRouter);
app.use('/api/admin/job-seeker-emails', careerEmailRouter);
app.use('/api/eqore', eqorePublicRoutes);
app.use('/api/admin/eqore', eqoreLeadIntelligenceRoutes);
app.use('/api/admin/alis', authenticate, authorize(['ADMIN']), alisRouter);
// Register ALIS + eQORE under WAANDA authority after mounts
import('./kangqore-view/waanda/adapters/AlisAdapter').then(({ AlisAdapter }) => {
  import('./kangqore-view/waanda/WaandaAuthority').then(({ WaandaAuthority }) => WaandaAuthority.register(AlisAdapter))
}).catch(() => {})
import('./kangqore-view/waanda/adapters/EqoreAdapter').then(({ EqoreAdapter }) => {
  import('./kangqore-view/waanda/WaandaAuthority').then(({ WaandaAuthority }) => WaandaAuthority.register(EqoreAdapter))
}).catch(() => {})
// BIDS™ — Business Diagnostic Intelligence System
import bidsRoutes from './routes/bids';
app.use('/api/admin/bids', bidsRoutes);
import bidsClientRoutes from './routes/bids-client';
app.use('/api/client/bids', bidsClientRoutes);
app.use('/api/client/kangqore-view/waanda', clientWaandaRoutes);
import { briefingRouter } from './routes/admin-briefing';
app.use('/api/admin/briefing', briefingRouter);
// WAANDA — Enterprise Cognitive OS boot manifest + domain registry + mission execution
app.use('/api/admin/kangqore-view/waanda', authenticate, authorize(['ADMIN']), waandaRouter);

// AEGIS — Autonomous Executive Governance & Intelligence Shield
// Sits above KIMMP: sovereign audit dashboard for ADMIN only.
app.use('/api/admin/aegis', aegisShield, aegisRouter);

// KIMMP — Human Behavior Intelligence Layer (auth applied per-route inside the router).
app.use('/api/admin/kangqore-immp', aegisAccessLogger, aegisEgressMonitor, kangqoreImmpRoutes);

// WAANDA Training Data Pipeline — Gen 1 → Gen 2 data collection (ADMIN only).
app.use('/api/admin/waanda-training', waandaTrainingRouter);

// Data Portability + GDPR — authenticated user data export / audit log / deletion requests.
app.use('/api/orgs', authenticate, orgsRouter);
app.use('/api/admin/data-privacy', authenticate, dataPrivacyRouter);

// Developer API keys.
app.use('/api/admin/developer', authenticate, developerRouter);

// ITIL — Incidents, Problems, CMDB (Sprint 7 — defeat ServiceNow).
app.use('/api/admin/itil', authenticate, authorize(['ADMIN']), itilRouter);

// OpenAPI / Swagger docs — public, no auth required.
// /spec must be registered BEFORE the /api/docs mount below: swaggerUi.setup()
// is a catch-all that responds to any GET under /api/docs with the rendered
// HTML shell and never calls next(), so if it were mounted first it would
// permanently shadow /api/docs/spec — which is exactly what was happening
// (Overshadow Roadmap P6.3 found this while verifying the swagger apis-glob fix).
app.get('/api/docs/spec', (_req, res) => res.json(swaggerSpec));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

import adminOntologyRoutes from './routes/admin-ontology';
app.use('/api/admin/ontology', adminOntologyRoutes);


import intelligenceRoutes from './routes/intelligence';
app.use('/api/admin/intelligence', intelligenceRoutes);

import adminKimmpGatewayRoutes from './routes/admin-kimmp-gateway';
app.use('/api/admin/kimmp-gateway', adminKimmpGatewayRoutes);
app.use('/api/admin/integrations', integrationsRouter);
app.use('/api/admin/semantic',     semanticMappingRouter);
app.use('/api/admin/packs',        packsRouter);
app.use('/api/admin/cdc',          cdcRouter);

import adminSearchRoutes from './routes/admin-search';
app.use('/api/admin/search', adminSearchRoutes);

import { publicVisitorRouter, adminVisitorRouter } from './routes/visitor';
app.use('/api/public/visitor', publicVisitorRouter);
app.use('/api/admin/visitor', adminVisitorRouter);

// Overshadow Roadmap P1 — "Publish the Proof": aggregate-only, no-auth
// scorecard/governance/eval endpoints. See routes/public-trust.ts header.
import { publicTrustRouter } from './routes/public-trust';
app.use('/api/public/trust', publicTrustRouter);

import { publicMarketplaceRouter } from './routes/public-marketplace';
app.use('/api/public/marketplace', publicMarketplaceRouter);

import hcipRouter from './routes/hcip';
app.use('/api/v1', apiKeyAuth, v1RateLimiter, v1Router);

app.use('/api/hcip', authenticate, authorize(['ADMIN']), hcipRouter);

import servicesRoutes from './routes/services'; // Phase 3
app.use('/api/services', servicesRoutes);

import channelsRoutes from './routes/channels';
app.use('/api/channels', channelsRoutes);





import reportsRoutes from './routes/reports'; // Gap 5
import strategyRoutes from './routes/strategy';
import resourcesRoutes from './routes/resources';
import departmentsRoutes from './routes/departments';
import marketingRoutes from './routes/marketing';
app.use('/api/reports', reportsRoutes);
app.use('/api/strategy', strategyRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/marketing', marketingRoutes);

import osWorkflowsRoutes from './routes/os-workflows';
app.use('/api/os-workflows', osWorkflowsRoutes);

// Enterprise Platform Fabrics — EDF (domain), EPF (prediction), ESF (simulation), EAF (agent)
// Satisfy WEE Constitutional Law 3 and power ExperienceAPI in the Gen III Runtime.
// CognitiveMirror polls /api/os/edf/domains + /api/os/epf/predictions every 30s.
import edfRouter from './kangqore-view/edf/edfRoutes';
import epfRouter from './kangqore-view/epf/epfRoutes';
import esfRouter from './kangqore-view/esf/esfRoutes';
import eafRouter from './kangqore-view/eaf/eafRoutes';
app.use('/api/os/edf', authenticate, edfRouter);
app.use('/api/os/epf', authenticate, epfRouter);
app.use('/api/os/esf', authenticate, esfRouter);
app.use('/api/os/eaf', authenticate, authorize(['ADMIN']), eafRouter);
import personalRouter from './kangqore-view/personal/personalRoutes';
app.use('/api/os/personal', personalRouter);

import adminClientsCrmRoutes   from './routes/admin-clients-crm';
import adminPartnersCrmRoutes  from './routes/admin-partners-crm';
import adminCrmSubentities     from './routes/admin-crm-subentities';
app.use('/api/admin/crm/clients',  adminClientsCrmRoutes);

import clientOnboardingRoutes from './routes/client-onboarding.routes';
app.use('/api/admin/client-onboarding', clientOnboardingRoutes);

import workOsRoutes from './routes/work-os.routes';
app.use('/api/admin/work-os', workOsRoutes);

// Materialise the Universal Enterprise Object Model into NOLAN on boot.
// Idempotent: types/schemas/cardinality rules are upserted, so editing
// EnterpriseObjectModel.ts and restarting is the whole update path.
import { seedEnterpriseObjectModel } from './kangqore-view/eof/EnterpriseObjectSeeder';
import { RecoveryActionSeeder } from './kangqore-view/eof/RecoveryActionSeeder';
import { seedWorkTemplates } from './kangqore-view/eof/WorkTemplateEngine';
import { startWorkAutomations } from './kangqore-view/eof/WorkAutomationEngine';
import { seedIntelligenceFields } from './kangqore-view/eof/IntelligenceFieldSeeder';
import { EnterpriseProjection } from './kangqore-view/eof/EnterpriseProjection';
import { IntelligenceEngine } from './kangqore-view/eof/IntelligenceEngine';
seedEnterpriseObjectModel()
  .then(r => console.log(`[EnterpriseObjectModel] ${r.typesCreated} created, ${r.typesUpdated} updated, ${r.cardinalityRules} cardinality rules`))
  // Types must exist before actions can be bound to them.
  .then(() => seedWorkTemplates())
  .then(r => {
    console.log(`[WorkTemplates] ${r.created} created, ${r.updated} updated`)
    // A template that cannot apply cleanly is reported here rather than
    // discovered by whoever clicks it.
    for (const bad of r.invalid) console.warn(`[WorkTemplates] INVALID ${bad}`)
  })
  .then(() => RecoveryActionSeeder.seed())
  .then(r => console.log(`[RecoveryActions] ${r.created} created, ${r.updated} updated across ${r.types} types`))
  // Mirrors real Projects and ClientCRM rows into the enterprise model so the
  // Intelligence and Decision layers run on live records. Governed changes
  // (an approved re-baseline, an escalation) are preserved, not overwritten.
  .then(() => EnterpriseProjection.run())
  .then(r => console.log(`[EnterpriseProjection] ${r.projects} projects, ${r.customers} customers, ${r.contracts} contracts`))
  // Inference must run after projection, or the INTELLIGENCE columns stay
  // empty and every query over predictedRisk / predictedCompletion returns
  // nothing — the columns would be declared, populated by no one, and quietly
  // wrong in exactly the way this model was built to avoid.
  .then(() => Promise.all(
    ['Project', 'Customer', 'Contract', 'Outcome'].map(t =>
      IntelligenceEngine.inferAndWrite(t).catch(() => ({ inferred: 0, atRisk: 0 }))),
  ))
  .then(rs => console.log(`[Intelligence] ${rs.reduce((n, r) => n + r.inferred, 0)} objects scored, ${rs.reduce((n, r) => n + r.atRisk, 0)} at risk`))
  // The wire that was missing: the automation engine existed, the CDC feed
  // existed, and nothing connected them.
  .then(() => seedIntelligenceFields())
  .then(r => console.log(`[IntelligenceFields] ${r.created} created, ${r.updated} updated, ${r.disabled} seeded disabled`))
  .then(() => startWorkAutomations())
  .then(r => console.log(`[WorkAutomations] subscribed to CDC, ${r.active} active`))
  .catch(e => console.warn('[EnterpriseObjectModel] seed failed:', e.message));
app.use('/api/admin/crm/partners', adminPartnersCrmRoutes);
app.use('/api/admin/crm',          adminCrmSubentities);

// ─── KangqoreVis — Kangqore Visibility Intelligence System ────────────────────────────
// Packaged framework. Sources connect later. Mounted before static frontend so
// dynamic /sitemap.xml, /robots.txt, /llms.txt take precedence.
import { kangqoreVisBootstrap } from './kangqore-vis';
kangqoreVisBootstrap({ app });
// Register VIS under WAANDA authority after bootstrap
import('./kangqore-view/waanda/adapters/VisAdapter').then(({ VisAdapter }) => {
  import('./kangqore-view/waanda/WaandaAuthority').then(({ WaandaAuthority }) => WaandaAuthority.register(VisAdapter))
}).catch(() => {})

// Serve Uploaded Files with CORS headers for cross-origin access
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}, express.static(path.join(process.cwd(), uploadDir)));

// ─── AEO/SEO Pre-Rendering Middleware (Phase 3) ────────────────────────────────
// If a bot (Googlebot, ChatGPT, Perplexity) requests a page, Prerender middleware 
// intercepts it, renders the React 19 SPA (with 3D/GSAP disabled automatically), 
// and returns the pure HTML containing our JSON-LD schemas.
if (process.env.PRERENDER_TOKEN) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const prerender = require('prerender-node');
  app.use(prerender.set('prerenderToken', process.env.PRERENDER_TOKEN));
  console.log('🤖 Prerender.io SEO/AEO Middleware Active');
}

// ─── Legacy URL 301 Redirects (Phase C) ────────────────────────────────────────
// MUST run BEFORE express.static() and the SPA fallback so legacy URLs return
// a real 301 with a Location header instead of 200 + index.html.
// The middleware itself guards against intercepting /api/* paths.
// Data source: backend/src/data/legacyRedirects.generated.json
//   (canonical authoring source: shared/legacyRedirects.json at repo root)
app.use(legacyRedirectsMiddleware);

// ─── Dashboard → OS permanent redirect ─────────────────────────────────────
// /dashboard/* → 301 → /os/*  (deep links survive the migration)
app.use(dashboardRedirectMiddleware);

// Serve Frontend Static Files
const frontendBuildPath = path.join(__dirname, '../../frontend/build');

// Serve Brotli-precompressed assets when the client accepts them.
// `compression()` above only speaks gzip/deflate; on this JS-heavy SPA first
// paint is gated on the bundle arriving, and Brotli is ~21% smaller than gzip
// across the critical chunks. Files are produced at build time by
// scripts/compress-build.mjs, so there is no per-request CPU cost.
// MUST be registered before express.static, which would otherwise answer first.
const BROTLI_TYPES: Record<string, string> = {
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
};

app.get(/\.(js|css|svg|json)$/, (req, res, next) => {
  const accepts = String(req.headers['accept-encoding'] || '');
  if (!/\bbr\b/.test(accepts)) return next();

  // req.path is URL-decoded and normalised by Express; resolve and confirm the
  // result stays inside the build directory before reading anything.
  const baseDir = path.resolve(frontendBuildPath) + path.sep;
  const candidate = path.resolve(frontendBuildPath, `.${req.path}.br`);
  if (!candidate.startsWith(baseDir)) return next();
  if (!fs.existsSync(candidate)) return next();

  const type = BROTLI_TYPES[path.extname(req.path).toLowerCase()];
  if (type) res.setHeader('Content-Type', type);
  res.setHeader('Content-Encoding', 'br');
  res.setHeader('Vary', 'Accept-Encoding');
  // Hashed filenames are immutable; anything else stays revalidated.
  res.setHeader('Cache-Control', /-[A-Za-z0-9_-]{8,}\./.test(req.path)
    ? 'public, max-age=31536000, immutable'
    : 'public, max-age=0, must-revalidate');
  res.sendFile(candidate, (err) => { if (err) next(); });
});

app.use(express.static(frontendBuildPath));

// ─── Soft-404 elimination ──────────────────────────────────────────────────────
// As an SPA, every unknown URL previously returned HTTP 200 with the shell —
// so /services/does-not-exist looked like a real page to crawlers. Search
// Console reports those as "Soft 404" and they burn crawl budget across an
// unbounded URL space.
//
// The canonical route list is already generated for the sitemap, so it can also
// authoritatively decide what does NOT exist. Only namespaces we can validate
// exhaustively are checked; every other path keeps SPA behaviour untouched.
const VALIDATED_NAMESPACES = ['/services/', '/departments/'];

let knownRoutes: Set<string> | null = null;
function loadKnownRoutes(): Set<string> {
  if (knownRoutes) return knownRoutes;
  const candidates = [
    path.resolve(__dirname, '../../shared/siteRoutes.json'),
    path.resolve(process.cwd(), 'shared/siteRoutes.json'),
    path.resolve(process.cwd(), '../shared/siteRoutes.json'),
  ];
  for (const file of candidates) {
    try {
      const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (Array.isArray(parsed?.routes) && parsed.routes.length) {
        knownRoutes = new Set(parsed.routes.map((r: { path: string }) => r.path.replace(/\/$/, '')));
        return knownRoutes;
      }
    } catch {
      /* try next candidate */
    }
  }
  // Manifest missing: fail open. A stale 404 is far worse than a soft 404.
  console.warn('[soft404] siteRoutes.json not found — unknown-route detection disabled');
  knownRoutes = new Set();
  return knownRoutes;
}

// An unmatched /api/* path must NOT fall through to the SPA. It did, which
// meant a deleted or misspelt endpoint answered 200 with index.html — a caller
// sees a success and a body of HTML, which is harder to diagnose than the 500
// it replaced. API namespaces get an honest JSON 404.
app.use(['/api', '/health'], (req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.originalUrl,
    method: req.method,
  });
});

// Serve index.html for all non-API routes (client-side routing)
app.get('*', (req, res) => {
  const clean = req.path.replace(/\/$/, '');
  const routes = loadKnownRoutes();
  const inValidatedNamespace = VALIDATED_NAMESPACES.some(
    (ns) => req.path.startsWith(ns) && req.path.length > ns.length,
  );

  // The SPA still renders its NotFound view; only the status code changes, so
  // humans see the same page while crawlers get an honest 404.
  if (routes.size > 0 && inValidatedNamespace && !routes.has(clean)) {
    res.status(404);
  }

  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// Error handling (must be last)
app.use(errorHandler);

// Start server on primary port
// Start server
const server = createServer(app);

// Initialize Socket.io for real-time features
const io = initializeSocket(server);
app.set('io', io); // Make io accessible in routes via req.app.get('io')

// Voice Assistant WebSocket gateway (public, unauthenticated — booking surfaces)
initializeVoiceGateway(server);

server.listen(PORT, () => {
  console.log(`🚀 Core Backend + Frontend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 Socket.io: Real-time enabled`);

  // Kangqore-View Action Pack Auto-Installer — idempotent, runs at every boot
  import('./kangqore-view/automation/PackAutoInstaller').then(({ installAllPacks }) =>
    installAllPacks().catch((e: unknown) => console.error('[PackAutoInstaller] Failed:', e))
  )

  // KERNEL: Hyper-Graph Boot Sequence (In-Memory Traversal Engine)
  hyperGraphDaemon.bootSequence().catch((e: unknown) => console.error('[HyperGraph] Boot failed:', e));

  // WAANDA Boot Sequence — single constitutional entry point for all subsystems
  WAANDA.boot().catch((e: unknown) => console.error('[WAANDA] Boot failed:', e));

  // Phase 6.6 — Digital CEO briefing cadence + Phase 6.8 autopilot tick
  void (async () => {
    try {
      const cron = await import('node-cron');
      const { MorningBriefingService }   = await import('./kangqore-immp/cognition/morningBriefing.service');
      const { AutopilotService }         = await import('./kangqore-immp/cognition/autopilot.service');
      const { RetrospectiveEngine }      = await import('./kangqore-immp/cognition/retrospectiveEngine');
      const { ExecutiveReviewService }   = await import('./kangqore-immp/cognition/executiveReview.service');

      cron.default.schedule('0 8 * * *',    async () => { await MorningBriefingService.generate('MORNING').catch(e => console.error('[Brief] Morning:', e)); });
      cron.default.schedule('0 13 * * *',   async () => { await MorningBriefingService.generate('MIDDAY').catch(e => console.error('[Brief] Midday:', e)); });
      cron.default.schedule('0 18 * * *',   async () => { await MorningBriefingService.generate('EVENING').catch(e => console.error('[Brief] Evening:', e)); });
      cron.default.schedule('*/30 * * * *', async () => { await AutopilotService.tick().catch(e => console.error('[Autopilot] Tick:', e)); });
      // Phase 6.9 — Sunday 20:00 retrospective, Monday 07:30 executive review
      cron.default.schedule('0 20 * * 0',   async () => {
        const w = new Date(); w.setDate(w.getDate() - w.getDay()); w.setHours(0,0,0,0);
        await RetrospectiveEngine.createForWeek(w).catch(e => console.error('[6.9] Retro:', e));
      });
      cron.default.schedule('30 7 * * 1',   async () => { await ExecutiveReviewService.generate().catch(e => console.error('[6.9] Review:', e)); });

      // S77 — BIDS™ Pillar Audit: nightly at 02:00
      cron.default.schedule('0 2 * * *', async () => {
        const { runBidsPillarAudit } = await import('./kangqore-immp/services/bidsPillarAudit.service');
        await runBidsPillarAudit('nightly').catch(e => console.error('[S77] BIDS Audit:', e));
      });

      console.log('[KIMMP] Phase 6.6 briefing + 6.8 autopilot + 6.9 reflection crons scheduled');
    } catch (e) {
      console.warn('[KIMMP] node-cron unavailable — cron disabled:', (e as Error).message);
    }
  })();
});

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server terminated');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

