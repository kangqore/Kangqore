import axios from 'axios';
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

    const { data: tokens } = await axios.post(
      `${sfBase}/services/oauth2/token`,
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.SALESFORCE_CLIENT_ID || '',
        client_secret: process.env.SALESFORCE_CLIENT_SECRET || '',
        redirect_uri: redirectUri,
        code
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

    await prisma.cRMIntegration.upsert({
      where: { userId_provider: { userId, provider: 'salesforce' } },
      create: { userId, provider: 'salesforce', accountId: tokens.instance_url || '', accessToken: tokens.access_token, refreshToken: tokens.refresh_token || '', expiresAt, syncStatus: 'ACTIVE' },
      update: { accountId: tokens.instance_url || '', accessToken: tokens.access_token, refreshToken: tokens.refresh_token || '', expiresAt, syncStatus: 'ACTIVE' }
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

    const sfBase = process.env.SALESFORCE_BASE_URL || 'https://login.salesforce.com';
    try {
      const { data: tokens } = await axios.post(
        `${sfBase}/services/oauth2/token`,
        new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: process.env.SALESFORCE_CLIENT_ID || '',
          client_secret: process.env.SALESFORCE_CLIENT_SECRET || '',
          refresh_token: integration.refreshToken
        }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
      await prisma.cRMIntegration.update({
        where: { userId_provider: { userId, provider: 'salesforce' } },
        data: { accessToken: tokens.access_token, expiresAt }
      });
      return { token: tokens.access_token, instanceUrl: integration.accountId };
    } catch {
      await prisma.cRMIntegration.update({
        where: { userId_provider: { userId, provider: 'salesforce' } },
        data: { syncStatus: 'ERROR' }
      });
      throw new Error('Salesforce token refresh failed');
    }
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
      const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

      const query = encodeURIComponent(`SELECT Id FROM Contact WHERE Email = '${invitee.email}' LIMIT 1`);
      const { data: searchData } = await axios.get(`${api}/query?q=${query}`, { headers });
      const existingId = searchData.records?.[0]?.Id;

      const nameParts = invitee.name.split(' ');
      const contactPayload = {
        FirstName: nameParts[0] || invitee.name,
        LastName: nameParts.slice(1).join(' ') || '.',
        Email: invitee.email,
        ...(invitee.phone && { Phone: invitee.phone }),
        ...(invitee.company && { AccountName: invitee.company })
      };

      let contactId: string;
      if (existingId) {
        await axios.patch(`${api}/sobjects/Contact/${existingId}`, contactPayload, { headers });
        contactId = existingId;
      } else {
        const { data: created } = await axios.post(`${api}/sobjects/Contact`, contactPayload, { headers });
        contactId = created.id;
      }

      await axios.post(`${api}/sobjects/Event`, {
        Subject: eventDetails.title,
        StartDateTime: eventDetails.startTime.toISOString(),
        EndDateTime: eventDetails.endTime.toISOString(),
        Description: eventDetails.joinUrl ? `Join: ${eventDetails.joinUrl}` : '',
        WhoId: contactId
      }, { headers });

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
