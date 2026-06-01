import { prisma } from '../lib/prisma';
import logger from '../utils/logger';

export class SalesforceService {

  // ─── OAuth ─────────────────────────────────────────────────────────────────

  static getAuthUrl(userId: string): string {
    const redirectUri = process.env.SALESFORCE_REDIRECT_URI ||
      `${process.env.BACKEND_URL || 'http://localhost:5050'}/api/scheduling/crm/salesforce/callback`;
    const sfBase = process.env.SALESFORCE_BASE_URL || 'https://login.salesforce.com';
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.SALESFORCE_CLIENT_ID || '',
      redirect_uri: redirectUri,
      state: userId
    });
    return `${sfBase}/services/oauth2/authorize?${params}`;
  }

  static async handleCallback(code: string, userId: string) {
    const redirectUri = process.env.SALESFORCE_REDIRECT_URI ||
      `${process.env.BACKEND_URL || 'http://localhost:5050'}/api/scheduling/crm/salesforce/callback`;
    const sfBase = process.env.SALESFORCE_BASE_URL || 'https://login.salesforce.com';

    const res = await fetch(`${sfBase}/services/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.SALESFORCE_CLIENT_ID || '',
        client_secret: process.env.SALESFORCE_CLIENT_SECRET || '',
        redirect_uri: redirectUri,
        code
      })
    });

    if (!res.ok) throw new Error(`Salesforce token exchange failed: ${await res.text()}`);
    const tokens = await res.json() as any;
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // SF tokens last ~2h

    await prisma.cRMIntegration.upsert({
      where: { userId_provider: { userId, provider: 'salesforce' } },
      create: {
        userId, provider: 'salesforce',
        accountId: tokens.instance_url || '',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || '',
        expiresAt, syncStatus: 'ACTIVE'
      },
      update: {
        accountId: tokens.instance_url || '',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || '',
        expiresAt, syncStatus: 'ACTIVE'
      }
    });

    return tokens.instance_url;
  }

  private static async getTokenAndInstance(userId: string): Promise<{ token: string; instanceUrl: string }> {
    const integration = await prisma.cRMIntegration.findUnique({
      where: { userId_provider: { userId, provider: 'salesforce' } }
    });
    if (!integration) throw new Error('No Salesforce integration for user');

    if (new Date(integration.expiresAt) > new Date()) {
      return { token: integration.accessToken, instanceUrl: integration.accountId };
    }

    // Refresh
    const sfBase = process.env.SALESFORCE_BASE_URL || 'https://login.salesforce.com';
    const res = await fetch(`${sfBase}/services/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: process.env.SALESFORCE_CLIENT_ID || '',
        client_secret: process.env.SALESFORCE_CLIENT_SECRET || '',
        refresh_token: integration.refreshToken
      })
    });
    if (!res.ok) {
      await prisma.cRMIntegration.update({
        where: { userId_provider: { userId, provider: 'salesforce' } },
        data: { syncStatus: 'ERROR' }
      });
      throw new Error('Salesforce token refresh failed');
    }
    const tokens = await res.json() as any;
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
    await prisma.cRMIntegration.update({
      where: { userId_provider: { userId, provider: 'salesforce' } },
      data: { accessToken: tokens.access_token, expiresAt }
    });
    return { token: tokens.access_token, instanceUrl: integration.accountId };
  }

  // ─── Sync on booking ───────────────────────────────────────────────────────

  static async syncBooking(hostUserId: string, invitee: {
    name: string; email: string; phone?: string; company?: string;
  }, eventDetails: {
    title: string; startTime: Date; endTime: Date; joinUrl?: string;
  }) {
    try {
      const { token, instanceUrl } = await this.getTokenAndInstance(hostUserId);
      const api = `${instanceUrl}/services/data/v58.0`;

      // Search for existing Contact by email
      const query = encodeURIComponent(`SELECT Id FROM Contact WHERE Email = '${invitee.email}' LIMIT 1`);
      const searchRes = await fetch(`${api}/query?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const searchData = await searchRes.json() as any;
      const existingId = searchData.records?.[0]?.Id;

      const nameParts = invitee.name.split(' ');
      const contactPayload = {
        FirstName: nameParts[0] || invitee.name,
        LastName: nameParts.slice(1).join(' ') || '.',
        Email: invitee.email,
        Phone: invitee.phone || undefined,
        AccountName: invitee.company || undefined
      };

      let contactId: string;
      if (existingId) {
        await fetch(`${api}/sobjects/Contact/${existingId}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(contactPayload)
        });
        contactId = existingId;
      } else {
        const createRes = await fetch(`${api}/sobjects/Contact`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(contactPayload)
        });
        const created = await createRes.json() as any;
        contactId = created.id;
      }

      // Create an Event (activity) linked to the contact
      await fetch(`${api}/sobjects/Event`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Subject: eventDetails.title,
          StartDateTime: eventDetails.startTime.toISOString(),
          EndDateTime: eventDetails.endTime.toISOString(),
          Description: eventDetails.joinUrl ? `Join: ${eventDetails.joinUrl}` : '',
          WhoId: contactId
        })
      });

      logger.info(`[Salesforce] Synced booking for ${invitee.email}`);
    } catch (err) {
      logger.error('[Salesforce] Sync failed', err);
    }
  }

  static async isConnected(userId: string): Promise<boolean> {
    const integration = await prisma.cRMIntegration.findUnique({
      where: { userId_provider: { userId, provider: 'salesforce' } },
      select: { syncStatus: true }
    });
    return integration?.syncStatus === 'ACTIVE';
  }
}
