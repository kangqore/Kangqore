import { io, Socket } from 'socket.io-client'

const DEV_PORTS = ['5173', '5174', '5175', '5176']
const SOCKET_URL = DEV_PORTS.includes(window.location.port) ? 'http://localhost:5050' : window.location.origin

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
