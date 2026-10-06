'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { api } from '@/lib/api';
import { VIETNAM_PROVINCES } from '@/lib/provinces';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type FormData = {
  destination: string;
  startDate: string;
  endDate: string;
  budgetPerPerson: number;
  groupSize: number;
  preferences: string[];
};

const DESTINATIONS = VIETNAM_PROVINCES.map((p) => ({
  id: p.key,
  label: p.label,
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
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    destination: '',
    startDate: '',
    endDate: '',
    budgetPerPerson: 0,
    groupSize: 1,
    preferences: [],
  });

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
        destination: formData.destination,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        budgetPerPerson: formData.budgetPerPerson,
        groupSize: formData.groupSize,
        preferences: formData.preferences,
      });

      router.push(`/trips/${trip.id}`);
    } catch (error: any) {
      console.error('Error creating trip:', error);
      alert(error.message || 'Không thể tạo lịch trình. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.destination && formData.startDate && formData.endDate;
      case 2:
        return formData.budgetPerPerson > 0 && formData.groupSize > 0;
      case 3:
        return formData.preferences.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F8] text-[#1A1A1A] pb-24">
      {/* Step Header */}
      <div className="border-b border-[#E5E7EB] bg-white sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] text-white flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-[#1A1A1A]">Lập kế hoạch du lịch thông minh</h1>
                <p className="text-xs text-muted-foreground">Bước {step} trên 3</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="text-muted-foreground hover:text-[#1A1A1A]"
            >
              Hủy
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-1 bg-[#F0F0EF] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1A1A1A] transition-all duration-300"
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
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#F4FCE3] border border-[#D9F99D] mb-3">
                <MapPin className="w-6 h-6 text-[#365314]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1.5 text-[#1A1A1A]">Bạn muốn đi đâu?</h2>
              <p className="text-muted-foreground text-sm">Chọn điểm đến và khoảng thời gian cho chuyến đi của bạn</p>
            </div>

            {/* Destination Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Điểm đến tại Việt Nam
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {DESTINATIONS.map((dest) => {
                  const isSelected = formData.destination === dest.id;
                  return (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => updateFormData('destination', dest.id)}
                      className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-xs'
                          : 'bg-white border-[#E5E7EB] text-[#1A1A1A] hover:bg-[#FAFAFA]'
                      }`}
                    >
                      <span className="text-sm font-medium">{dest.label}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#D4F066]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dates Selection */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  <Calendar className="w-3.5 h-3.5 inline mr-1 text-muted-foreground" />
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
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  <Calendar className="w-3.5 h-3.5 inline mr-1 text-muted-foreground" />
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
          </div>
        )}

        {/* Step 2: Budget & Group */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#F4FCE3] border border-[#D9F99D] mb-3">
                <DollarSign className="w-6 h-6 text-[#365314]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1.5 text-[#1A1A1A]">Ngân sách & số người</h2>
              <p className="text-muted-foreground text-sm">Xác định quy mô đoàn và hạn mức chi tiêu để AI cân đối chi phí</p>
            </div>

            {/* Budget */}
            <Card className="bg-white border-[#E5E7EB] shadow-2xs">
              <CardContent className="p-5 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Ngân sách dự kiến mỗi người (VNĐ)
                </label>
                <Input
                  type="number"
                  value={formData.budgetPerPerson || ''}
                  onChange={(e) => updateFormData('budgetPerPerson', Number(e.target.value))}
                  placeholder="Ví dụ: 3000000"
                  className="text-base font-medium"
                />
                <p className="text-xs text-muted-foreground">
                  {formData.budgetPerPerson > 0 &&
                    `Khoảng ${formData.budgetPerPerson.toLocaleString('vi-VN')} đ / người`}
                </p>
              </CardContent>
            </Card>

            {/* Group Size */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                <Users className="w-3.5 h-3.5 inline mr-1 text-muted-foreground" />
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
                          ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-xs'
                          : 'bg-white border-[#E5E7EB] text-[#1A1A1A] hover:bg-[#FAFAFA]'
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
              <Card className="bg-[#F4FCE3] border-[#D9F99D] shadow-2xs">
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="text-xs font-medium text-[#365314]">Tổng ngân sách toàn chuyến đi:</span>
                  <span className="text-xl font-bold font-mono text-[#365314]">
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
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#F4FCE3] border border-[#D9F99D] mb-3">
                <Sparkles className="w-6 h-6 text-[#365314]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1.5 text-[#1A1A1A]">Sở thích & trải nghiệm</h2>
              <p className="text-muted-foreground text-sm">Chọn những hoạt động bạn yêu thích (có thể chọn nhiều)</p>
            </div>

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
                        ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-xs'
                        : 'bg-white border-[#E5E7EB] text-[#1A1A1A] hover:bg-[#FAFAFA]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <IconComponent className={`w-5 h-5 ${isSelected ? 'text-[#D4F066]' : 'text-[#1A1A1A]'}`} />
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#D4F066]" />}
                    </div>
                    <div className="font-medium text-sm mt-3">{pref.label}</div>
                  </button>
                );
              })}
            </div>

            <div className="text-center">
              <Badge variant="secondary" className="px-3 py-1 font-normal text-xs">
                Đã chọn {formData.preferences.length} sở thích
              </Badge>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#E5E7EB]">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="gap-2 text-xs"
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
            className="gap-2 text-xs font-semibold px-6"
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
                <Sparkles className="w-4 h-4 text-[#D4F066]" />
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
