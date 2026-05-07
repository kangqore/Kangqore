
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import AppleStrategy from 'passport-apple';
import { prisma } from '../lib/prisma';
import { generateCustomId } from '../utils/idGenerator';

// Serialize user for session (if needed, though we use JWT)
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      if (user) {
        // Map to Express.User shape
        const expressUser = {
          ...user,
          userId: user.id,
          company: user.company || undefined
        };
        done(null, expressUser);
      } else {
        done(null, null);
      }
    } catch (error) {
      done(error, null);
    }
  });

// Helper to extract role from state
const extractRoleFromState = (req: any): string => {
  try {
    const rawState = req.query.state || req.body.state;
    if (!rawState) return 'CLIENT';
    
    // Check if it's base64 encoded JSON
    const decoded = Buffer.from(rawState, 'base64').toString('ascii');
    const data = JSON.parse(decoded);
    // Validate role is one of expected values
    const allowedRoles = ['CLIENT', 'PARTNER', 'INVESTOR', 'JOB_SEEKER'];
    return allowedRoles.includes(data.role) ? data.role : 'CLIENT';
  } catch (e) {
    return 'CLIENT';
  }
};

/**
 * GOOGLE STRATEGY
 */
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  console.log('🔧 Initializing Google OAuth Strategy');
  console.log('   Callback URL:', `${process.env.BACKEND_URL || 'http://localhost:5050'}/api/oauth/google/callback`);
  
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5050'}/api/oauth/google/callback`,
    scope: ['profile', 'email'],
    passReqToCallback: true
  }, async (req: any, accessToken, refreshToken, profile: any, done) => {
    try {
      console.log('✅ Google OAuth: Successfully received profile data');
      console.log('   User ID:', profile.id);
      console.log('   Email:', profile.emails?.[0]?.value);
      
      const email = profile.emails?.[0].value;
      const googleId = profile.id;
      const name = profile.displayName;
      const avatarUrl = profile.photos?.[0].value;

      if (!email) {
        console.error('❌ Google OAuth: No email provided');
        return done(null, false, { message: 'No email provided by Google' });
      }

      // 1. Find by Google ID
      let user = await prisma.user.findUnique({ where: { googleId } });
      if (user) {
        console.log('✓ Found existing user by Google ID:', user.id);
        return done(null, {
          ...user,
          userId: user.id,
          company: user.company || undefined
        });
      }

      // 2. Find by Email (Link account)
      user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        console.log('✓ Found existing user by email, linking Google ID:', user.id);
        // Link account
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId, avatarUrl: user.avatarUrl || avatarUrl }
        });
        const expressUser = {
          ...user,
          userId: user.id,
          company: user.company || undefined
        };
        return done(null, expressUser);
      }

      // 3. Create new user
      const role = extractRoleFromState(req);
      const customId = await generateCustomId(role as any);
      
      console.log('✓ Creating new user with role:', role);
      user = await prisma.user.create({
        data: {
          email,
          name,
          googleId,
          avatarUrl,
          role: role as any,
          customId,
          gmail: email.endsWith('@gmail.com') ? email : undefined
        }
      });

      console.log('✅ New user created:', user.id);
      const expressUser = {
        ...user,
        userId: user.id,
        company: user.company || undefined
      };
      return done(null, expressUser);
    } catch (error) {
      console.error('❌ Google OAuth Error:', error);
      return done(error as Error);
    }
  }));
} else {
  console.warn('⚠️  Google OAuth not configured - missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
}

/**
 * LINKEDIN STRATEGY
 */
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5050'}/api/oauth/linkedin/callback`,
    scope: ['r_emailaddress', 'r_liteprofile'],
    passReqToCallback: true
  }, async (req: any, accessToken: string, refreshToken: string, profile: any, done: Function) => {
    try {
      const email = profile.emails?.[0].value;
      const linkedinId = profile.id;
      const name = profile.displayName;
      const avatarUrl = profile.photos?.[0].value;

      if (!email) return done(null, false, { message: 'No email provided by LinkedIn' });

      let user = await prisma.user.findUnique({ where: { linkedinId } });
      if (user) {
        return done(null, {
          ...user,
          userId: user.id,
          company: user.company || undefined
        });
      }

      user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { linkedinId, avatarUrl: user.avatarUrl || avatarUrl }
        });
        const expressUser = {
          ...user,
          userId: user.id,
          company: user.company || undefined
        };
        return done(null, expressUser);
      }

      const role = extractRoleFromState(req);
      const customId = await generateCustomId(role as any);
      
      user = await prisma.user.create({
        data: {
          email,
          name,
          linkedinId,
          avatarUrl,
          role: role as any,
          customId,
          gmail: email.endsWith('@gmail.com') ? email : undefined
        }
      });

      const expressUser = {
        ...user,
        userId: user.id,
        company: user.company || undefined
      };
      return done(null, expressUser);
    } catch (error) {
      return done(error as Error);
    }
  }));
}

/**
 * APPLE STRATEGY
 * Note: Requires key file path or string content in env
 */
if (process.env.APPLE_SERVICE_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID && process.env.APPLE_PRIVATE_KEY) {
  try {
    passport.use(new AppleStrategy({
      clientID: process.env.APPLE_SERVICE_ID,
      teamID: process.env.APPLE_TEAM_ID,
      keyID: process.env.APPLE_KEY_ID,
      privateKeyString: process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle env newlines
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5050'}/api/oauth/apple/callback`,
      passReqToCallback: true
    }, async (req: any, accessToken: string, refreshToken: string, idToken: any, profile: any, done: Function) => {
      try {
        // Apple provides email only on first login via idToken or profile
        // We often need to decode idToken to get email if profile is empty on subsequent logins
        const email = idToken?.email || profile?.email;
        const appleId = idToken?.sub || profile?.id;
        
        // Name is only provided on first login in 'profile' object
        const firstName = profile?.name?.firstName || '';
        const lastName = profile?.name?.lastName || '';
        const name = `${firstName} ${lastName}`.trim() || 'Apple User';

        if (!email && !appleId) return done(null, false, { message: 'Could not identify Apple user' });

        let user;
        
        if (appleId) {
          user = await prisma.user.findUnique({ where: { appleId } });
          if (user) return done(null, user);
        }

        if (email) {
          user = await prisma.user.findUnique({ where: { email } });
          if (user) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { appleId } // Link apple ID
            });
            return done(null, user);
          }
        }

        // Create new user (Only if we have email, otherwise we can't create generic account easily)
        if (!email) {
           return done(null, false, { message: 'Email required for new account creation via Apple' });
        }

        const role = extractRoleFromState(req);
        const customId = await generateCustomId(role as any);
        
        user = await prisma.user.create({
          data: {
            email,
            name: name || 'Apple User',
            appleId,
            role: role as any,
            customId
          }
        });

        const expressUser = {
          ...user,
          userId: user.id,
          company: user.company || undefined
        };
        return done(null, expressUser);
      } catch (error) {
        return done(error as Error);
      }
    }));
  } catch (e) {
    console.error('Failed to initialize Apple Strategy:', e);
  }
}
