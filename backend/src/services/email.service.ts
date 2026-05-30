import sgMail from '@sendgrid/mail';
import { format } from 'date-fns';
import { randomUUID } from 'crypto';
import { prisma } from '../lib/prisma';
import logger from '../utils/logger';

interface BookingConfirmationData {
  inviteeName: string;
  inviteeEmail: string;
  hostName: string;
  hostEmail: string;
  eventTypeId: string;
  eventTitle: string;
  startTime: Date;
  endTime: Date;
  timezone: string;
  joinUrl?: string;
  cancelToken: string;
  rescheduleToken: string;
  frontendUrl: string;
}

interface CancelNotificationData {
  inviteeName: string;
  inviteeEmail: string;
  hostEmail: string;
  eventTypeId: string;
  eventTitle: string;
  startTime: Date;
  cancelReason?: string;
  cancelledBy: 'host' | 'invitee';
}

interface ReminderData {
  inviteeName: string;
  inviteeEmail: string;
  hostEmail: string;
  eventTypeId: string;
  eventTitle: string;
  startTime: Date;
  joinUrl?: string;
  minutesBefore: number;
}

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
      from: 'noreply@kangqore.com',
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

  async sendEmailWithAttachment(options: { 
    to: string; 
    subject: string; 
    text?: string; 
    html?: string;
    attachment: {
      content: string;
      filename: string;
      type: string;
      disposition: string;
    }
  }) {
    const msg = {
      to: options.to,
      from: process.env.EMAIL_FROM || 'noreply@kangqore.com',
      subject: options.subject,
      text: options.text || '',
      html: options.html || options.text || '',
      attachments: [options.attachment]
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

  async sendBookingConfirmation(data: BookingConfirmationData) {
    const {
      inviteeName, inviteeEmail, hostName, hostEmail,
      eventTypeId, eventTitle, startTime, endTime, timezone,
      joinUrl, cancelToken, rescheduleToken, frontendUrl
    } = data;

    const icsContent = this.generateICS({
      title: eventTitle,
      startTime,
      endTime,
      timezone,
      organiserName: 'Kangqore',
      organiserEmail: hostEmail,
      attendeeEmail: inviteeEmail,
      attendeeName: inviteeName,
      joinUrl
    });

    const cancelLink = `${frontendUrl}/booking/cancel/${cancelToken}`;
    const rescheduleLink = `${frontendUrl}/booking/reschedule/${rescheduleToken}`;
    const dateStr = format(startTime, 'EEEE, MMMM d, yyyy');
    const timeStr = format(startTime, 'h:mm a');
    const endTimeStr = format(endTime, 'h:mm a');

    const inviteeHtml = this.bookingEmailHtml({
      name: inviteeName,
      eventTitle,
      dateStr,
      timeStr,
      endTimeStr,
      timezone,
      joinUrl,
      cancelLink,
      rescheduleLink,
      isHost: false
    });

    const confirmationTemplate = await prisma.emailTemplate.findUnique({
      where: { eventTypeId_type: { eventTypeId, type: 'CONFIRMATION' } }
    });

    const hostHtml = this.bookingEmailHtml({
      name: hostName,
      guestName: inviteeName,
      guestEmail: inviteeEmail,
      eventTitle,
      dateStr,
      timeStr,
      endTimeStr,
      timezone,
      joinUrl,
      isHost: true
    });

    const inviteeSubject = confirmationTemplate 
      ? this.replaceTemplateVariables(confirmationTemplate.subject, data)
      : `Confirmed: ${eventTitle} on ${dateStr}`;

    const parsedInviteeHtml = confirmationTemplate
      ? this.replaceTemplateVariables(confirmationTemplate.bodyHtml, data)
      : inviteeHtml;

    const attachment = {
      content: Buffer.from(icsContent).toString('base64'),
      filename: 'invite.ics',
      type: 'text/calendar; method=REQUEST',
      disposition: 'attachment'
    };

    await Promise.all([
      this.send({
        to: inviteeEmail,
        from: process.env.EMAIL_FROM || 'noreply@kangqore.com',
        subject: inviteeSubject,
        text: `Your consultation "${eventTitle}" is confirmed for ${dateStr} at ${timeStr} ${timezone}.${joinUrl ? `\n\nJoin: ${joinUrl}` : ''}\n\nCancel: ${cancelLink}\nReschedule: ${rescheduleLink}`,
        html: parsedInviteeHtml,
        attachments: [attachment]
      }),
      this.send({
        to: hostEmail,
        from: process.env.EMAIL_FROM || 'noreply@kangqore.com',
        subject: `New Booking: ${eventTitle} with ${inviteeName}`,
        text: `${inviteeName} (${inviteeEmail}) has booked "${eventTitle}" for ${dateStr} at ${timeStr} ${timezone}.`,
        html: hostHtml,
        attachments: [attachment]
      })
    ]);
  }

  async sendCancelNotification(data: CancelNotificationData) {
    const { inviteeName, inviteeEmail, hostEmail, eventTypeId, eventTitle, startTime, cancelReason, cancelledBy } = data;
    const dateStr = format(startTime, 'EEEE, MMMM d, yyyy');
    const timeStr = format(startTime, 'h:mm a');
    const cancellerLabel = cancelledBy === 'host' ? 'Kangqore' : inviteeName;
    const subject = `Cancelled: ${eventTitle} on ${dateStr}`;
    const body = `Your consultation "${eventTitle}" scheduled for ${dateStr} at ${timeStr} has been cancelled by ${cancellerLabel}.${cancelReason ? `\n\nReason: ${cancelReason}` : ''}`;

    const html = `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f9fafb;border-radius:12px;">
        <div style="background:#fff;border-radius:8px;padding:32px;border:1px solid #e5e7eb;">
          <div style="width:48px;height:48px;background:#fee2e2;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
            <span style="font-size:24px;">✕</span>
          </div>
          <h2 style="text-align:center;color:#111827;margin:0 0 8px;">Meeting Cancelled</h2>
          <p style="text-align:center;color:#6b7280;margin:0 0 24px;">Your consultation has been cancelled by <strong>${cancellerLabel}</strong>.</p>
          <div style="background:#f9fafb;border-radius:8px;padding:16px;margin-bottom:24px;">
            <p style="margin:0 0 8px;color:#374151;"><strong>${eventTitle}</strong></p>
            <p style="margin:0;color:#6b7280;">${dateStr} at ${timeStr}</p>
            ${cancelReason ? `<p style="margin:8px 0 0;color:#6b7280;">Reason: ${cancelReason}</p>` : ''}
          </div>
          <p style="color:#6b7280;font-size:14px;text-align:center;">Visit <a href="${process.env.FRONTEND_URL || 'https://kangqore.com'}" style="color:#2564ea;">kangqore.com</a> to schedule a new consultation.</p>
        </div>
      </div>`;

    const cancelTemplate = await prisma.emailTemplate.findUnique({
      where: { eventTypeId_type: { eventTypeId, type: 'CANCELLATION' } }
    });
    
    const parsedSubject = cancelTemplate
      ? this.replaceTemplateVariables(cancelTemplate.subject, data)
      : subject;
      
    const parsedHtml = cancelTemplate
      ? this.replaceTemplateVariables(cancelTemplate.bodyHtml, data)
      : html;

    const recipients = cancelledBy === 'host'
      ? [{ to: inviteeEmail, name: inviteeName }]
      : [{ to: inviteeEmail, name: inviteeName }, { to: hostEmail, name: 'Kangqore Team' }];

    await Promise.all(recipients.map(r => this.send({
      to: r.to,
      from: process.env.EMAIL_FROM || 'noreply@kangqore.com',
      subject: parsedSubject,
      text: body,
      html: parsedHtml
    })));
  }

  async sendReminderEmail(data: ReminderData) {
    const { inviteeName, inviteeEmail, hostEmail, eventTypeId, eventTitle, startTime, joinUrl, minutesBefore } = data;
    const dateStr = format(startTime, 'EEEE, MMMM d, yyyy');
    const timeStr = format(startTime, 'h:mm a');
    const label = minutesBefore >= 1440 ? '24 hours' : '1 hour';
    const subject = `Reminder: ${eventTitle} starts in ${label}`;

    const html = `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f9fafb;border-radius:12px;">
        <div style="background:#fff;border-radius:8px;padding:32px;border:1px solid #e5e7eb;">
          <h2 style="color:#111827;margin:0 0 8px;">Your meeting starts in ${label}</h2>
          <p style="color:#6b7280;margin:0 0 24px;">${eventTitle}</p>
          <div style="background:#eff6ff;border-radius:8px;padding:16px;margin-bottom:24px;">
            <p style="margin:0 0 4px;color:#1d4ed8;font-weight:600;">${dateStr}</p>
            <p style="margin:0;color:#3b82f6;">${timeStr}</p>
          </div>
          ${joinUrl ? `<div style="text-align:center;"><a href="${joinUrl}" style="display:inline-block;background:linear-gradient(135deg,#2564ea,#06b6d4);color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;">Join Meeting</a></div>` : ''}
        </div>
      </div>`;

    const reminderType = minutesBefore >= 1440 ? 'REMINDER_24H' : 'REMINDER_1H';
    const reminderTemplate = await prisma.emailTemplate.findUnique({
      where: { eventTypeId_type: { eventTypeId, type: reminderType } }
    });
    
    const parsedSubject = reminderTemplate
      ? this.replaceTemplateVariables(reminderTemplate.subject, data)
      : subject;
      
    const parsedHtml = reminderTemplate
      ? this.replaceTemplateVariables(reminderTemplate.bodyHtml, data)
      : html;

    await Promise.all([
      this.send({ to: inviteeEmail, from: process.env.EMAIL_FROM || 'noreply@kangqore.com', subject: parsedSubject, text: subject, html: parsedHtml }),
      this.send({ to: hostEmail, from: process.env.EMAIL_FROM || 'noreply@kangqore.com', subject: `${subject} (with ${inviteeName})`, text: subject, html })
    ]);
  }

  private replaceTemplateVariables(template: string, data: any): string {
    let result = template;
    const dateStr = data.startTime ? format(data.startTime, 'EEEE, MMMM d, yyyy') : '';
    const timeStr = data.startTime ? format(data.startTime, 'h:mm a') : '';
    const replacements: Record<string, string> = {
      '{{invitee_name}}': data.inviteeName || '',
      '{{event_name}}': data.eventTitle || '',
      '{{date}}': dateStr,
      '{{time}}': timeStr,
      '{{join_url}}': data.joinUrl || '',
      '{{host_name}}': data.hostName || ''
    };

    for (const [key, value] of Object.entries(replacements)) {
      result = result.replace(new RegExp(key, 'g'), value);
    }
    return result;
  }

  private generateICS(params: {
    title: string;
    startTime: Date;
    endTime: Date;
    timezone: string;
    organiserName: string;
    organiserEmail: string;
    attendeeEmail: string;
    attendeeName: string;
    joinUrl?: string;
  }): string {
    const fmt = (d: Date) =>
      d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const uid = `${randomUUID()}@kangqore.com`;
    const now = fmt(new Date());
    const desc = params.joinUrl
      ? `Join: ${params.joinUrl}`
      : 'Kangqore consultation call.';

    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Kangqore//Kangqore//EN',
      'METHOD:REQUEST',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${now}`,
      `DTSTART;TZID=${params.timezone}:${fmt(params.startTime)}`,
      `DTEND;TZID=${params.timezone}:${fmt(params.endTime)}`,
      `SUMMARY:${params.title.replace(/\n/g, '\\n')}`,
      `DESCRIPTION:${desc.replace(/\n/g, '\\n')}`,
      `LOCATION:${params.joinUrl || 'Online'}`,
      `ORGANIZER;CN=${params.organiserName}:MAILTO:${params.organiserEmail}`,
      `ATTENDEE;CN=${params.attendeeName};RSVP=TRUE;ROLE=REQ-PARTICIPANT:MAILTO:${params.attendeeEmail}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ];

    return lines.join('\r\n');
  }

  private bookingEmailHtml(params: {
    name: string;
    guestName?: string;
    guestEmail?: string;
    eventTitle: string;
    dateStr: string;
    timeStr: string;
    endTimeStr: string;
    timezone: string;
    joinUrl?: string;
    cancelLink?: string;
    rescheduleLink?: string;
    isHost: boolean;
  }): string {
    const { name, guestName, guestEmail, eventTitle, dateStr, timeStr, endTimeStr, timezone, joinUrl, cancelLink, rescheduleLink, isHost } = params;
    return `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f9fafb;border-radius:12px;">
        <div style="background:#fff;border-radius:8px;padding:32px;border:1px solid #e5e7eb;">
          <div style="text-align:center;margin-bottom:24px;">
            <div style="width:56px;height:56px;background:linear-gradient(135deg,#2564ea,#06b6d4);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;">
              <span style="color:#fff;font-size:28px;">✓</span>
            </div>
          </div>
          <h2 style="text-align:center;color:#111827;margin:0 0 4px;">Meeting Confirmed</h2>
          <p style="text-align:center;color:#6b7280;margin:0 0 24px;">Hi ${name}, your consultation is scheduled.</p>
          ${isHost && guestName ? `<p style="color:#374151;margin:0 0 16px;"><strong>${guestName}</strong> (${guestEmail}) has booked a session with you.</p>` : ''}
          <div style="background:#eff6ff;border-left:4px solid #2564ea;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:24px;">
            <p style="margin:0 0 6px;font-weight:700;color:#111827;font-size:16px;">${eventTitle}</p>
            <p style="margin:0 0 4px;color:#374151;">📅 ${dateStr}</p>
            <p style="margin:0 0 4px;color:#374151;">🕐 ${timeStr} – ${endTimeStr}</p>
            <p style="margin:0;color:#6b7280;font-size:13px;">🌍 ${timezone}</p>
          </div>
          ${joinUrl ? `
          <div style="text-align:center;margin-bottom:24px;">
            <a href="${joinUrl}" style="display:inline-block;background:linear-gradient(135deg,#2564ea,#06b6d4);color:#fff;padding:14px 40px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">Join Meeting</a>
          </div>
          <p style="text-align:center;color:#6b7280;font-size:13px;margin:0 0 24px;word-break:break-all;">
            <a href="${joinUrl}" style="color:#2564ea;">${joinUrl}</a>
          </p>` : ''}
          <p style="color:#6b7280;font-size:13px;margin:0 0 8px;">📎 A calendar invite (.ics) is attached to this email.</p>
          ${!isHost && cancelLink && rescheduleLink ? `
          <div style="border-top:1px solid #e5e7eb;padding-top:20px;margin-top:20px;display:flex;gap:12px;justify-content:center;">
            <a href="${rescheduleLink}" style="color:#2564ea;font-size:13px;text-decoration:none;">↺ Reschedule</a>
            <span style="color:#d1d5db;">|</span>
            <a href="${cancelLink}" style="color:#ef4444;font-size:13px;text-decoration:none;">✕ Cancel</a>
          </div>` : ''}
        </div>
        <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px;">Kangqore · <a href="https://kangqore.com" style="color:#9ca3af;">kangqore.com</a></p>
      </div>`;
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
      if (msg.attachments?.length) logger.info(`Attachments: ${msg.attachments.map((a: any) => a.filename).join(', ')}`);
      logger.info('--------------------------------------------');
    }
  }
}

export const emailService = new EmailService();
