'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader2,
  CheckCircle2,
  Trees,
  Waves,
  Landmark,
  Utensils,
  Mountain,
  Camera,
  ShoppingBag,
  Coffee,
  Moon,
  History,
  X,
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { api } from '@/lib/api';
import { VIETNAM_PROVINCES } from '@/lib/provinces';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';

type FormData = {
  destinations: string[];
  startDate: string;
  endDate: string;
  budgetPerPerson: number;
  groupSize: number;
  preferences: string[];
};

const DESTINATIONS = VIETNAM_PROVINCES.map((p) => ({
  id: p.key,
  label: p.label,
  shortLabel: p.shortLabel,
}));

const PREFERENCES = [
  { id: 'nature', label: 'Thiên nhiên', icon: Trees },
  { id: 'beach', label: 'Biển & Đảo', icon: Waves },
  { id: 'culture', label: 'Văn hóa', icon: Landmark },
  { id: 'food', label: 'Ẩm thực', icon: Utensils },
  { id: 'adventure', label: 'Phiêu lưu', icon: Mountain },
  { id: 'photography', label: 'Chụp ảnh', icon: Camera },
  { id: 'shopping', label: 'Mua sắm', icon: ShoppingBag },
  { id: 'relax', label: 'Thư giãn', icon: Coffee },
  { id: 'nightlife', label: 'Đời sống đêm', icon: Moon },
  { id: 'historical', label: 'Lịch sử', icon: History },
];

function NewTripContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPrefilled, setHasPrefilled] = useState(false);
  const [isSmartPrefilled, setIsSmartPrefilled] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    destinations: [],
    startDate: '',
    endDate: '',
    budgetPerPerson: 0,
    groupSize: 1,
    preferences: [],
  });

  // Cơ chế Tự động điền (Smart Pre-fill) từ hồ sơ Onboarding cá nhân
  useEffect(() => {
    if (user && !hasPrefilled) {
      const userStyles = Array.isArray(user.preferredStyles) ? user.preferredStyles : [];
      const cleanStyles = userStyles.filter((s) => !s.startsWith('companion:'));
      const compTag = userStyles.find((s) => s.startsWith('companion:'));

      let defaultGroup = 1;
      if (compTag) {
        const c = compTag.replace('companion:', '');
        if (c === 'couple') defaultGroup = 2;
        else if (c === 'family' || c === 'friends') defaultGroup = 4;
      }

      let defaultBudget = 0;
      if (user.budgetLevel === 'budget') defaultBudget = 500000;
      else if (user.budgetLevel === 'standard') defaultBudget = 1200000;
      else if (user.budgetLevel === 'luxury') defaultBudget = 2500000;

      if (cleanStyles.length > 0 || defaultBudget > 0 || defaultGroup > 1) {
        setFormData((prev) => ({
          ...prev,
          preferences: cleanStyles.length > 0 ? cleanStyles : prev.preferences,
          budgetPerPerson: defaultBudget > 0 ? defaultBudget : prev.budgetPerPerson,
          groupSize: defaultGroup > 1 ? defaultGroup : prev.groupSize,
        }));
        setIsSmartPrefilled(true);
      }
      setHasPrefilled(true);
    }
  }, [user, hasPrefilled]);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleDestination = (destId: string) => {
    setFormData((prev) => {
      const exists = prev.destinations.includes(destId);
      const updated = exists
        ? prev.destinations.filter((d) => d !== destId)
        : [...prev.destinations, destId];
      return { ...prev, destinations: updated };
    });
  };

  const removeDestination = (destId: string) => {
    setFormData((prev) => ({
      ...prev,
      destinations: prev.destinations.filter((d) => d !== destId),
    }));
  };

  const togglePreference = (prefId: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(prefId)
        ? prev.preferences.filter((p) => p !== prefId)
        : [...prev.preferences, prefId],
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const trip = await api.post('/trips', {
        destination: formData.destinations.join(', '),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        budgetPerPerson: formData.budgetPerPerson,
        groupSize: formData.groupSize,
        preferences: formData.preferences,
      });

      router.push(`/trips/${trip.id}`);
    } catch (error: any) {
      console.error('Error creating trip:', error);
      showToast(error.message || 'Không thể tạo lịch trình. Vui lòng thử lại!', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const isDateRangeInvalid =
    Boolean(formData.startDate && formData.endDate) &&
    new Date(formData.endDate).getTime() < new Date(formData.startDate).getTime();

  const canProceed = () => {
    switch (step) {
      case 1:
        return (
          formData.destinations.length > 0 &&
          Boolean(formData.startDate) &&
          Boolean(formData.endDate) &&
          !isDateRangeInvalid
        );
      case 2:
        return formData.budgetPerPerson > 0 && formData.groupSize > 0;
      case 3:
        return formData.preferences.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-24">
      {/* Step Header */}
      <div className="border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md sticky top-[61px] z-30">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0D9488] text-white flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-[#0F172A]">Lập kế hoạch du lịch thông minh</h1>
                <p className="text-xs text-[#64748B]">Bước {step} trên 3</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="text-[#64748B] hover:text-[#0F172A]"
            >
              Hủy
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0D9488] transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Step 1: Destination & Dates */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#F0FDFA] border border-[#99F6E4] mb-3">
                <MapPin className="w-6 h-6 text-[#0D9488]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1.5 text-[#0F172A]">Bạn muốn đi đâu?</h2>
              <p className="text-[#64748B] text-sm">Chọn điểm đến và khoảng thời gian cho chuyến đi của bạn</p>
            </div>

            {/* Destination Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Điểm đến tại Việt Nam (Có thể chọn nhiều tỉnh cho Tour liên tỉnh)
                </label>
                {formData.destinations.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, destinations: [] }))}
                    className="text-xs text-[#0D9488] hover:underline transition cursor-pointer font-medium"
                  >
                    Bỏ chọn tất cả
                  </button>
                )}
              </div>

              {/* Selected Destination Badges */}
              {formData.destinations.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-4 p-3 rounded-xl bg-white border border-[#E2E8F0]">
                  <span className="text-xs text-[#64748B] mr-1">Đã chọn ({formData.destinations.length}):</span>
                  {formData.destinations.map((destId, idx) => {
                    const destObj = DESTINATIONS.find((d) => d.id === destId);
                    return (
                      <span
                        key={destId}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#0D9488] text-white"
                      >
                        <span className="text-teal-100 font-mono text-[11px]">{idx + 1}.</span>
                        {destObj?.label || destId}
                        <button
                          type="button"
                          onClick={() => removeDestination(destId)}
                          aria-label={`Bỏ chọn ${destObj?.label || destId}`}
                          className="hover:text-white ml-0.5 text-teal-100 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Multi-Province Tour Banner */}
              {formData.destinations.length >= 2 && (
                <div className="mb-4 p-3.5 rounded-xl bg-[#F0FDFA] border border-[#99F6E4] flex items-start gap-2.5 text-xs text-[#0F766E]">
                  <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#0D9488]" />
                  <div>
                    <span className="font-bold">Chế độ Tour Liên Tỉnh ({formData.destinations.length} địa phương): </span>
                    Hệ thống sẽ tự động phân bổ các ngày theo khu vực liền kề, giúp bạn di chuyển thuận tiện và liền mạch nhất.
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {DESTINATIONS.map((dest) => {
                  const isSelected = formData.destinations.includes(dest.id);
                  const selectedIndex = formData.destinations.indexOf(dest.id);
                  return (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => toggleDestination(dest.id)}
                      className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#0D9488] border-[#0D9488] text-white'
                          : 'bg-white border-[#E2E8F0] text-[#0F172A] hover:border-[#0D9488]/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-white text-[#0D9488] text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                            {selectedIndex + 1}
                          </span>
                        )}
                        <span className="text-sm font-medium">{dest.label}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dates Selection */}
            <div className="space-y-2 pt-2">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-2">
                    <Calendar className="w-3.5 h-3.5 inline mr-1 text-[#0D9488]" />
                    Ngày bắt đầu
                  </label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateFormData('startDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-2">
                    <Calendar className="w-3.5 h-3.5 inline mr-1 text-[#0D9488]" />
                    Ngày kết thúc
                  </label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateFormData('endDate', e.target.value)}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    className="bg-white"
                  />
                </div>
              </div>
              {isDateRangeInvalid && (
                <p className="text-xs font-medium text-[#EF4444]">
                  Ngày kết thúc phải cùng ngày hoặc sau ngày bắt đầu.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Budget & Group */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#F0FDFA] border border-[#99F6E4] mb-3">
                <DollarSign className="w-6 h-6 text-[#0D9488]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1.5 text-[#0F172A]">Ngân sách &amp; số người</h2>
              <p className="text-[#64748B] text-sm">Xác định quy mô đoàn và hạn mức chi tiêu để AI cân đối chi phí</p>
            </div>

            {/* Smart Pre-fill Notice */}
            {isSmartPrefilled && (
              <div className="p-3 rounded-xl bg-[#F0FDFA] border border-[#99F6E4] flex items-center gap-2 text-xs text-[#0F766E]">
                <Sparkles className="w-4 h-4 text-[#0D9488] shrink-0" />
                <span>
                  <strong>Smart Pre-fill:</strong> Đã tự động chọn ngân sách &amp; số người theo hồ sơ khảo sát của bạn. Bạn có thể thay đổi tùy ý cho chuyến đi này.
                </span>
              </div>
            )}

            {/* Budget */}
            <Card className="bg-white border-[#E2E8F0] shadow-none">
              <CardContent className="p-5 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Ngân sách dự kiến mỗi người (VNĐ)
                </label>
                <Input
                  type="number"
                  value={formData.budgetPerPerson || ''}
                  onChange={(e) => updateFormData('budgetPerPerson', Number(e.target.value))}
                  placeholder="Ví dụ: 3000000"
                  className="text-base font-medium tabular-nums"
                />
                <p className="text-xs text-[#64748B] tabular-nums">
                  {formData.budgetPerPerson > 0 &&
                    `Khoảng ${formData.budgetPerPerson.toLocaleString('vi-VN')} đ / người`}
                </p>
              </CardContent>
            </Card>

            {/* Group Size */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-2.5">
                <Users className="w-3.5 h-3.5 inline mr-1 text-[#0D9488]" />
                Số lượng người tham gia
              </label>
              <div className="grid grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map((size) => {
                  const isSelected = formData.groupSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => updateFormData('groupSize', size)}
                      className={`py-3.5 rounded-xl border text-sm font-semibold transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#0D9488] border-[#0D9488] text-white'
                          : 'bg-white border-[#E2E8F0] text-[#0F172A] hover:border-[#0D9488]/50'
                      }`}
                    >
                      {size}
                      {size === 6 && '+'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Total Budget Preview */}
            {formData.budgetPerPerson > 0 && formData.groupSize > 0 && (
              <Card className="bg-[#F0FDFA] border-[#99F6E4] text-[#0F766E] shadow-none">
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="text-xs font-medium text-[#0F766E]">Tổng ngân sách toàn chuyến đi:</span>
                  <span className="text-xl font-bold font-mono text-[#0D9488] tabular-nums">
                    {(formData.budgetPerPerson * formData.groupSize).toLocaleString('vi-VN')} đ
                  </span>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step 3: Preferences */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#F0FDFA] border border-[#99F6E4] mb-3">
                <Sparkles className="w-6 h-6 text-[#0D9488]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1.5 text-[#0F172A]">Sở thích &amp; trải nghiệm</h2>
              <p className="text-[#64748B] text-sm">Chọn những hoạt động bạn yêu thích (có thể chọn nhiều)</p>
            </div>

            {/* Smart Pre-fill Notice for Preferences */}
            {isSmartPrefilled && formData.preferences.length > 0 && (
              <div className="p-3 rounded-xl bg-[#F0FDFA] border border-[#99F6E4] flex items-center gap-2 text-xs text-[#0F766E]">
                <Sparkles className="w-4 h-4 text-[#0D9488] shrink-0" />
                <span>
                  <strong>Smart Pre-fill:</strong> Đã chọn sẵn các gu du lịch từ khảo sát khởi tạo của bạn. Bạn có thể nhấp để thêm/bớt theo nhu cầu riêng của chuyến đi này.
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PREFERENCES.map((pref) => {
                const IconComponent = pref.icon;
                const isSelected = formData.preferences.includes(pref.id);
                return (
                  <button
                    key={pref.id}
                    type="button"
                    onClick={() => togglePreference(pref.id)}
                    className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between min-h-[96px] ${
                      isSelected
                        ? 'bg-[#0D9488] border-[#0D9488] text-white'
                        : 'bg-white border-[#E2E8F0] text-[#0F172A] hover:border-[#0D9488]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <IconComponent className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-[#0D9488]'}`} />
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <div className="font-medium text-sm mt-3">{pref.label}</div>
                  </button>
                );
              })}
            </div>

            <div className="text-center">
              <Badge variant="teal" className="px-3 py-1 font-medium text-xs">
                Đã chọn {formData.preferences.length} sở thích
              </Badge>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#E2E8F0]">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="gap-2 text-xs rounded-xl border-[#E2E8F0]"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại
            </Button>
          ) : (
            <div />
          )}

          <Button
            onClick={() => {
              if (step < 3) {
                setStep(step + 1);
              } else {
                handleSubmit();
              }
            }}
            disabled={!canProceed() || isLoading}
            className="gap-2 text-xs font-semibold px-6 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang tổng hợp lịch trình...
              </>
            ) : step < 3 ? (
              <>
                Tiếp tục
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                Khởi tạo lịch trình
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}

export default function NewTripPage() {
  return (
    <ProtectedRoute>
      <NewTripContent />
    </ProtectedRoute>
  );
}
