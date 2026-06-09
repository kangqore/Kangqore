import { google } from 'googleapis';
import { ConfidentialClientApplication } from '@azure/msal-node';
import { prisma } from '../lib/prisma';
import logger from '../utils/logger';

function googleOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI ||
      `${process.env.BACKEND_URL || 'http://localhost:5050'}/api/scheduling/calendar-integrations/callback/google`
  );
}

function msalClient() {
  return new ConfidentialClientApplication({
    auth: {
      clientId: process.env.MICROSOFT_CLIENT_ID || '',
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
      authority: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID || 'common'}`
    }
  });
}

const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events'
];

const OUTLOOK_SCOPES = ['Calendars.ReadWrite', 'offline_access'];

export class CalendarSyncService {

  // ─── Google OAuth ──────────────────────────────────────────────────────────

  static getGoogleAuthUrl(userId: string): string {
    return googleOAuthClient().generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: GOOGLE_SCOPES,
      state: userId
    });
  }

  static async handleGoogleCallback(code: string, userId: string) {
    const oauth2 = googleOAuthClient();
    const { tokens } = await oauth2.getToken(code);
    oauth2.setCredentials(tokens);

    const calendar = google.calendar({ version: 'v3', auth: oauth2 });
    const profile = await calendar.calendarList.get({ calendarId: 'primary' });
    const accountId = profile.data.id || '';

    const expiresAt = tokens.expiry_date
      ? new Date(tokens.expiry_date)
      : new Date(Date.now() + 3600 * 1000);

    await prisma.calendarIntegration.upsert({
      where: { userId_provider_accountId: { userId, provider: 'google', accountId } },
      create: { userId, provider: 'google', accountId, accessToken: tokens.access_token || '', refreshToken: tokens.refresh_token || '', expiresAt, syncStatus: 'ACTIVE' },
      update: { accessToken: tokens.access_token || '', refreshToken: tokens.refresh_token || '', expiresAt, syncStatus: 'ACTIVE' }
    });

    return accountId;
  }

  private static async refreshGoogleToken(integration: any): Promise<string> {
    const oauth2 = googleOAuthClient();
    oauth2.setCredentials({
      access_token: integration.accessToken,
      refresh_token: integration.refreshToken,
      expiry_date: integration.expiresAt.getTime()
    });
    const { credentials } = await oauth2.refreshAccessToken();
    const expiresAt = credentials.expiry_date
      ? new Date(credentials.expiry_date)
      : new Date(Date.now() + 3600 * 1000);
    await prisma.calendarIntegration.update({
      where: { id: integration.id },
      data: { accessToken: credentials.access_token || '', expiresAt }
    });
    return credentials.access_token || '';
  }

  private static async getGoogleBusySlots(integration: any, start: Date, end: Date) {
    try {
      const oauth2 = googleOAuthClient();
      let accessToken = integration.accessToken;
      if (new Date(integration.expiresAt) <= new Date()) {
        accessToken = await this.refreshGoogleToken(integration);
      }
      oauth2.setCredentials({ access_token: accessToken });
      const calendar = google.calendar({ version: 'v3', auth: oauth2 });

      const response = await calendar.freebusy.query({
        requestBody: {
          timeMin: start.toISOString(),
          timeMax: end.toISOString(),
          items: [{ id: 'primary' }]
        }
      });

      const busy = response.data.calendars?.['primary']?.busy || [];
      return busy
        .filter(b => b.start && b.end)
        .map(b => ({ start: new Date(b.start!), end: new Date(b.end!), source: 'google' }));
    } catch (err) {
      logger.error('[Google Calendar] Failed to fetch busy slots', err);
      await prisma.calendarIntegration.update({ where: { id: integration.id }, data: { syncStatus: 'ERROR' } });
      return [];
    }
  }

  private static async exportEventToGoogle(
    integration: any,
    eventDetails: { title: string; description?: string; startTime: Date; endTime: Date; joinUrl?: string },
    requestMeetLink = false
  ): Promise<string | undefined> {
    try {
      const oauth2 = googleOAuthClient();
      let accessToken = integration.accessToken;
      if (new Date(integration.expiresAt) <= new Date()) {
        accessToken = await this.refreshGoogleToken(integration);
      }
      oauth2.setCredentials({ access_token: accessToken });
      const calendar = google.calendar({ version: 'v3', auth: oauth2 });

      const response = await calendar.events.insert({
        calendarId: 'primary',
        conferenceDataVersion: requestMeetLink ? 1 : 0,
        requestBody: {
          summary: eventDetails.title,
          description: eventDetails.description,
          start: { dateTime: eventDetails.startTime.toISOString() },
          end: { dateTime: eventDetails.endTime.toISOString() },
          ...(requestMeetLink
            ? { conferenceData: { createRequest: { requestId: `meet-${Date.now()}`, conferenceSolutionKey: { type: 'hangoutsMeet' } } } }
            : eventDetails.joinUrl
              ? { conferenceData: { entryPoints: [{ entryPointType: 'video', uri: eventDetails.joinUrl, label: 'Join Meeting' }] } }
              : {}
          )
        }
      });

      if (requestMeetLink) {
        return response.data.conferenceData?.entryPoints?.find(e => e.entryPointType === 'video')?.uri ?? undefined;
      }
    } catch (err) {
      logger.error('[Google Calendar] Failed to export event', err);
    }
    return undefined;
  }

  // ─── Outlook OAuth ─────────────────────────────────────────────────────────

  static getOutlookAuthUrl(userId: string): string {
    const redirectUri = process.env.MICROSOFT_REDIRECT_URI ||
      `${process.env.BACKEND_URL || 'http://localhost:5050'}/api/scheduling/calendar-integrations/callback/outlook`;
    const params = new URLSearchParams({
      client_id: process.env.MICROSOFT_CLIENT_ID || '',
      response_type: 'code',
      redirect_uri: redirectUri,
      scope: OUTLOOK_SCOPES.join(' '),
      response_mode: 'query',
      state: userId
    });
    return `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID || 'common'}/oauth2/v2.0/authorize?${params}`;
  }

  static async handleOutlookCallback(code: string, userId: string) {
    const redirectUri = process.env.MICROSOFT_REDIRECT_URI ||
      `${process.env.BACKEND_URL || 'http://localhost:5050'}/api/scheduling/calendar-integrations/callback/outlook`;

    const result = await msalClient().acquireTokenByCode({ code, redirectUri, scopes: OUTLOOK_SCOPES });
    const accountId = result.account?.username || result.account?.homeAccountId || '';
    const expiresAt = result.expiresOn || new Date(Date.now() + 3600 * 1000);

    await prisma.calendarIntegration.upsert({
      where: { userId_provider_accountId: { userId, provider: 'outlook', accountId } },
      create: { userId, provider: 'outlook', accountId, accessToken: result.accessToken, refreshToken: '', expiresAt, syncStatus: 'ACTIVE' },
      update: { accessToken: result.accessToken, expiresAt, syncStatus: 'ACTIVE' }
    });

    return accountId;
  }

  private static async getOutlookAccessToken(integration: any): Promise<string> {
    if (new Date(integration.expiresAt) > new Date()) return integration.accessToken;

    const accounts = await msalClient().getTokenCache().getAllAccounts();
    const account = accounts.find(a => a.username === integration.accountId);
    if (!account) throw new Error('Outlook account not found in token cache');

    const result = await msalClient().acquireTokenSilent({ account, scopes: OUTLOOK_SCOPES });
    const expiresAt = result.expiresOn || new Date(Date.now() + 3600 * 1000);
    await prisma.calendarIntegration.update({ where: { id: integration.id }, data: { accessToken: result.accessToken, expiresAt } });
    return result.accessToken;
  }

  private static async getOutlookBusySlots(integration: any, start: Date, end: Date) {
    try {
      const token = await this.getOutlookAccessToken(integration);
      const response = await fetch('https://graph.microsoft.com/v1.0/me/calendar/getSchedule', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schedules: [integration.accountId],
          startTime: { dateTime: start.toISOString(), timeZone: 'UTC' },
          endTime: { dateTime: end.toISOString(), timeZone: 'UTC' },
          availabilityViewInterval: 15
        })
      });
      if (!response.ok) throw new Error(`Graph API error: ${response.status}`);
      const data = await response.json() as any;
      return (data.value?.[0]?.scheduleItems || [])
        .filter((i: any) => i.status !== 'free')
        .map((i: any) => ({ start: new Date(i.start.dateTime + 'Z'), end: new Date(i.end.dateTime + 'Z'), source: 'outlook' }));
    } catch (err) {
      logger.error('[Outlook Calendar] Failed to fetch busy slots', err);
      await prisma.calendarIntegration.update({ where: { id: integration.id }, data: { syncStatus: 'ERROR' } });
      return [];
    }
  }

  private static async exportEventToOutlook(
    integration: any,
    eventDetails: { title: string; description?: string; startTime: Date; endTime: Date; joinUrl?: string }
  ) {
    try {
      const token = await this.getOutlookAccessToken(integration);
      await fetch('https://graph.microsoft.com/v1.0/me/events', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: eventDetails.title,
          body: { contentType: 'text', content: eventDetails.description || '' },
          start: { dateTime: eventDetails.startTime.toISOString(), timeZone: 'UTC' },
          end: { dateTime: eventDetails.endTime.toISOString(), timeZone: 'UTC' },
          ...(eventDetails.joinUrl ? { onlineMeeting: { joinUrl: eventDetails.joinUrl } } : {})
        })
      });
    } catch (err) {
      logger.error('[Outlook Calendar] Failed to export event', err);
    }
  }

  // ─── Unified public API ────────────────────────────────────────────────────

  static async getExternalBusySlots(userId: string, startDate: Date, endDate: Date) {
    const integrations = await prisma.calendarIntegration.findMany({ where: { userId, syncStatus: 'ACTIVE' } });
    const busySlots: { start: Date; end: Date; source: string }[] = [];
    const timeout = <T>(ms: number, promise: Promise<T>): Promise<T> =>
      Promise.race([promise, new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))]);

    for (const integration of integrations) {
      try {
        let slots: { start: Date; end: Date; source: string }[] = [];
        if (integration.provider === 'google') {
          slots = await timeout(8000, this.getGoogleBusySlots(integration, startDate, endDate));
        } else if (integration.provider === 'outlook') {
          slots = await timeout(8000, this.getOutlookBusySlots(integration, startDate, endDate));
        }
        busySlots.push(...slots);
      } catch (err) {
        logger.warn(`[CalendarSync] Skipping ${integration.provider} integration ${integration.id}: ${(err as Error).message}`);
      }
    }
    return busySlots;
  }

  static async exportEvent(
    userId: string,
    eventDetails: { title: string; description?: string; startTime: Date; endTime: Date; joinUrl?: string },
    requestMeetLink = false
  ): Promise<string | undefined> {
    const integrations = await prisma.calendarIntegration.findMany({ where: { userId, syncStatus: 'ACTIVE' } });
    let meetLink: string | undefined;
    for (const integration of integrations) {
      if (integration.provider === 'google') {
        const link = await this.exportEventToGoogle(integration, eventDetails, requestMeetLink);
        if (link) meetLink = link;
      } else if (integration.provider === 'outlook') {
        await this.exportEventToOutlook(integration, eventDetails);
      }
    }
    return meetLink;
  }
}
