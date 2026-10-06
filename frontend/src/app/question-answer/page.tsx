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
  ExternalLink,
  Layers,
  Lightbulb,
  HelpCircle,
  ChevronRight,
  Grid,
  ListFilter,
  ArrowUpRight,
} from 'lucide-react';
import { SourceCitation, Message, SystemStatus, ChatSession } from '@/types';
import { chatApi, getStoredToken } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { RAG_TOPICS, RagTopic } from '@/lib/ragTopics';


const GUEST_STORAGE_KEY = 'vietnam_travel_rag_guest_sessions';

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
                  // Cập nhật danh sách session
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
                // Cập nhật lại danh sách session để hiển thị thời gian và số lượng tin mới nhất
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
                  '⚠️ Không thể kết nối tới NestJS Backend. Vui lòng đảm bảo server backend đang chạy và kiểm tra kết nối mạng.',
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

  return (
    <div className="flex h-[calc(100vh-65px)] bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* ========================================================= */}
      {/* 1. SIDEBAR: Lịch Sử Cuộc Trò Chuyện                      */}
      {/* ========================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 md:static flex flex-col bg-slate-950/95 border-r border-emerald-950/50 backdrop-blur-xl transition-all duration-300 ease-in-out shrink-0 ${
          isSidebarOpen
            ? 'w-72 sm:w-80 translate-x-0'
            : '-translate-x-full md:translate-x-0 md:w-0 md:border-r-0 md:overflow-hidden'
        }`}
      >
        {/* Nút Tạo Cuộc Trò Chuyện Mới */}
        <div className="p-3.5 border-b border-slate-900/90 flex items-center justify-between gap-2">
          <button
            onClick={handleNewChat}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-medium text-xs sm:text-sm shadow-md shadow-emerald-950/40 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Cuộc trò chuyện mới</span>
          </button>

          {/* Nút đóng trên mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>

        {/* Danh Sách Sessions */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-emerald-400" />
              LỊCH SỬ GẦN ĐÂY
            </span>
            <span className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded-full">
              {sessions.length}
            </span>
          </div>

          {isLoadingSessions && sessions.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-slate-400 text-xs gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              Đang tải lịch sử...
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-10 px-4 text-xs text-slate-400">
              <MessageSquare className="w-8 h-8 text-slate-400/40 mx-auto mb-2" />
              Chưa có cuộc trò chuyện nào được lưu.
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === currentSessionId;
              const isEditing = session.id === editingSessionId;

              return (
                <div
                  key={session.id}
                  onClick={() => handleSelectSession(session.id)}
                  className={`group relative flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-950/50 text-emerald-200 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-900/80 hover:text-slate-100 border border-transparent'
                  }`}
                >
                  <MessageSquare
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400'
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
                        className="w-full bg-slate-900 px-2 py-1 rounded text-xs text-white border border-emerald-500 focus:outline-none"
                      />
                      <button
                        onClick={(e) => handleSaveRename(e, session.id)}
                        className="p-1 hover:text-emerald-400 transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={handleCancelRename}
                        className="p-1 hover:text-red-400 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1 truncate font-medium text-left">
                        {session.title || 'Cuộc trò chuyện mới'}
                      </span>

                      {/* Action buttons (Rename & Delete) */}
                      <div
                        className={`items-center gap-1 shrink-0 ${
                          isActive ? 'flex' : 'hidden group-hover:flex'
                        }`}
                      >
                        <button
                          onClick={(e) => handleStartRename(e, session)}
                          title="Đổi tên"
                          className="p-1 rounded text-slate-400 hover:text-emerald-300 hover:bg-slate-800 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteSession(e, session.id)}
                          title="Xóa"
                          className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer của Sidebar: Thông tin user / đồng bộ */}
        <div className="p-3 border-t border-slate-900 bg-slate-950/60 text-[11px] text-slate-400 flex items-center justify-between">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 truncate">
              <div className="w-6 h-6 rounded-full bg-emerald-600/30 flex items-center justify-center text-emerald-400">
                <UserIcon className="w-3.5 h-3.5" />
              </div>
              <span className="truncate text-slate-300">{user?.name || user?.email}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
              <span>💻 Lưu trữ trên trình duyệt</span>
            </div>
          )}

          <button
            onClick={() => loadSessions()}
            title="Làm mới danh sách"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </aside>

      {/* Backdrop trên màn hình mobile khi mở sidebar */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* ========================================================= */}
      {/* 2. MAIN CHAT AREA                                         */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 relative overflow-hidden">
        {/* Top bar header */}
        <div className="backdrop-blur-md bg-slate-950/70 border-b border-emerald-950/50 px-4 py-2.5 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title={isSidebarOpen ? 'Thu gọn sidebar' : 'Mở lịch sử chat'}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition shadow-sm"
            >
              <PanelLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent truncate max-w-xs sm:max-w-md">
                  {currentSession ? currentSession.title : 'Cố Vấn Du Lịch Việt Nam AI'}
                </h1>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                  RAG BGE-M3
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Truy vấn chính xác dựa trên cơ sở tri thức địa danh & cẩm nang du lịch
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Nút mở Modal Khám Phá Chủ Đề */}
            <button
              onClick={() => setIsTopicModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition shadow-sm hover:scale-[1.02]"
              title="Khám phá tất cả các chủ đề trong kho RAG"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">10 Chủ đề RAG</span>
              <span className="sm:hidden">Chủ đề</span>
            </button>

            {/* Status indicator */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px]">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400 hidden md:inline">pgvector:</span>
              {systemStatus?.database?.connected ? (
                <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  {systemStatus.database.totalChunks.toLocaleString()} chunks
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-400">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Đang nạp
                </span>
              )}
            </div>

            {messages.length > 0 && (
              <button
                onClick={handleNewChat}
                title="Tạo phiên mới"
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700/60"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* Message Content List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.length === 0 ? (
            /* Welcome Empty State: Bộ Khám Phá 10 Chủ Đề RAG Toàn Diện */
            <div className="max-w-4xl mx-auto py-4 sm:py-6 flex flex-col items-center">
              {/* Header Chào Mừng */}
              <div className="text-center mb-6 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold mb-3 shadow-inner">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>KHO TRI THỨC RAG: 10.856 CHUNKS • 63 TỈNH THÀNH • 10 CHỦ ĐỀ</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white mb-2.5">
                  Bạn muốn khám phá du lịch Việt Nam thế nào?
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Chọn một trong 10 chủ đề chuyên sâu dưới đây để xem gợi ý câu hỏi thực tế hoặc tự đặt câu hỏi bất kỳ cho AI!
                </p>

                {/* View Mode Toggle */}
                <div className="mt-4 inline-flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                  <button
                    onClick={() => setTopicViewMode('tabs')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                      topicViewMode === 'tabs'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ListFilter className="w-3.5 h-3.5" />
                    <span>Chi tiết theo chủ đề</span>
                  </button>
                  <button
                    onClick={() => setTopicViewMode('grid')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                      topicViewMode === 'grid'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>Lưới 10 chủ đề</span>
                  </button>
                </div>
              </div>

              {topicViewMode === 'tabs' ? (
                /* CHẾ ĐỘ 1: TABS CHỦ ĐỀ + DANH SÁCH CÂU HỎI MẪU */
                <div className="w-full space-y-4">
                  {/* Thanh Cuộn Ngang 10 Chủ Đề (Horizontal Pills Carousel) */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    {RAG_TOPICS.map((topic) => {
                      const isSelected = topic.id === selectedTopicId;
                      return (
                        <button
                          key={topic.id}
                          onClick={() => setSelectedTopicId(topic.id)}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                            isSelected
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/50 scale-[1.02] border border-emerald-400/30'
                              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80'
                          }`}
                        >
                          <span className="text-sm">{topic.icon}</span>
                          <span>{topic.shortName}</span>
                          {topic.badge && (
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                                isSelected
                                  ? 'bg-white/20 text-white'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {topic.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Chi Tiết Chủ Đề Đang Chọn & Các Câu Hỏi Gợi Ý */}
                  {(() => {
                    const currentTopic =
                      RAG_TOPICS.find((t) => t.id === selectedTopicId) || RAG_TOPICS[0];
                    return (
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-emerald-900/30 backdrop-blur-md shadow-xl space-y-4 animate-in fade-in duration-300">
                        {/* Header của Topic */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-sm">
                              {currentTopic.icon}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm sm:text-base font-bold text-white">
                                  {currentTopic.name}
                                </h3>
                                {currentTopic.badge && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                                    {currentTopic.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {currentTopic.description}
                              </p>
                            </div>
                          </div>
                          <div className="text-left sm:text-right shrink-0">
                            <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/40">
                              Dữ liệu: {currentTopic.chunkCountEstimate}
                            </span>
                          </div>
                        </div>

                        {/* Danh Sách Câu Hỏi Gợi Ý Tiêu Biểu */}
                        <div>
                          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Bấm vào câu hỏi để hỏi AI ngay lập tức:</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {currentTopic.sampleQuestions.map((qItem, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSendMessage(qItem.question)}
                                className="group relative p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/90 hover:border-emerald-500/50 transition-all text-left flex items-start justify-between gap-2.5 shadow-sm hover:shadow-emerald-950/40 hover:-translate-y-0.5"
                              >
                                <div className="space-y-1.5 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
                                    {qItem.badge && (
                                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                                        {qItem.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-200 group-hover:text-emerald-100 font-medium leading-relaxed">
                                    {qItem.question}
                                  </p>
                                </div>
                                <div className="p-1.5 rounded-lg bg-slate-800/80 group-hover:bg-emerald-600 text-slate-400 group-hover:text-white transition-all shrink-0 mt-0.5 shadow-sm">
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
                /* CHẾ ĐỘ 2: LƯỚI CARD TẤT CẢ 10 CHỦ ĐỀ CỦA RAG */
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {RAG_TOPICS.map((topic) => (
                    <div
                      key={topic.id}
                      onClick={() => {
                        setSelectedTopicId(topic.id);
                        setTopicViewMode('tabs');
                      }}
                      className="group cursor-pointer p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800/90 hover:border-emerald-500/40 transition-all flex flex-col justify-between gap-3 shadow-md hover:shadow-emerald-950/40 hover:-translate-y-0.5"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-2xl p-2 rounded-xl bg-slate-800/60 group-hover:bg-emerald-950/40 border border-slate-800 group-hover:border-emerald-700/40 transition-colors">
                            {topic.icon}
                          </span>
                          {topic.badge && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                              {topic.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                          {topic.name}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {topic.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="text-emerald-400 font-medium">
                          {topic.chunkCountEstimate}
                        </span>
                        <span className="flex items-center gap-1 group-hover:text-emerald-300 transition-colors">
                          Khám phá <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (

            /* Tin nhắn trò chuyện */
            <div className="max-w-4xl mx-auto space-y-6 pb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {/* Bot Avatar */}
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shrink-0 shadow-md ring-1 ring-emerald-400/40 mt-1">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-2xl sm:max-w-3xl rounded-2xl p-4 sm:p-5 shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-slate-900/90 border border-slate-800/90 text-slate-100 rounded-tl-none'
                    }`}
                  >
                    {/* Message Content */}
                    <div className="text-sm leading-relaxed break-words [&>p]:mb-3 [&>p:last-child]:mb-0 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4">
                      {msg.content ? (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-slate-400 italic">
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                          Đang tìm kiếm tri thức và viết câu trả lời...
                        </span>
                      )}
                    </div>

                    {/* Sources Accordion */}
                    {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-800/80">
                        <button
                          onClick={() => toggleSource(msg.id)}
                          className="flex items-center justify-between w-full py-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition"
                        >
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" />
                            Nguồn tham chiếu ({msg.sources.length} tài liệu)
                            {msg.sources[0]?.similarity && (
                              <span className="ml-1 text-[11px] text-slate-400 font-normal">
                                • Độ khớp cao nhất: {(Number(msg.sources[0].similarity) * 100).toFixed(1)}%
                              </span>
                            )}
                          </span>
                          {expandedSources[msg.id] ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
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
                                  className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs space-y-1.5"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-semibold text-slate-200 truncate flex items-center gap-1.5">
                                      <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                                      {src.title}
                                    </span>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <span
                                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                          isQa
                                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                        }`}
                                      >
                                        {isQa ? 'Hỏi - Đáp gốc' : 'Ngữ cảnh bài viết'}
                                      </span>
                                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-emerald-400">
                                        {matchPct}% match
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-slate-400 italic line-clamp-3 bg-slate-900/60 p-2 rounded border border-slate-800/40">
                                    "{src.content}"
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-2 text-[10px] text-right text-slate-400/80">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Form Nhập Câu Hỏi Dưới Cùng & Dải Gợi Ý Chủ Đề Nhanh */}
        <div className="p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xl border-t border-slate-900 shrink-0 space-y-2.5">
          {/* Popover Câu Hỏi Nhanh (Hiển thị khi bấm vào 1 chip chủ đề) */}
          {activeQuickTopic && (() => {
            const topic = RAG_TOPICS.find((t) => t.id === activeQuickTopic);
            if (!topic) return null;
            return (
              <div className="max-w-4xl mx-auto p-3.5 rounded-2xl bg-slate-900/95 border border-emerald-500/40 shadow-2xl space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{topic.icon}</span>
                    <span className="text-xs font-bold text-white">{topic.name}</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40 font-medium">
                      Gợi ý câu hỏi
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveQuickTopic(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  >
                    <X className="w-4 h-4" />
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
                      className="group p-2.5 rounded-xl bg-slate-950/70 hover:bg-emerald-950/40 border border-slate-800/80 hover:border-emerald-500/40 text-left transition flex items-center justify-between gap-2"
                    >
                      <span className="text-xs text-slate-300 group-hover:text-emerald-200 line-clamp-2">
                        {q.question}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Dải Chip Gợi Ý Chủ Đề Nhanh (Horizontal Quick Topic Bar) */}
          <div className="max-w-4xl mx-auto flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800 text-xs">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 shrink-0 pr-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Chủ đề:</span>
            </div>

            {RAG_TOPICS.map((topic) => {
              const isActive = activeQuickTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => {
                    setActiveQuickTopic(isActive ? null : topic.id);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all shrink-0 text-xs ${
                    isActive
                      ? 'bg-emerald-600 text-white font-medium shadow-md shadow-emerald-950/40 scale-[1.02]'
                      : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  <span className="text-xs">{topic.icon}</span>
                  <span>{topic.shortName}</span>
                </button>
              );
            })}

            <button
              onClick={() => setIsTopicModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold shrink-0 transition"
            >
              <span>Xem tất cả (10)</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Form Nhập Câu Hỏi */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="max-w-4xl mx-auto relative flex items-end gap-2 p-2 rounded-2xl bg-slate-900/90 border border-emerald-900/40 shadow-2xl focus-within:border-emerald-500/70 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all"
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Đặt câu hỏi về danh lam thắng cảnh, văn hóa, ẩm thực Việt Nam..."
              className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none max-h-32 min-h-[40px]"
            />

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-md transition shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>

          <p className="text-[11px] text-slate-500 text-center mt-1">
            Nhấn <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">Enter</kbd> để gửi • <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">Shift + Enter</kbd> xuống dòng
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MODAL: TOÀN BỘ 10 CHỦ ĐỀ & KHO TRI THỨC RAG           */}
      {/* ========================================================= */}
      {isTopicModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-4xl max-h-[90vh] bg-slate-950 border border-emerald-900/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header Modal */}
            <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between gap-3 bg-slate-900/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    Toàn Bộ Chủ Đề Trong Kho Tri Thức RAG
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                      10.856 Chunks
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Bấm vào bất kỳ câu hỏi nào để hỏi trực tiếp hệ thống AI
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTopicModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Modal: Danh sách 10 chủ đề */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
              {RAG_TOPICS.map((topic) => (
                <div
                  key={topic.id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-1.5 rounded-lg bg-slate-800 border border-slate-700/60">
                        {topic.icon}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          {topic.name}
                          {topic.badge && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {topic.badge}
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-slate-400">{topic.description}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      {topic.chunkCountEstimate}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800/60">
                    {topic.sampleQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setIsTopicModalOpen(false);
                          handleSendMessage(q.question);
                        }}
                        className="group p-2.5 rounded-lg bg-slate-950/60 hover:bg-emerald-950/40 border border-slate-800/80 hover:border-emerald-500/40 text-left transition flex items-center justify-between gap-2"
                      >
                        <span className="text-xs text-slate-300 group-hover:text-emerald-200 line-clamp-2">
                          {q.question}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Modal */}
            <div className="p-3 sm:p-4 border-t border-slate-800/80 bg-slate-900/50 flex items-center justify-between text-xs text-slate-400 shrink-0">
              <span>Được xây dựng với mô hình BGE-M3 và dữ liệu 63 tỉnh thành Việt Nam</span>
              <button
                onClick={() => setIsTopicModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
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
