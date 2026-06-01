import axios from 'axios';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';

export interface WebhookEventPayload {
  event: 'booking.created' | 'booking.cancelled' | 'booking.rescheduled' | 'booking.no_show';
  data: any;
}

export class WebhookService {
  /**
   * Dispatch an event to all active webhooks for a specific event type.
   * Also includes org-wide webhooks if they are configured without an eventTypeId.
   */
  async dispatchEvent(eventTypeId: string, eventName: WebhookEventPayload['event'], data: any) {
    // Find webhooks for this eventType OR global ones (eventTypeId == null)
    const webhooks = await prisma.webhook.findMany({
      where: {
        isActive: true,
        OR: [
          { eventTypeId },
          { eventTypeId: null }
        ]
      }
    });

    if (webhooks.length === 0) return;

    const payload: WebhookEventPayload = {
      event: eventName,
      data
    };

    // Dispatch asynchronously (don't block the caller)
    for (const webhook of webhooks) {
      // If the webhook declares an events filter, respect it
      const allowedEvents = (webhook as any).events as string[] | null;
      if (allowedEvents && allowedEvents.length > 0 && !allowedEvents.includes(eventName)) continue;

      this.sendWebhook(webhook, payload).catch(err => {
        console.error(`Failed to send webhook ${webhook.id}:`, err);
      });
    }
  }

  private async sendWebhook(webhook: { id: string, url: string, secret: string | null }, payload: WebhookEventPayload, attempt = 1): Promise<void> {
    const startTime = Date.now();
    const payloadStr = JSON.stringify(payload);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Kangqore-Webhook-System',
    };

    if (webhook.secret) {
      const hmac = crypto.createHmac('sha256', webhook.secret);
      hmac.update(payloadStr);
      headers['X-Kangqore-Signature'] = `t=${Date.now()},v1=${hmac.digest('hex')}`;
    }

    try {
      const response = await axios.post(webhook.url, payloadStr, {
        headers,
        timeout: 10000 // 10s timeout
      });

      const responseTime = Date.now() - startTime;
      
      await this.logDelivery(webhook.id, payload, 'SUCCESS', response.status, JSON.stringify(response.data).substring(0, 1000), responseTime);
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      const status = error.response ? error.response.status : null;
      const responseBody = error.response ? JSON.stringify(error.response.data).substring(0, 1000) : error.message;

      if (attempt < 3) {
        // Retry with exponential backoff (e.g. 5s, 25s)
        const delay = Math.pow(5, attempt) * 1000;
        setTimeout(() => this.sendWebhook(webhook, payload, attempt + 1), delay);
      } else {
        await this.logDelivery(webhook.id, payload, 'FAILED', status, responseBody, responseTime);
      }
    }
  }

  private async logDelivery(webhookId: string, payload: any, status: string, statusCode: number | null, responseBody: string, responseTime: number) {
    try {
      await prisma.webhookDelivery.create({
        data: {
          webhookId,
          payload,
          status,
          statusCode,
          responseBody,
          responseTime
        }
      });

      // Cleanup: Keep only last 100 deliveries per webhook to save space
      const count = await prisma.webhookDelivery.count({ where: { webhookId } });
      if (count > 100) {
        const oldest = await prisma.webhookDelivery.findMany({
          where: { webhookId },
          orderBy: { requestTime: 'desc' },
          skip: 100,
          take: 1
        });
        
        if (oldest.length > 0) {
          await prisma.webhookDelivery.deleteMany({
            where: {
              webhookId,
              requestTime: { lt: oldest[0].requestTime }
            }
          });
        }
      }
    } catch (dbError) {
      console.error('Failed to log webhook delivery:', dbError);
    }
  }
}

export const webhookService = new WebhookService();
