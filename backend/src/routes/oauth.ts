
import { Router } from 'express';
import passport from 'passport';
import { createSession } from '../kangqore-view/kernel/auth/SessionService';
import { extractRequestMetadata, createAuditLog, AUDIT_ACTIONS } from '../kangqore-view/kernel/audit/AuditService';
import { sanitizeRedirectUrl } from '../utils/security';

const router = Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Helper to handle successful auth
const handleAuthSuccess = async (req: any, res: any) => {
  try {
    const user = req.user;
    
    // Create session
    const metadata = extractRequestMetadata(req);
    const { tokens } = await createSession({
      userId: user.id,
      role: user.role,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent
    });

    // Audit Log
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.LOGIN,
      ...metadata
    });

    // Redirect to frontend with token
    // Using a temporary param or cookie is common. 
    // Here we append to URL fragment or query.
    res.redirect(sanitizeRedirectUrl(`${FRONTEND_URL}/auth/callback?token=${tokens.accessToken}&refreshToken=${tokens.refreshToken}&role=${user.role}`));
  } catch (error) {
    console.error('OAuth Success Handler Error:', error);
    res.redirect(sanitizeRedirectUrl(`${FRONTEND_URL}/login?error=auth_failed`));
  }
};

/**
 * GOOGLE
 */
/**
 * GOOGLE
 */
router.get('/google', (req: any, res: any, next: any) => {
  const role = (req.query.role as string) || 'CLIENT';
  const state = Buffer.from(JSON.stringify({ role })).toString('base64');
  
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false,
    state
  })(req, res, next);
});

router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=google_failed` }),
  handleAuthSuccess
);

/**
 * LINKEDIN
 */
router.get('/linkedin', (req: any, res: any, next: any) => {
  const role = (req.query.role as string) || 'CLIENT';
  const state = Buffer.from(JSON.stringify({ role })).toString('base64');

  passport.authenticate('linkedin', { 
    state, // Pass encoded state
    session: false 
  })(req, res, next);
});

router.get('/linkedin/callback', 
  passport.authenticate('linkedin', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=linkedin_failed` }),
  handleAuthSuccess
);

/**
 * APPLE
 */
router.get('/apple', (req: any, res: any, next: any) => {
  const role = (req.query.role as string) || 'CLIENT';
  const state = Buffer.from(JSON.stringify({ role })).toString('base64');

  passport.authenticate('apple', { 
    session: false,
    state
  })(req, res, next);
});

// Apple sends a POST request for callback
router.post('/apple/callback', 
  passport.authenticate('apple', { session: false, failureRedirect: `${FRONTEND_URL}/login?error=apple_failed` }),
  handleAuthSuccess
);

export default router;
