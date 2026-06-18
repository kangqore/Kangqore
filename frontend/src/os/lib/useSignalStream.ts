import { useEffect, useState } from 'react'
import { connectSocket, getSocket } from './socket'

export interface LiveSignal {
  id: string
  sourceModule: string
  signalType: string
  signalCategory: string
  signalValue: string
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'
  confidence: number
  createdAt: string
}

export function useSignalStream() {
  const [recentSignals, setRecentSignals] = useState<LiveSignal[]>([])
  const [lastSignal,    setLastSignal]    = useState<LiveSignal | null>(null)
  const [criticalAlert, setCriticalAlert] = useState<LiveSignal | null>(null)
  const [connected,     setConnected]     = useState(false)

  useEffect(() => {
    try { connectSocket() } catch {}
    const socket = getSocket()

    const onConnect    = () => setConnected(true)
    const onDisconnect = () => setConnected(false)

    const onSignal = (s: LiveSignal) => {
      setLastSignal(s)
      setRecentSignals(prev => [s, ...prev].slice(0, 10))
    }

    const onCritical = (s: LiveSignal) => {
      setCriticalAlert(s)
      setTimeout(() => setCriticalAlert(null), 8000)
    }

    socket.on('connect',          onConnect)
    socket.on('disconnect',       onDisconnect)
    socket.on('kimmp:signal',     onSignal)
    socket.on('kimmp:critical',   onCritical)

    return () => {
      socket.off('connect',        onConnect)
      socket.off('disconnect',     onDisconnect)
      socket.off('kimmp:signal',   onSignal)
      socket.off('kimmp:critical', onCritical)
    }
  }, [])

  return { lastSignal, criticalAlert, recentSignals, connected }
}
