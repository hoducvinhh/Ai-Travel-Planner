'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  ChevronLeft,
  ChevronRight,
  Route,
  ShieldCheck,
} from 'lucide-react';

import { FEATURED_DESTINATION_BANNERS, VIETNAM_PROVINCES } from '@/lib/provinces';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const QUICK_CHIPS = [
  { label: 'Đà Lạt', province: 'Lam Dong' },
  { label: 'Sa Pa', province: 'Lao Cai' },
  { label: 'Hạ Long', province: 'Quang Ninh' },
  { label: 'Hội An', province: 'Quang Nam' },
  { label: 'Ninh Bình', province: 'Ninh Binh' },
  { label: 'Phú Quốc', province: 'Kien Giang' },
];

// Keep the 10 distinct Vietnam province photos in the visual discovery grid (no duplicate imagery)
const DISCOVERY_PROVINCES = VIETNAM_PROVINCES.filter((p) => p.key !== 'Ho Chi Minh');

const WORKFLOW_STEPS = [
  {
    step: '01',
    icon: Compass,
    title: 'Chia sẻ gu & ngân sách',
    desc: 'Chọn tỉnh thành muốn đến, số ngày dự kiến, ngân sách và sở thích du lịch cá nhân.',
  },
  {
    step: '02',
    icon: Route,
    title: 'AI sắp lịch 3 buổi & chấm OFS',
    desc: 'Mô hình gợi ý sắp xếp lộ trình Sáng / Chiều / Tối tối ưu vị trí GPS và đánh giá tính khả thi 5 chiều.',
  },
  {
    step: '03',
    icon: Users,
    title: 'Khám phá bản đồ & rủ bạn đi',
    desc: 'Theo dõi đường đi OSRM, thời tiết trực tiếp và chia sẻ lên cộng đồng để tìm Travel Buddy 1-1.',
  },
];

