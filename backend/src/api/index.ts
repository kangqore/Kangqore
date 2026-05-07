/**
 * API Module - Centralized API route aggregator
 * 
 * This module provides a single entry point for all API routes.
 * Routes are still defined in /routes/ but can be accessed from here.
 */

import { Router } from 'express';

// Import all routes from the routes folder
import authRoutes from '../routes/auth';
import adminRoutes from '../routes/admin';
import clientRoutes from '../routes/client';
import partnerRoutes from '../routes/partner';
import investorRoutes from '../routes/investor';
import careersRoutes from '../routes/careers';
import dashboardRoutes from '../routes/dashboard';
import profileRoutes from '../routes/profile';
import projectsRoutes from '../routes/projects';
import consultationsRoutes from '../routes/consultations';
import contentRoutes from '../routes/content';
import publicContentRoutes from '../routes/public_content';
import mediaRoutes from '../routes/media';
import messagesRoutes from '../routes/messages';
import notificationsRoutes from '../routes/notifications';
import newsletterRoutes from '../routes/newsletter';
import contactRoutes from '../routes/contact';
import chatbotRoutes from '../routes/chatbot';
import searchRoutes from '../routes/search';
import recommendationsRoutes from '../routes/recommendations';
import analyticsRoutes from '../routes/analytics';
import meetingsRoutes from '../routes/meetings';
import sessionsRoutes from '../routes/sessions';
import ticketsRoutes from '../routes/tickets';
import uploadsRoutes from '../routes/uploads';
import oauthRoutes from '../routes/oauth';

const router = Router();

// API v1 Routes
const v1Router = Router();

// Auth routes (public)
v1Router.use('/auth', authRoutes);
v1Router.use('/oauth', oauthRoutes);

// Dashboard routes
v1Router.use('/admin', adminRoutes);
v1Router.use('/client', clientRoutes);
v1Router.use('/partner', partnerRoutes);
v1Router.use('/investor', investorRoutes);
v1Router.use('/careers', careersRoutes);
v1Router.use('/dashboard', dashboardRoutes);

// User routes
v1Router.use('/profile', profileRoutes);
v1Router.use('/sessions', sessionsRoutes);

// Project routes
v1Router.use('/projects', projectsRoutes);
v1Router.use('/consultations', consultationsRoutes);
v1Router.use('/meetings', meetingsRoutes);

// Content routes
v1Router.use('/content', contentRoutes);
v1Router.use('/public', publicContentRoutes);
v1Router.use('/media', mediaRoutes);

// Communication routes
v1Router.use('/messages', messagesRoutes);
v1Router.use('/notifications', notificationsRoutes);
v1Router.use('/newsletter', newsletterRoutes);
v1Router.use('/contact', contactRoutes);
v1Router.use('/tickets', ticketsRoutes);

// Features
v1Router.use('/chatbot', chatbotRoutes);
v1Router.use('/search', searchRoutes);
v1Router.use('/recommendations', recommendationsRoutes);
v1Router.use('/analytics', analyticsRoutes);
v1Router.use('/uploads', uploadsRoutes);

// Mount v1 router
router.use('/v1', v1Router);

// Also mount at root for backwards compatibility
router.use('/', v1Router);

export default router;

// Export individual routes for direct access if needed
export {
  authRoutes,
  adminRoutes,
  clientRoutes,
  partnerRoutes,
  investorRoutes,
  careersRoutes,
  dashboardRoutes,
  profileRoutes,
  projectsRoutes,
  consultationsRoutes,
  contentRoutes,
  publicContentRoutes,
  mediaRoutes,
  messagesRoutes,
  notificationsRoutes,
  newsletterRoutes,
  contactRoutes,
  chatbotRoutes,
  searchRoutes,
  recommendationsRoutes,
  analyticsRoutes,
  meetingsRoutes,
  sessionsRoutes,
  ticketsRoutes,
  uploadsRoutes,
  oauthRoutes
};
