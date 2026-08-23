import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(err: unknown): State {
    const message = err instanceof Error ? err.message : 'Something went wrong'
    return { hasError: true, message }
  }

  // Without this the boundary was silent: it printed the message on screen and
  // logged nothing, so a crash could be seen but never located. This wraps
  // every route in App.jsx, so "Cannot read properties of undefined" appeared
  // on the page with no stack and no component name anywhere in the console.
  //
  // `componentStack` is the part that matters — it names the component that
  // threw, which the message alone never does.
  componentDidCatch(err: unknown, info: ErrorInfo) {
    /* eslint-disable no-console */
    console.error('[ErrorBoundary] caught:', err)
    console.error('[ErrorBoundary] component stack:', info?.componentStack)
    /* eslint-enable no-console */
  }

  reset = () => this.setState({ hasError: false, message: '' })

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-sm font-semibold text-white mb-1">Something went wrong</p>
          <p className="text-xs text-slate-500 mb-4 max-w-xs">{this.state.message}</p>
          <button
            onClick={this.reset}
            className="flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
