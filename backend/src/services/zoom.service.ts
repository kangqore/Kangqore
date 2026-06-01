import axios from 'axios';
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

    const { data: tokens } = await axios.post(
      `${ZOOM_OAUTH}/token`,
      new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: redirectUri }).toString(),
      { headers: { Authorization: `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const expiresAt = new Date(Date.now() + (tokens.expires_in || 3600) * 1000);

    const { data: profile } = await axios.get(`${ZOOM_API}/users/me`, {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });
    const accountId = profile.email || profile.id || userId;

    await prisma.zoomIntegration.upsert({
      where: { userId },
      create: { userId, accountId, accessToken: tokens.access_token, refreshToken: tokens.refresh_token || '', expiresAt, syncStatus: 'ACTIVE' },
      update: { accountId, accessToken: tokens.access_token, refreshToken: tokens.refresh_token || '', expiresAt, syncStatus: 'ACTIVE' }
    });

    return accountId;
  }

  private static async getAccessToken(userId: string): Promise<string> {
    const integration = await prisma.zoomIntegration.findUnique({ where: { userId } });
    if (!integration) throw new Error('No Zoom integration found for user');

    if (new Date(integration.expiresAt) > new Date()) return integration.accessToken;

    const credentials = Buffer.from(
      `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
    ).toString('base64');

    try {
      const { data: tokens } = await axios.post(
        `${ZOOM_OAUTH}/token`,
        new URLSearchParams({ grant_type: 'refresh_token', refresh_token: integration.refreshToken }).toString(),
        { headers: { Authorization: `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      const expiresAt = new Date(Date.now() + (tokens.expires_in || 3600) * 1000);
      await prisma.zoomIntegration.update({
        where: { userId },
        data: { accessToken: tokens.access_token, refreshToken: tokens.refresh_token || integration.refreshToken, expiresAt }
      });
      return tokens.access_token;
    } catch {
      await prisma.zoomIntegration.update({ where: { userId }, data: { syncStatus: 'ERROR' } });
      throw new Error('Failed to refresh Zoom token');
    }
  }

  // ─── Meeting creation ──────────────────────────────────────────────────────

  static async createMeeting(hostUserId: string, details: {
    topic: string; startTime: Date; durationMinutes: number; agenda?: string;
  }): Promise<{ joinUrl: string; meetingId: string; password: string }> {
    const token = await this.getAccessToken(hostUserId);

    const { data: meeting } = await axios.post(
      `${ZOOM_API}/users/me/meetings`,
      {
        topic: details.topic,
        type: 2,
        start_time: details.startTime.toISOString(),
        duration: details.durationMinutes,
        agenda: details.agenda || '',
        settings: { host_video: true, participant_video: true, join_before_host: false, waiting_room: true, auto_recording: 'none' }
      },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );

    return { joinUrl: meeting.join_url, meetingId: String(meeting.id), password: meeting.password || '' };
  }

  static async isConnected(userId: string): Promise<boolean> {
    const integration = await prisma.zoomIntegration.findUnique({
      where: { userId }, select: { syncStatus: true }
    });
    return integration?.syncStatus === 'ACTIVE';
  }
}
