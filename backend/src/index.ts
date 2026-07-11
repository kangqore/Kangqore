import './config/https-fix';
import './config/env';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import path from 'path';
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
import messagesRoutes from './routes/messages';
import investorRoutes from './routes/investor'; // NEW // NEW // NEW
import partnerRoutes from './routes/partner'; // NEW // NEW // NEW
import ticketsRoutes from './routes/tickets'; // NEW
import riskRoutes from './routes/risks'; // NEW
import decisionRoutes from './routes/decisions'; // NEW
import invoiceRoutes from './routes/invoices'; // NEW
import documentRoutes from './routes/documents'; // NEW
import deliverablesRoutes from './routes/deliverables'; // NEW
import clientProfileRoutes from './routes/clientProfile'; // NEW (MNC Pillar 1)
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
import { waandaRouter } from './waanda/waandaRoutes';
import { waandaTrainingRouter } from './waanda-training';
import { dataPrivacyRouter } from './routes/data-privacy';
import { developerRouter } from './routes/developer';
import { itilRouter } from './routes/itil';
import orgsRouter from './routes/orgs';
import integrationsRouter   from './routes/integrations';
import semanticMappingRouter from './routes/semanticMapping';
import packsRouter           from './routes/packs';
import cdcRouter             from './routes/cdc';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import { WAANDA } from './waanda/WaandaBootstrap';
import { authenticate, authorize } from './middleware/auth';

import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { legacyRedirectsMiddleware } from './middleware/legacyRedirects';
import { dashboardRedirectMiddleware } from './middleware/dashboardRedirect';
import { customDomainRouter } from './middleware/customDomainRouter';
import { initializeSocket, getIO } from './socket';


// Server restart trigger 12345678901234567890
// Initialize Prisma Client
import { prisma } from './lib/prisma';
export { prisma };
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
import adminIpRoutes from './routes/admin-ip';
import koreRoutes from './os/kore/api/kore.routes'; // NEW KEOS Layer

app.use('/api/kangqore/immp', kangqoreImmpRoutes);
app.use('/api/kangqore/urgi', authenticate, urgiRoutes);
app.use('/api/kangqore/kore', koreRoutes); // Mount KEOS KORE APIs

app.use('/api/content', publicContentRoutes); // Public access
app.use('/api/uploads', uploadRoutes);
app.use('/api/search', searchRoutes);
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
// BIDS™ — Business Diagnostic Intelligence System
import bidsRoutes from './routes/bids';
app.use('/api/admin/bids', bidsRoutes);
import bidsClientRoutes from './routes/bids-client';
app.use('/api/client/bids', bidsClientRoutes);
import { briefingRouter } from './routes/admin-briefing';
app.use('/api/admin/briefing', briefingRouter);
// WAANDA — Enterprise Cognitive OS boot manifest + domain registry + mission execution
app.use('/api/admin/waanda', authenticate, authorize(['ADMIN']), waandaRouter);

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
app.use('/api/admin/itil', authenticate, itilRouter);

// OpenAPI / Swagger docs — public, no auth required.
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs/spec', (_req, res) => res.json(swaggerSpec));

import adminOntologyRoutes from './routes/admin-ontology';
app.use('/api/admin/ontology', adminOntologyRoutes);
app.use('/api/admin/integrations', integrationsRouter);
app.use('/api/admin/semantic',     semanticMappingRouter);
app.use('/api/admin/packs',        packsRouter);
app.use('/api/admin/cdc',          cdcRouter);

import adminSearchRoutes from './routes/admin-search';
app.use('/api/admin/search', adminSearchRoutes);

import { publicVisitorRouter, adminVisitorRouter } from './routes/visitor';
app.use('/api/public/visitor', publicVisitorRouter);
app.use('/api/admin/visitor', adminVisitorRouter);

import hcipRouter from './routes/hcip';
app.use('/api/hcip', hcipRouter);

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
import edfRouter from './os/edf/edfRoutes';
import epfRouter from './os/epf/epfRoutes';
import esfRouter from './os/esf/esfRoutes';
import eafRouter from './os/eaf/eafRoutes';
app.use('/api/os/edf', authenticate, edfRouter);
app.use('/api/os/epf', authenticate, epfRouter);
app.use('/api/os/esf', authenticate, esfRouter);
app.use('/api/os/eaf', authenticate, authorize(['ADMIN']), eafRouter);
import personalRouter from './os/personal/personalRoutes';
app.use('/api/os/personal', personalRouter);

import adminClientsCrmRoutes   from './routes/admin-clients-crm';
import adminPartnersCrmRoutes  from './routes/admin-partners-crm';
import adminCrmSubentities     from './routes/admin-crm-subentities';
app.use('/api/admin/crm/clients',  adminClientsCrmRoutes);
app.use('/api/admin/crm/partners', adminPartnersCrmRoutes);
app.use('/api/admin/crm',          adminCrmSubentities);

// ─── KangqoreVis — Kangqore Visibility Intelligence System ────────────────────────────
// Packaged framework. Sources connect later. Mounted before static frontend so
// dynamic /sitemap.xml, /robots.txt, /llms.txt take precedence.
import { kangqoreVisBootstrap } from './kangqore-vis';
kangqoreVisBootstrap({ app });

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
app.use(express.static(frontendBuildPath));

// Serve index.html for all non-API routes (client-side routing)
app.get('*', (req, res) => {
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

server.listen(PORT, () => {
  console.log(`🚀 Core Backend + Frontend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 Socket.io: Real-time enabled`);

  // WAANDA Boot Sequence — single constitutional entry point for all subsystems
  WAANDA.boot().catch((e: unknown) => console.error('[WAANDA] Boot failed:', e));
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

