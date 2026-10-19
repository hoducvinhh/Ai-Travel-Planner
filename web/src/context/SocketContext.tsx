'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { API_BASE_URL, api } from '@/lib/api';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (conversationId: string, content: string) => void;
  sendTyping: (conversationId: string, isTyping: boolean) => void;
  markConversationRead: (conversationId: string) => void;
  refreshUnreadCount: () => Promise<void>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  const refreshUnreadCount = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get<{ unreadCount: number }>('/messages/unread-count');
      if (res && typeof res.unreadCount === 'number') {
        setUnreadCount(res.unreadCount);
      }
    } catch {
      // Ignored if unauthenticated
    }
  }, [token]);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      setUnreadCount(0);
      return;
    }

    // Khởi tạo kết nối Socket.io
    const socketInstance = io(API_BASE_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setIsConnected(true);
      refreshUnreadCount();
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    // Lắng nghe cập nhật unread count thời gian thực từ Gateway
    socketInstance.on(
      'unread_notification',
      (data: { unreadCount: number; conversationId?: string; fromUserId?: string }) => {
        if (typeof data.unreadCount === 'number') {
          setUnreadCount(data.unreadCount);
        }
      },
    );

    refreshUnreadCount();

    return () => {
      socketInstance.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
    };
  }, [token, isAuthenticated, refreshUnreadCount]);

  const joinConversation = useCallback((conversationId: string) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('join_conversation', { conversationId });
    }
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('leave_conversation', { conversationId });
    }
  }, []);

  const sendMessage = useCallback((conversationId: string, content: string) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('send_message', { conversationId, content });
    }
  }, []);

  const sendTyping = useCallback((conversationId: string, isTyping: boolean) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('typing', { conversationId, isTyping });
    }
  }, []);

  const markConversationRead = useCallback(
    (conversationId: string) => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('mark_read', { conversationId });
      }
      // Optimistic update
      refreshUnreadCount();
    },
    [refreshUnreadCount],
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        unreadCount,
        setUnreadCount,
        joinConversation,
        leaveConversation,
        sendMessage,
        sendTyping,
        markConversationRead,
        refreshUnreadCount,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
