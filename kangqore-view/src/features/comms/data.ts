import type { EmailConversation, InternalConversation } from './types'

export const MOCK_CLIENT_EMAILS: EmailConversation[] = [
  {
    id: 'cl1',
    user: { id: 'cl1', name: 'Dr. Sarah Mitchell', email: 'sarah@globemed.com', company: 'GlobeMed Group' },
    unreadCount: 1,
    lastMessage: {
      id: 'e3', subject: 'Re: Offline mode change request', from: 'sarah@globemed.com',
      to: 'admin@kangqore.com', body: 'Thanks for the quick response. Can we confirm the cost impact is fixed at £12k?',
      preview: 'Thanks for the quick response. Can we confirm the cost impact is fixed at £12k?',
      direction: 'inbound', isRead: false, hasAttachment: false, createdAt: '2026-06-02T09:15:00Z',
    },
    emails: [
      { id: 'e1', subject: 'Offline mode change request', from: 'sarah@globemed.com', to: 'admin@kangqore.com', body: 'Hi team, we need to add offline mode support for clinicians in low-connectivity wards. Please advise on impact.', preview: 'Hi team, we need to add offline mode support…', direction: 'inbound', isRead: true, hasAttachment: false, createdAt: '2026-06-01T10:00:00Z' },
      { id: 'e2', subject: 'Re: Offline mode change request', from: 'admin@kangqore.com', to: 'sarah@globemed.com', body: 'Hi Sarah, we have reviewed this. Estimated cost is £12,000 and will add 3 weeks to the timeline. A formal CR has been raised for your approval.', preview: 'Hi Sarah, we have reviewed this…', direction: 'outbound', isRead: true, hasAttachment: false, createdAt: '2026-06-01T14:30:00Z' },
      { id: 'e3', subject: 'Re: Offline mode change request', from: 'sarah@globemed.com', to: 'admin@kangqore.com', body: 'Thanks for the quick response. Can we confirm the cost impact is fixed at £12k?', preview: 'Thanks for the quick response. Can we confirm the cost impact is fixed at £12k?', direction: 'inbound', isRead: false, hasAttachment: false, createdAt: '2026-06-02T09:15:00Z' },
    ],
  },
  {
    id: 'cl2',
    user: { id: 'cl2', name: 'James Okello', email: 'james@meridian.com', company: 'Meridian Capital' },
    unreadCount: 0,
    lastMessage: {
      id: 'e5', subject: 'Re: Invoice INV-2026-038 query', from: 'admin@kangqore.com',
      to: 'james@meridian.com', body: 'Hi James, we have corrected line item 3 and re-issued the invoice.',
      preview: 'Hi James, we have corrected line item 3 and re-issued the invoice.',
      direction: 'outbound', isRead: true, hasAttachment: true, createdAt: '2026-05-22T11:00:00Z',
    },
    emails: [
      { id: 'e4', subject: 'Invoice INV-2026-038 query', from: 'james@meridian.com', to: 'admin@kangqore.com', body: 'Hi, line item 3 says "Extended discovery — 8h" but the SOW only covers 4h. Please clarify.', preview: 'Hi, line item 3 says "Extended discovery…"', direction: 'inbound', isRead: true, hasAttachment: false, createdAt: '2026-05-20T10:00:00Z' },
      { id: 'e5', subject: 'Re: Invoice INV-2026-038 query', from: 'admin@kangqore.com', to: 'james@meridian.com', body: 'Hi James, we have corrected line item 3 and re-issued the invoice. The revised amount is £22,000. Apologies for the confusion.', preview: 'Hi James, we have corrected line item 3…', direction: 'outbound', isRead: true, hasAttachment: true, createdAt: '2026-05-22T11:00:00Z' },
    ],
  },
]

export const MOCK_PARTNER_EMAILS: EmailConversation[] = [
  {
    id: 'p1',
    user: { id: 'p1', name: 'Ravi Nair', email: 'ravi@freelance.dev', company: 'Independent' },
    unreadCount: 2,
    lastMessage: {
      id: 'pe2', subject: 'May timesheet - please review', from: 'ravi@freelance.dev',
      to: 'admin@kangqore.com', body: 'Following up on my May timesheet — any issues?',
      preview: 'Following up on my May timesheet — any issues?',
      direction: 'inbound', isRead: false, hasAttachment: false, createdAt: '2026-06-02T08:00:00Z',
    },
    emails: [
      { id: 'pe1', subject: 'May timesheet - please review', from: 'ravi@freelance.dev', to: 'admin@kangqore.com', body: 'Hi, please find attached my May timesheet (160h across eQORE and Alpha CRM). Let me know if anything needs clarifying.', preview: 'Hi, please find attached my May timesheet…', direction: 'inbound', isRead: false, hasAttachment: true, createdAt: '2026-06-01T17:00:00Z' },
      { id: 'pe2', subject: 'May timesheet - please review', from: 'ravi@freelance.dev', to: 'admin@kangqore.com', body: 'Following up on my May timesheet — any issues?', preview: 'Following up on my May timesheet — any issues?', direction: 'inbound', isRead: false, hasAttachment: false, createdAt: '2026-06-02T08:00:00Z' },
    ],
  },
  {
    id: 'p2',
    user: { id: 'p2', name: 'Anika Roy', email: 'anika@design.co', company: 'AnikaDesign' },
    unreadCount: 0,
    lastMessage: {
      id: 'pe4', subject: 'Re: GCC availability check', from: 'admin@kangqore.com',
      to: 'anika@design.co', body: 'Great — locking you in from 15 June.',
      preview: 'Great — locking you in from 15 June.',
      direction: 'outbound', isRead: true, hasAttachment: false, createdAt: '2026-05-29T16:00:00Z',
    },
    emails: [
      { id: 'pe3', subject: 'GCC availability check', from: 'anika@design.co', to: 'admin@kangqore.com', body: 'Hi! Just checking whether you need me for the GCC localisation work — I am available from 15 June.', preview: 'Hi! Just checking whether you need me…', direction: 'inbound', isRead: true, hasAttachment: false, createdAt: '2026-05-28T10:00:00Z' },
      { id: 'pe4', subject: 'Re: GCC availability check', from: 'admin@kangqore.com', to: 'anika@design.co', body: 'Great — locking you in from 15 June. Will send the brief next week.', preview: 'Great — locking you in from 15 June.', direction: 'outbound', isRead: true, hasAttachment: false, createdAt: '2026-05-29T16:00:00Z' },
    ],
  },
]

