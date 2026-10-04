'use client';

import Link from 'next/link';
import {
  MapPin,
  MessageSquare,
  Sparkles,
  Calendar,
  Map,
  TrendingUp,
  Users,
  Clock,
  Compass,
  Heart,
  Bookmark,
  Share2,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            Hệ Sinh Thái Mạng Xã Hội Du Lịch & AI Recommendation
          </div>

          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Nền Tảng Du Lịch
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Thông Minh & Cá Nhân Hóa
            </span>
          </h2>

          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-6 leading-relaxed">
            Khám phá 200 điểm đến chân thực, kết nối bạn đồng hành cùng gu, và để mô hình Machine Learning (LightFM) kết hợp cùng LLM kiến tạo lịch trình hoàn hảo cho bạn.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Gợi ý LightFM ML</span>
            </div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Khám phá Social Feed</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Travel Buddy Finder</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Tối ưu thời gian thực</span>
            </div>
          </div>
        </div>

        {/* 4 Feature Ecosystem Cards (2x2 Grid) */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Card 1: Khám Phá Điểm Đến Mạng Xã Hội */}
          <Link
            href="/places"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800/90 to-emerald-950/70 p-8 border border-slate-800 hover:border-emerald-500/50 hover:scale-[1.02] transition-all duration-300 shadow-2xl backdrop-blur-sm"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                <Compass className="w-7 h-7" />
              </div>

              <h3 className="text-2xl font-bold mb-3 group-hover:text-emerald-300 transition-colors">
                Khám Phá Điểm Đến
              </h3>

              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Feed bài đăng mạng xã hội của 200 địa điểm thật tại Hà Nội, TP.HCM và Đà Lạt. Thích, lưu wishlist, đánh giá sao và bình luận trực tiếp.
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>Tương tác Like / Save / Rate 1-5 sao</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                  <span>Bộ sưu tập Wishlist & Lọc theo tỉnh thành</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Dữ liệu tương tác nuôi dưỡng mô hình Machine Learning</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 text-emerald-400 font-semibold text-sm group-hover:gap-3 transition-all">
                <span>Khám Phá Ngay</span>
                <span className="text-xl">→</span>
              </div>
            </div>
          </Link>

          {/* Card 2: Lập Kế Hoạch Du Lịch AI */}
          <Link
            href="/trips/new"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 p-8 hover:scale-[1.02] transition-transform duration-300 shadow-2xl hover:shadow-emerald-500/40"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                <Calendar className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-2xl font-bold mb-3">Lập Lịch Trình Tự Động</h3>

              <p className="text-emerald-50 text-sm mb-6 leading-relaxed">
                Tạo lịch trình du lịch thông minh với AI. Nhập điểm đến, ngân sách và thời gian, mô hình LightFM lọc Top 50 điểm hợp gu nhất để LLM xếp lịch.
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-emerald-50">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  <span>Gợi ý cá nhân hóa dựa trên LightFM ML</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-50">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  <span>Xếp lịch thông minh theo cung đường tối ưu</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-50">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  <span>Bản đồ trực quan & timeline chi tiết</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 text-white font-semibold text-sm group-hover:gap-3 transition-all">
                <span>Tạo Lịch Trình Ngay</span>
                <span className="text-xl">→</span>
              </div>
            </div>
          </Link>

          {/* Card 3: Cộng Đồng & Travel Buddy Finder */}
          <Link
            href="/community"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800/90 to-teal-950/70 p-8 border border-slate-800 hover:border-teal-500/50 hover:scale-[1.02] transition-all duration-300 shadow-2xl backdrop-blur-sm"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center mb-6 text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all">
                <Users className="w-7 h-7" />
              </div>

              <h3 className="text-2xl font-bold mb-3 group-hover:text-teal-300 transition-colors">
                Cộng Đồng & Tìm Bạn Đồng Hành
              </h3>

              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Diễn đàn giao lưu kinh nghiệm phượt, review quán ăn. Tính năng Travel Buddy Finder tự động tìm những bạn có chung gu du lịch và mức ngân sách.
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <span>Đăng bài chia sẻ & thảo luận cộng đồng</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <span>Thuật toán so khớp bạn đồng hành (% Hợp gu)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <span>Kết nối những người cùng sở thích</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 text-teal-400 font-semibold text-sm group-hover:gap-3 transition-all">
                <span>Tham Gia Cộng Đồng</span>
                <span className="text-xl">→</span>
              </div>
            </div>
          </Link>

          {/* Card 4: Chatbot Hỏi Đáp RAG AI */}
          <Link
            href="/question-answer"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 border border-slate-800 hover:border-cyan-500/50 hover:scale-[1.02] transition-all duration-300 shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mb-6 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                <MessageSquare className="w-7 h-7" />
              </div>

              <h3 className="text-2xl font-bold mb-3 group-hover:text-cyan-300 transition-colors">
                Hỏi Đáp Du Lịch RAG AI
              </h3>

              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Trợ lý ảo thông minh trả lời mọi thắc mắc du lịch Việt Nam dựa trên kho tri thức chuyên sâu với pgvector và trích dẫn nguồn uy tín.
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>RAG với BGE-M3 embeddings chuyên biệt</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Trích dẫn tài liệu tham khảo chính xác</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Trả lời tức thì với Google Gemini AI</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 text-cyan-400 font-semibold text-sm group-hover:gap-3 transition-all">
                <span>Bắt Đầu Chat</span>
                <span className="text-xl">→</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Technical Highlights Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-400">
              <Compass className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold mb-2">Mạng Xã Hội Khép Kín</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tương tác Like/Save/Rate của người dùng trực tiếp cập nhật trọng số và huấn luyện lại mô hình học máy theo thời gian thực.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mb-4 text-teal-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold mb-2">Hybrid Machine Learning</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              LightFM kết hợp Collaborative & Content-Based Filtering với hàm mất mát WARP trong không gian tiềm ẩn 64 chiều.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 text-cyan-400">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold mb-2">Travel Buddy Matching</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Thuật toán so khớp tập đặc trưng sở thích du lịch và ngân sách giúp kết nối cộng đồng du khách lý tưởng.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-slate-800/80">
        <div className="text-center text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-400">AI Travel Planner - Mạng Xã Hội & Lập Lịch Trình Du Lịch Thông Minh</p>
          <p>Đồ Án Tốt Nghiệp • NestJS • FastAPI / LightFM ML • Next.js • PostgreSQL & pgvector</p>
        </div>
      </footer>
    </div>
  );
}
