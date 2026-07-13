import twilio from 'twilio';
import logger from '../utils/logger';

class SmsService {
  private readonly client: twilio.Twilio | null = null;
  private readonly fromNumber: string | undefined;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_FROM;

    if (accountSid && authToken && this.fromNumber) {
      this.client = twilio(accountSid, authToken);
      logger.info('Twilio SMS service initialized');
    } else {
      logger.warn('Twilio SMS service disabled. Missing TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or TWILIO_FROM');
    }
  }

  async sendReminderSms(to: string, message: string): Promise<boolean> {
    if (!this.client || !this.fromNumber) {
      logger.warn(`SMS simulation to ${to}: ${message}`);
      return false;
    }

    try {
      await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to
      });
      logger.info(`SMS reminder sent successfully to ${to}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send SMS reminder to ${to}`, error);
      return false;
    }
  }
}

export const smsService = new SmsService();
