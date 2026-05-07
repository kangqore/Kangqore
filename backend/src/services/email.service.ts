import sgMail from '@sendgrid/mail';
import logger from '../utils/logger';

class EmailService {
  private isConfigured = false;

  constructor() {
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      this.isConfigured = true;
      logger.info('EmailService: SendGrid configured.');
    } else {
      logger.warn('EmailService: SENDGRID_API_KEY missing. Using MOCK mode (logging emails).');
    }
  }

  async sendWelcomeEmail(email: string, name: string) {
    const msg = {
      to: email,
      from: 'noreply@kangqore.com', // Verified sender
      subject: 'Welcome to Kangqore!',
      text: `Hello ${name},\n\nWelcome to Kangqore! We're excited to have you on board.\n\nBest,\nThe Kangqore Team`,
      html: `<strong>Hello ${name},</strong><br><br>Welcome to Kangqore! We're excited to have you on board.<br><br>Best,<br>The Kangqore Team`,
    };

    await this.send(msg);
  }

  async sendEmail(options: { to: string; subject: string; text?: string; html?: string }) {
    const msg = {
      to: options.to,
      from: process.env.EMAIL_FROM || 'noreply@kangqore.com',
      subject: options.subject,
      text: options.text || '',
      html: options.html || options.text || '',
    };

    await this.send(msg);
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${process.env.CORS_ORIGINS?.split(',')[0]}/reset-password?token=${token}`;
    const msg = {
      to: email,
      from: 'noreply@kangqore.com',
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the following link to reset your password: ${resetLink}`,
      html: `<p>You requested a password reset.</p><p><a href="${resetLink}">Click here to reset your password</a></p>`,
    };

    await this.send(msg);
  }

  private async send(msg: any) {
    if (this.isConfigured) {
      try {
        await sgMail.send(msg);
        logger.info(`Email sent to ${msg.to}`);
      } catch (error) {
        logger.error('Error sending email:', error);
      }
    } else {
      logger.info('---------------- MOCK EMAIL ----------------');
      logger.info(`To: ${msg.to}`);
      logger.info(`Subject: ${msg.subject}`);
      logger.info(`Body: ${msg.text}`);
      logger.info('--------------------------------------------');
    }
  }
}

export const emailService = new EmailService();
