import { Router } from 'express';
import eventTypeRoutes from './event-types';
import availabilityRoutes from './availability';
import eventRoutes from './events';
import linkRoutes from './links';
import organizationRoutes from './organizations';
import routingFormRoutes from './routing-forms';
import nlpParseRoutes from './nlp-parse';
import acceptInviteRoutes from './accept-invite';
import calendarIntegrationRoutes from './calendar-integrations';
import feedRoutes from './feed';

const router = Router();

router.use('/event-types', eventTypeRoutes);
router.use('/availability', availabilityRoutes);
router.use('/events', eventRoutes);
router.use('/links', linkRoutes);
router.use('/org', organizationRoutes);
router.use('/routing-forms', routingFormRoutes);
router.use('/nlp-parse', nlpParseRoutes);
router.use('/accept-invite', acceptInviteRoutes);
router.use('/calendar-integrations', calendarIntegrationRoutes);
router.use('/feed', feedRoutes);

export default router;
