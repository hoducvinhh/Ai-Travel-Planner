'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Calendar,
  Compass,
  Users,
  Search,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Bookmark,
  Heart,
  MessageSquare,
  ShieldCheck,
  Plane,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const POPULAR_DESTINATIONS = [
  { name: 'Đà Lạt', query: 'Đà Lạt' },
  { name: 'Sa Pa', query: 'Sa Pa' },
  { name: 'Đà Nẵng', query: 'Đà Nẵng' },
  { name: 'Hội An', query: 'Hội An' },
  { name: 'Ninh Bình', query: 'Ninh Bình' },
  { name: 'Phú Quốc', query: 'Phú Quốc' },
];

export default function Home() {
  const router = useRouter();
  const [quickSearch, setQuickSearch] = useState('');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      router.push(`/places?search=${encodeURIComponent(quickSearch.trim())}`);
    } else {
      router.push('/places');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F8] text-[#1A1A1A]">
      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-16 pb-20 max-w-6xl">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <Badge
            variant="lime"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium mb-6 shadow-2xs border-[#D9F99D]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#365314]" />
            <span>Nền tảng du lịch thông minh & gợi ý cá nhân hóa</span>
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1A1A1A] mb-5 leading-tight">
            Nền tảng du lịch thông minh
            <br />
            <span className="text-neutral-500 font-semibold">cá nhân hoá cho riêng bạn</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Khám phá các điểm đến thực tế, kết nối bạn đồng hành cùng gu, và để AI kiến tạo lịch trình tối ưu từng buổi cho chuyến đi của bạn.
          </p>

          {/* Quick Search & Actions Box */}
          <div className="max-w-2xl mx-auto mb-8 bg-white p-2.5 sm:p-3 rounded-2xl sm:rounded-full border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative flex-1 w-full pl-2">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuickSearch(e)}
                placeholder="Bạn muốn đi đâu? (Đà Lạt, Sa Pa, Hội An...)"
                className="pl-10 h-10 border-none bg-transparent text-sm focus-visible:ring-0 shadow-none"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button
                onClick={handleQuickSearch}
                className="h-10 px-5 rounded-full bg-[#1A1A1A] hover:bg-[#2C2C2C] text-white text-xs font-semibold gap-1.5 shadow-xs w-full sm:w-auto"
              >
                <span>Tìm kiếm</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Popular Destination Quick Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="text-neutral-400 font-medium mr-1">Điểm đến gợi ý:</span>
            {POPULAR_DESTINATIONS.map((dest) => (
              <Link
                key={dest.name}
                href={`/places?search=${encodeURIComponent(dest.query)}`}
                className="px-3 py-1 rounded-full bg-white hover:bg-neutral-100 border border-[#E5E7EB] text-[#1A1A1A] text-xs font-medium transition-colors shadow-2xs"
              >
                {dest.name}
              </Link>
            ))}
          </div>
        </div>

        {/* 4 Feature Cards (2x2 Grid) */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Card 1: Khám Phá Điểm Đến */}
          <Link href="/places" className="group block">
            <Card className="h-full bg-white border-[#E5E7EB] hover:border-[#1A1A1A]/40 rounded-3xl p-8 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#F5F5F4] border border-[#E5E7EB] text-[#1A1A1A] flex items-center justify-center mb-6 group-hover:bg-[#1A1A1A] group-hover:text-white transition-all duration-200">
                  <Compass className="w-6 h-6" />
                </div>

                <h2 className="text-xl font-bold text-[#1A1A1A] mb-2 group-hover:underline flex items-center justify-between">
                  <span>Khám phá điểm đến</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[#1A1A1A] group-hover:translate-x-1 transition-all" />
                </h2>

                <p className="text-muted-foreground text-xs leading-relaxed mb-6">
                  Bảng tin mạng xã hội chia sẻ địa điểm thực tế tại Việt Nam. Thích, lưu wishlist, đánh giá và bình luận trao đổi.
                </p>

                <div className="space-y-2.5 mb-6">
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
                    <span>Dữ liệu tương tác giúp gợi ý chuẩn xác theo gu bạn</span>
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A1A1A] pt-4 border-t border-[#F0F0EF]">
                <span>Khám phá ngay</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* Card 2: Lập Kế Hoạch Du Lịch */}
          <Link href="/trips/new" className="group block">
            <Card className="h-full bg-white border-[#E5E7EB] hover:border-[#1A1A1A]/40 rounded-3xl p-8 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#F5F5F4] border border-[#E5E7EB] text-[#1A1A1A] flex items-center justify-center mb-6 group-hover:bg-[#1A1A1A] group-hover:text-white transition-all duration-200">
                  <Calendar className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-[#1A1A1A] group-hover:underline">Lập lịch trình thông minh</h2>
                  <Badge variant="lime" className="text-[10px] h-5">AI</Badge>
                </div>

                <p className="text-muted-foreground text-xs leading-relaxed mb-6">
                  Lập kế hoạch du lịch chi tiết theo từng ngày. Chọn điểm đến, ngân sách và sở thích; AI sẽ tự động tối ưu cung đường và thời gian.
                </p>

                <div className="space-y-2.5 mb-6">
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

              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A1A1A] pt-4 border-t border-[#F0F0EF]">
                <span>Tạo lịch trình ngay</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* Card 3: Cộng Đồng & Bạn Đồng Hành */}
          <Link href="/community" className="group block">
            <Card className="h-full bg-white border-[#E5E7EB] hover:border-[#1A1A1A]/40 rounded-3xl p-8 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#F5F5F4] border border-[#E5E7EB] text-[#1A1A1A] flex items-center justify-center mb-6 group-hover:bg-[#1A1A1A] group-hover:text-white transition-all duration-200">
                  <Users className="w-6 h-6" />
                </div>

                <h2 className="text-xl font-bold text-[#1A1A1A] mb-2 group-hover:underline">
                  Cộng đồng & tìm bạn du lịch
                </h2>

                <p className="text-muted-foreground text-xs leading-relaxed mb-6">
                  Diễn đàn giao lưu kinh nghiệm, review điểm đến thực tế. Tính năng Travel Buddy tự động gợi ý bạn đồng hành có chung gu xê dịch.
                </p>

                <div className="space-y-2.5 mb-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#365314]" />
                    <span>Đăng bài chia sẻ & thảo luận mở với cộng đồng</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#365314]" />
                    <span>Gợi ý bạn đồng hành cùng gu và lịch trình</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#365314]" />
                    <span>Kết nối những người cùng đam mê xê dịch</span>
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A1A1A] pt-4 border-t border-[#F0F0EF]">
                <span>Tham gia cộng đồng</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* Card 4: Hỏi Đáp Thông Minh */}
          <Link href="/question-answer" className="group block">
            <Card className="h-full bg-white border-[#E5E7EB] hover:border-[#1A1A1A]/40 rounded-3xl p-8 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#F5F5F4] border border-[#E5E7EB] text-[#1A1A1A] flex items-center justify-center mb-6 group-hover:bg-[#1A1A1A] group-hover:text-white transition-all duration-200">
                  <MessageSquare className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-[#1A1A1A] group-hover:underline">
                    Hỏi đáp du lịch thông minh
                  </h2>
                  <Badge variant="lime" className="text-[10px] h-5">Trợ lý AI</Badge>
                </div>

                <p className="text-muted-foreground text-xs leading-relaxed mb-6">
                  Trợ lý thông minh giải đáp mọi thắc mắc du lịch Việt Nam với dữ liệu tin cậy và trích dẫn nguồn uy tín.
                </p>

                <div className="space-y-2.5 mb-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#365314]" />
                    <span>Tra cứu nhanh lộ trình, thời tiết và đặc sản địa phương</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#365314]" />
                    <span>Trích dẫn cẩm nang du lịch và nguồn tham khảo rõ ràng</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#365314]" />
                    <span>Khám phá các chủ đề du lịch đặc sắc nhanh chóng</span>
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A1A1A] pt-4 border-t border-[#F0F0EF]">
                <span>Bắt đầu trò chuyện</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>
        </div>

        {/* Value Highlights Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          <Card className="p-6 bg-white border-[#E5E7EB] rounded-2xl shadow-2xs">
            <CardContent className="p-0">
              <div className="w-10 h-10 rounded-xl bg-[#F5F5F4] border border-[#E5E7EB] text-[#1A1A1A] flex items-center justify-center mb-3.5">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#1A1A1A] mb-1.5">Cộng đồng thực tế</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tương tác và chia sẻ kinh nghiệm thực tế từ các chuyến đi của cộng đồng du lịch khắp Việt Nam.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 bg-white border-[#E5E7EB] rounded-2xl shadow-2xs">
            <CardContent className="p-0">
              <div className="w-10 h-10 rounded-xl bg-[#F5F5F4] border border-[#E5E7EB] text-[#1A1A1A] flex items-center justify-center mb-3.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#1A1A1A] mb-1.5">Gợi ý cá nhân hóa</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Hệ thống AI phân tích sở thích và thói quen du lịch để gợi ý điểm đến phù hợp nhất với bạn.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 bg-white border-[#E5E7EB] rounded-2xl shadow-2xs">
            <CardContent className="p-0">
              <div className="w-10 h-10 rounded-xl bg-[#F5F5F4] border border-[#E5E7EB] text-[#1A1A1A] flex items-center justify-center mb-3.5">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#1A1A1A] mb-1.5">Tìm bạn đồng hành</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Kết nối với những người bạn có cùng gu du lịch, thời gian rảnh và ngân sách chuyến đi.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] bg-white py-10">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1A1A1A] text-white flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-[#1A1A1A]">AI Travel Planner</span>
            <span className="text-neutral-300">|</span>
            <span>Nền tảng lập kế hoạch du lịch thông minh</span>
          </div>

          <div className="flex items-center gap-5 text-xs text-neutral-600">
            <Link href="/places" className="hover:text-[#1A1A1A] transition">Khám phá</Link>
            <Link href="/trips/new" className="hover:text-[#1A1A1A] transition">Tạo lịch trình</Link>
            <Link href="/community" className="hover:text-[#1A1A1A] transition">Cộng đồng</Link>
            <Link href="/question-answer" className="hover:text-[#1A1A1A] transition">Hỏi đáp AI</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
