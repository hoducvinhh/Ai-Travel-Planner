'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Send,
  Sparkles,
  MapPin,
  BookOpen,
  MessageSquare,
  Loader2,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  PanelLeftClose,
  PanelLeft,
  Clock,
  ArrowUpRight,
  Search,
  Globe,
  ExternalLink,
  Flag,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { Message, SystemStatus, ChatSession } from '@/types';
import { chatApi, getStoredToken } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const GUEST_STORAGE_KEY = 'vietnam_travel_rag_guest_sessions';

const SUGGESTED_PROMPTS = [
  {
    badge: 'Lịch trình',
    prompt: 'Gợi ý lịch trình 3 ngày 2 đêm tại Đà Lạt cho gia đình',
  },
  {
    badge: 'Ẩm thực',
    prompt: 'Top món đặc sản và quán ăn truyền thống không nên bỏ qua ở Hội An',
  },
  {
    badge: 'Chi phí',
    prompt: 'Dự toán chi phí du lịch tự túc Phú Quốc 4 ngày 3 đêm cho 2 người',
  },
  {
    badge: 'Kinh nghiệm',
    prompt: 'Nên đi Sa Pa mùa nào đẹp nhất và kinh nghiệm trekking săn mây an toàn',
  },
];

function CitationPill({ href, children }: { href?: string; children?: React.ReactNode }) {
  const [imgError, setImgError] = useState(false);

  if (!href) return <span>{children}</span>;

  let domain = '';
  try {
    domain = new URL(href).hostname.replace(/^www\./, '');
  } catch {
    domain = '';
  }

  const rawText =
    typeof children === 'string'
      ? children
      : Array.isArray(children)
      ? children.filter((c) => typeof c === 'string').join('')
      : '';

  let label = rawText.trim() || domain || 'Nguồn';
  if (label.startsWith('http://') || label.startsWith('https://')) {
    label = domain || 'Nguồn';
  }

  if (label.includes(':') || label.includes(' - ') || label.includes(' | ')) {
    const parts = label.split(/\s*[-:|–—]\s*/).filter(Boolean);
    if (parts.length > 1) {
      if (domain) {
        const matchingPart = parts.find(
          (p) =>
            p.toLowerCase().includes(domain.toLowerCase()) ||
            domain.toLowerCase().includes(p.toLowerCase()),
        );
        if (matchingPart && matchingPart.length <= 25) {
          label = matchingPart;
        } else {
          label = parts[0];
        }
      } else {
        label = parts[0];
      }
    }
  }

  if (label.length > 22) {
    label = label.slice(0, 20) + '...';
  }

  const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32` : null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={`${rawText || label} (${href})`}
      className="inline-flex items-center gap-1.5 align-middle mx-1 px-2.5 py-0.5 rounded-full bg-[#24272C] hover:bg-[#32363D] text-[#E0E2E7] hover:text-white border border-[#3A3E45] text-xs font-medium transition-all shadow-xs group no-underline cursor-pointer select-none"
    >
      {faviconUrl && !imgError ? (
        <img
          src={faviconUrl}
          alt=""
          referrerPolicy="no-referrer"
          className="w-3.5 h-3.5 rounded-full object-contain shrink-0"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      )}
      <span className="truncate max-w-[130px]">{label}</span>
      <ExternalLink className="w-2.5 h-2.5 text-neutral-400 group-hover:text-white shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}

function normalizeMarkdownContent(text: string): string {
  if (!text) return text;

  const lines = text.split('\n');
  const processedLines = lines.map((line) => {
    if (!line.includes('](')) return line;

    // Tách dòng thành các câu theo dấu kết thúc câu (.!? hoặc đầu dòng gạch đầu dòng)
    const sentences = line.split(/(?<=[.!?])\s+/);
    const cleanedSentences = sentences.map((sentence) => {
      const seen = new Set<string>();
      const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

      return sentence
        .replace(linkRegex, (fullMatch, title, url) => {
          const normUrl = url.toLowerCase().replace(/\/+$/, '');
          // Trong cùng 1 câu/đoạn, nếu cùng 1 link thì chỉ hiện 1 link duy nhất
          if (seen.has(normUrl)) {
            return '';
          }
          seen.add(normUrl);
          return fullMatch;
        })
        .replace(/\s{2,}/g, ' ')
        .trim();
    });

    return cleanedSentences.join(' ');
  });

  return processedLines.join('\n');
}

export default function QuestionAnswerPage() {
  const { user, isAuthenticated } = useAuth();

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [searchSessionQuery, setSearchSessionQuery] = useState('');
  const [pinnedSessionIds, setPinnedSessionIds] = useState<string[]>([]);

  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleInput, setEditTitleInput] = useState('');

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackTargetMessage, setFeedbackTargetMessage] = useState<{
    userQuestion: string;
    botAnswer: string;
  } | null>(null);
  const [feedbackReason, setFeedbackReason] = useState<string>('OUTDATED_PRICE');
  const [feedbackNote, setFeedbackNote] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getGuestSessionIds = (): string[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(GUEST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveGuestSessionId = (id: string) => {
    if (typeof window === 'undefined') return;
    try {
      const current = getGuestSessionIds();
      if (!current.includes(id)) {
        const updated = [id, ...current];
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('Lỗi lưu guest session id:', e);
    }
  };

  const removeGuestSessionId = (id: string) => {
    if (typeof window === 'undefined') return;
    try {
      const current = getGuestSessionIds();
      const updated = current.filter((item) => item !== id);
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Lỗi xóa guest session id:', e);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        const res = await fetch(`${apiUrl}/api/chat/status`);
        if (res.ok) {
          const data = await res.json();
          setSystemStatus(data);
        }
      } catch (err) {
        console.warn('Backend chưa sẵn sàng hoặc đang khởi động:', err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadSessions = async () => {
    setIsLoadingSessions(true);
    try {
      if (isAuthenticated) {
        const data = await chatApi.getSessions();
        setSessions(data || []);
      } else {
        const guestIds = getGuestSessionIds();
        const data = await chatApi.getSessions(guestIds);
        setSessions(data || []);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách sessions:', err);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [isAuthenticated]);

  const loadSessionHistory = async (sessionId: string) => {
    try {
      setIsLoading(true);
      const sessionData = await chatApi.getSessionDetail(sessionId);
      if (sessionData && sessionData.messages) {
        const mappedMessages: Message[] = sessionData.messages.map((m: any) => ({
          id: m.id,
          role: m.role.toLowerCase() as 'user' | 'assistant',
          content: m.content,
          timestamp: new Date(m.createdAt).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          sources: m.metadata?.sources,
          webSources: m.metadata?.webSources,
          disclaimer: m.metadata?.disclaimer,
          mode: m.metadata?.mode,
        }));
        setMessages(mappedMessages);
        setCurrentSessionId(sessionId);
      }
    } catch (err) {
      console.error('Lỗi tải lịch sử hội thoại:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSession = (sessionId: string) => {
    if (sessionId === currentSessionId) return;
    loadSessionHistory(sessionId);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    setInput('');
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
    textareaRef.current?.focus();
  };

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    try {
      if (isAuthenticated) {
        await chatApi.deleteSession(sessionId);
      } else {
        removeGuestSessionId(sessionId);
      }
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (currentSessionId === sessionId) {
        handleNewChat();
      }
    } catch (err) {
      console.error('Lỗi khi xóa session:', err);
    }
  };

  const handleStartEditTitle = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditTitleInput(session.title || '');
  };

  const handleSaveEditTitle = async (sessionId: string) => {
    if (!editTitleInput.trim()) {
      setEditingSessionId(null);
      return;
    }
    try {
      if (isAuthenticated) {
        await chatApi.updateSessionTitle(sessionId, editTitleInput.trim());
      }
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId ? { ...s, title: editTitleInput.trim() } : s
        )
      );
    } catch (err) {
      console.error('Lỗi cập nhật tiêu đề session:', err);
    } finally {
      setEditingSessionId(null);
    }
  };

  const handleOpenFeedback = (botMsg: Message, msgIdx: number) => {
    let userQ = '';
    for (let i = msgIdx - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        userQ = messages[i].content;
        break;
      }
    }
    setFeedbackTargetMessage({
      userQuestion: userQ,
      botAnswer: botMsg.content,
    });
    setFeedbackReason('OUTDATED_PRICE');
    setFeedbackNote('');
    setFeedbackSuccess(false);
    setFeedbackDialogOpen(true);
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackTargetMessage) return;
    try {
      setIsSubmittingFeedback(true);
      await chatApi.submitFeedback({
        sessionId: currentSessionId || undefined,
        userQuestion: feedbackTargetMessage.userQuestion,
        botAnswer: feedbackTargetMessage.botAnswer,
        reason: feedbackReason,
        userNote: feedbackNote,
      });
      setFeedbackSuccess(true);
      setTimeout(() => {
        setFeedbackDialogOpen(false);
        setFeedbackSuccess(false);
      }, 1500);
    } catch (err) {
      console.error('Lỗi gửi feedback:', err);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleSendMessage = async (overrideText?: string) => {
    const query = overrideText || input.trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const botMessageId = (Date.now() + 1).toString();
    const botInitialMessage: Message = {
      id: botMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMessage, botInitialMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const token = getStoredToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: query,
          sessionId: currentSessionId || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event = JSON.parse(line.replace('data: ', '').trim());

              if (event.type === 'session_info') {
                const { sessionId, isNew } = event.data;
                if (isNew) {
                  setCurrentSessionId(sessionId);
                  if (!isAuthenticated) {
                    saveGuestSessionId(sessionId);
                  }
                  loadSessions();
                }
              } else if (event.type === 'routing') {
                const { mode, disclaimer, reason } = event.data;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMessageId
                      ? {
                          ...msg,
                          mode,
                          disclaimer: disclaimer || null,
                          routerReason: reason,
                        }
                      : msg
                  )
                );
              } else if (event.type === 'sources') {
                if (Array.isArray(event.data)) {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === botMessageId
                        ? { ...msg, sources: event.data }
                        : msg
                    )
                  );
                } else if (event.data && typeof event.data === 'object') {
                  const { mode, items, webSources, disclaimer } = event.data;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === botMessageId
                        ? {
                            ...msg,
                            mode: mode || msg.mode,
                            sources: items && items.length > 0 ? items : msg.sources,
                            webSources: webSources && webSources.length > 0 ? webSources : msg.webSources,
                            disclaimer: disclaimer !== undefined ? disclaimer : msg.disclaimer,
                          }
                        : msg
                    )
                  );
                }
              } else if (event.type === 'token') {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMessageId
                      ? { ...msg, content: msg.content + event.data }
                      : msg
                  )
                );
              } else if (event.type === 'content_update') {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMessageId
                      ? { ...msg, content: event.data }
                      : msg
                  )
                );
              } else if (event.type === 'done') {
                setIsLoading(false);
                loadSessions();
              } else if (event.type === 'error') {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMessageId
                      ? {
                          ...msg,
                          content:
                            msg.content +
                            `\n\n*(Thông báo: ${event.data || 'Không thể lấy phản hồi'})*`,
                        }
                      : msg
                  )
                );
              }
            } catch (err) {
              console.error('Lỗi parse SSE:', err, line);
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Lỗi khi gọi API chat:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                content:
                  'Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau.',
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredSessions = sessions.filter((s) => {
    if (!searchSessionQuery.trim()) return true;
    return (s.title || '').toLowerCase().includes(searchSessionQuery.toLowerCase().trim());
  });

  return (
    <div className="flex h-[calc(100vh-65px)] bg-[#F9F9F8] text-[#1A1A1A] font-sans overflow-hidden">
      {/* 1. SIDEBAR: Lịch Sử Cuộc Trò Chuyện */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 md:static flex flex-col bg-white border-r border-[#E5E7EB] transition-all duration-200 ease-in-out shrink-0 ${
          isSidebarOpen
            ? 'w-72 sm:w-80 translate-x-0'
            : '-translate-x-full md:translate-x-0 md:w-0 md:border-r-0 md:overflow-hidden'
        }`}
      >
        <div className="p-3.5 border-b border-[#F0F0EF] flex items-center justify-between gap-2">
          <Button
            onClick={handleNewChat}
            disabled={isLoading}
            variant="default"
            className="flex-1 rounded-xl bg-[#1A1A1A] hover:bg-[#2C2C2C] text-white text-xs sm:text-sm font-medium gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Đoạn chat mới</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Đóng sidebar"
            className="md:hidden h-9 w-9 rounded-lg text-[#6B7280] hover:text-[#1A1A1A]"
          >
            <PanelLeftClose className="w-4 h-4 text-[#6B7280]" />
          </Button>
        </div>

        {/* Tìm kiếm phiên chat nếu có nhiều hơn 5 phiên */}
        {sessions.length > 5 && (
          <div className="p-2 border-b border-[#F0F0EF]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                value={searchSessionQuery}
                onChange={(e) => setSearchSessionQuery(e.target.value)}
                placeholder="Tìm đoạn chat..."
                className="h-8 text-xs pl-8 bg-[#FAFAFA] border-[#E5E7EB] rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Danh Sách Sessions */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-2 py-1.5 text-[11px] font-semibold text-[#6B7280] tracking-wider uppercase flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#6B7280]" />
              Lịch sử trò chuyện
            </span>
            <Badge variant="secondary" className="text-[10px] px-2 py-0.5 rounded-full font-medium border-[#E5E7EB]">
              {sessions.length}
            </Badge>
          </div>

          {isLoadingSessions && sessions.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-[#6B7280] text-xs gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#1A1A1A]" />
              Đang tải lịch sử...
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12 px-4 text-xs text-[#6B7280]">
              <MessageSquare className="w-6 h-6 text-[#9CA3AF] mx-auto mb-2.5 opacity-60" />
              <p className="font-medium text-[#4B5563]">Chưa có đoạn chat nào</p>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">Các phiên hội thoại sẽ hiển thị tại đây</p>
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === currentSessionId;
              const isEditing = session.id === editingSessionId;

              return (
                <div
                  key={session.id}
                  onClick={() => handleSelectSession(session.id)}
                  className={`group relative flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-colors cursor-pointer border ${
                    isActive
                      ? 'bg-[#F5F5F4] text-[#1A1A1A] border-[#E5E7EB] font-medium'
                      : 'text-[#4B5563] hover:bg-[#FAFAF9] hover:text-[#1A1A1A] border-transparent'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 shrink-0 text-[#6B7280]" />

                  {isEditing ? (
                    <div className="flex-1 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <Input
                        value={editTitleInput}
                        onChange={(e) => setEditTitleInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEditTitle(session.id);
                          if (e.key === 'Escape') setEditingSessionId(null);
                        }}
                        autoFocus
                        className="h-6 text-xs px-1.5 py-0 bg-white border-[#1A1A1A]"
                      />
                      <button
                        onClick={() => handleSaveEditTitle(session.id)}
                        className="p-1 hover:text-emerald-700 text-emerald-600"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingSessionId(null)}
                        className="p-1 hover:text-rose-700 text-[#6B7280]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="flex-1 truncate">{session.title || 'Đoạn chat mới'}</span>
                  )}

                  {!isEditing && (
                    <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleStartEditTitle(e, session)}
                        className="p-1 rounded hover:bg-neutral-200 text-[#6B7280] hover:text-[#1A1A1A]"
                        title="Đổi tên"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSession(e, session.id)}
                        className="p-1 rounded hover:bg-rose-100 text-[#6B7280] hover:text-rose-600"
                        title="Xóa"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Sidebar */}
        <div className="p-3 border-t border-[#F0F0EF] text-[11px] text-[#6B7280] flex items-center justify-between bg-[#FAFAF9]">
          <span className="truncate max-w-[170px]">{isAuthenticated ? user?.email : 'Chế độ khách'}</span>
          <Badge variant="outline" className="text-[10px] bg-white border-[#E5E7EB] shrink-0">
            {isAuthenticated ? 'Đã đồng bộ' : 'Lưu cục bộ'}
          </Badge>
        </div>
      </aside>

      {/* 2. MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F9F9F8]">
        {/* Header Chat */}
        <div className="h-14 border-b border-[#E5E7EB] bg-white px-4 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label={isSidebarOpen ? 'Thu gọn thanh bên' : 'Mở thanh bên'}
              className="h-8 w-8 rounded-lg text-[#6B7280] hover:text-[#1A1A1A]"
            >
              <PanelLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-[#1A1A1A]">Cố Vấn Du Lịch AI</h1>
              <span className="text-neutral-300">•</span>
              <span className="text-xs text-muted-foreground hidden sm:inline">Trợ lý du lịch thông minh</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleNewChat}
                className="h-8 px-2.5 rounded-lg text-xs border-[#E5E7EB] text-[#6B7280] hover:text-[#1A1A1A] gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mới</span>
              </Button>
            )}
          </div>
        </div>

        {/* Messages & Empty State Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.length === 0 ? (
            /* EMPTY STATE: TINH GỌN, CHỈ 4 PROMPT GỢI Ý */
            <div className="max-w-2xl mx-auto py-12 sm:py-16 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] text-white flex items-center justify-center mb-5 shadow-sm">
                <Sparkles className="w-6 h-6 text-[#D4F066]" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A] mb-2">
                Bạn muốn khám phá điều gì hôm nay?
              </h2>

              <p className="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto leading-relaxed mb-8">
                Hỏi đáp về lịch trình, ẩm thực, chi phí hoặc kinh nghiệm khám phá mọi miền Việt Nam.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
                {SUGGESTED_PROMPTS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(item.prompt)}
                    className="group p-4 rounded-2xl bg-white hover:bg-[#FAFAF9] border border-[#E5E7EB] hover:border-[#1A1A1A]/30 transition-all flex flex-col justify-between gap-3 shadow-2xs hover:shadow-xs cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="lime" className="text-[10px] font-medium px-2 py-0.5">
                        {item.badge}
                      </Badge>
                      <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-[#1A1A1A] transition-colors" />
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-[#1A1A1A] leading-snug">
                      {item.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* MESSAGES LIST */
            <div className="max-w-3xl mx-auto space-y-6 pb-4">
              {messages.map((msg, idx) => (
                <div
                  key={msg.id || idx}
                  className={`flex gap-3 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center shrink-0 shadow-2xs mt-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4F066]" />
                    </div>
                  )}

                  <div
                    className={`max-w-2xl sm:max-w-3xl rounded-2xl p-4 sm:p-5 shadow-xs ${
                      msg.role === 'user'
                        ? 'bg-[#1A1A1A] text-white rounded-tr-sm'
                        : 'bg-white border border-[#E5E7EB] text-[#1A1A1A] rounded-tl-sm'
                    }`}
                  >
                    {/* Header thông tin nguồn & nút báo cáo sai lệch */}
                    {msg.role === 'assistant' && (
                      <div className="mb-3 flex items-center justify-between gap-2 flex-wrap">
                        {msg.mode === 'live_web' && (
                          <Badge
                            variant="outline"
                            className="text-[11px] font-medium bg-emerald-50 text-emerald-800 border-emerald-200 gap-1.5 py-0.5 px-2.5 rounded-full"
                          >
                            <Globe className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Kiểm chứng trực tuyến</span>
                          </Badge>
                        )}

                        {msg.content && (
                          <button
                            type="button"
                            onClick={() => handleOpenFeedback(msg, idx)}
                            className="inline-flex items-center gap-1.5 text-[11px] text-[#6B7280] hover:text-[#DC2626] transition-colors py-1 px-2 rounded-lg hover:bg-red-50 cursor-pointer ml-auto"
                            title="Báo cáo thông tin chưa chính xác"
                          >
                            <Flag className="w-3 h-3 text-[#6B7280]" />
                            <span>Góp ý</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Nội dung markdown */}
                    <div
                      className={`text-sm leading-relaxed break-words [&>p]:mb-3 [&>p:last-child]:mb-0 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:ml-4 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:ml-4 [&_ol]:space-y-1 ${
                        msg.role === 'user' ? 'text-white' : 'text-[#1A1A1A]'
                      }`}
                    >
                      {msg.content ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            table: ({ children }) => (
                              <div className="overflow-x-auto my-3 rounded-xl border border-[#E5E7EB] bg-white shadow-xs">
                                <table className="w-full text-left text-xs border-collapse">
                                  {children}
                                </table>
                              </div>
                            ),
                            thead: ({ children }) => (
                              <thead className="bg-[#F9F9F8] border-b border-[#E5E7EB] text-[#1A1A1A] font-semibold">
                                {children}
                              </thead>
                            ),
                            th: ({ children }) => (
                              <th className="py-2.5 px-3 font-semibold text-[#1A1A1A] text-xs">
                                {children}
                              </th>
                            ),
                            tbody: ({ children }) => (
                              <tbody className="divide-y divide-[#F0F0EF]">
                                {children}
                              </tbody>
                            ),
                            tr: ({ children }) => (
                              <tr className="hover:bg-[#F9F9F8]/60 transition-colors">
                                {children}
                              </tr>
                            ),
                            td: ({ children }) => (
                              <td className="py-2.5 px-3 text-[#374151] text-xs align-top">
                                {children}
                              </td>
                            ),
                            a: ({ href, children }) => (
                              <CitationPill href={href}>{children}</CitationPill>
                            ),
                          }}
                        >
                          {normalizeMarkdownContent(msg.content)}
                        </ReactMarkdown>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-[#6B7280] italic text-xs">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1A1A1A]" />
                          Đang tìm kiếm tri thức và viết câu trả lời...
                        </span>
                      )}
                    </div>

                    {/* Live Web Grounding Sources (Chỉ hiển thị dự phòng nếu câu trả lời chưa có link bằng chứng chèn trực tiếp) */}
                    {msg.role === 'assistant' &&
                      !/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/.test(msg.content || '') &&
                      msg.webSources &&
                      msg.webSources.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-[#F0F0EF]">
                        <div className="text-xs font-semibold text-[#1A1A1A] mb-2 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Nguồn kiểm chứng trực tuyến</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.webSources.map((webSrc, wIdx) => (
                            <a
                              key={wIdx}
                              href={webSrc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-2.5 rounded-xl bg-[#F9F9F8] hover:bg-emerald-50/40 border border-[#E5E7EB] hover:border-emerald-300 text-xs text-[#1A1A1A] group transition-all"
                            >
                              <div className="flex items-center gap-2 min-w-0 pr-2">
                                <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <div className="min-w-0">
                                  <p className="font-medium truncate group-hover:text-emerald-700">
                                    {webSrc.title || webSrc.domain || 'Trang web tham khảo'}
                                  </p>
                                  {webSrc.domain && (
                                    <p className="text-[10px] text-[#6B7280] truncate">{webSrc.domain}</p>
                                  )}
                                </div>
                              </div>
                              <ExternalLink className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-emerald-600 shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Nguồn tham chiếu CSDL */}
                    {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-[#F0F0EF]">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="sources" className="border-0">
                            <AccordionTrigger className="py-1 text-xs font-medium text-[#1A1A1A] hover:no-underline">
                              <span className="flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-[#6B7280]" />
                                <span>Tài liệu tham chiếu ({msg.sources.length})</span>
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 space-y-2">
                              {msg.sources.map((src, sIdx) => (
                                <Card
                                  key={sIdx}
                                  className="p-3 rounded-xl bg-[#F9F9F8] border-[#E5E7EB] text-xs space-y-1.5 shadow-none"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-semibold text-[#1A1A1A] truncate flex items-center gap-1.5">
                                      <MapPin className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {src.title}
                                    </span>
                                  </div>
                                  <p className="text-[#4B5563] text-xs leading-relaxed bg-white p-2.5 rounded-lg border border-[#E5E7EB] line-clamp-2">
                                    &ldquo;{src.content}&rdquo;
                                  </p>
                                </Card>
                              ))}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {/* Disclaimer */}
                    {msg.role === 'assistant' && msg.disclaimer && (
                      <div className="mt-3.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
                        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{msg.disclaimer}</span>
                      </div>
                    )}

                    <div
                      className={`mt-2 text-[10px] text-right ${
                        msg.role === 'user' ? 'text-white/60' : 'text-[#9CA3AF]'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* 3. INPUT FORM */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-[#E5E7EB] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="max-w-3xl mx-auto relative flex items-end gap-2 p-2 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs focus-within:border-[#1A1A1A] focus-within:ring-2 focus-within:ring-[#1A1A1A]/10 transition-all"
          >
            <Textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Hỏi bất cứ điều gì về du lịch Việt Nam..."
              className="flex-1 bg-transparent px-3 py-2 text-sm text-[#1A1A1A] placeholder-[#9CA3AF] focus-visible:ring-0 focus-visible:ring-offset-0 border-0 shadow-none resize-none max-h-32 min-h-[42px] leading-relaxed"
            />

            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              aria-label="Gửi câu hỏi"
              className="h-9 w-9 rounded-xl bg-[#1A1A1A] hover:bg-[#2C2C2C] disabled:opacity-30 disabled:cursor-not-allowed text-white shadow-2xs transition-colors shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </Button>
          </form>

          <p className="text-[11px] text-[#9CA3AF] text-center mt-2">
            Nhấn <kbd className="px-1.5 py-0.5 rounded bg-[#F5F5F4] border border-[#E5E7EB] text-[#6B7280] text-[10px]">Enter</kbd> để gửi • <kbd className="px-1.5 py-0.5 rounded bg-[#F5F5F4] border border-[#E5E7EB] text-[#6B7280] text-[10px]">Shift + Enter</kbd> xuống dòng
          </p>
        </div>
      </div>

      {/* 4. MODAL: BÁO CÁO SAI LỆCH THÔNG TIN */}
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent className="max-w-md bg-white border-[#E5E7EB] p-5 rounded-2xl shadow-xl">
          <DialogHeader className="space-y-1.5">
            <DialogTitle className="text-sm sm:text-base font-bold text-[#1A1A1A] flex items-center gap-2">
              <Flag className="w-4 h-4 text-[#DC2626]" />
              Góp Ý Thông Tin Du Lịch
            </DialogTitle>
            <DialogDescription className="text-xs text-[#6B7280]">
              Đóng góp của bạn giúp hệ thống cập nhật thông tin du lịch chính xác hơn.
            </DialogDescription>
          </DialogHeader>

          {feedbackSuccess ? (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 animate-in zoom-in-50" />
              <p className="text-sm font-semibold text-[#1A1A1A]">Đã gửi góp ý thành công!</p>
              <p className="text-xs text-[#6B7280]">Cảm ơn bạn đã phản hồi cho hệ thống.</p>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              {feedbackTargetMessage && (
                <div className="p-3 rounded-xl bg-[#F9F9F8] border border-[#E5E7EB] text-xs space-y-1">
                  <p className="text-[#6B7280] font-medium text-[11px]">Câu hỏi:</p>
                  <p className="text-[#1A1A1A] font-semibold truncate">&ldquo;{feedbackTargetMessage.userQuestion}&rdquo;</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1A1A1A]">Lý do báo cáo:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'OUTDATED_PRICE', label: 'Giá vé đã đổi' },
                    { id: 'CLOSED', label: 'Tạm ngưng / Đóng' },
                    { id: 'INCORRECT_INFO', label: 'Thông tin chưa đúng' },
                    { id: 'OTHER', label: 'Lý do khác' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setFeedbackReason(r.id)}
                      className={`p-2 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer ${
                        feedbackReason === r.id
                          ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                          : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F9F9F8]'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1A1A1A]">
                  Ghi chú chi tiết:
                </label>
                <Textarea
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  placeholder="Ví dụ: Giá vé hiện nay đã thay đổi thành..."
                  className="text-xs min-h-[80px] rounded-xl border-[#E5E7EB] focus:ring-1 focus:ring-[#1A1A1A]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFeedbackDialogOpen(false)}
                  disabled={isSubmittingFeedback}
                  className="rounded-xl text-xs border-[#E5E7EB] cursor-pointer"
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmitFeedback}
                  disabled={isSubmittingFeedback}
                  className="rounded-xl bg-[#1A1A1A] text-white text-xs hover:bg-[#2C2C2C] gap-1.5 cursor-pointer"
                >
                  {isSubmittingFeedback ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <span>Gửi góp ý</span>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
