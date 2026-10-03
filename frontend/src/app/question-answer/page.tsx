'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  CheckCircle2,
  AlertCircle,
  Database,
  ExternalLink,
  MessageSquare,
  Globe,
  Loader2,
} from 'lucide-react';

interface SourceCitation {
  id: string;
  chunk_type: 'context' | 'qa';
  title: string;
  content: string;
  similarity: number;
  metadata?: any;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceCitation[];
  timestamp: string;
}

interface SystemStatus {
  status: string;
  database?: {
    connected: boolean;
    totalChunks: number;
    breakdown: Array<{ type: string; count: number }>;
  };
  services?: {
    bgeM3Local: boolean;
    geminiConfigured: boolean;
  };
}

const SUGGESTED_QUESTIONS = [
  {
    category: 'Văn hóa & Con người',
    icon: '👥',
    question: 'Người dân Việt Nam nổi tiếng với đặc điểm gì?',
  },
  {
    category: 'Thủ đô Hà Nội',
    icon: '🏛️',
    question: 'Thủ đô Hà Nội có những nét hấp dẫn nào về văn hóa và ẩm thực?',
  },
  {
    category: 'Kỳ quan Thiên nhiên',
    icon: '🏝️',
    question: 'Vịnh Hạ Long được miêu tả và có những giá trị đặc sắc gì?',
  },
  {
    category: 'Di sản & Ẩm thực',
    icon: '🏮',
    question: 'Phố cổ Hội An và các món ăn đặc trưng ở miền Trung có gì nổi bật?',
  },
];

export default function QuestionAnswerPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Cuộn tự động khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Kiểm tra trạng thái hệ thống backend
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
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
    const interval = setInterval(fetchStatus, 8000);
    return () => clearInterval(interval);
  }, []);

  const toggleSource = (msgId: string) => {
    setExpandedSources((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: query }),
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

              if (event.type === 'sources') {
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

  const handleClearChat = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện không?')) {
      setMessages([]);
      setExpandedSources({});
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-slate-950/80 border-b border-emerald-900/40 px-4 lg:px-8 py-3.5 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30">
              <Compass className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base lg:text-lg font-bold tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                  Cố Vấn Du Lịch Việt Nam AI
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  RAG BGE-M3
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Hỏi đáp thông minh dựa trên kho tri thức chuyên sâu du lịch Việt Nam
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400 hidden md:inline">CSDL pgvector:</span>
              {systemStatus?.database?.connected ? (
                <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  {systemStatus.database.totalChunks.toLocaleString()} chunks
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-400">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Đang đồng bộ
                </span>
              )}
            </div>

            {messages.length > 0 && (
              <button
                onClick={handleClearChat}
                title="Xóa cuộc trò chuyện"
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700/60"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Chat Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between">
        {/* Welcome Empty State */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <Sparkles className="w-6 h-6 text-amber-300 absolute -top-2 -right-2 animate-bounce" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              Khám Phá Vẻ Đẹp Việt Nam
            </h2>
            <p className="text-slate-400 text-sm max-w-lg mb-8 leading-relaxed">
              Đặt bất kỳ câu hỏi nào về danh lam thắng cảnh, văn hóa, ẩm thực, lịch sử hoặc kinh nghiệm du lịch tại các vùng miền Việt Nam.
            </p>

            {/* Suggested Question Cards */}
            <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {SUGGESTED_QUESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.question)}
                  className="group p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/40 transition-all duration-200 text-left flex flex-col gap-1.5 shadow-sm hover:shadow-emerald-500/10 hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 group-hover:text-white line-clamp-2 leading-relaxed">
                    {item.question}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Message List */
          <div className="flex-1 space-y-6 pb-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* Bot Avatar */}
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shrink-0 shadow-md ring-1 ring-emerald-400/40 mt-1">
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
                  <div className="text-sm leading-relaxed break-words [&>p]:mb-4 [&>p:last-child]:mb-0 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4">
                    {msg.content ? (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-slate-400 italic">
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                        Đang truy xuất tri thức và tổng hợp câu trả lời...
                      </span>
                    )}
                  </div>

                  {/* Sources Accordion (Only for Assistant) */}
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

        {/* 3. Input Form Area */}
        <div className="pt-2 sticky bottom-3 z-20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="relative flex items-end gap-2 p-2 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-emerald-900/40 shadow-2xl focus-within:border-emerald-500/70 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all"
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Hỏi về địa điểm, đặc sản, lịch trình du lịch Việt Nam..."
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
            Nhấn <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">Enter</kbd> để gửi, <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">Shift + Enter</kbd> để xuống dòng
          </p>
        </div>
      </main>
    </div>
  );
}
