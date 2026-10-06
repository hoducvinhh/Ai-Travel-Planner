'use client';

import Link from 'next/link';
import {
  Sparkles,
  Calendar,
  TrendingUp,
  Users,
  Clock,
  Compass,
  Heart,
  Bookmark,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9F9F8] text-[#1A1A1A]">
      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-16 pb-20 max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4FCE3] border border-[#D9F99D] text-[#365314] text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hệ sinh thái mạng xã hội du lịch & AI Recommendation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1A1A1A] mb-5 leading-tight">
            Nền tảng du lịch thông minh
            <br />
            <span className="text-[#1A1A1A]">cá nhân hoá cho riêng bạn</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Khám phá 520+ điểm đến thực tế, tìm kiếm bạn đồng hành cùng gu, và để mô hình Machine Learning kết hợp cùng AI kiến tạo lịch trình tối ưu nhất cho bạn.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs text-muted-foreground">
            <Badge variant="secondary" className="px-3 py-1 gap-1.5 font-normal">
              <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Gợi ý LightFM ML</span>
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 gap-1.5 font-normal">
              <Compass className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Khám phá Social Feed</span>
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 gap-1.5 font-normal">
              <Users className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Travel Buddy Finder</span>
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 gap-1.5 font-normal">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Tối ưu thời gian thực</span>
            </Badge>
          </div>
        </div>

        {/* 4 Feature Cards (2x2 Grid) */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Card 1: Khám Phá Điểm Đến */}
          <Link href="/places" className="group block">
            <Card className="h-full bg-white border-[#E5E7EB] hover:border-[#1A1A1A]/40 rounded-2xl p-7 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F0F0EF] text-[#1A1A1A] flex items-center justify-center mb-5 group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
                  <Compass className="w-6 h-6" />
                </div>

                <h2 className="text-xl font-bold text-[#1A1A1A] mb-2 group-hover:underline">
                  Khám phá điểm đến
                </h2>

                <p className="text-muted-foreground text-xs leading-relaxed mb-5">
                  Bảng tin mạng xã hội gồm 520+ địa điểm thực tế tại Việt Nam. Thích, lưu wishlist, đánh giá 1-5 sao và bình luận trao đổi.
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>Tương tác Thích, Lưu Wishlist, Đánh giá sao</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Bookmark className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Bộ lọc đa dạng theo 11 tỉnh thành & thể loại</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="w-3.5 h-3.5 text-[#365314]" />
                    <span>Dữ liệu tương tác giúp AI học sâu sở thích của bạn</span>
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A1A1A] pt-4 border-t border-[#E5E7EB]">
                <span>Khám phá ngay</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* Card 2: Lập Kế Hoạch Du Lịch */}
          <Link href="/trips/new" className="group block">
            <Card className="h-full bg-white border-[#E5E7EB] hover:border-[#1A1A1A]/40 rounded-2xl p-7 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F0F0EF] text-[#1A1A1A] flex items-center justify-center mb-5 group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
                  <Calendar className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-[#1A1A1A] group-hover:underline">Lập lịch trình thông minh</h2>
                  <Badge variant="lime" className="text-[10px] h-5">AI</Badge>
                </div>

                <p className="text-muted-foreground text-xs leading-relaxed mb-5">
                  Lập kế hoạch du lịch chi tiết theo từng ngày. Chọn điểm đến, ngân sách và sở thích; AI sẽ tự động tối ưu cung đường và thời gian.
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#365314]" />
                    <span>Gợi ý cá nhân hóa dựa trên học máy LightFM</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#365314]" />
                    <span>Sắp xếp lịch trình theo cung đường di chuyển tối ưu</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#365314]" />
                    <span>Bản đồ trực quan & tích hợp dự báo thời tiết</span>
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A1A1A] pt-4 border-t border-[#E5E7EB]">
                <span>Tạo lịch trình ngay</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* Card 3: Cộng Đồng & Bạn Đồng Hành */}
          <Link href="/community" className="group block">
            <Card className="h-full bg-white border-[#E5E7EB] hover:border-[#1A1A1A]/40 rounded-2xl p-7 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F0F0EF] text-[#1A1A1A] flex items-center justify-center mb-5 group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
                  <Users className="w-6 h-6" />
                </div>

                <h2 className="text-xl font-bold text-[#1A1A1A] mb-2 group-hover:underline">
                  Cộng đồng & tìm bạn du lịch
                </h2>

                <p className="text-muted-foreground text-xs leading-relaxed mb-5">
                  Diễn đàn giao lưu kinh nghiệm, review điểm đến. Tính năng Travel Buddy Finder tự động gợi ý bạn đồng hành có chung gu du lịch.
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
                    <span>Đăng bài chia sẻ & thảo luận mở với cộng đồng</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
                    <span>Thuật toán so khớp bạn đồng hành (% hợp gu)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
                    <span>Kết nối những người cùng đam mê xê dịch</span>
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A1A1A] pt-4 border-t border-[#E5E7EB]">
                <span>Tham gia cộng đồng</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* Card 4: Hỏi Đáp RAG AI */}
          <Link href="/question-answer" className="group block">
            <Card className="h-full bg-white border-[#E5E7EB] hover:border-[#1A1A1A]/40 rounded-2xl p-7 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F0F0EF] text-[#1A1A1A] flex items-center justify-center mb-5 group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
                  <MessageSquare className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-[#1A1A1A] group-hover:underline">
                    Hỏi đáp du lịch RAG AI
                  </h2>
                  <Badge variant="lime" className="text-[10px] h-5">RAG</Badge>
                </div>

                <p className="text-muted-foreground text-xs leading-relaxed mb-5">
                  Trợ lý thông minh giải đáp mọi thắc mắc du lịch Việt Nam dựa trên kho tri thức chuyên sâu với pgvector và trích dẫn nguồn uy tín.
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
                    <span>RAG kết hợp BGE-M3 multilingual embeddings</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
                    <span>Trích dẫn tài liệu và nguồn tham khảo rõ ràng</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
                    <span>Khám phá 10 chủ đề du lịch đặc sắc nhanh chóng</span>
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A1A1A] pt-4 border-t border-[#E5E7EB]">
                <span>Bắt đầu trò chuyện</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>
        </div>

        {/* Technical Highlights Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          <Card className="p-5 bg-white border-[#E5E7EB] rounded-2xl shadow-2xs">
            <CardContent className="p-0">
              <div className="w-10 h-10 rounded-xl bg-[#F0F0EF] text-[#1A1A1A] flex items-center justify-center mb-3">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#1A1A1A] mb-1">Mạng xã hội khép kín</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tương tác Like/Save/Rate của người dùng trực tiếp cập nhật trọng số để tái huấn luyện mô hình học máy liên tục.
              </p>
            </CardContent>
          </Card>

          <Card className="p-5 bg-white border-[#E5E7EB] rounded-2xl shadow-2xs">
            <CardContent className="p-0">
              <div className="w-10 h-10 rounded-xl bg-[#F0F0EF] text-[#1A1A1A] flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#1A1A1A] mb-1">Hybrid Machine Learning</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                LightFM kết hợp Collaborative & Content-Based Filtering với hàm mất mát WARP trong không gian tiềm ẩn 64 chiều.
              </p>
            </CardContent>
          </Card>

          <Card className="p-5 bg-white border-[#E5E7EB] rounded-2xl shadow-2xs">
            <CardContent className="p-0">
              <div className="w-10 h-10 rounded-xl bg-[#F0F0EF] text-[#1A1A1A] flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#1A1A1A] mb-1">Travel Buddy Matching</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Thuật toán so khớp tập đặc trưng sở thích du lịch và ngân sách giúp kết nối cộng đồng bạn đồng hành lý tưởng.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] bg-white py-8">
        <div className="container mx-auto px-4 max-w-6xl text-center text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-[#1A1A1A]">
            AI Travel Planner • Lập Kế Hoạch Du Lịch Thông Minh
          </p>
          <p>
            Đồ Án Tốt Nghiệp • NestJS • FastAPI / LightFM ML • Next.js • PostgreSQL & pgvector
          </p>
        </div>
      </footer>
    </div>
  );
}
