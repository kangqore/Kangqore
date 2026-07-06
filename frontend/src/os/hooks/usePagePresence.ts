import { useEffect, useState } from 'react'
import { getSocket } from '@lib/socket'

export interface PageViewer {
  userId: string
  userName: string
}

export function usePagePresence(pageKey: string): { viewers: PageViewer[] } {
  const [viewers, setViewers] = useState<PageViewer[]>([])

  useEffect(() => {
    if (!pageKey) return
    const socket = getSocket()

    socket.emit('page:enter', { pageKey })

    const onJoined = (data: { userId: string; userName: string; pageKey: string }) => {
      if (data.pageKey !== pageKey) return
      setViewers(prev => {
        if (prev.some(v => v.userId === data.userId)) return prev
        return [...prev, { userId: data.userId, userName: data.userName }]
      })
    }

    const onLeft = (data: { userId: string; pageKey: string }) => {
      if (data.pageKey !== pageKey) return
      setViewers(prev => prev.filter(v => v.userId !== data.userId))
    }

    socket.on('page:viewer:joined', onJoined)
    socket.on('page:viewer:left', onLeft)

    return () => {
      socket.emit('page:leave', { pageKey })
      socket.off('page:viewer:joined', onJoined)
      socket.off('page:viewer:left', onLeft)
      setViewers([])
    }
  }, [pageKey])

  return { viewers }
}
