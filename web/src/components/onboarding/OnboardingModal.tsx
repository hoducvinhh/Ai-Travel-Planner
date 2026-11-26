'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  Sparkles,
  Check,
  Loader2,
  Compass,
  Landmark,
  Trees,
  Utensils,
  Waves,
  Camera,
  Mountain,
  PartyPopper,
  User,
  Heart,
  Users,
  Wallet,
  CreditCard,
  Gem,
  ArrowRight,
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

interface StyleOption {
  id: string;
  name: string;
  desc: string;
  icon: React.ElementType;
}

const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'culture',
    name: 'Văn hóa & Lịch sử',
    desc: 'Bảo tàng, di tích, đền chùa, phố cổ, làng nghề',
    icon: Landmark,
  },
  {
    id: 'nature',
    name: 'Thiên nhiên & Sinh thái',
    desc: 'Rừng núi, thác nước, thung lũng, cắm trại',
    icon: Trees,
  },
  {
    id: 'food',
    name: 'Ẩm thực & Đặc sản',
    desc: 'Chợ đêm, street food, món ngon bản địa, cafe view đẹp',
    icon: Utensils,
  },
  {
    id: 'relax',
    name: 'Nghỉ dưỡng & Biển đảo',
    desc: 'Resort, tắm khoáng onsen, bãi biển, spa thư giãn',
    icon: Waves,
  },
  {
    id: 'photography',
    name: 'Check-in & Sống ảo',
    desc: 'Cung đường view đẹp, quán cafe săn mây, kiến trúc độc lạ',
    icon: Camera,
  },
  {
    id: 'adventure',
    name: 'Khám phá & Mạo hiểm',
    desc: 'Trekking leo núi, chèo SUP, khám phá hang động',
    icon: Mountain,
  },
  {
    id: 'nightlife',
    name: 'Vui chơi & Giải trí',
    desc: 'Công viên chủ đề, trò chơi cảm giác mạnh, phố đi bộ, bar pub',
    icon: PartyPopper,
  },
];

interface CompanionOption {
  id: string;
  name: string;
  desc: string;
  icon: React.ElementType;
}

const COMPANION_OPTIONS: CompanionOption[] = [
  {
    id: 'solo',
    name: 'Đi một mình (Solo)',
    desc: 'Tự do, linh hoạt, trải nghiệm không gian cá nhân',
    icon: User,
  },
  {
    id: 'couple',
    name: 'Cặp đôi (Couple)',
    desc: 'Lãng mạn, riêng tư, nhẹ nhàng và thư giãn',
    icon: Heart,
  },
  {
    id: 'family',
    name: 'Gia đình (Family)',
    desc: 'An toàn, khuôn viên thoáng mát, phù hợp trẻ nhỏ và người lớn tuổi',
    icon: Users,
  },
  {
    id: 'friends',
    name: 'Nhóm bạn bè (Friends)',
    desc: 'Sôi động, trải nghiệm tập thể, vui chơi ăn uống',
    icon: Users,
  },
];

interface BudgetOption {
  id: string;
  name: string;
  range: string;
  desc: string;
  icon: React.ElementType;
}

const BUDGET_OPTIONS: BudgetOption[] = [
  {
    id: 'budget',
    name: 'Tiết kiệm (Budget)',
    range: '< 500k / ngày',
    desc: 'Ưu tiên điểm miễn phí hoặc giá rẻ, homestay bình dân',
    icon: Wallet,
  },
  {
    id: 'standard',
    name: 'Tiêu chuẩn (Standard)',
    range: '500k - 1.5tr / ngày',
    desc: 'Chi tiêu cân bằng, trải nghiệm ẩm thực và dịch vụ vừa đủ',
    icon: CreditCard,
  },
  {
    id: 'luxury',
    name: 'Cao cấp (Luxury)',
    range: '> 1.5tr / ngày',
    desc: 'Trải nghiệm nghỉ dưỡng sang trọng, vé VIP, resort 4-5 sao',
    icon: Gem,
  },
];

