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
            /* Welcome Empty State */
            <div className="max-w-3xl mx-auto h-full flex flex-col items-center justify-center py-6 text-center">
              <div className="relative mb-5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                  <Compass className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" />
                </div>
                <Sparkles className="w-5 h-5 text-amber-300 absolute -top-1.5 -right-1.5 animate-bounce" />
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-2">
                Hỏi Đáp Du Lịch Việt Nam
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm max-w-lg mb-6 leading-relaxed">
                Hệ thống RAG AI phân tích hàng ngàn bài viết và dữ liệu văn hóa, ẩm thực, lịch trình để giải đáp thắc mắc của bạn một cách chính xác nhất.
              </p>

              {/* Suggested Questions */}
              <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
                {SUGGESTED_QUESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.question)}
                    className="group p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/40 transition-all text-left flex flex-col gap-1 shadow-sm hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.icon}</span>
                      <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 group-hover:text-white line-clamp-2">
                      {item.question}
                    </p>
                  </button>
                ))}
              </div>
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

        {/* Form Nhập Câu Hỏi Dưới Cùng */}
        <div className="p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xl border-t border-slate-900 shrink-0">
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

          <p className="text-[11px] text-slate-500 text-center mt-2">
            Nhấn <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">Enter</kbd> để gửi • <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">Shift + Enter</kbd> xuống dòng
          </p>
        </div>
      </div>
    </div>
  );
}
