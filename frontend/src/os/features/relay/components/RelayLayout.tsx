import { Component, type ReactNode, useState } from 'react'
import { useChatSocket } from '../hooks/useChatSocket'
import { useChannels } from '../hooks/useChannels'
import { useRelayStore } from '../store'
import { ChannelSidebar } from './ChannelSidebar'
import { MessagePane } from './MessagePane'
import { SystemFeedPanel } from './SystemFeedPanel'
import { Activity } from 'lucide-react'
import type { Channel } from '../types'

class PaneBoundary extends Component<{ children: ReactNode; channelId: string }, { crashed: boolean }> {
  state = { crashed: false }
  static getDerivedStateFromError() { return { crashed: true } }
  render() {
    if (this.state.crashed) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-[var(--os-surface-0)] text-[var(--os-text-2)] gap-2">
          <p className="text-sm font-semibold">Couldn't load this channel.</p>
          <button
            onClick={() => this.setState({ crashed: false })}
            className="text-xs font-bold px-4 py-2 rounded-xl bg-[var(--os-card)] border border-[var(--os-border)] hover:bg-slate-50 transition-colors shadow-sm"
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export function RelayLayout() {
  useChatSocket()
  useChannels()

  const [activeChannel, setActiveChannel] = useState<Channel | null>(null)
  const [showFeed, setShowFeed] = useState(false)

  const handleSelect = (ch: Channel) => {
    setActiveChannel(ch)
    useRelayStore.getState().setActiveChannel(ch.id)
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-[var(--os-card)]" style={{ borderRadius: 'var(--os-radius-xl)', boxShadow: '0 32px 64px rgba(0,0,0,0.04)' }}>
      {/* KIMMP feed toggle bar */}
      <div className="flex items-center justify-end px-4 py-1.5 border-b border-[var(--os-border)] bg-[var(--os-card)]">
        <button
          type="button"
          onClick={() => setShowFeed(v => !v)}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border transition-colors ${
            showFeed
              ? 'bg-violet-500/10 border-violet-500/30 text-violet-400'
              : 'border-[var(--os-border)] text-[var(--os-text-3)] hover:text-[var(--os-text-1)]'
          }`}
        >
          <Activity className="w-3 h-3" />
          KIMMP Feed
        </button>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <ChannelSidebar
          activeChannelId={activeChannel?.id ?? null}
          onSelect={handleSelect}
        />

        {activeChannel ? (
          <PaneBoundary key={activeChannel.id} channelId={activeChannel.id}>
            <MessagePane channel={activeChannel} />
          </PaneBoundary>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8 bg-[var(--os-card)]">
            <div className="w-16 h-16 flex items-center justify-center text-3xl mb-4 bg-slate-50 border border-[var(--os-border)] shadow-sm" style={{ borderRadius: 'var(--os-radius-xl)' }}>💬</div>
            <p className="text-[15px] font-bold text-[var(--os-text-1)] mb-1">Select a channel to start messaging</p>
            <p className="text-[12px] font-medium text-[var(--os-text-2)]">Choose from the sidebar on the left</p>
          </div>
        )}

        {showFeed && <SystemFeedPanel onClose={() => setShowFeed(false)} />}
      </div>
    </div>
  )
}
