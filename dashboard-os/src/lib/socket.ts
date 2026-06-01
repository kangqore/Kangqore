import { io, Socket } from 'socket.io-client'

const SOCKET_URL = window.location.port === '5174' ? 'http://localhost:5050' : window.location.origin

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    const token = localStorage.getItem('token')
    socket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: false,
    })
  }
  return socket
}

export function connectSocket() {
  const s = getSocket()
  if (!s.connected) {
    const token = localStorage.getItem('token')
    s.auth = { token }
    s.connect()
  }
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