export default function OnboardingModal() {
  const { user, isAuthenticated, isLoading, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedCompanion, setSelectedCompanion] = useState<string>('friends');
  const [selectedBudget, setSelectedBudget] = useState<string>('standard');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Kiểm tra xem người dùng đã hoàn thành khảo sát Onboarding hay chưa
  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) {
      setIsOpen(false);
      return;
    }

    if (pathname === '/login' || pathname === '/register') {
      setIsOpen(false);
      return;
    }

    // Nếu user chưa có preferredStyles hoặc preferredStyles rỗng -> Bắt buộc mở Modal
    const hasStyles = Array.isArray(user.preferredStyles) && user.preferredStyles.length > 0;
    if (!hasStyles) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [user, isAuthenticated, isLoading, pathname]);

  const toggleStyle = (id: string) => {
    setSelectedStyles((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isFormValid = selectedStyles.length >= 3 && selectedCompanion && selectedBudget;

  const handleSubmit = async () => {
    if (!isFormValid || !user || isSubmitting) return;

    try {
      setIsSubmitting(true);
      // Lưu preferredStyles kèm tag companion và mức budgetLevel vào CSDL
      const finalStyles = [...selectedStyles, `companion:${selectedCompanion}`];
      await api.patch(`/users/${user.id}/profile`, {
        preferredStyles: finalStyles,
        budgetLevel: selectedBudget,
      });

      // Nạp lại profile trong AuthContext
      await refreshProfile();
      setIsOpen(false);

      // Bắn sự kiện để trang chủ hoặc các màn hình gợi ý reload dữ liệu cá nhân hóa mới
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('onboarding:completed'));
      }
    } catch (err: any) {
      console.error('Lỗi lưu khảo sát Onboarding:', err);
      showToast(err.message || 'Không thể lưu khảo sát gu du lịch. Vui lòng thử lại.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-2xl max-h-[92vh] overflow-y-auto p-0 gap-0 border-[#E2E8F0] shadow-2xl rounded-2xl bg-white sm:rounded-2xl"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="sr-only">
          <DialogTitle>Khảo Sát Khởi Tạo Gu Du Lịch Cá Nhân</DialogTitle>
          <DialogDescription>
            Chọn các sở thích, đối tượng đồng hành và ngân sách để hệ thống AI cá nhân hóa lịch trình cho bạn.
          </DialogDescription>
        </div>

        {/* Header với thương hiệu */}
        <div className="bg-[#F8FAFC] p-6 pb-4 border-b border-[#E2E8F0]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D9488] text-white text-[11px] font-medium mb-3">
            <Compass className="w-3.5 h-3.5 text-white" />
            <span>Khảo Sát Khởi Tạo Cá Nhân Hóa (Onboarding)</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Chào mừng bạn đến với AI Travel Planner
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 leading-relaxed">
            Để mang đến những đề xuất lịch trình được may đo chuẩn xác nhất ngay từ lần đầu tiên, hãy dành 1 phút chia sẻ gu du lịch quen thuộc của bạn:
          </p>
        </div>

        {/* Nội dung 3 câu hỏi */}
        <div className="p-6 space-y-6">
          {/* CÂU HỎI 1: Gu du lịch */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#0D9488] text-white text-xs flex items-center justify-center font-mono">1</span>
                <span>Gu du lịch yêu thích của bạn</span>
              </label>
              <span className={`text-xs font-medium ${selectedStyles.length >= 3 ? 'text-[#0D9488] font-semibold' : 'text-[#F59E0B]'}`}>
                Đã chọn {selectedStyles.length}/3 thẻ tối thiểu
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {STYLE_OPTIONS.map((style) => {
                const Icon = style.icon;
                const isSelected = selectedStyles.includes(style.id);
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => toggleStyle(style.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-[#0D9488] bg-[#0D9488] text-white'
                        : 'border-[#E2E8F0] bg-white hover:border-[#0D9488]/50 text-[#0F172A]'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white/15 text-white' : 'bg-[#F0FDFA] text-[#0D9488]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold leading-none">{style.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <p
                        className={`text-[11px] mt-1 line-clamp-1 leading-snug ${
                          isSelected ? 'text-teal-50' : 'text-[#64748B]'
                        }`}
                      >
                        {style.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CÂU HỎI 2: Đối tượng đồng hành */}
          <div>
            <label className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5 mb-2.5">
              <span className="w-5 h-5 rounded-full bg-[#0D9488] text-white text-xs flex items-center justify-center font-mono">2</span>
              <span>Đối tượng bạn thường đồng hành nhất</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {COMPANION_OPTIONS.map((comp) => {
                const Icon = comp.icon;
                const isSelected = selectedCompanion === comp.id;
                return (
                  <button
                    key={comp.id}
                    type="button"
                    onClick={() => setSelectedCompanion(comp.id)}
                    className={`p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? 'border-[#0D9488] bg-[#0D9488] text-white'
                        : 'border-[#E2E8F0] bg-white hover:border-[#0D9488]/50 text-[#0F172A]'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 ${
                        isSelected ? 'bg-white/15 text-white' : 'bg-[#F0FDFA] text-[#0D9488]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold">{comp.name.split(' (')[0]}</span>
                    <span
                      className={`text-[10px] mt-0.5 line-clamp-1 ${
                        isSelected ? 'text-teal-50' : 'text-[#64748B]'
                      }`}
                    >
                      {comp.id === 'family' ? 'Trẻ em & người lớn' : comp.desc.split(',')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CÂU HỎI 3: Mức ngân sách chi tiêu */}
          <div>
            <label className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5 mb-2.5">
              <span className="w-5 h-5 rounded-full bg-[#0D9488] text-white text-xs flex items-center justify-center font-mono">3</span>
              <span>Mức ngân sách chi tiêu thông thường</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {BUDGET_OPTIONS.map((b) => {
                const Icon = b.icon;
                const isSelected = selectedBudget === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBudget(b.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-[#0D9488] bg-[#0D9488] text-white'
                        : 'border-[#E2E8F0] bg-white hover:border-[#0D9488]/50 text-[#0F172A]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-white/15 text-white' : 'bg-[#F0FDFA] text-[#0D9488]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className={`text-[11px] font-mono font-semibold ${isSelected ? 'text-teal-50' : 'text-[#0D9488]'}`}>
                        {b.range}
                      </span>
                    </div>
                    <div className="text-xs font-bold">{b.name}</div>
                    <p className={`text-[11px] mt-1 line-clamp-2 leading-snug ${isSelected ? 'text-teal-50' : 'text-[#64748B]'}`}>
                      {b.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer cố định với nút Hoàn tất */}
        <div className="p-4 sm:p-6 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#64748B] text-center sm:text-left">
            Khảo sát này giúp loại bỏ hoàn toàn hiện tượng Cold-Start trống cho tài khoản mới.
          </div>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="w-full sm:w-auto bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang lưu thông tin cá nhân hóa...</span>
              </>
            ) : (
              <>
                <span>Hoàn tất & Khám phá</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
