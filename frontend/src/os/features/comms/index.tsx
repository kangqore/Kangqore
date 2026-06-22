import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { MessageSquare, Users, Handshake, TrendingUp, GraduationCap } from 'lucide-react'
import { cn } from '@design-system/cn'
import { useCommsStore } from './store'
import { EmailInbox }      from './pages/EmailInbox'
import { InternalMessages } from './pages/InternalMessages'
import type { TabConfig } from './types'
import { AnimatePresence, motion } from 'framer-motion'

const EMAIL_TABS: TabConfig[] = [
  {
    audience: 'clients',
    path:     'clients',
    label:    'Clients',
    listApi:  '/admin/client-emails',
    threadApi:'/admin/client-emails',
    replyApi: '/admin/client-emails/reply',
    idField:  'clientId',
  },
  {
    audience: 'partners',
    path:     'partners',
    label:    'Partners',
    listApi:  '/admin/partner-emails',
    threadApi:'/admin/partner-emails',
    replyApi: '/admin/partner-emails/reply',
    idField:  'partnerId',
  },
  {
    audience: 'investors',
    path:     'investors',
    label:    'Investors',
    listApi:  '/admin/investor-emails',
    threadApi:'/admin/investor-emails',
    replyApi: '/admin/investor-emails/reply',
    idField:  'investorId',
  },
  {
    audience: 'careers',
    path:     'careers',
    label:    'Careers',
    listApi:  '/admin/job-seeker-emails',
    threadApi:'/admin/job-seeker-emails',
    replyApi: '/admin/job-seeker-emails/reply',
    idField:  'jobSeekerId',
  },
]

const NAV_TABS = [
  { path: '',          label: 'Messages',  icon: MessageSquare,  },
  { path: 'clients',   label: 'Clients',   icon: Users,          },
  { path: 'partners',  label: 'Partners',  icon: Handshake,      },
  { path: 'investors', label: 'Investors', icon: TrendingUp,     },
  { path: 'careers',   label: 'Careers',   icon: GraduationCap,  },
]

function UnreadBadge({ count }: { count: number }) {
  if (count === 0) return null

  return (
    <span className="ml-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
      {count > 9 ? '9+' : count}
    </span>
  )
}

export function CommsModule() {
  const { pathname } = useLocation()
  const { emailConversations, internalConversations } = useCommsStore()

  const unreadByAudience = {
    messages:  internalConversations.reduce((s, c) => s + c.unreadCount, 0),
    clients:   emailConversations.clients.reduce((s, c)   => s + c.unreadCount, 0),
    partners:  emailConversations.partners.reduce((s, c)  => s + c.unreadCount, 0),
    investors: emailConversations.investors.reduce((s, c) => s + c.unreadCount, 0),
    careers:   emailConversations.careers.reduce((s, c)   => s + c.unreadCount, 0),
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-white/10 border-t-white/20 mb-6 -mt-2 overflow-x-auto">
        {NAV_TABS.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path === '' ? '/kangqore-view/admin/comms' : `/kangqore-view/admin/comms/${tab.path}`}
            end={tab.path === ''}
            className={({ isActive }) => cn(
              'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all whitespace-nowrap flex-shrink-0',
              isActive
                ? 'border-os-blue text-os-blue'
                : 'border-transparent text-slate-500 hover:text-slate-200 hover:border-white/10 border-t-white/20'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            <UnreadBadge count={unreadByAudience[tab.path === '' ? 'messages' : tab.path as keyof typeof unreadByAudience] ?? 0} />
          </NavLink>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={pathname} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.15,ease:'easeOut'}}>

        <Routes>
          <Route index element={<InternalMessages />} />
          {EMAIL_TABS.map(tab => (
            <Route
              key={tab.path}
              path={tab.path}
              element={<EmailInbox tab={tab} />}
            />
          ))}
          <Route path="*" element={<Navigate to="/kangqore-view/admin/comms" replace />} />
        </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
