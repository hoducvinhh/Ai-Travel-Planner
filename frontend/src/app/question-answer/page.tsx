'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Send,
  Sparkles,
  Compass,
  MapPin,
  BookOpen,
  ChevronDown,
  ChevronUp,
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
  User as UserIcon,
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
} from 'lucide-react';
import { SourceCitation, Message, SystemStatus, ChatSession } from '@/types';
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
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});

  // Trạng thái Chủ đề RAG (Topic Explorer)
  const [selectedTopicId, setSelectedTopicId] = useState<string>('routes');
  const [topicViewMode, setTopicViewMode] = useState<'tabs' | 'grid'>('tabs');
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [activeQuickTopic, setActiveQuickTopic] = useState<string | null>(null);
  const [searchTopicQuery, setSearchTopicQuery] = useState('');

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
      const formattedMessages: Message[] = (detail.messages || []).map((m: any) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        sources: m.sources || undefined,
        timestamp: new Date(m.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));
      setMessages(formattedMessages);
      setExpandedSources({});
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
    setExpandedSources({});
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

  const toggleSource = (msgId: string) => {
    setExpandedSources((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
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
      sources: [],
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
              } else if (event.type === 'sources') {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botMessageId
                      ? { ...msg, sources: event.data }
                      : msg
                  )
                );
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
          <button
            onClick={handleNewChat}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#2C2C2C] active:scale-[0.99] text-white font-medium text-xs sm:text-sm transition-all shadow-xs disabled:opacity-40"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Cuộc trò chuyện mới</span>
          </button>

          {/* Nút đóng trên mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Đóng sidebar"
            className="md:hidden p-2 rounded-lg text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F5F5F4] transition"
          >
            <PanelLeftClose className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>

        {/* Danh Sách Sessions */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-2 py-1.5 text-[11px] font-semibold text-[#6B7280] tracking-wider uppercase flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#6B7280]" />
              Lịch sử gần đây
            </span>
            <span className="text-[10px] text-[#6B7280] bg-[#F5F5F4] border border-[#E5E7EB] px-2 py-0.5 rounded-full font-medium">
              {sessions.length}
            </span>
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
                        <input
                          type="text"
                          value={editTitleInput}
                          onChange={(e) => setEditTitleInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveRename(e as any, session.id);
                            if (e.key === 'Escape') handleCancelRename(e as any);
                          }}
                          autoFocus
                          className="w-full bg-white px-2 py-1 rounded-md text-xs text-[#1A1A1A] border border-[#1A1A1A] focus:outline-none"
                        />
                        <button
                          onClick={(e) => handleSaveRename(e, session.id)}
                          className="p-1 text-[#1A1A1A] hover:bg-neutral-200 rounded transition"
                          title="Lưu"
                        >
                          <Check className="w-3.5 h-3.5 text-[#1A1A1A]" />
                        </button>
                        <button
                          onClick={handleCancelRename}
                          className="p-1 text-[#6B7280] hover:text-[#1A1A1A] hover:bg-neutral-200 rounded transition"
                          title="Hủy"
                        >
                          <X className="w-3.5 h-3.5 text-[#6B7280]" />
                        </button>
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
                      <button
                        onClick={(e) => handleStartRename(e, session)}
                        title="Đổi tên"
                        className="p-1 rounded text-[#6B7280] hover:text-[#1A1A1A] hover:bg-neutral-200/60 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#6B7280]" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteSession(e, session.id)}
                        title="Xóa"
                        className="p-1 rounded text-[#6B7280] hover:text-[#1A1A1A] hover:bg-neutral-200/60 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-[#6B7280]" />
                      </button>
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

          <button
            onClick={() => loadSessions()}
            title="Làm mới danh sách"
            className="p-1.5 rounded-lg hover:bg-[#F5F5F4] text-[#6B7280] hover:text-[#1A1A1A] transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#6B7280]" />
          </button>
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
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title={isSidebarOpen ? 'Thu gọn thanh bên' : 'Mở lịch sử chat'}
              className="p-2 rounded-xl bg-white hover:bg-[#F5F5F4] text-[#6B7280] hover:text-[#1A1A1A] border border-[#E5E7EB] transition shadow-2xs"
            >
              <PanelLeft className="w-4 h-4 text-[#6B7280]" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-semibold text-[#1A1A1A] truncate max-w-xs sm:max-w-md">
                  {currentSession ? currentSession.title : 'Cố Vấn Du Lịch Việt Nam AI'}
                </h1>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F4FCE3] text-[#365314] border border-[#D9F99D] shrink-0">
                  RAG BGE-M3
                </span>
              </div>
              <p className="text-[11px] text-[#6B7280] hidden sm:block mt-0.5">
                Cơ sở tri thức 63 tỉnh thành & cẩm nang du lịch Việt Nam
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Nút mở Modal 10 Chủ đề */}
            <button
              onClick={() => setIsTopicModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#F5F5F4] text-[#1A1A1A] border border-[#E5E7EB] text-xs font-medium transition shadow-2xs"
              title="Khám phá tất cả các chủ đề trong kho RAG"
            >
              <Compass className="w-3.5 h-3.5 text-[#6B7280]" />
              <span className="hidden sm:inline">10 Chủ đề RAG</span>
              <span className="sm:hidden">Chủ đề</span>
            </button>

            {/* Trạng thái pgvector */}
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-[11px] shadow-2xs">
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
            </div>

            {messages.length > 0 && (
              <button
                onClick={handleNewChat}
                title="Tạo phiên mới"
                className="p-1.5 rounded-lg bg-white hover:bg-[#F5F5F4] text-[#6B7280] hover:text-[#1A1A1A] border border-[#E5E7EB] transition shadow-2xs"
              >
                <Plus className="w-4 h-4 text-[#6B7280]" />
              </button>
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
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4FCE3] border border-[#D9F99D] text-[#365314] text-xs font-medium mb-3.5 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#1A1A1A]" />
                  <span>Kho tri thức RAG • 10.856 Chunks • 63 Tỉnh thành</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1A1A1A] mb-2.5">
                  Bạn muốn khám phá du lịch Việt Nam thế nào?
                </h2>
                <p className="text-[#6B7280] text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
                  Chọn một trong 10 chủ đề bên dưới để xem gợi ý câu hỏi thực tế hoặc tự do đặt câu hỏi bất kỳ cho cố vấn AI.
                </p>

                {/* Segmented Pill Control */}
                <div className="mt-5 inline-flex items-center p-1 rounded-full bg-[#F0F0EF] border border-[#E5E7EB] text-xs">
                  <button
                    onClick={() => setTopicViewMode('tabs')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium transition-all ${
                      topicViewMode === 'tabs'
                        ? 'bg-[#1A1A1A] text-white shadow-xs'
                        : 'text-[#6B7280] hover:text-[#1A1A1A]'
                    }`}
                  >
                    <ListFilter className="w-3.5 h-3.5 text-inherit" />
                    <span>Chi tiết theo chủ đề</span>
                  </button>
                  <button
                    onClick={() => setTopicViewMode('grid')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium transition-all ${
                      topicViewMode === 'grid'
                        ? 'bg-[#1A1A1A] text-white shadow-xs'
                        : 'text-[#6B7280] hover:text-[#1A1A1A]'
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5 text-inherit" />
                    <span>Lưới 10 chủ đề</span>
                  </button>
                </div>
              </div>

              {topicViewMode === 'tabs' ? (
                /* CHẾ ĐỘ 1: TABS CHỦ ĐỀ + DANH SÁCH CÂU HỎI MẪU */
                <div className="w-full space-y-4">
                  {/* Thanh Cuộn Ngang 10 Chủ Đề (Horizontal Pills với Lucide Icons) */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {RAG_TOPICS.map((topic) => {
                      const isSelected = topic.id === selectedTopicId;
                      const Icon = getTopicIcon(topic.id);
                      return (
                        <button
                          key={topic.id}
                          onClick={() => setSelectedTopicId(topic.id)}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                            isSelected
                              ? 'bg-[#1A1A1A] text-white shadow-xs border border-[#1A1A1A]'
                              : 'bg-white hover:bg-[#F5F5F4] text-[#1A1A1A] border border-[#E5E7EB]'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-[#6B7280]'}`} />
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
                        </button>
                      );
                    })}
                  </div>

                  {/* Chi Tiết Chủ Đề & Các Câu Hỏi Gợi Ý */}
                  {(() => {
                    const currentTopic =
                      RAG_TOPICS.find((t) => t.id === selectedTopicId) || RAG_TOPICS[0];
                    const TopicIcon = getTopicIcon(currentTopic.id);
                    return (
                      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-5 animate-in fade-in duration-200">
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
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F4FCE3] text-[#365314] border border-[#D9F99D] font-medium">
                                    {currentTopic.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#6B7280] mt-0.5">
                                {currentTopic.description}
                              </p>
                            </div>
                          </div>
                          <div className="shrink-0">
                            <span className="text-xs font-medium text-[#6B7280] bg-[#F9F9F8] px-2.5 py-1 rounded-lg border border-[#E5E7EB]">
                              {currentTopic.chunkCountEstimate}
                            </span>
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
                              <button
                                key={idx}
                                onClick={() => handleSendMessage(qItem.question)}
                                className="group relative p-3.5 rounded-xl bg-white hover:bg-[#FAFAF9] border border-[#E5E7EB] hover:border-[#1A1A1A]/30 transition-all text-left flex items-start justify-between gap-3 shadow-2xs hover:shadow-xs"
                              >
                                <div className="space-y-1.5 flex-1">
                                  {qItem.badge && (
                                    <span className="inline-block text-[10px] font-medium px-1.5 py-0.2 rounded bg-[#F4FCE3] text-[#365314] border border-[#D9F99D]">
                                      {qItem.badge}
                                    </span>
                                  )}
                                  <p className="text-xs text-[#1A1A1A] font-medium leading-relaxed group-hover:text-black">
                                    {qItem.question}
                                  </p>
                                </div>
                                <div className="p-1.5 rounded-lg bg-[#F5F5F4] group-hover:bg-[#1A1A1A] text-[#6B7280] group-hover:text-white transition-all shrink-0 mt-0.5">
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                /* CHẾ ĐỘ 2: LƯỚI CARD TẤT CẢ 10 CHỦ ĐỀ VỚI LUCIDE ICONS */
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {RAG_TOPICS.map((topic) => {
                    const CardIcon = getTopicIcon(topic.id);
                    return (
                      <div
                        key={topic.id}
                        onClick={() => {
                          setSelectedTopicId(topic.id);
                          setTopicViewMode('tabs');
                        }}
                        className="group cursor-pointer p-4 sm:p-5 rounded-2xl bg-white hover:bg-[#FAFAF9] border border-[#E5E7EB] hover:border-[#1A1A1A]/30 transition-all flex flex-col justify-between gap-3.5 shadow-2xs hover:shadow-xs"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#F5F5F4] border border-[#E5E7EB] flex items-center justify-center text-[#1A1A1A]">
                              <CardIcon className="w-4 h-4 text-[#1A1A1A]" />
                            </div>
                            {topic.badge && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F4FCE3] text-[#365314] border border-[#D9F99D] font-medium">
                                {topic.badge}
                              </span>
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
                      </div>
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
              {messages.map((msg) => (
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

                    {/* Sources Accordion */}
                    {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-4 pt-3.5 border-t border-[#F0F0EF]">
                        <button
                          onClick={() => toggleSource(msg.id)}
                          className="flex items-center justify-between w-full py-1 text-xs font-medium text-[#1A1A1A] hover:text-[#4B5563] transition-colors"
                        >
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-[#6B7280]" />
                            <span>Nguồn tham chiếu ({msg.sources.length} tài liệu)</span>
                            {msg.sources[0]?.similarity && (
                              <span className="text-[11px] text-[#6B7280] font-normal">
                                • Độ khớp cao nhất: {(Number(msg.sources[0].similarity) * 100).toFixed(1)}%
                              </span>
                            )}
                          </span>
                          {expandedSources[msg.id] ? (
                            <ChevronUp className="w-3.5 h-3.5 text-[#6B7280]" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
                          )}
                        </button>

                        {expandedSources[msg.id] && (
                          <div className="mt-3 space-y-2.5">
                            {msg.sources.map((src, sIdx) => {
                              const matchPct = (Number(src.similarity) * 100).toFixed(1);
                              const isQa = src.chunk_type === 'qa';

                              return (
                                <div
                                  key={sIdx}
                                  className="p-3.5 rounded-xl bg-[#F9F9F8] border border-[#E5E7EB] text-xs space-y-2"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-semibold text-[#1A1A1A] truncate flex items-center gap-1.5">
                                      <MapPin className="w-3.5 h-3.5 text-[#6B7280] shrink-0" />
                                      {src.title}
                                    </span>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white border border-[#E5E7EB] text-[#4B5563]">
                                        {isQa ? 'Hỏi - Đáp gốc' : 'Ngữ cảnh bài viết'}
                                      </span>
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F4FCE3] text-[#365314] border border-[#D9F99D]">
                                        {matchPct}% match
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-[#4B5563] text-xs leading-relaxed bg-white p-2.5 rounded-lg border border-[#E5E7EB] line-clamp-3">
                                    "{src.content}"
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        )}
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
              <div className="max-w-4xl mx-auto p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-md space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#F0F0EF]">
                  <div className="flex items-center gap-2">
                    <FlyoutIcon className="w-4 h-4 text-[#1A1A1A]" />
                    <span className="text-xs font-semibold text-[#1A1A1A]">{topic.name}</span>
                    <span className="text-[10px] text-[#365314] bg-[#F4FCE3] border border-[#D9F99D] px-2 py-0.5 rounded-full font-medium">
                      Gợi ý câu hỏi
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveQuickTopic(null)}
                    aria-label="Đóng gợi ý"
                    className="p-1 rounded-lg text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F5F5F4] transition"
                  >
                    <X className="w-4 h-4 text-[#6B7280]" />
                  </button>
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
              </div>
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
                <button
                  key={topic.id}
                  onClick={() => {
                    setActiveQuickTopic(isActive ? null : topic.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all shrink-0 text-xs ${
                    isActive
                      ? 'bg-[#1A1A1A] text-white font-medium shadow-xs'
                      : 'bg-white hover:bg-[#F5F5F4] text-[#1A1A1A] border border-[#E5E7EB]'
                  }`}
                >
                  <ChipIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-[#6B7280]'}`} />
                  <span>{topic.shortName}</span>
                </button>
              );
            })}

            <button
              onClick={() => setIsTopicModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F4FCE3] hover:bg-[#EAF7B8] text-[#365314] border border-[#D9F99D] text-xs font-semibold shrink-0 transition"
            >
              <span>Xem tất cả (10)</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#365314]" />
            </button>
          </div>

          {/* Form Nhập Câu Hỏi */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="max-w-4xl mx-auto relative flex items-end gap-2 p-2 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs focus-within:border-[#1A1A1A] focus-within:ring-2 focus-within:ring-[#1A1A1A]/10 transition-all"
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Đặt câu hỏi về danh lam thắng cảnh, văn hóa, ẩm thực Việt Nam..."
              className="flex-1 bg-transparent px-3 py-2 text-sm text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none resize-none max-h-32 min-h-[42px] leading-relaxed"
            />

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Gửi câu hỏi"
              className="p-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#2C2C2C] disabled:opacity-30 disabled:cursor-not-allowed text-white shadow-2xs transition-colors shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </button>
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="w-full max-w-4xl max-h-[90vh] bg-white border border-[#E5E7EB] rounded-2xl shadow-xl flex flex-col overflow-hidden">
            {/* Header Modal */}
            <div className="p-4 sm:p-5 border-b border-[#F0F0EF] flex items-center justify-between gap-3 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] text-white flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-[#1A1A1A] flex items-center gap-2">
                    Toàn Bộ Chủ Đề Trong Kho Tri Thức RAG
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F4FCE3] text-[#365314] border border-[#D9F99D] font-medium">
                      10.856 Chunks
                    </span>
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Bấm vào bất kỳ câu hỏi nào để trao đổi ngay với hệ thống AI
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTopicModalOpen(false)}
                aria-label="Đóng modal"
                className="p-2 rounded-xl text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F5F5F4] transition"
              >
                <X className="w-4 h-4 text-[#6B7280]" />
              </button>
            </div>

            {/* Thanh Tìm Kiếm Chủ Đề Trong Modal */}
            <div className="px-4 sm:px-6 py-3 border-b border-[#F0F0EF] bg-[#FAFAF9]">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchTopicQuery}
                  onChange={(e) => setSearchTopicQuery(e.target.value)}
                  placeholder="Tìm kiếm chủ đề hoặc câu hỏi gợi ý..."
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl pl-9 pr-4 py-2 text-xs text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#1A1A1A] transition"
                />
                {searchTopicQuery && (
                  <button
                    onClick={() => setSearchTopicQuery('')}
                    className="absolute right-3 p-1 text-[#6B7280] hover:text-[#1A1A1A]"
                  >
                    <X className="w-3.5 h-3.5 text-[#6B7280]" />
                  </button>
                )}
              </div>
            </div>

            {/* Body Modal: Danh sách 10 chủ đề */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {filteredTopics.length === 0 ? (
                <div className="text-center py-12 text-xs text-[#6B7280]">
                  Không tìm thấy chủ đề hoặc câu hỏi phù hợp với từ khóa "{searchTopicQuery}".
                </div>
              ) : (
                filteredTopics.map((topic) => {
                  const ModalTopicIcon = getTopicIcon(topic.id);
                  return (
                    <div
                      key={topic.id}
                      className="p-4 sm:p-5 rounded-2xl bg-[#F9F9F8] border border-[#E5E7EB] space-y-3"
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
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F4FCE3] text-[#365314] border border-[#D9F99D] font-medium">
                                  {topic.badge}
                                </span>
                              )}
                            </h4>
                            <p className="text-xs text-[#6B7280]">{topic.description}</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-[#6B7280] bg-white px-2.5 py-1 rounded-lg border border-[#E5E7EB]">
                          {topic.chunkCountEstimate}
                        </span>
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
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Modal */}
            <div className="p-3.5 sm:p-4 border-t border-[#F0F0EF] bg-[#FAFAF9] flex items-center justify-between text-xs text-[#6B7280] shrink-0">
              <span>Được xây dựng với mô hình BGE-M3 và dữ liệu 63 tỉnh thành Việt Nam</span>
              <button
                onClick={() => setIsTopicModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#2C2C2C] text-white font-medium transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
