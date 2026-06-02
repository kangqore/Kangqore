import { create } from 'zustand'
import {
  MOCK_CLIENT_EMAILS, MOCK_PARTNER_EMAILS,
  MOCK_INVESTOR_EMAILS, MOCK_CAREERS_EMAILS, MOCK_MESSAGES,
} from './data'
import type { EmailConversation, InternalConversation, TabAudience } from './types'

interface CommsStore {
  emailConversations: Record<TabAudience, EmailConversation[]>
  internalConversations: InternalConversation[]
  hydrateEmails:    (audience: TabAudience, convs: EmailConversation[]) => void
  hydrateInternal:  (convs: InternalConversation[]) => void
  appendEmail:      (audience: TabAudience, convId: string, email: import('./types').EmailLog) => void
}

export const useCommsStore = create<CommsStore>((set) => ({
  emailConversations: {
    messages:  [],
    clients:   MOCK_CLIENT_EMAILS,
    partners:  MOCK_PARTNER_EMAILS,
    investors: MOCK_INVESTOR_EMAILS,
    careers:   MOCK_CAREERS_EMAILS,
  },
  internalConversations: MOCK_MESSAGES,

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