export const MOCK_INVESTOR_EMAILS: EmailConversation[] = [
  {
    id: 'inv1',
    user: { id: 'inv1', name: 'Marcus Webb', email: 'm.webb@nexusvc.co.uk', company: 'Nexus Ventures' },
    unreadCount: 1,
    lastMessage: {
      id: 'ie1', subject: 'Q2 investor update — scheduling', from: 'm.webb@nexusvc.co.uk',
      to: 'admin@kangqore.com', body: 'Hi Mahesh, would the week of 16 June work for a 30-min Q2 update call?',
      preview: 'Would the week of 16 June work for a 30-min Q2 update call?',
      direction: 'inbound', isRead: false, hasAttachment: false, createdAt: '2026-06-01T11:00:00Z',
    },
    emails: [
      { id: 'ie1', subject: 'Q2 investor update — scheduling', from: 'm.webb@nexusvc.co.uk', to: 'admin@kangqore.com', body: 'Hi Mahesh, would the week of 16 June work for a 30-min Q2 update call? Happy to do Thu or Fri afternoon.', preview: 'Would the week of 16 June work for a 30-min Q2 update call?', direction: 'inbound', isRead: false, hasAttachment: false, createdAt: '2026-06-01T11:00:00Z' },
    ],
  },
]

export const MOCK_CAREERS_EMAILS: EmailConversation[] = [
  {
    id: 'js1',
    user: { id: 'js1', name: 'Priya Chatterjee', email: 'priya@email.com', company: undefined },
    unreadCount: 0,
    lastMessage: {
      id: 'ce2', subject: 'Re: Interview confirmation — Senior Engineer', from: 'admin@kangqore.com',
      to: 'priya@email.com', body: 'Hi Priya, confirmed for Tuesday 10 June at 14:00 BST. Zoom link below.',
      preview: 'Confirmed for Tuesday 10 June at 14:00 BST.',
      direction: 'outbound', isRead: true, hasAttachment: false, createdAt: '2026-06-01T13:00:00Z',
    },
    emails: [
      { id: 'ce1', subject: 'Interview confirmation — Senior Engineer', from: 'priya@email.com', to: 'admin@kangqore.com', body: 'Hi, I wanted to confirm my interview for the Senior Engineer role. Could you share the Zoom link?', preview: 'Hi, I wanted to confirm my interview…', direction: 'inbound', isRead: true, hasAttachment: false, createdAt: '2026-06-01T09:00:00Z' },
      { id: 'ce2', subject: 'Re: Interview confirmation — Senior Engineer', from: 'admin@kangqore.com', to: 'priya@email.com', body: 'Hi Priya, confirmed for Tuesday 10 June at 14:00 BST. Zoom link: https://zoom.us/j/123456789. Looking forward to speaking with you!', preview: 'Confirmed for Tuesday 10 June at 14:00 BST.', direction: 'outbound', isRead: true, hasAttachment: false, createdAt: '2026-06-01T13:00:00Z' },
    ],
  },
]

export const MOCK_MESSAGES: InternalConversation[] = [
  {
    user: { id: 'u1', name: 'Ravi Nair', role: 'ADMIN' },
    unreadCount: 1,
    lastMessage: { id: 'im1', content: 'Redis fix deployed. Can you verify the lead score sync?', senderId: 'u1', sender: { id: 'u1', name: 'Ravi Nair', role: 'ADMIN' }, isRead: false, createdAt: '2026-06-02T10:30:00Z' },
  },
  {
    user: { id: 'u2', name: 'Anika Roy', role: 'ADMIN' },
    unreadCount: 0,
    lastMessage: { id: 'im3', content: 'On it! Will share the link when done.', senderId: 'me', sender: { id: 'me', name: 'You', role: 'ADMIN' }, isRead: true, createdAt: '2026-06-01T15:10:00Z' },
  },
]

export const MOCK_MESSAGE_THREAD: Record<string, import('./types').InternalMessage[]> = {
  u1: [
    { id: 'im1', content: 'Redis fix deployed. Can you verify the lead score sync is working correctly on staging?', senderId: 'u1', sender: { id: 'u1', name: 'Ravi Nair', role: 'ADMIN' }, isRead: false, createdAt: '2026-06-02T10:30:00Z' },
  ],
  u2: [
    { id: 'im2', content: 'GlobeMed designs are ready in Figma — can you review before I send them to the client?', senderId: 'u2', sender: { id: 'u2', name: 'Anika Roy', role: 'ADMIN' }, isRead: true, createdAt: '2026-06-01T15:00:00Z' },
    { id: 'im3', content: 'On it! Will share the link when done.', senderId: 'me', sender: { id: 'me', name: 'You', role: 'ADMIN' }, isRead: true, createdAt: '2026-06-01T15:10:00Z' },
  ],
}