export default function Home() {
  const router = useRouter();
  const [quickSearch, setQuickSearch] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHoveringHero, setIsHoveringHero] = useState(false);

  const bannerCount = FEATURED_DESTINATION_BANNERS.length;
  const currentBanner = FEATURED_DESTINATION_BANNERS[activeSlide] || FEATURED_DESTINATION_BANNERS[0];

  useEffect(() => {
    if (isHoveringHero) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % bannerCount);
    }, 6000);
    return () => clearInterval(timer);
  }, [bannerCount, isHoveringHero]);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      router.push(`/places?search=${encodeURIComponent(quickSearch.trim())}`);
    } else {
      router.push('/places');
    }
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + bannerCount) % bannerCount);
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % bannerCount);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      <main className="flex-1 container mx-auto px-4 pt-6 sm:pt-8 pb-20 max-w-7xl">
        {/* 1. Editorial Hero Showcase */}
        <section
          aria-label="Điểm đến nổi bật tại Việt Nam"
          onMouseEnter={() => setIsHoveringHero(true)}
          onMouseLeave={() => setIsHoveringHero(false)}
          className="relative overflow-hidden rounded-3xl border border-[#E2E8F0] bg-[#0F172A] min-h-[470px] lg:min-h-[530px] flex items-center shadow-sm"
        >
          {/* Crisp rotating 1376x768 editorial destination photos */}
          {FEATURED_DESTINATION_BANNERS.map((banner, idx) => (
            <div
              key={banner.provinceKey}
              className={`absolute inset-0 transition-opacity duration-700 ${
                idx === activeSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                priority={idx === 0}
                quality={95}
                sizes="(max-width: 768px) 100vw, 1280px"
                className="object-cover object-center"
              />
            </div>
          ))}

          {/* High-contrast directional slate/teal scrim */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/92 via-[#0F172A]/68 to-[#0F172A]/25"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/75 via-transparent to-transparent"
          />

          {/* Hero Content */}
          <div className="relative z-10 w-full px-6 py-10 sm:px-10 md:px-14 lg:py-14 flex flex-col justify-between gap-8">
            <div className="max-w-2xl">
              {/* Active Location Pill */}
              <Link
                href={`/places?province=${encodeURIComponent(currentBanner.provinceKey)}`}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/14 hover:bg-white/22 backdrop-blur-md border border-white/25 text-white text-xs font-medium mb-5 transition"
              >
                <MapPin className="w-3.5 h-3.5 text-[#14B8A6]" />
                <span>{currentBanner.regionLabel}</span>
                <span className="text-white/50">•</span>
                <span className="text-teal-200">{currentBanner.title}</span>
              </Link>

              <h1 className="text-3xl sm:text-4xl lg:text-[3.1rem] font-bold tracking-[-0.025em] text-white mb-4 leading-[1.14] text-balance">
                Khám phá Việt Nam &amp; lập lịch trình thông minh cùng AI
              </h1>

              <p className="text-sm sm:text-base text-slate-200 max-w-xl mb-7 leading-relaxed">
                {currentBanner.subtitle} Tìm kiếm hơn 500 điểm đến thực tế, tối ưu cung đường từng buổi và kết nối bạn đồng hành hợp gu.
              </p>

              {/* Quick Search Bar integrated in Hero */}
              <form
                onSubmit={handleQuickSearch}
                className="bg-white p-1.5 rounded-2xl shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4 border border-white/40"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    type="text"
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                    aria-label="Tìm kiếm điểm đến"
                    placeholder="Bạn muốn đi đâu? (Đà Lạt, Sa Pa, Hội An...)"
                    className="pl-10 h-10 border-none bg-transparent text-sm text-[#0F172A] placeholder-[#94A3B8] focus-visible:ring-0 shadow-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-semibold gap-1.5 cursor-pointer shrink-0"
                >
                  <span>Tìm điểm đến</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </form>

              {/* Quick Province Chips + Hero Primary CTA */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-slate-300 font-medium mr-1">Gợi ý:</span>
                  {QUICK_CHIPS.map((chip) => (
                    <Link
                      key={chip.province}
                      href={`/places?province=${encodeURIComponent(chip.province)}`}
                      className="px-2.5 py-1 rounded-full bg-white/12 hover:bg-[#0D9488] border border-white/20 hover:border-[#0D9488] text-white text-[11px] font-medium transition-colors backdrop-blur-xs"
                    >
                      {chip.label}
                    </Link>
                  ))}
                </div>

                <div className="flex items-center gap-2.5">
                  <Button
                    asChild
                    size="sm"
                    className="h-9 px-4 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-semibold gap-1.5 shadow-md"
                  >
                    <Link href="/trips/new">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Tạo lịch trình AI</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Bottom Carousel Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-white/15">
              <div className="flex items-center gap-1.5">
                {FEATURED_DESTINATION_BANNERS.map((banner, idx) => (
                  <button
                    key={banner.provinceKey}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    aria-label={`Xem ảnh ${banner.title}`}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === activeSlide
                        ? 'w-7 bg-[#14B8A6]'
                        : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  aria-label="Ảnh điểm đến trước"
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  aria-label="Ảnh điểm đến tiếp theo"
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-xs"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Visual Province Discovery Grid */}
        <section className="mt-12 sm:mt-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                Điểm đến nổi bật khắp Việt Nam
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                Chọn điểm đến để xem tọa độ thực tế, đánh giá cộng đồng, giá vé &amp; dự báo thời tiết
              </p>
            </div>
            <Link
              href="/places"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D9488] hover:text-[#0F766E] transition shrink-0"
            >
              <span>Xem tất cả địa điểm</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {DISCOVERY_PROVINCES.map((province) => (
              <Link
                key={province.key}
                href={`/places?province=${encodeURIComponent(province.key)}`}
                className="group relative aspect-[16/10] rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#0F172A] block shadow-2xs"
              >
                <Image
                  src={province.image}
                  alt={province.label}
                  fill
                  quality={95}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/85 via-[#0F172A]/25 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-3.5">
                  <div className="text-sm font-bold text-white leading-tight group-hover:text-[#5EEAD4] transition-colors">
                    {province.shortLabel}
                  </div>
                  <div className="text-[11px] text-slate-200/90 mt-0.5 line-clamp-1">
                    {province.tagline}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Action Hub Bento (Mobile-inspired hierarchy) */}
        <section className="mt-12 sm:mt-14">
          <div className="mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
              Lên kế hoạch &amp; Trợ lý du lịch
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Mọi công cụ cần thiết cho một chuyến đi tự túc chỉn chu từ lúc lên ý tưởng tới khi khởi hành
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-5 items-stretch">
            {/* Left Primary AI Planner Card (7 cols) */}
            <Link href="/trips/new" className="lg:col-span-7 group block">
              <Card className="h-full bg-[#0D9488] text-white border-[#0D9488] rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-transform duration-200 group-hover:-translate-y-0.5 shadow-sm overflow-hidden">
                <div className="grid md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-7">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 text-white flex items-center justify-center">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <Badge variant="outline" className="bg-white text-[#0D9488] border-white text-[10px] font-semibold">
                        AI Planner
                      </Badge>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold mb-2.5 leading-snug">
                      Tạo lịch trình AI thông minh
                    </h3>

                    <p className="text-teal-50 text-xs sm:text-sm leading-relaxed mb-5">
                      Chọn tour một tỉnh hoặc liên tỉnh, ngân sách và gu cá nhân. Hệ thống chia 3 buổi Sáng / Chiều / Tối hợp lý và tối ưu quãng đường di chuyển.
                    </p>

                    <div className="space-y-2 text-xs text-teal-50 mb-5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                        <span>Tối ưu lộ trình theo tọa độ địa lý (OSRM)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-white shrink-0" />
                        <span>Chấm điểm tính khả thi 5 chiều (OFS)</span>
                      </div>
                    </div>
                  </div>

                  {/* Crisp visual route-planning illustration framed cleanly */}
                  <div className="md:col-span-5">
                    <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-white/25 bg-white shadow-md">
                      <Image
                        src="/images/illustrations/empty_trips.jpg"
                        alt="Minh họa lập kế hoạch lịch trình AI"
                        fill
                        quality={95}
                        sizes="(max-width: 768px) 100vw, 280px"
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-white pt-4 mt-4 border-t border-white/20">
                  <span>Bắt đầu tạo lịch trình ngay</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>

            {/* Right Stack of 3 Concise Tool Cards (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-3.5">
              <Link href="/places" className="group block flex-1">
                <Card className="h-full bg-white border-[#E2E8F0] hover:border-[#0D9488] rounded-2xl p-5 flex items-center gap-4 transition-colors shadow-2xs">
                  <div className="w-12 h-12 rounded-2xl bg-[#F0FDFA] border border-[#99F6E4] text-[#0D9488] flex items-center justify-center shrink-0 group-hover:bg-[#0D9488] group-hover:text-white group-hover:border-[#0D9488] transition-colors">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-sm sm:text-base font-bold text-[#0F172A] group-hover:text-[#0D9488] transition-colors truncate">
                        Khám phá 500+ điểm đến
                      </h3>
                      <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0D9488] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                    <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                      Lọc theo tỉnh thành &amp; thể loại, chấm sao, lưu Wishlist và xem chỉ đường kèm thời tiết.
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-[#64748B]">
                      <span className="inline-flex items-center gap-1">
                        <Heart className="w-3 h-3 text-[#FF6B6B]" /> Thích &amp; Đánh giá
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Bookmark className="w-3 h-3 text-[#F59E0B]" /> Wishlist nhanh
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/community" className="group block flex-1">
                <Card className="h-full bg-white border-[#E2E8F0] hover:border-[#0D9488] rounded-2xl p-5 flex items-center gap-4 transition-colors shadow-2xs">
                  <div className="w-12 h-12 rounded-2xl bg-[#F0FDFA] border border-[#99F6E4] text-[#0D9488] flex items-center justify-center shrink-0 group-hover:bg-[#0D9488] group-hover:text-white group-hover:border-[#0D9488] transition-colors">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-sm sm:text-base font-bold text-[#0F172A] group-hover:text-[#0D9488] transition-colors truncate">
                        Cộng đồng &amp; Travel Buddy 1-1
                      </h3>
                      <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0D9488] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                    <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                      Đọc review thực tế, nhân bản lịch trình cộng đồng chỉ với 1 chạm và chat tìm bạn đồng hành.
                    </p>
                  </div>
                </Card>
              </Link>

              <Link href="/question-answer" className="group block flex-1">
                <Card className="h-full bg-white border-[#E2E8F0] hover:border-[#0D9488] rounded-2xl p-5 flex items-center gap-4 transition-colors shadow-2xs">
                  <div className="w-12 h-12 rounded-2xl bg-[#F0FDFA] border border-[#99F6E4] text-[#0D9488] flex items-center justify-center shrink-0 group-hover:bg-[#0D9488] group-hover:text-white group-hover:border-[#0D9488] transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-[#0F172A] group-hover:text-[#0D9488] transition-colors truncate">
                          Hỏi đáp du lịch AI (RAG)
                        </h3>
                        <Badge variant="amber" className="text-[10px] shrink-0">Trợ lý AI</Badge>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0D9488] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                    <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                      Hỏi đáp về giá vé, giờ mở cửa, kinh nghiệm bản địa có trích dẫn nguồn tài liệu tin cậy.
                    </p>
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* 4. 3-Step Flow Strip */}
        <section className="mt-12 sm:mt-14 bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
                Quy trình tạo chuyến đi cá nhân hóa trong 3 bước
              </h2>
            </div>
            <span className="text-xs text-[#64748B]">Kết hợp LightFM + tối ưu lộ trình</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {WORKFLOW_STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] border border-[#99F6E4] text-[#0D9488] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono font-bold text-[#0D9488] mb-0.5">
                      BƯỚC {item.step}
                    </div>
                    <h3 className="text-sm font-bold text-[#0F172A] mb-1">{item.title}</h3>
                    <p className="text-xs text-[#64748B] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white py-8">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0D9488] text-white flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-[#0F172A]">AI Travel Planner</span>
            <span className="text-[#CBD5E1]">|</span>
            <span>Nền tảng lập kế hoạch du lịch thông minh</span>
          </div>

          <div className="flex items-center gap-5 text-xs text-[#64748B]">
            <Link href="/places" className="hover:text-[#0D9488] transition">Khám phá</Link>
            <Link href="/trips/new" className="hover:text-[#0D9488] transition">Tạo lịch trình</Link>
            <Link href="/community" className="hover:text-[#0D9488] transition">Cộng đồng</Link>
            <Link href="/question-answer" className="hover:text-[#0D9488] transition">Hỏi đáp AI</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
