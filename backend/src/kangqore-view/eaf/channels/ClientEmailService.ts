import sgMail from '@sendgrid/mail';
import { prisma } from '../../../lib/prisma';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const FROM    = process.env.EMAIL_FROM     || 'notifications@kangqore.com';
const PORTAL  = process.env.FRONTEND_URL   || 'https://kangqore.com';
const BASE    = `${PORTAL}/kangqore-view/client`;

// ── Event types ───────────────────────────────────────────────────────────────

export type ClientEventType =
  | 'INVOICE_READY'
  | 'INVOICE_DUE'
  | 'INVOICE_OVERDUE'
  | 'ACTION_REQUIRED'
  | 'CHANGE_REQUEST_UPDATE'
  | 'TICKET_REPLY'
  | 'DOCUMENT_UPLOADED'
  | 'MILESTONE_COMPLETE'

export interface ClientEvent {
  type: ClientEventType
  // INVOICE_READY / INVOICE_DUE / INVOICE_OVERDUE
  invoiceNumber?: string
  amount?: number
  currency?: string
  dueDate?: Date
  // ACTION_REQUIRED
  actions?: Array<{ title: string; subtitle: string; link: string }>
  // CHANGE_REQUEST_UPDATE
  crTitle?: string
  crStatus?: 'APPROVED' | 'REJECTED'
  // TICKET_REPLY
  ticketSubject?: string
  replyPreview?: string
  // DOCUMENT_UPLOADED
  documentTitle?: string
  // MILESTONE_COMPLETE
  milestoneTitle?: string
}

const EVENT_SUBJECTS: Record<ClientEventType, string> = {
  INVOICE_READY:          'New invoice ready — Kangqore',
  INVOICE_DUE:            'Invoice due in 3 days — Kangqore',
  INVOICE_OVERDUE:        'Invoice overdue — action required',
  ACTION_REQUIRED:        'Action required on your Kangqore portal',
  CHANGE_REQUEST_UPDATE:  'Your change request has been updated',
  TICKET_REPLY:           'New reply on your support ticket',
  DOCUMENT_UPLOADED:      'New document available on your portal',
  MILESTONE_COMPLETE:     'Milestone completed — please review',
}

// ── Shared layout wrapper ─────────────────────────────────────────────────────

