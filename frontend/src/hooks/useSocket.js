/**
 * useSocket Hook
 * React hook for socket.io real-time features
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { initSocket, disconnectSocket, getSocket, isSocketConnected } from '../lib/socket';
import { useAuth } from '../context/AuthContext';

/**
 * Hook for managing socket connection and events
 * @returns {Object} Socket utilities and state
 */
export function useSocket() {
  const { user, token } = useAuth();
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const listenersRef = useRef({});

  // Initialize socket when user is authenticated
  useEffect(() => {
    if (user && token) {
      const socket = initSocket(token);

      socket.on('connect', () => {
        setConnected(true);
      });

      socket.on('disconnect', () => {
        setConnected(false);
      });

      // Listen for new notifications
      socket.on('notification:new', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        
        // Trigger any registered callbacks
        if (listenersRef.current.onNotification) {
          listenersRef.current.onNotification(notification);
        }
      });

      // Listen for new messages
      socket.on('message:new', (message) => {
        setMessages((prev) => [...prev, message]);
        
        // Trigger any registered callbacks
        if (listenersRef.current.onMessage) {
          listenersRef.current.onMessage(message);
        }
      });

      // Listen for typing indicators
      socket.on('typing:indicator', ({ userId, isTyping }) => {
        setTypingUsers((prev) => ({
          ...prev,
          [userId]: isTyping,
        }));
      });

      return () => {
        disconnectSocket();
        setConnected(false);
      };
    }
  }, [user, token]);

  // Register notification callback
  const onNotification = useCallback((callback) => {
    listenersRef.current.onNotification = callback;
    return () => {
      listenersRef.current.onNotification = null;
    };
  }, []);

  // Register message callback
  const onMessage = useCallback((callback) => {
    listenersRef.current.onMessage = callback;
    return () => {
      listenersRef.current.onMessage = null;
    };
  }, []);

  // Emit typing start
  const startTyping = useCallback((receiverId) => {
    const socket = getSocket();
    if (socket?.connected) {
      socket.emit('typing:start', { receiverId });
    }
  }, []);

  // Emit typing stop
  const stopTyping = useCallback((receiverId) => {
    const socket = getSocket();
    if (socket?.connected) {
      socket.emit('typing:stop', { receiverId });
    }
  }, []);

  // Mark messages as read
  const markMessagesRead = useCallback((messageIds) => {
    const socket = getSocket();
    if (socket?.connected) {
      socket.emit('message:read', { messageIds });
    }
  }, []);

  // Clear stored notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Clear stored messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    connected,
    isConnected: isSocketConnected,
    notifications,
    messages,
    typingUsers,
    onNotification,
    onMessage,
    startTyping,
    stopTyping,
    markMessagesRead,
    clearNotifications,
    clearMessages,
  };
}

export default useSocket;
