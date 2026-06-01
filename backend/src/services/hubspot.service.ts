import { prisma } from '../lib/prisma';
import logger from '../utils/logger';

const HS_API = 'https://api.hubapi.com';

export class HubspotService {

  // ─── OAuth ─────────────────────────────────────────────────────────────────

  static getAuthUrl(userId: string): string {
    const redirectUri = process.env.HUBSPOT_REDIRECT_URI ||
      `${process.env.BACKEND_URL || 'http://localhost:5050'}/api/scheduling/crm/hubspot/callback`;
    const params = new URLSearchParams({
      client_id: process.env.HUBSPOT_CLIENT_ID || '',
      redirect_uri: redirectUri,
      scope: 'crm.objects.contacts.write crm.objects.contacts.read timeline',
      state: userId
    });
    return `https://app.hubspot.com/oauth/authorize?${params}`;
  }

  static async handleCallback(code: string, userId: string) {
    const redirectUri = process.env.HUBSPOT_REDIRECT_URI ||
      `${process.env.BACKEND_URL || 'http://localhost:5050'}/api/scheduling/crm/hubspot/callback`;

    const res = await fetch(`${HS_API}/oauth/v1/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.HUBSPOT_CLIENT_ID || '',
        client_secret: process.env.HUBSPOT_CLIENT_SECRET || '',
        redirect_uri: redirectUri,
        code
      })
    });

    if (!res.ok) throw new Error(`HubSpot token exchange failed: ${await res.text()}`);
    const tokens = await res.json() as any;
    const expiresAt = new Date(Date.now() + (tokens.expires_in || 1800) * 1000);

    // Get HubSpot portal ID
    const infoRes = await fetch(`${HS_API}/oauth/v1/access-tokens/${tokens.access_token}`);
    const info = await infoRes.json() as any;

    await prisma.cRMIntegration.upsert({
      where: { userId_provider: { userId, provider: 'hubspot' } },
      create: {
        userId, provider: 'hubspot',
        accountId: String(info.hub_id || ''),
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || '',
        expiresAt, syncStatus: 'ACTIVE'
      },
      update: {
        accountId: String(info.hub_id || ''),
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || '',
        expiresAt, syncStatus: 'ACTIVE'
      }
    });

    return info.hub_id;
  }

  private static async getToken(userId: string): Promise<string> {
    const integration = await prisma.cRMIntegration.findUnique({
      where: { userId_provider: { userId, provider: 'hubspot' } }
    });
    if (!integration) throw new Error('No HubSpot integration for user');

    if (new Date(integration.expiresAt) > new Date()) return integration.accessToken;

    // Refresh
    const res = await fetch(`${HS_API}/oauth/v1/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: process.env.HUBSPOT_CLIENT_ID || '',
        client_secret: process.env.HUBSPOT_CLIENT_SECRET || '',
        refresh_token: integration.refreshToken
      })
    });
    if (!res.ok) {
      await prisma.cRMIntegration.update({
        where: { userId_provider: { userId, provider: 'hubspot' } },
        data: { syncStatus: 'ERROR' }
      });
      throw new Error('HubSpot token refresh failed');
    }
    const tokens = await res.json() as any;
    const expiresAt = new Date(Date.now() + (tokens.expires_in || 1800) * 1000);
    await prisma.cRMIntegration.update({
      where: { userId_provider: { userId, provider: 'hubspot' } },
      data: { accessToken: tokens.access_token, refreshToken: tokens.refresh_token || integration.refreshToken, expiresAt }
    });
    return tokens.access_token;
  }

  // ─── Sync on booking ───────────────────────────────────────────────────────

  static async syncBooking(hostUserId: string, invitee: {
    name: string; email: string; phone?: string; company?: string;
  }, eventDetails: {
    title: string; startTime: Date; endTime: Date; joinUrl?: string;
  }) {
    try {
      const token = await this.getToken(hostUserId);

      // Search for existing contact
      const searchRes = await fetch(`${HS_API}/crm/v3/objects/contacts/search`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: invitee.email }] }]
        })
      });
      const searchData = await searchRes.json() as any;
      const existingId = searchData.results?.[0]?.id;

      const nameParts = invitee.name.split(' ');
      const contactProps = {
        firstname: nameParts[0] || invitee.name,
        lastname: nameParts.slice(1).join(' ') || '',
        email: invitee.email,
        phone: invitee.phone || '',
        company: invitee.company || ''
      };

      let contactId: string;
      if (existingId) {
        await fetch(`${HS_API}/crm/v3/objects/contacts/${existingId}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ properties: contactProps })
        });
        contactId = existingId;
      } else {
        const createRes = await fetch(`${HS_API}/crm/v3/objects/contacts`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ properties: contactProps })
        });
        const created = await createRes.json() as any;
        contactId = created.id;
      }

      // Log meeting as an activity note
      await fetch(`${HS_API}/crm/v3/objects/notes`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          properties: {
            hs_note_body: `Booking: ${eventDetails.title}\nTime: ${eventDetails.startTime.toISOString()}\n${eventDetails.joinUrl ? `Join: ${eventDetails.joinUrl}` : ''}`,
            hs_timestamp: eventDetails.startTime.getTime()
          },
          associations: [{
            to: { id: contactId },
            types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }]
          }]
        })
      });

      logger.info(`[HubSpot] Synced booking for ${invitee.email}`);
    } catch (err) {
      logger.error('[HubSpot] Sync failed', err);
    }
  }

  static async isConnected(userId: string): Promise<boolean> {
    const integration = await prisma.cRMIntegration.findUnique({
      where: { userId_provider: { userId, provider: 'hubspot' } },
      select: { syncStatus: true }
    });
    return integration?.syncStatus === 'ACTIVE';
  }
}
