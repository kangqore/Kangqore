/**
 * Socket.io Client Configuration
 * Provides singleton socket instance for real-time communication
 */

import { io } from 'socket.io-client';

// Get backend URL from environment or default
const SOCKET_URL = process.env.REACT_APP_BACKEND_URL || '';

let socket = null;

/**
 * Initialize socket connection with authentication
 * @param {string} token - JWT access token
 * @returns {Socket} Socket.io client instance
 */
export function initSocket(token) {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  // Connection events
  socket.on('connect', () => {
    console.log('🔌 Socket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('🔌 Socket connection error:', error.message);
  });

  socket.on('connected', (data) => {
    console.log('🔌 Server confirmed connection:', data);
  });

  return socket;
}

/**
 * Get current socket instance
 * @returns {Socket|null}
 */
export function getSocket() {
  return socket;
}

/**
 * Disconnect socket
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('🔌 Socket manually disconnected');
  }
}

/**
 * Check if socket is connected
 * @returns {boolean}
 */
export function isSocketConnected() {
  return socket?.connected ?? false;
}

export default socket;
