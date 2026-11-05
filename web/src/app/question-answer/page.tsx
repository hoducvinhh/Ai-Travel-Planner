'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Send,
  Sparkles,
  Compass,
  MapPin,
  BookOpen,
  RotateCcw,
  Database,
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
  HelpCircle,
  ChevronRight,
  Grid,
  ListFilter,
  ArrowUpRight,
  Search,
  HardDrive,
  Route,
  Receipt,
  Hotel,
  Lightbulb,
  Utensils,
  Landmark,
  Mountain,
  Waves,
  LucideIcon,
  Ticket,
  Globe,
  ExternalLink,
  Flag,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { SourceCitation, WebSourceCitation, Message, SystemStatus, ChatSession } from '@/types';
import { chatApi, getStoredToken } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { RAG_TOPICS, RagTopic } from '@/lib/ragTopics';

const GUEST_STORAGE_KEY = 'vietnam_travel_rag_guest_sessions';

// Bảng ánh xạ icon chuẩn Lucide cho 10 chủ đề RAG (Monochrome, Outline line icons, không sử dụng emoji)
const TOPIC_ICONS: Record<string, LucideIcon> = {
  routes: Route,
  costs: Receipt,
  styles: Compass,
  stays: Hotel,
  tips: Lightbulb,
  food: Utensils,
  heritage: Landmark,
  nature: Mountain,
  islands: Waves,
  provinces: MapPin,
};

function getTopicIcon(id: string): LucideIcon {
  return TOPIC_ICONS[id] || Compass;
}

