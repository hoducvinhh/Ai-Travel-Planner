'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Heart,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { api } from '@/lib/api';

type FormData = {
  destination: string;
  startDate: string;
  endDate: string;
  budgetPerPerson: number;
  groupSize: number;
  preferences: string[];
};

const DESTINATIONS = [
  { id: 'Hanoi', label: 'Hà Nội' },
  { id: 'Ho Chi Minh', label: 'Hồ Chí Minh' },
  { id: 'Lam Dong', label: 'Đà Lạt' },
];

const PREFERENCES = [
  { id: 'nature', label: 'Thiên nhiên', icon: '🏞️' },
  { id: 'beach', label: 'Biển', icon: '🏖️' },
  { id: 'culture', label: 'Văn hóa', icon: '🏛️' },
  { id: 'food', label: 'Ẩm thực', icon: '🍜' },
  { id: 'adventure', label: 'Phiêu lưu', icon: '🏔️' },
  { id: 'photography', label: 'Chụp ảnh', icon: '📸' },
  { id: 'shopping', label: 'Mua sắm', icon: '🛍️' },
  { id: 'relax', label: 'Thư giãn', icon: '🧘' },
  { id: 'nightlife', label: 'Nightlife', icon: '🌃' },
  { id: 'historical', label: 'Lịch sử', icon: '🏯' },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
      {/* Step Header */}
      <div className="border-b border-slate-800/80 bg-slate-950/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Lập Kế Hoạch Du Lịch</h1>
                <p className="text-xs text-slate-400">Bước {step} / 3</p>
              </div>
            </div>

            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white transition"
            >
              Hủy
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Step 1: Destination & Dates */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 mb-4">
                <MapPin className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Bạn muốn đi đâu?</h2>
              <p className="text-slate-400">Chọn điểm đến và thời gian cho chuyến đi</p>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-medium mb-3 text-slate-300">
                Điểm đến
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {DESTINATIONS.map((dest) => (
                  <button
                    key={dest.id}
                    onClick={() => updateFormData('destination', dest.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.destination === dest.id
                        ? 'border-emerald-500 bg-emerald-500/10 text-white'
                        : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {dest.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateFormData('startDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Ngày kết thúc
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => updateFormData('endDate', e.target.value)}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Budget & Group */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 mb-4">
                <DollarSign className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Ngân sách của bạn?</h2>
              <p className="text-slate-400">Cho chúng tôi biết chi phí và số người đi</p>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                Ngân sách mỗi người (VNĐ)
              </label>
              <input
                type="number"
                value={formData.budgetPerPerson || ''}
                onChange={(e) => updateFormData('budgetPerPerson', Number(e.target.value))}
                placeholder="VD: 5000000"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 text-lg"
              />
              <p className="mt-2 text-sm text-slate-400">
                {formData.budgetPerPerson > 0 &&
                  `≈ ${formData.budgetPerPerson.toLocaleString()} VNĐ / người`}
              </p>
            </div>

            {/* Group Size */}
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                <Users className="w-4 h-4 inline mr-2" />
                Số người đi
              </label>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5, 6].map((size) => (
                  <button
                    key={size}
                    onClick={() => updateFormData('groupSize', size)}
                    className={`flex-1 py-4 rounded-xl border-2 transition-all ${
                      formData.groupSize === size
                        ? 'border-emerald-500 bg-emerald-500/10 text-white'
                        : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {size}
                    {size === 6 && '+'}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Budget Preview */}
            {formData.budgetPerPerson > 0 && formData.groupSize > 0 && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Tổng ngân sách:</span>
                  <span className="text-2xl font-bold text-emerald-400">
                    {(formData.budgetPerPerson * formData.groupSize).toLocaleString()} VNĐ
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Preferences */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 mb-4">
                <Heart className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Sở thích của bạn?</h2>
              <p className="text-slate-400">Chọn những gì bạn quan tâm (chọn nhiều)</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {PREFERENCES.map((pref) => (
                <button
                  key={pref.id}
                  onClick={() => togglePreference(pref.id)}
                  className={`p-5 rounded-xl border-2 transition-all text-left ${
                    formData.preferences.includes(pref.id)
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                  }`}
                >
                  <div className="text-3xl mb-2">{pref.icon}</div>
                  <div className="font-medium">{pref.label}</div>
                  {formData.preferences.includes(pref.id) && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-2" />
                  )}
                </button>
              ))}
            </div>

            <div className="text-center text-sm text-slate-400">
              Đã chọn {formData.preferences.length} sở thích
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12 pt-8 border-t border-slate-800">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay lại
            </button>
          )}

          <button
            onClick={() => {
              if (step < 3) {
                setStep(step + 1);
              } else {
                handleSubmit();
              }
            }}
            disabled={!canProceed() || isLoading}
            className="ml-auto flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang tạo lịch trình...
              </>
            ) : step < 3 ? (
              <>
                Tiếp tục
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Tạo Lịch Trình
              </>
            )}
          </button>
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

