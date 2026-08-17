import { Component, type ReactNode } from 'react'
import { RelayLayout } from '../components/RelayLayout'

class RelayBoundary extends Component<{ children: ReactNode }, { crashed: boolean }> {
  state = { crashed: false }
  static getDerivedStateFromError() { return { crashed: true } }
  render() {
    if (this.state.crashed) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#0d1117] text-white/50 gap-3">
          <span className="text-2xl">💬</span>
          <p className="text-sm">RELAY couldn't load.</p>
          <button
            onClick={() => this.setState({ crashed: false })}
            className="text-xs px-3 py-1.5 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function RelayPage() {
  return (
    <RelayBoundary>
      <RelayLayout />
    </RelayBoundary>
  )
}
