'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  User as UserIcon,
  Heart,
  Bookmark,
  Calendar,
  Settings,
  Sparkles,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Check,
  ChevronRight,
  Loader2,
  Trash2,
  Edit3,
  ExternalLink,
  Shield,
  Compass,
} from 'lucide-react';
import { Place, Trip, UserProfileData } from '@/types';

const AVAILABLE_STYLES = [
  'Thiên nhiên',
  'Văn hóa',
  'Lịch sử',
  'Ẩm thực',
  'Check-in',
  'Nghỉ dưỡng',
  'Khám phá',
  'Phượt',
  'Mua sắm',
  'Giải trí',
];

const BUDGET_LEVELS = [
  { key: 'BUDGET', label: 'Tiết kiệm (< 1.000.000đ/ngày)', desc: 'Tập trung trải nghiệm giá rẻ, ẩm thực đường phố' },
  { key: 'MODERATE', label: 'Tiêu chuẩn (1.000.000đ - 3.000.000đ/ngày)', desc: 'Cân bằng giữa chi phí và tiện nghi' },
  { key: 'LUXURY', label: 'Cao cấp (> 3.000.000đ/ngày)', desc: 'Trải nghiệm tiện nghi cao cấp, resort và nhà hàng' },
];

export default function ProfilePage() {
  const { user: authUser, isAuthenticated, isLoading: authLoading, refreshProfile } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'wishlist' | 'liked' | 'trips' | 'preferences'>('wishlist');
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Preference edit states
  const [editName, setEditName] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState('MODERATE');
  const [isSavingPref, setIsSavingPref] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadProfile = async (userId: string) => {
    setIsLoading(true);
    try {
      const data = await api.get<UserProfileData>(`/users/${userId}/profile`);
      setProfileData(data);
      setEditName(data.user.name || '');
      setSelectedStyles(data.user.preferredStyles || []);
      setSelectedBudget(data.user.budgetLevel || 'MODERATE');
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || !authUser) {
        router.push('/login');
      } else {
        loadProfile(authUser.id);
      }
    }
  }, [authLoading, isAuthenticated, authUser, router]);

  const handleSavePreferences = async () => {
    if (!authUser) return;
    setIsSavingPref(true);
    try {
      await api.patch(`/users/${authUser.id}/profile`, {
        name: editName,
        preferredStyles: selectedStyles,
        budgetLevel: selectedBudget,
      });
      await refreshProfile();
      await loadProfile(authUser.id);
      showToast('Đã cập nhật thông tin và sở thích thành công! ✨');
    } catch (err) {
      showToast('Có lỗi khi lưu thông tin');
    } finally {
      setIsSavingPref(false);
    }
  };

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style],
    );
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-400">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  const u = profileData?.user || authUser;
  const stats = profileData?.stats || {
    tripsCount: 0,
    likedCount: 0,
    savedCount: 0,
    ratedCount: 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white pb-24">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 border border-emerald-500/40 text-emerald-300 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Profile Header Hero */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md pt-12 pb-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-1 shadow-xl shadow-emerald-500/20">
                <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-3xl font-black text-emerald-400 uppercase">
                  {u?.name ? u.name.charAt(0) : u?.email.charAt(0)}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950 uppercase border-2 border-slate-900 shadow">
                {u?.role}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                  {u?.name || u?.email.split('@')[0]}
                </h1>
                <span className="text-xs text-slate-400 md:ml-2">({u?.email})</span>
              </div>

              {/* Personality Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
                {u?.preferredStyles && u.preferredStyles.length > 0 ? (
                  u.preferredStyles.map((style) => (
                    <span
                      key={style}
                      className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium"
                    >
                      {style}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">
                    Chưa thiết lập gu du lịch. Vào tab &ldquo;Cài đặt sở thích&rdquo; để cập nhật.
                  </span>
                )}
                {u?.budgetLevel && (
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
                    Ngân sách: {u.budgetLevel}
                  </span>
                )}
              </div>

              <div className="text-[11px] text-slate-500 pt-1">
                Thành viên từ:{' '}
                {u?.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '2026'}
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-3">
              <Link
                href="/trips/new"
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                <span>Tạo Chuyến Đi Mới</span>
              </Link>
            </div>
          </div>

          {/* 4 Stat Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-1.5">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-white">{stats.tripsCount}</div>
              <div className="text-[11px] text-slate-400 font-medium">Chuyến đi đã tạo</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-1.5">
                <Bookmark className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-white">{stats.savedCount}</div>
              <div className="text-[11px] text-slate-400 font-medium">Địa điểm đã lưu</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-1.5">
                <Heart className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-white">{stats.likedCount}</div>
              <div className="text-[11px] text-slate-400 font-medium">Địa điểm đã thích</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto mb-1.5">
                <Star className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-white">{stats.ratedCount}</div>
              <div className="text-[11px] text-slate-400 font-medium">Lượt đánh giá sao</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Tabs */}
      <section className="container mx-auto px-4 max-w-5xl py-8">
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800/80 mb-8 overflow-x-auto space-x-2">
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center gap-2 px-5 py-3 font-semibold text-xs transition border-b-2 whitespace-nowrap ${
              activeTab === 'wishlist'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Wishlist ({profileData?.savedPlaces.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('liked')}
            className={`flex items-center gap-2 px-5 py-3 font-semibold text-xs transition border-b-2 whitespace-nowrap ${
              activeTab === 'liked'
                ? 'border-rose-400 text-rose-300 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Đã thích ({profileData?.likedPlaces.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('trips')}
            className={`flex items-center gap-2 px-5 py-3 font-semibold text-xs transition border-b-2 whitespace-nowrap ${
              activeTab === 'trips'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Chuyến đi của tôi ({profileData?.trips.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-2 px-5 py-3 font-semibold text-xs transition border-b-2 whitespace-nowrap ${
              activeTab === 'preferences'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Cài đặt sở thích & AI</span>
          </button>
        </div>

        {/* Tab 1: Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-400" />
                Các địa điểm bạn đã lưu vào danh sách mong muốn
              </h2>
              {profileData?.savedPlaces && profileData.savedPlaces.length > 0 && (
                <Link
                  href="/trips/new"
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold hover:bg-amber-500/30 transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Lập lịch trình từ các điểm này
                </Link>
              )}
            </div>

            {profileData?.savedPlaces.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-3xl">
                <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-300 mb-1">Chưa có địa điểm nào được lưu</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Dạo qua trang Khám phá và bấm biểu tượng 🔖 để lưu các điểm đến yêu thích nhé!
                </p>
                <Link
                  href="/places"
                  className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow hover:bg-emerald-400 transition"
                >
                  Khám phá địa điểm ngay
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profileData?.savedPlaces.map((place) => (
                  <div
                    key={place.id}
                    className="bg-slate-900/80 border border-slate-800/80 hover:border-amber-500/40 rounded-2xl p-4 flex flex-col justify-between transition shadow-md group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {place.province || 'Việt Nam'}
                        </span>
                        <span className="text-[11px] font-semibold text-amber-300">
                          {place.priceEstimate > 0
                            ? `${place.priceEstimate.toLocaleString('vi-VN')}đ`
                            : 'Miễn phí'}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm mb-1.5 group-hover:text-amber-300 transition-colors">
                        {place.name}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                        {place.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{place.district || 'Trung tâm'}</span>
                      </div>
                      <Link
                        href={`/places#${place.id}`}
                        className="text-amber-400 hover:text-amber-300 font-semibold text-[11px] flex items-center gap-1"
                      >
                        Chi tiết <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Liked Places */}
        {activeTab === 'liked' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-rose-500" />
              Bộ sưu tập địa điểm bạn đã bấm thích (❤️)
            </h2>

            {profileData?.likedPlaces.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-3xl">
                <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-300 mb-1">Bạn chưa thả tim địa điểm nào</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Bấm tim các địa điểm để AI hiểu gu du lịch của bạn sâu sắc hơn!
                </p>
                <Link
                  href="/places"
                  className="px-4 py-2 bg-rose-500 text-white font-bold text-xs rounded-xl shadow hover:bg-rose-400 transition"
                >
                  Khám phá và thả tim
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profileData?.likedPlaces.map((place) => (
                  <div
                    key={place.id}
                    className="bg-slate-900/80 border border-slate-800/80 hover:border-rose-500/40 rounded-2xl p-4 flex flex-col justify-between transition shadow-md group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          {place.province || 'Việt Nam'}
                        </span>
                        <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                      </div>
                      <h4 className="font-bold text-white text-sm mb-1.5 group-hover:text-rose-300 transition-colors">
                        {place.name}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                        {place.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex flex-wrap gap-1">
                        {place.categories?.slice(0, 2).map((c) => (
                          <span
                            key={c}
                            className="px-1.5 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400"
                          >
                            #{c}
                          </span>
                        ))}
                      </div>
                      <Link
                        href={`/places#${place.id}`}
                        className="text-rose-400 hover:text-rose-300 font-semibold text-[11px] flex items-center gap-1"
                      >
                        Xem <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: My Trips */}
        {activeTab === 'trips' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                Lịch sử các chuyến đi đã tạo
              </h2>
              <Link
                href="/trips/new"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/30 transition flex items-center gap-1.5"
              >
                + Tạo chuyến đi mới
              </Link>
            </div>

            {profileData?.trips.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-3xl">
                <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-300 mb-1">Chưa có chuyến đi nào</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Hãy để AI lên kế hoạch chi tiết cho chuyến hành trình sắp tới của bạn!
                </p>
                <Link
                  href="/trips/new"
                  className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow hover:bg-emerald-400 transition"
                >
                  Tạo lịch trình ngay
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {profileData?.trips.map((trip) => (
                  <div
                    key={trip.id}
                    className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-emerald-500/40 transition shadow-md"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {trip.status}
                        </span>
                        <span className="text-xs text-slate-400">
                          Tạo ngày {new Date(trip.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                        Chuyến đi {trip.destination}
                      </h4>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                        <span>
                          📅 {new Date(trip.startDate).toLocaleDateString('vi-VN')} -{' '}
                          {new Date(trip.endDate).toLocaleDateString('vi-VN')}
                        </span>
                        <span>👥 {trip.groupSize} người</span>
                        <span>
                          💰 {trip.budgetPerPerson ? trip.budgetPerPerson.toLocaleString('vi-VN') : 0}đ/người
                        </span>
                      </div>
                    </div>

                    <div>
                      <Link
                        href={`/trips/${trip.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-semibold transition"
                      >
                        <span>Xem chi tiết</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Preferences & Settings */}
        {activeTab === 'preferences' && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-8 backdrop-blur-md">
            <div>
              <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Settings className="w-4 h-4 text-cyan-400" />
                Cài Đặt Hồ Sơ & Huấn Luyện AI Recommendation
              </h2>
              <p className="text-xs text-slate-400">
                Gu du lịch và ngân sách dưới đây sẽ đóng vai trò là đặc trưng người dùng (User Features)
                truyền vào mô hình học máy **LightFM** để cá nhân hóa kết quả gợi ý.
              </p>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Tên hiển thị của bạn
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Nhập tên của bạn..."
                className="w-full max-w-md px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            {/* Preferred Styles */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Gu du lịch yêu thích (Chọn nhiều)
              </label>
              <div className="flex flex-wrap gap-2 max-w-2xl">
                {AVAILABLE_STYLES.map((style) => {
                  const isSelected = selectedStyles.includes(style);
                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() => toggleStyle(style)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                        isSelected
                          ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 shadow-md scale-105'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      <span>{style}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Mức ngân sách thông thường
              </label>
              <div className="grid md:grid-cols-3 gap-3 max-w-3xl">
                {BUDGET_LEVELS.map((b) => {
                  const isSelected = selectedBudget === b.key;
                  return (
                    <button
                      key={b.key}
                      type="button"
                      onClick={() => setSelectedBudget(b.key)}
                      className={`text-left p-4 rounded-2xl border transition ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-lg'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs text-white mb-1">{b.label}</div>
                      <div className="text-[11px] text-slate-400 leading-relaxed">{b.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={handleSavePreferences}
                disabled={isSavingPref}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition disabled:opacity-50"
              >
                {isSavingPref ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Lưu Cài Đặt Hồ Sơ</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
