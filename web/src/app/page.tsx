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
            <span>Nền tảng du lịch thông minh & gợi ý cá nhân hóa</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1A1A1A] mb-5 leading-tight">
            Nền tảng du lịch thông minh
            <br />
            <span className="text-[#1A1A1A]">cá nhân hoá cho riêng bạn</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Khám phá các điểm đến thực tế, kết nối bạn đồng hành cùng gu, và để AI kiến tạo lịch trình tối ưu nhất cho chuyến đi của bạn.
          </p>
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
                  Bảng tin mạng xã hội chia sẻ địa điểm thực tế tại Việt Nam. Thích, lưu wishlist, đánh giá và bình luận trao đổi.
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
                    <span>Gợi ý cá nhân hóa theo sở thích của bạn</span>
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
                    Hỏi đáp du lịch thông minh
                  </h2>
                  <Badge variant="lime" className="text-[10px] h-5">Trợ lý AI</Badge>
                </div>

                <p className="text-muted-foreground text-xs leading-relaxed mb-5">
                  Trợ lý thông minh giải đáp mọi thắc mắc du lịch Việt Nam với dữ liệu tin cậy và trích dẫn nguồn uy tín.
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
                    <span>Tra cứu nhanh lộ trình, thời tiết và đặc sản địa phương</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
                    <span>Trích dẫn tài liệu và nguồn tham khảo rõ ràng</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
                    <span>Khám phá các chủ đề du lịch đặc sắc nhanh chóng</span>
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

        {/* Value Highlights Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          <Card className="p-5 bg-white border-[#E5E7EB] rounded-2xl shadow-2xs">
            <CardContent className="p-0">
              <div className="w-10 h-10 rounded-xl bg-[#F0F0EF] text-[#1A1A1A] flex items-center justify-center mb-3">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#1A1A1A] mb-1">Cộng đồng thực tế</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tương tác và chia sẻ kinh nghiệm thực tế từ các chuyến đi của cộng đồng du lịch khắp Việt Nam.
              </p>
            </CardContent>
          </Card>

          <Card className="p-5 bg-white border-[#E5E7EB] rounded-2xl shadow-2xs">
            <CardContent className="p-0">
              <div className="w-10 h-10 rounded-xl bg-[#F0F0EF] text-[#1A1A1A] flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#1A1A1A] mb-1">Gợi ý cá nhân hóa</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Hệ thống AI phân tích sở thích và thói quen du lịch để gợi ý điểm đến phù hợp nhất với bạn.
              </p>
            </CardContent>
          </Card>

          <Card className="p-5 bg-white border-[#E5E7EB] rounded-2xl shadow-2xs">
            <CardContent className="p-0">
              <div className="w-10 h-10 rounded-xl bg-[#F0F0EF] text-[#1A1A1A] flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#1A1A1A] mb-1">Tìm bạn đồng hành</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Kết nối với những người bạn có cùng gu du lịch, thời gian rảnh và ngân sách chuyến đi.
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
            Nền tảng hỗ trợ trải nghiệm du lịch cá nhân hóa cho người Việt
          </p>
        </div>
      </footer>
    </div>
  );
}
