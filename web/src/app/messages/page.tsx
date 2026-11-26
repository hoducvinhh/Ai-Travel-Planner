'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { api } from '@/lib/api';
import { formatStyleLabel, splitStylesAndCompanion } from '@/lib/labels';
import { ConversationItem, DirectMessageItem, ChatUser } from '@/types';
import {
  MessageCircle,
  Send,
  Search,
  ArrowLeft,
  Loader2,
  Sparkles,
  ShieldCheck,
  Check,
  CheckCheck,
  Clock,
  Compass,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

function MessagesContent() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { socket, joinConversation, leaveConversation, sendMessage, sendTyping, markConversationRead } =
    useSocket();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activePartner, setActivePartner] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<DirectMessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Fetch list of user conversations
  const fetchConversations = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await api.get<ConversationItem[]>('/messages/conversations');
      setConversations(data || []);
      return data;
    } catch (err) {
      console.error('Failed to load conversations:', err);
      return [];
    } finally {
      setIsLoadingConversations(false);
    }
  }, [isAuthenticated]);

  // Load active conversation messages
  const loadConversation = useCallback(
    async (convId: string, partner?: ChatUser) => {
      if (activeConversationId) {
        leaveConversation(activeConversationId);
      }
      setActiveConversationId(convId);
      if (partner) {
        setActivePartner(partner);
      }
      joinConversation(convId);
      markConversationRead(convId);

      setIsLoadingMessages(true);
      try {
        const data = await api.get<{
          conversationId: string;
          partner: ChatUser;
          messages: DirectMessageItem[];
        }>(`/messages/conversations/${convId}/messages`);

        setMessages(data.messages || []);
        if (data.partner) {
          setActivePartner(data.partner);
        }

        // Cập nhật lại unread count trên danh sách hội thoại
        setConversations((prev) =>
          prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c)),
        );

        setTimeout(() => scrollToBottom('auto'), 50);
      } catch (err) {
        console.error('Failed to load messages:', err);
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [activeConversationId, joinConversation, leaveConversation, markConversationRead],
  );

  // Handle URL search params on mount
  useEffect(() => {
    if (!isAuthenticated) return;

    const initialConvId = searchParams.get('conversationId');
    const targetUserId = searchParams.get('targetUserId');
    const seedMessage = searchParams.get('seedMessage');

    if (seedMessage) {
      setInputText(seedMessage);
    }

    const init = async () => {
      const convs = await fetchConversations();

      if (initialConvId) {
        const found = convs?.find((c) => c.id === initialConvId);
        loadConversation(initialConvId, found?.partner);
      } else if (targetUserId) {
        try {
          const newConv = await api.post<{
            id: string;
            partner: ChatUser;
          }>('/messages/conversations', { targetUserId });

          if (newConv?.id) {
            await fetchConversations();
            loadConversation(newConv.id, newConv.partner);
          }
        } catch (err) {
          console.error('Failed to start conversation with target user:', err);
        }
      }
    };

    init();
  }, [isAuthenticated, searchParams, fetchConversations, loadConversation]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: DirectMessageItem) => {
      if (msg.conversationId === activeConversationId) {
        setMessages((prev) => {
          // Tránh trùng lặp nếu tin nhắn thật đã có trong danh sách
          if (prev.some((m) => m.id === msg.id)) return prev;

          // Nếu là tin nhắn do chính user gửi, thay thế optimistic tempMessage tương ứng
          if (msg.senderId === user?.id) {
            const tempIdx = prev.findIndex(
              (m) => m.id.startsWith('temp-') && m.content === msg.content,
            );
            if (tempIdx !== -1) {
              const updated = [...prev];
              updated[tempIdx] = msg;
              return updated;
            }

            // Fallback: nếu có temp message nào đang chờ, thay thế tin cũ nhất
            const anyTempIdx = prev.findIndex((m) => m.id.startsWith('temp-'));
            if (anyTempIdx !== -1) {
              const updated = [...prev];
              updated[anyTempIdx] = msg;
              return updated;
            }
          }

          return [...prev, msg];
        });
        scrollToBottom();
        markConversationRead(msg.conversationId);
      }

      // Cập nhật danh sách hội thoại
      setConversations((prev) => {
        const index = prev.findIndex((c) => c.id === msg.conversationId);
        if (index === -1) {
          fetchConversations();
          return prev;
        }

        const updated = [...prev];
        const conv = { ...updated[index] };
        conv.lastMessage = msg;
        conv.lastMessageAt = msg.createdAt;
        if (msg.conversationId !== activeConversationId && msg.senderId !== user?.id) {
          conv.unreadCount = (conv.unreadCount || 0) + 1;
        }

        // Đưa cuộc hội thoại có tin nhắn mới lên đầu danh sách
        updated.splice(index, 1);
        return [conv, ...updated];
      });
    };

    const handleTypingEvent = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId === activePartner?.id) {
        setPartnerTyping(data.isTyping);
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('typing', handleTypingEvent);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('typing', handleTypingEvent);
    };
  }, [socket, activeConversationId, activePartner?.id, markConversationRead, user?.id, fetchConversations]);

  // Handle typing debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);

    if (activeConversationId) {
      sendTyping(activeConversationId, true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(activeConversationId, false);
      }, 1500);
    }
  };

  // Send message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || !activeConversationId || !user) return;

    // Emit qua WebSocket
    sendMessage(activeConversationId, trimmed);
    setInputText('');
    sendTyping(activeConversationId, false);

    // Optimistic message append
    const tempMessage: DirectMessageItem = {
      id: `temp-${Date.now()}`,
      conversationId: activeConversationId,
      senderId: user.id,
      content: trimmed,
      isRead: false,
      createdAt: new Date().toISOString(),
      sender: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };

    setMessages((prev) => [...prev, tempMessage]);
    setTimeout(() => scrollToBottom(), 50);
  };

  const filteredConversations = conversations.filter((c) => {
    const name = c.partner?.name || c.partner?.email || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (isAuthLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 bg-[#F8FAFC]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0D9488]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center bg-white border-[#E2E8F0] rounded-2xl shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#F0FDFA] border border-[#99F6E4] flex items-center justify-center mx-auto mb-4 text-[#0D9488]">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#0F172A] mb-2">Đăng nhập để xem tin nhắn</h2>
          <p className="text-xs text-[#64748B] mb-6">
            Bạn cần đăng nhập tài khoản để trao đổi trực tiếp với bạn đồng hành và các thành viên cộng đồng.
          </p>
          <Button onClick={() => router.push('/login')} className="w-full text-xs font-semibold">
            Đăng nhập ngay
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#F8FAFC] text-[#0F172A] py-4 sm:py-6 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[calc(100vh-104px)] min-h-[520px] max-h-[820px]">
          {/* CỘT TRÁI: DANH SÁCH CUỘC HỘI THOẠI (4 cols) */}
          <div
            className={`md:col-span-4 border-r border-[#E2E8F0] flex flex-col bg-white min-h-0 ${
              activeConversationId ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Header Cột Trái */}
            <div className="p-4 border-b border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0D9488] text-white flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <h1 className="text-sm font-bold text-[#0F172A]">Hộp thư trực tiếp</h1>
                </div>
              </div>

              {/* Ô tìm kiếm đối thoại */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <Input
                  type="text"
                  placeholder="Tìm theo tên bạn bè..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs bg-[#F8FAFC] border-[#E2E8F0] rounded-xl focus:border-[#0D9488]"
                />
              </div>
            </div>

            {/* Danh sách các cuộc trò chuyện */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#F1F5F9]">
              {isLoadingConversations ? (
                <div className="py-12 text-center text-xs text-[#64748B]">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#0D9488]" />
                  Đang tải danh sách hội thoại...
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="py-16 text-center px-4">
                  <MessageCircle className="w-8 h-8 mx-auto text-[#CBD5E1] mb-2" />
                  <p className="text-xs font-semibold text-[#0F172A]">Chưa có cuộc trò chuyện nào</p>
                  <p className="text-[11px] text-[#64748B] mt-1">
                    Hãy bấm &quot;Nhắn tin tham gia&quot; từ bài viết cộng đồng để bắt đầu!
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isActive = conv.id === activeConversationId;
                  const partner = conv.partner;
                  const displayName = partner?.name || partner?.email?.split('@')[0] || 'Người dùng';
                  const initial = displayName.charAt(0).toUpperCase();

                  return (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => loadConversation(conv.id, partner)}
                      className={`w-full p-3.5 flex items-start gap-3 text-left transition rounded-xl cursor-pointer ${
                        isActive
                          ? 'bg-[#F0FDFA] text-[#0F172A] font-medium border border-[#99F6E4]'
                          : 'hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <Avatar className="w-10 h-10 rounded-xl border border-[#E2E8F0]">
                          <AvatarFallback className="font-bold text-xs bg-[#F0FDFA] text-[#0F766E]">
                            {initial}
                          </AvatarFallback>
                        </Avatar>
                        {conv.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full text-[9px] font-bold bg-[#FF6B6B] text-white border border-white">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="text-xs font-bold truncate text-[#0F172A]">{displayName}</h4>
                          <span className="text-[10px] whitespace-nowrap text-[#64748B]">
                            {conv.lastMessageAt
                              ? new Date(conv.lastMessageAt).toLocaleDateString('vi-VN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : ''}
                          </span>
                        </div>

                        <p
                          className={`text-[11px] truncate ${
                            conv.unreadCount > 0
                              ? 'font-bold text-[#0F172A]'
                              : 'text-[#64748B]'
                          }`}
                        >
                          {conv.lastMessage ? conv.lastMessage.content : 'Bắt đầu cuộc trò chuyện...'}
                        </p>

                        {partner?.preferredStyles && partner.preferredStyles.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {splitStylesAndCompanion(partner.preferredStyles).styles.slice(0, 2).map((s) => (
                              <Badge
                                key={s}
                                variant="outline"
                                className="text-[9px] px-1.5 py-0 h-3.5 border-[#E2E8F0] text-[#64748B]"
                              >
                                {formatStyleLabel(s)}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* CỘT PHẢI: KHUNG TRÒ CHUYỆN (8 cols) */}
          <div
            className={`md:col-span-8 flex flex-col bg-[#F8FAFC] ${
              !activeConversationId ? 'hidden md:flex' : 'flex'
            }`}
          >
            {activeConversationId && activePartner ? (
              <>
                {/* Header Khung Chat */}
                <div className="p-3.5 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setActiveConversationId(null)}
                      aria-label="Quay lại danh sách hội thoại"
                      className="md:hidden h-8 w-8 text-[#64748B]"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>

                    <Avatar className="w-9 h-9 rounded-xl border border-[#E2E8F0]">
                      <AvatarFallback className="font-bold text-xs bg-[#F0FDFA] text-[#0F766E]">
                        {(activePartner.name || activePartner.email || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-[#0F172A]">
                          {activePartner.name || activePartner.email.split('@')[0]}
                        </h3>
                        <span className="flex items-center gap-1 text-[10px] text-[#10B981] font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                          Trực tuyến
                        </span>
                      </div>
                      <p className="text-[10px] text-[#64748B]">{activePartner.email}</p>
                    </div>
                  </div>

                  {activePartner.preferredStyles && activePartner.preferredStyles.length > 0 && (
                    <div className="hidden sm:flex items-center gap-1">
                      {splitStylesAndCompanion(activePartner.preferredStyles).styles.slice(0, 3).map((st) => (
                        <Badge key={st} variant="teal" className="text-[9px] px-2 py-0.5">
                          {formatStyleLabel(st)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Vùng Tin Nhắn */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
                  {isLoadingMessages ? (
                    <div className="py-20 text-center text-xs text-[#64748B]">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0D9488]" />
                      Đang tải tin nhắn...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="py-20 text-center px-4 max-w-sm mx-auto">
                      <div className="w-10 h-10 rounded-2xl bg-[#F0FDFA] border border-[#99F6E4] flex items-center justify-center mx-auto mb-3 text-[#0D9488]">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-bold text-[#0F172A]">Bắt đầu cuộc trò chuyện</h4>
                      <p className="text-[11px] text-[#64748B] mt-1">
                        Hãy gửi lời chào đầu tiên để làm quen hoặc bàn về chuyến đi đồng hành!
                      </p>
                    </div>
                  ) : (
                    messages.map((m, idx) => {
                      const isMe = m.senderId === user?.id;
                      return (
                        <div
                          key={m.id || idx}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed break-words ${
                              isMe
                                ? 'bg-[#0D9488] text-white rounded-br-xs'
                                : 'bg-white border border-[#E2E8F0] text-[#0F172A] rounded-bl-xs'
                            }`}
                          >
                            <p className="whitespace-pre-line">{m.content}</p>
                          </div>

                          <div className="flex items-center gap-1 mt-1 px-1">
                            <span className="text-[9px] text-[#94A3B8]">
                              {new Date(m.createdAt).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {isMe && (
                              <span>
                                {m.isRead ? (
                                  <CheckCheck className="w-3 h-3 text-[#0D9488]" />
                                ) : (
                                  <Check className="w-3 h-3 text-[#94A3B8]" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Typing Indicator */}
                  {partnerTyping && (
                    <div className="flex items-center gap-2 text-xs text-[#64748B] bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-full w-fit animate-in fade-in">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-[#0D9488] rounded-full animate-pulse [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-[#0D9488] rounded-full animate-pulse [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-[#0D9488] rounded-full animate-pulse" />
                      </div>
                      <span className="text-[10px]">Đang soạn tin nhắn...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Thanh Nhập Tin Nhắn */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 border-t border-[#E2E8F0] bg-white flex items-center gap-2"
                >
                  <Input
                    type="text"
                    placeholder="Nhập tin nhắn... (Enter để gửi)"
                    value={inputText}
                    onChange={handleInputChange}
                    className="flex-1 h-9 text-xs bg-[#F8FAFC] border-[#E2E8F0] rounded-xl focus:border-[#0D9488]"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!inputText.trim()}
                    className="h-9 px-3.5 rounded-xl text-xs gap-1.5 bg-[#0D9488] hover:bg-[#0F766E] text-white"
                  >
                    <span>Gửi</span>
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </form>
              </>
            ) : (
              /* Trạng thái chưa chọn cuộc hội thoại nào */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#F0FDFA] border border-[#99F6E4] flex items-center justify-center mb-4 text-[#0D9488]">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-[#0F172A] mb-1">
                  Chọn một cuộc trò chuyện
                </h3>
                <p className="text-xs text-[#64748B] max-w-sm">
                  Kết nối với bạn bè du lịch, hẹn giờ gặp mặt hoặc hỏi kinh nghiệm lịch trình qua kênh chat bảo mật tức thì.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center py-24 bg-[#F8FAFC]">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D9488]" />
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
