'use client';

import Link from 'next/link';
import { MapPin, MessageSquare, Sparkles, Calendar, Map, TrendingUp, Users, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                AI Travel Planner
              </h1>
              <p className="text-xs text-slate-400">Trợ lý du lịch thông minh</p>
            </div>
          </div>

          <Link
            href="/trips"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/50 transition text-sm font-medium"
          >
            <Calendar className="w-4 h-4" />
            <span>Xem Lịch Trình</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            Powered by Machine Learning & LLM
          </div>

          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Lên Kế Hoạch Du Lịch
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Thông Minh & Cá Nhân Hóa
            </span>
          </h2>

          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-4">
            Hệ thống AI kết hợp Machine Learning và Large Language Model để tạo lịch trình du lịch
            hoàn hảo dựa trên sở thích và ngân sách của bạn
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Gợi ý thông minh</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Cá nhân hóa</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Tiết kiệm thời gian</span>
            </div>
          </div>
        </div>

        {/* Main Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Travel Planner Card */}
          <Link
            href="/trips/new"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 p-8 hover:scale-105 transition-transform duration-300 shadow-2xl hover:shadow-emerald-500/50"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-3xl font-bold mb-3">Lập Kế Hoạch Du Lịch</h3>

              <p className="text-emerald-50 mb-6 leading-relaxed">
                Tạo lịch trình du lịch tự động với AI. Chỉ cần nhập điểm đến, ngân sách và sở thích,
                hệ thống sẽ gợi ý lịch trình chi tiết theo từng ngày.
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-emerald-50">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  <span>Gợi ý địa điểm dựa trên ML</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-emerald-50">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  <span>Xếp lịch thông minh với LLM</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-emerald-50">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  <span>Bản đồ trực quan & timeline</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all">
                <span>Bắt Đầu Ngay</span>
                <span className="text-2xl">→</span>
              </div>
            </div>
          </Link>

          {/* Chatbot RAG Card */}
          <Link
            href="/question-answer"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-8 border border-slate-700 hover:border-emerald-500/50 hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center mb-6 group-hover:bg-emerald-900/50 transition-colors">
                <MessageSquare className="w-8 h-8 text-emerald-400" />
              </div>

              <h3 className="text-3xl font-bold mb-3">Hỏi Đáp Du Lịch</h3>

              <p className="text-slate-300 mb-6 leading-relaxed">
                Chat với AI về bất kỳ thông tin du lịch Việt Nam nào. Hệ thống RAG với pgvector
                giúp trả lời chính xác dựa trên kho tri thức chuyên sâu.
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>RAG với BGE-M3 embeddings</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Trích dẫn nguồn tự động</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Streaming response real-time</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 text-emerald-400 font-semibold group-hover:gap-3 transition-all">
                <span>Bắt Đầu Chat</span>
                <span className="text-2xl">→</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
              <Map className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="text-lg font-bold mb-2">Bản Đồ Tương Tác</h4>
            <p className="text-sm text-slate-400">
              Leaflet map với markers, routing và clustering địa điểm thông minh
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="text-lg font-bold mb-2">Hybrid ML Model</h4>
            <p className="text-sm text-slate-400">
              LightFM kết hợp Collaborative & Content-Based Filtering
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="text-lg font-bold mb-2">Cá Nhân Hóa</h4>
            <p className="text-sm text-slate-400">
              Học từ hành vi người dùng để đưa ra gợi ý ngày càng chính xác
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-slate-800">
        <div className="text-center text-sm text-slate-500">
          <p>AI Travel Planner - Đồ Án Tốt Nghiệp</p>
          <p className="mt-1">Powered by NestJS • Python ML • Next.js • PostgreSQL</p>
        </div>
      </footer>
    </div>
  );
}