export default function QuestionAnswerPage() {
  const { user, isAuthenticated } = useAuth();

  // Trạng thái phiên chat
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Trạng thái chỉnh sửa tiêu đề session
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleInput, setEditTitleInput] = useState('');

  // Trạng thái hội thoại hiện tại
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  // Trạng thái Chủ đề RAG (Topic Explorer)
  const [selectedTopicId, setSelectedTopicId] = useState<string>('routes');
  const [topicViewMode, setTopicViewMode] = useState<'tabs' | 'grid'>('tabs');
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [activeQuickTopic, setActiveQuickTopic] = useState<string | null>(null);
  const [searchTopicQuery, setSearchTopicQuery] = useState('');

  // Trạng thái modal báo cáo thông tin sai / lỗi thời
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

  // Helper lấy guest IDs từ localStorage
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

  // Cuộn tự động khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Kiểm tra trạng thái hệ thống backend
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

  // Tải danh sách các phiên trò chuyện
  const loadSessions = useCallback(async () => {
    setIsLoadingSessions(true);
    try {
      let guestIds: string[] | undefined;
      if (!isAuthenticated) {
        guestIds = getGuestSessionIds();
        if (guestIds.length === 0) {
          setSessions([]);
          setIsLoadingSessions(false);
          return;
        }
      }
      const data = await chatApi.getSessions(guestIds);
      setSessions(data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách phiên trò chuyện:', err);
    } finally {
      setIsLoadingSessions(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Chuyển sang một phiên trò chuyện cũ
  const handleSelectSession = async (sessionId: string) => {
    if (sessionId === currentSessionId || isLoading) return;

    setCurrentSessionId(sessionId);
    setIsLoading(true);
    try {
      const detail = await chatApi.getSessionDetail(sessionId);
      const formattedMessages: Message[] = (detail.messages || []).map((m: any) => {
        let mode: 'internal' | 'live_web' = 'internal';
        let sources: SourceCitation[] = [];
        let webSources: WebSourceCitation[] = [];
        let disclaimer: string | null = null;

        if (m.sources) {
          if (Array.isArray(m.sources)) {
            sources = m.sources;
          } else if (typeof m.sources === 'object') {
            mode = m.sources.mode || (m.sources.webSources?.length > 0 ? 'live_web' : 'internal');
            sources = m.sources.items || [];
            webSources = m.sources.webSources || [];
            disclaimer = m.sources.disclaimer || null;
          }
        }

        return {
          id: m.id,
          role: m.role,
          content: m.content,
          mode,
          sources: sources.length > 0 ? sources : undefined,
          webSources: webSources.length > 0 ? webSources : undefined,
          disclaimer,
          timestamp: new Date(m.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
      });
      setMessages(formattedMessages);
    } catch (err) {
      console.error('Lỗi khi tải chi tiết cuộc trò chuyện:', err);
      alert('Không thể tải chi tiết cuộc trò chuyện này.');
    } finally {
      setIsLoading(false);
    }
  };

  // Tạo cuộc trò chuyện mới
  const handleNewChat = () => {
    if (isLoading) return;
    setCurrentSessionId(null);
    setMessages([]);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Xóa một phiên trò chuyện
  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (!window.confirm('Bạn có chắc chắn muốn xóa cuộc trò chuyện này không?')) return;

    try {
      await chatApi.deleteSession(sessionId);
      removeGuestSessionId(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));

      if (currentSessionId === sessionId) {
        handleNewChat();
      }
    } catch (err) {
      console.error('Lỗi khi xóa phiên trò chuyện:', err);
      alert('Không thể xóa cuộc trò chuyện này.');
    }
  };

  // Bắt đầu sửa tiêu đề phiên
  const handleStartRename = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditTitleInput(session.title);
  };

  // Lưu tiêu đề phiên sau khi sửa
  const handleSaveRename = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    const newTitle = editTitleInput.trim();
    if (!newTitle) return;

    try {
      await chatApi.updateSessionTitle(sessionId, newTitle);
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, title: newTitle } : s))
      );
      setEditingSessionId(null);
    } catch (err) {
      console.error('Lỗi khi cập nhật tiêu đề:', err);
      alert('Không thể đổi tên cuộc trò chuyện.');
    }
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(null);
  };

  // Gửi tin nhắn qua SSE
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const botMessageId = `bot_${Date.now()}`;
    const initialBotMessage: Message = {
      id: botMessageId,
      role: 'assistant',
      content: '',
      mode: 'internal',
      sources: [],
      webSources: [],
      disclaimer: null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage, initialBotMessage]);
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
                  'Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại dịch vụ backend hoặc thử lại sau.',
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

  // Xử lý mở modal báo cáo phản hồi
  const handleOpenFeedback = (assistantMsg: Message, index: number) => {
    let userQuestion = '';
    for (let i = index - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        userQuestion = messages[i].content;
        break;
      }
    }
    setFeedbackTargetMessage({
      userQuestion: userQuestion || 'Câu hỏi du lịch',
      botAnswer: assistantMsg.content,
    });
    setFeedbackReason('OUTDATED_PRICE');
    setFeedbackNote('');
    setFeedbackSuccess(false);
    setFeedbackDialogOpen(true);
  };

  // Xử lý gửi báo cáo phản hồi tới backend
  const handleSubmitFeedback = async () => {
    if (!feedbackTargetMessage) return;
    setIsSubmittingFeedback(true);
    try {
      await chatApi.submitFeedback({
        sessionId: currentSessionId || undefined,
        userQuestion: feedbackTargetMessage.userQuestion,
        botAnswer: feedbackTargetMessage.botAnswer,
        reason: feedbackReason,
        userNote: feedbackNote.trim() || undefined,
      });
      setFeedbackSuccess(true);
      setTimeout(() => {
        setFeedbackDialogOpen(false);
        setFeedbackSuccess(false);
      }, 1500);
    } catch (err) {
      console.error('Lỗi khi gửi báo cáo phản hồi:', err);
      alert('Không thể gửi báo cáo vào lúc này. Vui lòng thử lại sau.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const currentSession = sessions.find((s) => s.id === currentSessionId);

  // Lọc chủ đề trong modal
  const filteredTopics = RAG_TOPICS.filter((topic) => {
    const q = searchTopicQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      topic.name.toLowerCase().includes(q) ||
      topic.description.toLowerCase().includes(q) ||
      topic.sampleQuestions.some((item) => item.question.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex h-[calc(100vh-65px)] bg-[#F9F9F8] text-[#1A1A1A] font-sans overflow-hidden">
      {/* ========================================================= */}
      {/* 1. SIDEBAR: Lịch Sử Cuộc Trò Chuyện                      */}
      {/* ========================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 md:static flex flex-col bg-white border-r border-[#E5E7EB] transition-all duration-200 ease-in-out shrink-0 ${
          isSidebarOpen
            ? 'w-72 sm:w-80 translate-x-0'
            : '-translate-x-full md:translate-x-0 md:w-0 md:border-r-0 md:overflow-hidden'
        }`}
      >
        {/* Nút Tạo Cuộc Trò Chuyện Mới */}
        <div className="p-3.5 border-b border-[#F0F0EF] flex items-center justify-between gap-2">
          <Button
            onClick={handleNewChat}
            disabled={isLoading}
            variant="default"
            className="flex-1 rounded-xl bg-[#1A1A1A] hover:bg-[#2C2C2C] text-white text-xs sm:text-sm font-medium gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Cuộc trò chuyện mới</span>
          </Button>

          {/* Nút đóng trên mobile */}
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

        {/* Danh Sách Sessions */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-2 py-1.5 text-[11px] font-semibold text-[#6B7280] tracking-wider uppercase flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#6B7280]" />
              Lịch sử gần đây
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
              <MessageSquare className="w-6 h-6 text-[#9CA3AF] mx-auto mb-2.5" />
              <p className="font-medium text-[#4B5563]">Chưa có cuộc trò chuyện nào</p>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">Các phiên hội thoại sẽ được lưu tại đây</p>
            </div>
          ) : (
            sessions.map((session) => {
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
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <MessageSquare
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-[#1A1A1A]' : 'text-[#6B7280] group-hover:text-[#1A1A1A]'
                      }`}
                    />

                    {isEditing ? (
                      <div
                        className="flex-1 flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Input
                          type="text"
                          value={editTitleInput}
                          onChange={(e) => setEditTitleInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveRename(e as any, session.id);
                            if (e.key === 'Escape') handleCancelRename(e as any);
                          }}
                          autoFocus
                          className="h-7 text-xs bg-white text-[#1A1A1A] border-[#1A1A1A] rounded-md px-2 focus-visible:ring-0"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleSaveRename(e, session.id)}
                          className="h-6 w-6 p-1 text-[#1A1A1A]"
                          title="Lưu"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCancelRename}
                          className="h-6 w-6 p-1 text-[#6B7280] hover:text-[#1A1A1A]"
                          title="Hủy"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <span className="truncate text-left flex-1">
                        {session.title || 'Cuộc trò chuyện mới'}
                      </span>
                    )}
                  </div>

                  {/* Nút Sửa / Xóa */}
                  {!isEditing && (
                    <div
                      className={`items-center gap-0.5 shrink-0 ${
                        isActive ? 'flex' : 'hidden group-hover:flex'
                      }`}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleStartRename(e, session)}
                        title="Đổi tên"
                        className="h-6 w-6 p-1 text-[#6B7280] hover:text-[#1A1A1A]"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleDeleteSession(e, session.id)}
                        title="Xóa"
                        className="h-6 w-6 p-1 text-[#6B7280] hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer của Sidebar: User / Device Info */}
        <div className="p-3 border-t border-[#F0F0EF] bg-white text-[11px] text-[#6B7280] flex items-center justify-between">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 truncate">
              <div className="w-6 h-6 rounded-full bg-[#F5F5F4] border border-[#E5E7EB] flex items-center justify-center text-[#1A1A1A] font-semibold text-[10px]">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="truncate font-medium text-[#1A1A1A]">
                {user?.name || user?.email}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[#6B7280]">
              <HardDrive className="w-3.5 h-3.5 text-[#6B7280]" />
              <span>Lưu trên trình duyệt</span>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => loadSessions()}
            title="Làm mới danh sách"
            className="h-7 w-7 text-[#6B7280] hover:text-[#1A1A1A]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </aside>

      {/* Backdrop trên màn hình mobile khi mở sidebar */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* ========================================================= */}
      {/* 2. MAIN CHAT AREA                                         */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F9F9F8] relative overflow-hidden">
        {/* Top Header Bar */}
        <div className="bg-white/90 backdrop-blur-md border-b border-[#E5E7EB] px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title={isSidebarOpen ? 'Thu gọn thanh bên' : 'Mở lịch sử chat'}
              className="h-8 w-8 rounded-xl border-[#E5E7EB] text-[#6B7280] hover:text-[#1A1A1A]"
            >
              <PanelLeft className="w-4 h-4" />
            </Button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-semibold text-[#1A1A1A] truncate max-w-xs sm:max-w-md">
                  {currentSession ? currentSession.title : 'Cố Vấn Du Lịch Việt Nam AI'}
                </h1>
                <Badge variant="lime" className="text-[10px] font-semibold">
                  RAG BGE-M3
                </Badge>
              </div>
              <p className="text-[11px] text-[#6B7280] hidden sm:block mt-0.5">
                Cơ sở tri thức 63 tỉnh thành & cẩm nang du lịch Việt Nam
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Nút mở Modal 10 Chủ đề */}
            <Button
              variant="outline"
              onClick={() => setIsTopicModalOpen(true)}
              className="h-8 px-3 rounded-full text-xs font-medium gap-1.5 border-[#E5E7EB] text-[#1A1A1A] hover:bg-[#F5F5F4]"
              title="Khám phá tất cả các chủ đề trong kho RAG"
            >
              <Compass className="w-3.5 h-3.5 text-[#6B7280]" />
              <span className="hidden sm:inline">10 Chủ đề RAG</span>
              <span className="sm:hidden">Chủ đề</span>
            </Button>

            {/* Trạng thái pgvector */}
            <Badge variant="secondary" className="gap-2 px-2.5 py-1 rounded-full text-[11px] border-[#E5E7EB] bg-white font-normal">
              <Database className="w-3.5 h-3.5 text-[#6B7280]" />
              {systemStatus?.database?.connected ? (
                <span className="flex items-center gap-1.5 font-medium text-[#1A1A1A]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#65A30D]"></span>
                  <span>{systemStatus.database.totalChunks.toLocaleString()} chunks</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[#6B7280]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5E7EB] animate-pulse"></span>
                  <span>Đang kết nối</span>
                </span>
              )}
            </Badge>

            {messages.length > 0 && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleNewChat}
                title="Tạo phiên mới"
                className="h-8 w-8 rounded-lg border-[#E5E7EB] text-[#6B7280] hover:text-[#1A1A1A]"
              >
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Khung Nội Dung Chat & Welcome State */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.length === 0 ? (
            /* ========================================================= */
            /* WELCOME EMPTY STATE: BỘ KHÁM PHÁ 10 CHỦ ĐỀ RAG            */
            /* ========================================================= */
            <div className="max-w-4xl mx-auto py-6 sm:py-10 flex flex-col items-center">
              {/* Header Chào Mừng */}
              <div className="text-center mb-8 max-w-2xl">
                <Badge variant="lime" className="gap-1.5 px-3 py-1 text-xs font-medium mb-3.5 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#1A1A1A]" />
                  <span>Kho tri thức RAG • 10.856 Chunks • 63 Tỉnh thành</span>
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1A1A1A] mb-2.5">
                  Bạn muốn khám phá du lịch Việt Nam thế nào?
                </h2>
                <p className="text-[#6B7280] text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
                  Chọn một trong 10 chủ đề bên dưới để xem gợi ý câu hỏi thực tế hoặc tự do đặt câu hỏi bất kỳ cho cố vấn AI.
                </p>

                {/* Segmented Pill Control với shadcn Tabs */}
                <div className="mt-5">
                  <Tabs value={topicViewMode} onValueChange={(val) => setTopicViewMode(val as any)}>
                    <TabsList className="rounded-full bg-[#F0F0EF] border border-[#E5E7EB] p-1">
                      <TabsTrigger
                        value="tabs"
                        className="rounded-full px-3.5 py-1.5 text-xs font-medium data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white shadow-xs transition-all"
                      >
                        <ListFilter className="w-3.5 h-3.5 mr-1.5" />
                        <span>Chi tiết theo chủ đề</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="grid"
                        className="rounded-full px-3.5 py-1.5 text-xs font-medium data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white shadow-xs transition-all"
                      >
                        <Grid className="w-3.5 h-3.5 mr-1.5" />
                        <span>Lưới 10 chủ đề</span>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              {topicViewMode === 'tabs' ? (
                /* CHẾ ĐỘ 1: TABS CHỦ ĐỀ + DANH SÁCH CÂU HỎI MẪU */
                <div className="w-full space-y-4">
                  {/* Thanh Cuộn Ngang 10 Chủ Đề (Horizontal Pills với Button + Lucide Icons) */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {RAG_TOPICS.map((topic) => {
                      const isSelected = topic.id === selectedTopicId;
                      const Icon = getTopicIcon(topic.id);
                      return (
                        <Button
                          key={topic.id}
                          variant={isSelected ? 'default' : 'outline'}
                          onClick={() => setSelectedTopicId(topic.id)}
                          className={`h-9 px-3.5 rounded-xl text-xs font-medium gap-2 shrink-0 ${
                            isSelected
                              ? 'bg-[#1A1A1A] text-white hover:bg-[#2C2C2C]'
                              : 'bg-white hover:bg-[#F5F5F4] text-[#1A1A1A] border-[#E5E7EB]'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#6B7280]'}`} />
                          <span>{topic.shortName}</span>
                          {topic.badge && (
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold ${
                                isSelected
                                  ? 'bg-white/20 text-white'
                                  : 'bg-[#F4FCE3] text-[#365314] border border-[#D9F99D]'
                              }`}
                            >
                              {topic.badge}
                            </span>
                          )}
                        </Button>
                      );
                    })}
                  </div>

                  {/* Chi Tiết Chủ Đề & Các Câu Hỏi Gợi Ý sử dụng shadcn Card */}
                  {(() => {
                    const currentTopic =
                      RAG_TOPICS.find((t) => t.id === selectedTopicId) || RAG_TOPICS[0];
                    const TopicIcon = getTopicIcon(currentTopic.id);
                    return (
                      <Card className="p-5 sm:p-6 rounded-2xl bg-white border-[#E5E7EB] shadow-xs space-y-5 animate-in fade-in duration-200">
                        {/* Header của Topic */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0F0EF]">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#F5F5F4] border border-[#E5E7EB] flex items-center justify-center text-[#1A1A1A] shrink-0">
                              <TopicIcon className="w-4 h-4 text-[#1A1A1A]" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm sm:text-base font-semibold text-[#1A1A1A]">
                                  {currentTopic.name}
                                </h3>
                                {currentTopic.badge && (
                                  <Badge variant="lime" className="text-[10px] font-medium">
                                    {currentTopic.badge}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-[#6B7280] mt-0.5">
                                {currentTopic.description}
                              </p>
                            </div>
                          </div>
                          <div className="shrink-0">
                            <Badge variant="secondary" className="border-[#E5E7EB] text-xs font-medium text-[#6B7280]">
                              {currentTopic.chunkCountEstimate}
                            </Badge>
                          </div>
                        </div>

                        {/* Danh Sách Câu Hỏi Gợi Ý Tiêu Biểu */}
                        <div>
                          <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5 text-[#6B7280]" />
                            <span>Bấm vào câu hỏi để hỏi AI ngay:</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {currentTopic.sampleQuestions.map((qItem, idx) => (
                              <Card
                                key={idx}
                                onClick={() => handleSendMessage(qItem.question)}
                                className="group p-3.5 rounded-xl bg-white hover:bg-[#FAFAF9] border-[#E5E7EB] hover:border-[#1A1A1A]/30 transition-all text-left flex items-start justify-between gap-3 shadow-2xs hover:shadow-xs cursor-pointer"
                              >
                                <div className="space-y-1.5 flex-1">
                                  {qItem.badge && (
                                    <Badge variant="lime" className="text-[10px] font-medium px-1.5 py-0.2">
                                      {qItem.badge}
                                    </Badge>
                                  )}
                                  <p className="text-xs text-[#1A1A1A] font-medium leading-relaxed group-hover:text-black">
                                    {qItem.question}
                                  </p>
                                </div>
                                <div className="p-1.5 rounded-lg bg-[#F5F5F4] group-hover:bg-[#1A1A1A] text-[#6B7280] group-hover:text-white transition-all shrink-0 mt-0.5">
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </Card>
                    );
                  })()}
                </div>
              ) : (
                /* CHẾ ĐỘ 2: LƯỚI CARD TẤT CẢ 10 CHỦ ĐỀ VỚI SHADCN CARD */
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {RAG_TOPICS.map((topic) => {
                    const CardIcon = getTopicIcon(topic.id);
                    return (
                      <Card
                        key={topic.id}
                        onClick={() => {
                          setSelectedTopicId(topic.id);
                          setTopicViewMode('tabs');
                        }}
                        className="group cursor-pointer p-4 sm:p-5 rounded-2xl bg-white hover:bg-[#FAFAF9] border-[#E5E7EB] hover:border-[#1A1A1A]/30 transition-all flex flex-col justify-between gap-3.5 shadow-2xs hover:shadow-xs"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#F5F5F4] border border-[#E5E7EB] flex items-center justify-center text-[#1A1A1A]">
                              <CardIcon className="w-4 h-4 text-[#1A1A1A]" />
                            </div>
                            {topic.badge && (
                              <Badge variant="lime" className="text-[10px] font-medium">
                                {topic.badge}
                              </Badge>
                            )}
                          </div>
                          <h4 className="text-sm font-semibold text-[#1A1A1A] line-clamp-1">
                            {topic.name}
                          </h4>
                          <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
                            {topic.description}
                          </p>
                        </div>

                        <div className="pt-2.5 border-t border-[#F0F0EF] flex items-center justify-between text-xs text-[#6B7280]">
                          <span className="font-medium text-[#6B7280]">
                            {topic.chunkCountEstimate}
                          </span>
                          <span className="flex items-center gap-1 group-hover:text-[#1A1A1A] font-medium transition-colors">
                            Xem câu hỏi <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-[#6B7280] group-hover:text-[#1A1A1A]" />
                          </span>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* ========================================================= */
            /* DANH SÁCH TIN NHẮN TRÒ CHUYỆN                            */
            /* ========================================================= */
            <div className="max-w-4xl mx-auto space-y-6 pb-4">
              {messages.map((msg, idx) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {/* Avatar trợ lý */}
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center shrink-0 shadow-2xs mt-1">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-2xl sm:max-w-3xl rounded-2xl p-4 sm:p-5 shadow-xs ${
                      msg.role === 'user'
                        ? 'bg-[#1A1A1A] text-white rounded-tr-sm'
                        : 'bg-white border border-[#E5E7EB] text-[#1A1A1A] rounded-tl-sm'
                    }`}
                  >
                    {/* Header thông tin nguồn phân luồng & Nút báo cáo sai lệch */}
                    {msg.role === 'assistant' && (
                      <div className="mb-3 flex items-center justify-between gap-2 flex-wrap">
                        {msg.mode === 'live_web' ? (
                          <Badge
                            variant="outline"
                            className="text-[11px] font-medium bg-emerald-50 text-emerald-800 border-emerald-200 gap-1.5 py-0.5 px-2.5 rounded-full"
                          >
                            <Globe className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Nguồn Kiểm Chứng Trực Tuyến Thời Gian Thực</span>
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-[11px] font-medium bg-[#F4F4F3] text-[#4B5563] border-[#E5E7EB] gap-1.5 py-0.5 px-2.5 rounded-full"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-[#6B7280]" />
                            <span>Nguồn Tri Thức Du Lịch Bản Địa</span>
                          </Badge>
                        )}

                        {/* Nút 🚩 Báo cáo sai lệch */}
                        {msg.content && (
                          <button
                            type="button"
                            onClick={() => handleOpenFeedback(msg, idx)}
                            className="inline-flex items-center gap-1.5 text-[11px] text-[#6B7280] hover:text-[#DC2626] transition-colors py-1 px-2 rounded-lg hover:bg-red-50 cursor-pointer"
                            title="Báo cáo thông tin chưa chính xác / lỗi thời"
                          >
                            <Flag className="w-3 h-3 text-[#6B7280]" />
                            <span>Báo cáo sai lệch</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Message Content */}
                    <div
                      className={`text-sm leading-relaxed break-words [&>p]:mb-3 [&>p:last-child]:mb-0 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:ml-4 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:ml-4 [&_ol]:space-y-1 ${
                        msg.role === 'user' ? 'text-white' : 'text-[#1A1A1A]'
                      }`}
                    >
                      {msg.content ? (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-[#6B7280] italic text-xs">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1A1A1A]" />
                          Đang tìm kiếm tri thức và viết câu trả lời...
                        </span>
                      )}
                    </div>

                    {/* Live Web Grounding Sources */}
                    {msg.role === 'assistant' && msg.webSources && msg.webSources.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-[#F0F0EF]">
                        <div className="text-xs font-semibold text-[#1A1A1A] mb-2 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Nguồn kiểm chứng trực tuyến ({msg.webSources.length} liên kết đối chứng)</span>
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
                                    {webSrc.title || webSrc.domain || 'Trang web xác thực'}
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

                    {/* Sources Accordion sử dụng shadcn Accordion */}
                    {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-[#F0F0EF]">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="sources" className="border-0">
                            <AccordionTrigger className="py-1 text-xs font-medium text-[#1A1A1A] hover:no-underline">
                              <span className="flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-[#6B7280]" />
                                <span>Nguồn tham chiếu CSDL ({msg.sources.length} tài liệu)</span>
                                {msg.sources[0]?.similarity && (
                                  <span className="text-[11px] text-[#6B7280] font-normal">
                                    • Độ khớp: {(Number(msg.sources[0].similarity) * 100).toFixed(1)}%
                                  </span>
                                )}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 space-y-2.5">
                              {msg.sources.map((src, sIdx) => {
                                const matchPct = (Number(src.similarity) * 100).toFixed(1);
                                const isQa = src.chunk_type === 'qa';

                                return (
                                  <Card
                                    key={sIdx}
                                    className="p-3.5 rounded-xl bg-[#F9F9F8] border-[#E5E7EB] text-xs space-y-2 shadow-none"
                                  >
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="font-semibold text-[#1A1A1A] truncate flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-[#6B7280] shrink-0" />
                                        {src.title}
                                      </span>
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <Badge variant="outline" className="text-[10px] font-medium bg-white border-[#E5E7EB] text-[#4B5563]">
                                          {isQa ? 'Hỏi - Đáp gốc' : 'Ngữ cảnh bài viết'}
                                        </Badge>
                                        <Badge variant="lime" className="text-[10px] font-semibold">
                                          {matchPct}% match
                                        </Badge>
                                      </div>
                                    </div>
                                    <p className="text-[#4B5563] text-xs leading-relaxed bg-white p-2.5 rounded-lg border border-[#E5E7EB] line-clamp-3">
                                      "{src.content}"
                                    </p>
                                  </Card>
                                );
                              })}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}

                    {/* Disclaimer cảnh báo thời điểm */}
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

        {/* ========================================================= */}
        {/* 3. INPUT FORM & DẢI CHỦ ĐỀ GỢI Ý NHANH                    */}
        {/* ========================================================= */}
        <div className="p-3.5 sm:p-5 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] shrink-0 space-y-3">
          {/* Popover Câu Hỏi Nhanh (Khi bấm vào 1 chip) */}
          {activeQuickTopic && (() => {
            const topic = RAG_TOPICS.find((t) => t.id === activeQuickTopic);
            if (!topic) return null;
            const FlyoutIcon = getTopicIcon(topic.id);
            return (
              <Card className="max-w-4xl mx-auto p-4 rounded-2xl bg-white border-[#E5E7EB] shadow-md space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#F0F0EF]">
                  <div className="flex items-center gap-2">
                    <FlyoutIcon className="w-4 h-4 text-[#1A1A1A]" />
                    <span className="text-xs font-semibold text-[#1A1A1A]">{topic.name}</span>
                    <Badge variant="lime" className="text-[10px] font-medium">
                      Gợi ý câu hỏi
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setActiveQuickTopic(null)}
                    aria-label="Đóng gợi ý"
                    className="h-7 w-7 rounded-lg text-[#6B7280] hover:text-[#1A1A1A]"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {topic.sampleQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveQuickTopic(null);
                        handleSendMessage(q.question);
                      }}
                      className="group p-2.5 rounded-xl bg-[#F9F9F8] hover:bg-[#F5F5F4] border border-[#E5E7EB] text-left transition flex items-center justify-between gap-2"
                    >
                      <span className="text-xs text-[#1A1A1A] group-hover:text-black line-clamp-2">
                        {q.question}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#1A1A1A] shrink-0" />
                    </button>
                  ))}
                </div>
              </Card>
            );
          })()}

          {/* Dải Chip Gợi Ý Chủ Đề Nhanh */}
          <div className="max-w-4xl mx-auto flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-[#6B7280] shrink-0 pr-1">
              <Compass className="w-3.5 h-3.5 text-[#6B7280] shrink-0" />
              <span>Chủ đề:</span>
            </div>

            {RAG_TOPICS.map((topic) => {
              const isActive = activeQuickTopic === topic.id;
              const ChipIcon = getTopicIcon(topic.id);
              return (
                <Button
                  key={topic.id}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setActiveQuickTopic(isActive ? null : topic.id);
                  }}
                  className={`h-7 px-3 rounded-full text-xs gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-white hover:bg-[#F5F5F4] text-[#1A1A1A] border-[#E5E7EB]'
                  }`}
                >
                  <ChipIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-[#6B7280]'}`} />
                  <span>{topic.shortName}</span>
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTopicModalOpen(true)}
              className="h-7 px-3 rounded-full bg-[#F4FCE3] hover:bg-[#EAF7B8] text-[#365314] border-[#D9F99D] text-xs font-semibold shrink-0 gap-1"
            >
              <span>Xem tất cả (10)</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#365314]" />
            </Button>
          </div>

          {/* Form Nhập Câu Hỏi với shadcn Textarea & Button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="max-w-4xl mx-auto relative flex items-end gap-2 p-2 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs focus-within:border-[#1A1A1A] focus-within:ring-2 focus-within:ring-[#1A1A1A]/10 transition-all"
          >
            <Textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Đặt câu hỏi về danh lam thắng cảnh, văn hóa, ẩm thực Việt Nam..."
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

          <p className="text-[11px] text-[#9CA3AF] text-center mt-1">
            Nhấn <kbd className="px-1.5 py-0.5 rounded bg-[#F5F5F4] border border-[#E5E7EB] text-[#6B7280] text-[10px]">Enter</kbd> để gửi • <kbd className="px-1.5 py-0.5 rounded bg-[#F5F5F4] border border-[#E5E7EB] text-[#6B7280] text-[10px]">Shift + Enter</kbd> xuống dòng
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. MODAL: TOÀN BỘ 10 CHỦ ĐỀ & KHO TRI THỨC RAG           */}
      {/* ========================================================= */}
      {isTopicModalOpen && (
        <Dialog open={isTopicModalOpen} onOpenChange={setIsTopicModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] rounded-2xl border-[#E5E7EB] bg-white p-0 shadow-xl overflow-hidden flex flex-col">
            {/* Header Modal */}
            <DialogHeader className="p-4 sm:p-5 border-b border-[#F0F0EF] bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] text-white flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-sm sm:text-base font-semibold text-[#1A1A1A] flex items-center gap-2">
                    Toàn Bộ Chủ Đề Trong Kho Tri Thức RAG
                    <Badge variant="lime" className="text-[10px] font-medium">
                      10.856 Chunks
                    </Badge>
                  </DialogTitle>
                  <DialogDescription className="text-xs text-[#6B7280]">
                    Bấm vào bất kỳ câu hỏi nào để trao đổi ngay với hệ thống AI
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Thanh Tìm Kiếm Chủ Đề Trong Modal */}
            <div className="px-4 sm:px-6 py-3 border-b border-[#F0F0EF] bg-[#FAFAF9]">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 pointer-events-none" />
                <Input
                  type="text"
                  value={searchTopicQuery}
                  onChange={(e) => setSearchTopicQuery(e.target.value)}
                  placeholder="Tìm kiếm chủ đề hoặc câu hỏi gợi ý..."
                  className="w-full bg-white border-[#E5E7EB] rounded-xl pl-9 pr-8 text-xs text-[#1A1A1A] placeholder-[#9CA3AF]"
                />
                {searchTopicQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchTopicQuery('')}
                    className="absolute right-2 h-6 w-6 text-[#9CA3AF] hover:text-[#1A1A1A]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Body Modal: Danh sách 10 chủ đề */}
            <ScrollArea className="flex-1 p-4 sm:p-6">
              <div className="space-y-4">
                {filteredTopics.length === 0 ? (
                  <div className="text-center py-12 text-xs text-[#6B7280]">
                    Không tìm thấy chủ đề hoặc câu hỏi phù hợp với từ khóa "{searchTopicQuery}".
                  </div>
                ) : (
                  filteredTopics.map((topic) => {
                    const ModalTopicIcon = getTopicIcon(topic.id);
                    return (
                      <Card
                        key={topic.id}
                        className="p-4 sm:p-5 rounded-2xl bg-[#F9F9F8] border-[#E5E7EB] space-y-3 shadow-none"
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-[#1A1A1A] shrink-0">
                              <ModalTopicIcon className="w-4 h-4 text-[#1A1A1A]" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-[#1A1A1A] flex items-center gap-2">
                                {topic.name}
                                {topic.badge && (
                                  <Badge variant="lime" className="text-[10px] font-medium">
                                    {topic.badge}
                                  </Badge>
                                )}
                              </h4>
                              <p className="text-xs text-[#6B7280]">{topic.description}</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-white border-[#E5E7EB] text-xs font-medium text-[#6B7280]">
                            {topic.chunkCountEstimate}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#E5E7EB]/70">
                          {topic.sampleQuestions.map((q, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setIsTopicModalOpen(false);
                                handleSendMessage(q.question);
                              }}
                              className="group p-2.5 rounded-xl bg-white hover:bg-[#F5F5F4] border border-[#E5E7EB] hover:border-[#1A1A1A]/30 text-left transition flex items-center justify-between gap-2 shadow-2xs"
                            >
                              <span className="text-xs text-[#1A1A1A] group-hover:text-black line-clamp-2">
                                {q.question}
                              </span>
                              <ArrowUpRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#1A1A1A] shrink-0" />
                            </button>
                          ))}
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </ScrollArea>

            {/* Footer Modal */}
            <div className="p-3.5 sm:p-4 border-t border-[#F0F0EF] bg-[#FAFAF9] flex items-center justify-between text-xs text-[#6B7280] shrink-0">
              <span>Được xây dựng với mô hình BGE-M3 và dữ liệu 63 tỉnh thành Việt Nam</span>
              <Button
                variant="default"
                onClick={() => setIsTopicModalOpen(false)}
                className="rounded-xl bg-[#1A1A1A] hover:bg-[#2C2C2C] text-white text-xs font-medium px-4 py-2"
              >
                Đóng
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ========================================================= */}
      {/* 5. MODAL: BÁO CÁO SAI LỆCH / LỖI THỜI TRI THỨC           */}
      {/* ========================================================= */}
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent className="max-w-md bg-white p-6 rounded-2xl border-[#E5E7EB] shadow-xl">
          <DialogHeader className="space-y-1.5">
            <DialogTitle className="text-base font-semibold text-[#1A1A1A] flex items-center gap-2">
              <Flag className="w-4 h-4 text-[#DC2626]" />
              Báo Cáo Thông Tin Chưa Chính Xác / Lỗi Thời
            </DialogTitle>
            <DialogDescription className="text-xs text-[#6B7280]">
              Đóng góp của bạn giúp hệ thống cập nhật và đối soát thông tin du lịch chính xác hơn.
            </DialogDescription>
          </DialogHeader>

          {feedbackSuccess ? (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 animate-in zoom-in-50" />
              <p className="text-sm font-semibold text-[#1A1A1A]">Đã gửi báo cáo thành công!</p>
              <p className="text-xs text-[#6B7280]">Cảm ơn bạn đã đóng góp phản hồi cho hệ thống.</p>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              {feedbackTargetMessage && (
                <div className="p-3 rounded-xl bg-[#F9F9F8] border border-[#E5E7EB] text-xs space-y-1">
                  <p className="text-[#6B7280] font-medium text-[11px]">Câu hỏi:</p>
                  <p className="text-[#1A1A1A] font-semibold truncate">"{feedbackTargetMessage.userQuestion}"</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1A1A1A]">Lý do báo cáo:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'OUTDATED_PRICE', label: '💰 Giá vé đã đổi' },
                    { id: 'CLOSED', label: '🚪 Tạm ngưng / Đóng' },
                    { id: 'INCORRECT_INFO', label: '❌ Thông tin sai' },
                    { id: 'OTHER', label: '📝 Lý do khác' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setFeedbackReason(r.id)}
                      className={`p-2 rounded-xl text-xs font-medium border text-left transition-all ${
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
                  Ghi chú chi tiết hoặc nguồn đính chính:
                </label>
                <Textarea
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  placeholder="Ví dụ: Giá vé combo tham quan hiện nay đã cập nhật thành 65.000đ theo thông báo mới nhất..."
                  className="text-xs min-h-[80px] rounded-xl border-[#E5E7EB] focus:ring-1 focus:ring-[#1A1A1A]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFeedbackDialogOpen(false)}
                  disabled={isSubmittingFeedback}
                  className="rounded-xl text-xs border-[#E5E7EB]"
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmitFeedback}
                  disabled={isSubmittingFeedback}
                  className="rounded-xl bg-[#1A1A1A] text-white text-xs hover:bg-[#2C2C2C] gap-1.5"
                >
                  {isSubmittingFeedback ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <span>Gửi báo cáo</span>
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