function layout(preheader: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kangqore</title>
</head>
<body style="margin:0;padding:0;background:#080c18;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <!-- Preheader (hidden preview text) -->
  <span style="display:none;max-height:0;overflow:hidden;">${preheader}</span>

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080c18;min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0">

          <!-- Logo bar -->
          <tr>
            <td style="padding-bottom:24px;" align="center">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#2564ea,#2564ea88);width:36px;height:36px;border-radius:10px;text-align:center;vertical-align:middle;">
                    <span style="color:#fff;font-size:16px;font-weight:800;line-height:36px;">K</span>
                  </td>
                  <td style="padding-left:10px;vertical-align:middle;">
                    <span style="color:#fff;font-size:16px;font-weight:700;letter-spacing:-0.3px;">Kangqore</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#0f172a;border-radius:16px;border:1px solid #1e2b40;padding:32px;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="color:#334155;font-size:12px;margin:0;">
                Kangqore Client Portal &nbsp;·&nbsp;
                <a href="${BASE}/settings" style="color:#2564ea;text-decoration:none;">Manage notifications</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ── CTA button ────────────────────────────────────────────────────────────────

function ctaButton(label: string, href: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin-top:24px;">
    <tr>
      <td style="background:#2564ea;border-radius:10px;padding:0;">
        <a href="${href}" style="display:inline-block;padding:13px 28px;color:#fff;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:0.1px;">${label}</a>
      </td>
    </tr>
  </table>`
}

// ── Badge (status pill) ───────────────────────────────────────────────────────

function pill(label: string, color: string, bg: string): string {
  return `<span style="display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;color:${color};background:${bg};border:1px solid ${color}30;">${label}</span>`
}

// ── 4 templates ───────────────────────────────────────────────────────────────

function tmplInvoice(e: ClientEvent, type: 'READY' | 'DUE' | 'OVERDUE'): string {
  const amount   = e.amount   ? `${e.currency || 'USD'} ${Number(e.amount).toLocaleString()}` : ''
  const dueLabel = e.dueDate  ? new Date(e.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
  const badge    = type === 'OVERDUE'
    ? pill('OVERDUE', '#e2445c', '#e2445c18')
    : type === 'DUE'
      ? pill('DUE SOON', '#fdab3d', '#fdab3d18')
      : pill('NEW', '#2564ea', '#2564ea18')

  const headline = type === 'OVERDUE'
    ? 'Your invoice is overdue'
    : type === 'DUE'
      ? 'Invoice due in 3 days'
      : `Invoice ${e.invoiceNumber} is ready`

  const body = type === 'OVERDUE'
    ? 'Payment is past due. Please arrange payment as soon as possible to avoid service interruption.'
    : type === 'DUE'
      ? `Your invoice is due on <strong style="color:#fdab3d;">${dueLabel}</strong>. Please arrange payment to keep your account current.`
      : `A new invoice has been issued and is available for review on your portal.`

  return layout(`${headline} — ${amount}`, `
    <p style="margin:0 0 4px;color:#64748b;font-size:12px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;">Invoice ${e.invoiceNumber || ''}</p>
    <h1 style="margin:0 0 16px;color:#f1f5f9;font-size:22px;font-weight:700;line-height:1.3;">${headline}</h1>
    ${badge}

    <!-- Amount card -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;background:#161b27;border-radius:12px;border:1px solid #1e2b40;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 4px;color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;">Amount Due</p>
          <p style="margin:0;color:#f1f5f9;font-size:28px;font-weight:800;letter-spacing:-0.5px;">${amount}</p>
          ${dueLabel ? `<p style="margin:6px 0 0;color:#64748b;font-size:12px;">Due ${dueLabel}</p>` : ''}
        </td>
      </tr>
    </table>

    <p style="margin:20px 0 0;color:#94a3b8;font-size:14px;line-height:1.6;">${body}</p>
    ${ctaButton('View Invoice', `${BASE}/invoices`)}
  `)
}

function tmplChangeRequest(e: ClientEvent): string {
  const approved = e.crStatus === 'APPROVED'
  const badge    = approved
    ? pill('APPROVED', '#00c875', '#00c87518')
    : pill('DECLINED', '#e2445c', '#e2445c18')
  const headline = approved ? 'Your change request was approved' : 'Your change request was not approved'
  const message  = approved
    ? `Your change request <strong style="color:#e2e8f0;">"${e.crTitle}"</strong> has been approved. Your account manager will be in touch shortly with next steps.`
    : `Your change request <strong style="color:#e2e8f0;">"${e.crTitle}"</strong> was not approved at this time. Please contact your account manager to discuss alternatives.`

  return layout(headline, `
    <p style="margin:0 0 4px;color:#64748b;font-size:12px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;">Change Request</p>
    <h1 style="margin:0 0 16px;color:#f1f5f9;font-size:22px;font-weight:700;line-height:1.3;">${headline}</h1>
    ${badge}
    <p style="margin:20px 0 0;color:#94a3b8;font-size:14px;line-height:1.6;">${message}</p>
    ${ctaButton('View Change Requests', `${BASE}/change-requests`)}
  `)
}

function tmplTicketReply(e: ClientEvent): string {
  const preview = e.replyPreview
    ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;background:#161b27;border-radius:12px;border:1px solid #1e2b40;border-left:3px solid #2564ea;">
        <tr><td style="padding:16px 20px;">
          <p style="margin:0 0 4px;color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;">Support Team</p>
          <p style="margin:0;color:#cbd5e1;font-size:14px;line-height:1.6;">${e.replyPreview}</p>
        </td></tr>
      </table>`
    : ''

  return layout(`New reply on: ${e.ticketSubject}`, `
    <p style="margin:0 0 4px;color:#64748b;font-size:12px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;">Support Ticket</p>
    <h1 style="margin:0 0 8px;color:#f1f5f9;font-size:22px;font-weight:700;line-height:1.3;">New reply from support</h1>
    <p style="margin:0;color:#64748b;font-size:14px;">${e.ticketSubject || ''}</p>
    ${preview}
    <p style="margin:20px 0 0;color:#94a3b8;font-size:14px;line-height:1.6;">Your support team has replied to your ticket. Log in to continue the conversation.</p>
    ${ctaButton('View Ticket', `${BASE}/support`)}
  `)
}

function tmplActionRequired(e: ClientEvent): string {
  const items = (e.actions ?? []).map(a => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #1e2b40;">
        <p style="margin:0;color:#e2e8f0;font-size:14px;font-weight:600;">${a.title}</p>
        <p style="margin:2px 0 0;color:#64748b;font-size:12px;">${a.subtitle}</p>
      </td>
    </tr>`).join('')

  return layout(`${e.actions?.length ?? 0} items need your attention`, `
    <p style="margin:0 0 4px;color:#64748b;font-size:12px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;">Action Required</p>
    <h1 style="margin:0 0 8px;color:#f1f5f9;font-size:22px;font-weight:700;line-height:1.3;">${e.actions?.length ?? 0} items need your attention</h1>
    <p style="margin:0 0 20px;color:#94a3b8;font-size:14px;">The following items on your Kangqore portal are waiting for your review.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#161b27;border-radius:12px;border:1px solid #1e2b40;padding:0 20px;">
      <tbody>${items}</tbody>
    </table>

    ${ctaButton('Open your portal', `${BASE}`)}
  `)
}

function tmplDocumentUploaded(e: ClientEvent): string {
  return layout(`New document: ${e.documentTitle}`, `
    <p style="margin:0 0 4px;color:#64748b;font-size:12px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;">Documents</p>
    <h1 style="margin:0 0 8px;color:#f1f5f9;font-size:22px;font-weight:700;line-height:1.3;">New document available</h1>
    <p style="margin:0 0 20px;color:#94a3b8;font-size:14px;">A new document has been added to your portal.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#161b27;border-radius:12px;border:1px solid #1e2b40;">
      <tr>
        <td style="padding:20px 24px;">
          <p style="margin:0 0 4px;color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;">Document</p>
          <p style="margin:0;color:#f1f5f9;font-size:16px;font-weight:600;">${e.documentTitle || 'Untitled'}</p>
        </td>
      </tr>
    </table>

    ${ctaButton('View Documents', `${BASE}/documents`)}
  `)
}

function tmplMilestoneComplete(e: ClientEvent): string {
  return layout(`Milestone completed: ${e.milestoneTitle}`, `
    <p style="margin:0 0 4px;color:#64748b;font-size:12px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;">Project Milestone</p>
    <h1 style="margin:0 0 8px;color:#f1f5f9;font-size:22px;font-weight:700;line-height:1.3;">Milestone completed</h1>
    ${pill('COMPLETED', '#00c875', '#00c87518')}
    <p style="margin:20px 0 0;color:#94a3b8;font-size:14px;line-height:1.6;">
      <strong style="color:#e2e8f0;">"${e.milestoneTitle}"</strong> has been marked complete. Please log in to review and acknowledge.
    </p>
    ${ctaButton('Review Milestone', `${BASE}/projects`)}
  `)
}

// ── Renderer ──────────────────────────────────────────────────────────────────

function renderClientEmailTemplate(event: ClientEvent): string {
  switch (event.type) {
    case 'INVOICE_READY':    return tmplInvoice(event, 'READY')
    case 'INVOICE_DUE':      return tmplInvoice(event, 'DUE')
    case 'INVOICE_OVERDUE':  return tmplInvoice(event, 'OVERDUE')
    case 'CHANGE_REQUEST_UPDATE': return tmplChangeRequest(event)
    case 'TICKET_REPLY':     return tmplTicketReply(event)
    case 'ACTION_REQUIRED':  return tmplActionRequired(event)
    case 'DOCUMENT_UPLOADED': return tmplDocumentUploaded(event)
    case 'MILESTONE_COMPLETE': return tmplMilestoneComplete(event)
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function notifyClient(userId: string, event: ClientEvent): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    })
    if (!user?.email) return

    if (!process.env.SENDGRID_API_KEY) {
      // Mock mode — log to console, don't fail
      console.log(`[ClientEmail MOCK] → ${user.email} | ${EVENT_SUBJECTS[event.type]}`)
      return
    }

    await sgMail.send({
      to:      user.email,
      from:    FROM,
      subject: EVENT_SUBJECTS[event.type],
      html:    renderClientEmailTemplate(event),
    })
  } catch (err) {
    // Email must never break the main flow
    console.error('[ClientEmail] Failed to send:', err)
  }
}
