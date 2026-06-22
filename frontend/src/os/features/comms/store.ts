import { create } from 'zustand'
import {
  MOCK_CLIENT_EMAILS, MOCK_PARTNER_EMAILS,
  MOCK_INVESTOR_EMAILS, MOCK_CAREERS_EMAILS, MOCK_MESSAGES,
} from './data'
import { isDemo } from '@lib/api'
import type { EmailConversation, InternalConversation, TabAudience } from './types'

interface CommsStore {
  emailConversations: Record<TabAudience, EmailConversation[]>
  internalConversations: InternalConversation[]
  hydrateEmails:    (audience: TabAudience, convs: EmailConversation[]) => void
  hydrateInternal:  (convs: InternalConversation[]) => void
  appendEmail:      (audience: TabAudience, convId: string, email: import('./types').EmailLog) => void
}

const demo = isDemo()

export const useCommsStore = create<CommsStore>((set) => ({
  emailConversations: {
    messages:  [],
    clients:   demo ? MOCK_CLIENT_EMAILS   : [],
    partners:  demo ? MOCK_PARTNER_EMAILS  : [],
    investors: demo ? MOCK_INVESTOR_EMAILS : [],
    careers:   demo ? MOCK_CAREERS_EMAILS  : [],
  },
  internalConversations: demo ? MOCK_MESSAGES : [],

  hydrateEmails: (audience, convs) =>
    set(s => ({ emailConversations: { ...s.emailConversations, [audience]: convs } })),

  hydrateInternal: (convs) => set({ internalConversations: convs }),

  appendEmail: (audience, convId, email) =>
    set(s => ({
      emailConversations: {
        ...s.emailConversations,
        [audience]: s.emailConversations[audience].map(c =>
          c.id === convId
            ? { ...c, emails: [...c.emails, email], lastMessage: email }
            : c
        ),
      },
    })),
}))
