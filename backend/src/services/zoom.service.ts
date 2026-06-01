import { prisma } from '../lib/prisma';
import logger from '../utils/logger';

const ZOOM_API = 'https://api.zoom.us/v2';
const ZOOM_OAUTH = 'https://zoom.us/oauth';

export class ZoomService {

  // ─── OAuth ─────────────────────────────────────────────────────────────────

  static getAuthUrl(userId: string): string {
    const redirectUri = process.env.ZOOM_REDIRECT_URI ||
      `${process.env.BACKEND_URL || 'http://localhost:5050'}/api/scheduling/zoom/callback`;
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.ZOOM_CLIENT_ID || '',
      redirect_uri: redirectUri,
      state: userId
    });
    return `${ZOOM_OAUTH}/authorize?${params}`;
  }

  static async handleCallback(code: string, userId: string) {
    const redirectUri = process.env.ZOOM_REDIRECT_URI ||
      `${process.env.BACKEND_URL || 'http://localhost:5050'}/api/scheduling/zoom/callback`;

    const credentials = Buffer.from(
      `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
    ).toString('base64');

    const tokenRes = await fetch(`${ZOOM_OAUTH}/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri
      })
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      throw new Error(`Zoom token exchange failed: ${err}`);
    }

    const tokens = await tokenRes.json() as any;
    const expiresAt = new Date(Date.now() + (tokens.expires_in || 3600) * 1000);

    // Fetch Zoom user profile to get accountId
    const profileRes = await fetch(`${ZOOM_API}/users/me`, {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });
    const profile = await profileRes.json() as any;
    const accountId = profile.email || profile.id || userId;

    await prisma.zoomIntegration.upsert({
      where: { userId },
      create: {
        userId,
        accountId,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || '',
        expiresAt,
        syncStatus: 'ACTIVE'
      },
      update: {
        accountId,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || '',
        expiresAt,
        syncStatus: 'ACTIVE'
      }
    });

    return accountId;
  }

  private static async getAccessToken(userId: string): Promise<string> {
    const integration = await prisma.zoomIntegration.findUnique({ where: { userId } });
    if (!integration) throw new Error('No Zoom integration found for user');

    if (new Date(integration.expiresAt) > new Date()) {
      return integration.accessToken;
    }

    // Refresh the token
    const credentials = Buffer.from(
      `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
    ).toString('base64');

    const res = await fetch(`${ZOOM_OAUTH}/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: integration.refreshToken
      })
    });

    if (!res.ok) {
      await prisma.zoomIntegration.update({
        where: { userId },
        data: { syncStatus: 'ERROR' }
      });
      throw new Error('Failed to refresh Zoom token');
    }

    const tokens = await res.json() as any;
    const expiresAt = new Date(Date.now() + (tokens.expires_in || 3600) * 1000);

    await prisma.zoomIntegration.update({
      where: { userId },
      data: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || integration.refreshToken,
        expiresAt
      }
    });

    return tokens.access_token;
  }

  // ─── Meeting creation ──────────────────────────────────────────────────────

  static async createMeeting(hostUserId: string, details: {
    topic: string;
    startTime: Date;
    durationMinutes: number;
    agenda?: string;
  }): Promise<{ joinUrl: string; meetingId: string; password: string }> {
    const token = await this.getAccessToken(hostUserId);

    const res = await fetch(`${ZOOM_API}/users/me/meetings`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        topic: details.topic,
        type: 2, // Scheduled meeting
        start_time: details.startTime.toISOString(),
        duration: details.durationMinutes,
        agenda: details.agenda || '',
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          waiting_room: true,
          auto_recording: 'none'
        }
      })
    });

    if (!res.ok) {
      const err = await res.text();
      logger.error('[Zoom] Failed to create meeting', err);
      throw new Error(`Zoom meeting creation failed: ${err}`);
    }

    const meeting = await res.json() as any;
    return {
      joinUrl: meeting.join_url,
      meetingId: String(meeting.id),
      password: meeting.password || ''
    };
  }

  static async isConnected(userId: string): Promise<boolean> {
    const integration = await prisma.zoomIntegration.findUnique({
      where: { userId },
      select: { syncStatus: true }
    });
    return integration?.syncStatus === 'ACTIVE';
  }
}
