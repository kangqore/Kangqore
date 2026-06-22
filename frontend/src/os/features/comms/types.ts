export interface ContactInfo {
  id:       string
  name:     string
  email?:   string
  company?: string
  role?:    string
}

export interface EmailAttachment {
  name: string
  url:  string
  size: number
}

export interface EmailLog {
  id:            string
  subject:       string
  from:          string
  to:            string
  body:          string
  preview:       string
  direction:     'inbound' | 'outbound'
  isRead:        boolean
  hasAttachment: boolean
  attachments?:  EmailAttachment[] | null
  threadId?:     string
  replyToId?:    string
  createdAt:     string
}

export interface EmailConversation {
  id:           string        // contact id
  user:         ContactInfo
  emails:       EmailLog[]
  lastMessage:  EmailLog
  unreadCount:  number
}

export interface InternalMessage {
  id:         string
  content:    string
  senderId:   string
  receiverId?: string
  sender:     ContactInfo
  receiver?:  ContactInfo
  isRead:     boolean
  createdAt:  string
}

export interface InternalConversation {
  user:        ContactInfo
  lastMessage: InternalMessage
  unreadCount: number
}

export type TabAudience = 'messages' | 'clients' | 'partners' | 'investors' | 'careers'

export interface TabConfig {
  audience:    TabAudience
  path:        string
  label:       string
  listApi:     string
  threadApi:   string
  replyApi:    string
  idField:     string
}
