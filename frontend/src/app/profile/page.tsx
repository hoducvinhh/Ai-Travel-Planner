'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  Heart,
  Bookmark,
  Calendar,
  Settings,
  Sparkles,
  MapPin,
  DollarSign,
  Star,
  Check,
  ChevronRight,
  Loader2,
  Trash2,
  Share2,
} from 'lucide-react';
import { Place, Trip, UserProfileData } from '@/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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

  const [activeTab, setActiveTab] = useState<'wishlist' | 'liked' | 'rated' | 'shared' | 'trips' | 'preferences'>('wishlist');
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

  // Remove from Wishlist
  const handleRemoveSaved = async (placeId: string) => {
    if (!authUser) return;

    setProfileData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        savedPlaces: prev.savedPlaces.filter((p) => p.id !== placeId),
        stats: {
          ...prev.stats,
          savedCount: Math.max(0, (prev.stats?.savedCount || 1) - 1),
        },
      };
    });

    try {
      await api.post('/interactions/toggle-save', {
        userId: authUser.id,
        placeId,
      });
      showToast('Đã xóa địa điểm khỏi Wishlist');
    } catch {
      showToast('Có lỗi xảy ra khi xóa');
      loadProfile(authUser.id);
    }
  };

  // Remove from Liked Places
  const handleRemoveLiked = async (placeId: string) => {
    if (!authUser) return;

    setProfileData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        likedPlaces: prev.likedPlaces.filter((p) => p.id !== placeId),
        stats: {
          ...prev.stats,
          likedCount: Math.max(0, (prev.stats?.likedCount || 1) - 1),
        },
      };
    });

    try {
      await api.post('/interactions/toggle-like', {
        userId: authUser.id,
        placeId,
      });
      showToast('Đã bỏ thích địa điểm');
    } catch {
      showToast('Có lỗi xảy ra khi bỏ thích');
      loadProfile(authUser.id);
    }
  };

  // Remove Rating
  const handleRemoveRating = async (placeId: string) => {
    if (!authUser) return;

    setProfileData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        ratedPlaces: (prev.ratedPlaces || []).filter((r) => r.place.id !== placeId),
        stats: {
          ...prev.stats,
          ratedCount: Math.max(0, (prev.stats?.ratedCount || 1) - 1),
        },
      };
    });

    try {
      await api.post('/interactions/unrate', {
        userId: authUser.id,
        placeId,
      });
      showToast('Đã xóa đánh giá sao');
    } catch {
      showToast('Có lỗi xảy ra khi xóa đánh giá');
      loadProfile(authUser.id);
    }
  };

  // Remove Shared Place
  const handleRemoveShared = async (placeId: string) => {
    if (!authUser) return;

    setProfileData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sharedPlaces: (prev.sharedPlaces || []).filter((s) => s.place.id !== placeId),
        stats: {
          ...prev.stats,
          sharedCount: Math.max(0, (prev.stats?.sharedCount || 1) - 1),
        },
      };
    });

    try {
      await api.post('/interactions/unshare', {
        userId: authUser.id,
        placeId,
      });
      showToast('Đã xóa bài chia sẻ khỏi trang cá nhân');
    } catch {
      showToast('Có lỗi xảy ra khi xóa bài chia sẻ');
      loadProfile(authUser.id);
    }
  };

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
      showToast('Đã cập nhật thông tin và sở thích thành công!');
    } catch {
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
      <div className="min-h-screen bg-[#F9F9F8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
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
    <div className="min-h-screen bg-[#F9F9F8] text-[#1A1A1A] pb-24">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white px-4 py-2.5 rounded-xl shadow-lg border border-[#333333] flex items-center gap-2.5 text-xs font-medium animate-in fade-in duration-200">
          <Sparkles className="w-4 h-4 text-[#D4F066]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Profile Header Hero */}
      <section className="border-b border-[#E5E7EB] bg-white pt-10 pb-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-20 h-20 border-2 border-[#E5E7EB] shadow-xs">
                <AvatarFallback className="bg-[#1A1A1A] text-white text-2xl font-bold">
                  {u?.name ? u.name.charAt(0) : u?.email ? u.email.charAt(0) : 'U'}
                </AvatarFallback>
              </Avatar>
              <Badge variant="lime" className="absolute -bottom-2 -right-1 text-[10px] uppercase font-semibold h-5">
                {u?.role}
              </Badge>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">
                  {u?.name || u?.email.split('@')[0]}
                </h1>
                <span className="text-xs text-muted-foreground md:ml-1">({u?.email})</span>
              </div>

              {/* Personality Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-0.5">
                {u?.preferredStyles && u.preferredStyles.length > 0 ? (
                  u.preferredStyles.map((style) => (
                    <Badge
                      key={style}
                      variant="outline"
                      className="text-xs font-normal text-muted-foreground border-[#E5E7EB]"
                    >
                      {style}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground italic">
                    Chưa thiết lập gu du lịch. Vào tab &ldquo;Cài đặt sở thích&rdquo; để cập nhật.
                  </span>
                )}
                {u?.budgetLevel && (
                  <Badge variant="lime" className="text-xs font-medium">
                    Ngân sách: {u.budgetLevel}
                  </Badge>
                )}
              </div>

              <div className="text-[11px] text-muted-foreground">
                Thành viên từ:{' '}
                {u?.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '2026'}
              </div>
            </div>

            {/* Quick Action Button */}
            <Button asChild size="sm" className="gap-2 font-medium">
              <Link href="/trips/new">
                <Sparkles className="w-4 h-4 text-[#D4F066]" />
                <span>Tạo chuyến đi mới</span>
              </Link>
            </Button>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-8">
            <Card className="bg-[#FAFAFA] border-[#E5E7EB] p-3.5 text-center shadow-2xs">
              <CardContent className="p-0">
                <Calendar className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                <div className="text-xl font-bold text-[#1A1A1A]">{stats.tripsCount}</div>
                <div className="text-[11px] text-muted-foreground">Chuyến đi đã tạo</div>
              </CardContent>
            </Card>

            <Card className="bg-[#FAFAFA] border-[#E5E7EB] p-3.5 text-center shadow-2xs">
              <CardContent className="p-0">
                <Bookmark className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                <div className="text-xl font-bold text-[#1A1A1A]">{stats.savedCount}</div>
                <div className="text-[11px] text-muted-foreground">Địa điểm đã lưu</div>
              </CardContent>
            </Card>

            <Card className="bg-[#FAFAFA] border-[#E5E7EB] p-3.5 text-center shadow-2xs">
              <CardContent className="p-0">
                <Heart className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                <div className="text-xl font-bold text-[#1A1A1A]">{stats.likedCount}</div>
                <div className="text-[11px] text-muted-foreground">Địa điểm đã thích</div>
              </CardContent>
            </Card>

            <Card className="bg-[#FAFAFA] border-[#E5E7EB] p-3.5 text-center shadow-2xs">
              <CardContent className="p-0">
                <Star className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                <div className="text-xl font-bold text-[#1A1A1A]">{stats.ratedCount}</div>
                <div className="text-[11px] text-muted-foreground">Lượt đánh giá sao</div>
              </CardContent>
            </Card>

            <Card className="bg-[#FAFAFA] border-[#E5E7EB] p-3.5 text-center shadow-2xs col-span-2 sm:col-span-1">
              <CardContent className="p-0">
                <Share2 className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                <div className="text-xl font-bold text-[#1A1A1A]">
                  {stats.sharedCount ?? profileData?.sharedPlaces?.length ?? 0}
                </div>
                <div className="text-[11px] text-muted-foreground">Đã chia sẻ</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content with Tabs */}
      <section className="container mx-auto px-4 max-w-5xl py-8">
        {/* Tab Pills */}
        <div className="flex border-b border-[#E5E7EB] mb-8 overflow-x-auto space-x-1 pb-1">
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center gap-1.5 px-3.5 py-2 font-medium text-xs rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'wishlist'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'text-muted-foreground hover:text-[#1A1A1A] hover:bg-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Wishlist ({profileData?.savedPlaces.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('liked')}
            className={`flex items-center gap-1.5 px-3.5 py-2 font-medium text-xs rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'liked'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'text-muted-foreground hover:text-[#1A1A1A] hover:bg-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Đã thích ({profileData?.likedPlaces.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('rated')}
            className={`flex items-center gap-1.5 px-3.5 py-2 font-medium text-xs rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'rated'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'text-muted-foreground hover:text-[#1A1A1A] hover:bg-white'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Đã đánh giá ({profileData?.ratedPlaces?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('shared')}
            className={`flex items-center gap-1.5 px-3.5 py-2 font-medium text-xs rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'shared'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'text-muted-foreground hover:text-[#1A1A1A] hover:bg-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Đã chia sẻ ({profileData?.sharedPlaces?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('trips')}
            className={`flex items-center gap-1.5 px-3.5 py-2 font-medium text-xs rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'trips'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'text-muted-foreground hover:text-[#1A1A1A] hover:bg-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Chuyến đi ({profileData?.trips.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-1.5 px-3.5 py-2 font-medium text-xs rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'preferences'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'text-muted-foreground hover:text-[#1A1A1A] hover:bg-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Cài đặt sở thích</span>
          </button>
        </div>

        {/* Tab 1: Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5" />
                Địa điểm đã lưu vào danh sách mong muốn
              </h2>
              {profileData?.savedPlaces && profileData.savedPlaces.length > 0 && (
                <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Link href="/trips/new">
                    <Sparkles className="w-3.5 h-3.5 text-[#365314]" /> Tạo lịch trình từ Wishlist
                  </Link>
                </Button>
              )}
            </div>

            {profileData?.savedPlaces.length === 0 ? (
              <Card className="p-10 text-center bg-white border-[#E5E7EB] rounded-2xl">
                <CardContent className="p-0">
                  <Bookmark className="w-9 h-9 text-neutral-300 mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1">Chưa có địa điểm nào được lưu</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Khám phá địa điểm và bấm lưu lại các điểm đến bạn quan tâm!
                  </p>
                  <Button asChild size="sm">
                    <Link href="/places">Khám phá địa điểm</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profileData?.savedPlaces.map((place) => (
                  <Card
                    key={place.id}
                    className="bg-white border-[#E5E7EB] hover:border-[#1A1A1A]/30 rounded-2xl p-4 flex flex-col justify-between transition shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground">
                          {place.province || 'Việt Nam'}
                        </Badge>
                        <span className="text-xs font-mono font-medium text-[#1A1A1A]">
                          {place.priceEstimate > 0
                            ? `${place.priceEstimate.toLocaleString('vi-VN')} đ`
                            : 'Miễn phí'}
                        </span>
                      </div>
                      <h4 className="font-semibold text-[#1A1A1A] text-sm mb-1 line-clamp-1">
                        {place.name}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {place.description}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSaved(place.id)}
                        className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-rose-600 gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Bỏ lưu</span>
                      </Button>
                      <Link
                        href={`/places#${place.id}`}
                        className="text-xs font-medium text-[#1A1A1A] hover:underline flex items-center gap-0.5"
                      >
                        Chi tiết <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Liked Places */}
        {activeTab === 'liked' && (
          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              Địa điểm bạn đã thích
            </h2>

            {profileData?.likedPlaces.length === 0 ? (
              <Card className="p-10 text-center bg-white border-[#E5E7EB] rounded-2xl">
                <CardContent className="p-0">
                  <Heart className="w-9 h-9 text-neutral-300 mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1">Chưa thích địa điểm nào</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Thả tim các địa điểm để AI hiểu gu du lịch của bạn tốt hơn!
                  </p>
                  <Button asChild size="sm">
                    <Link href="/places">Khám phá địa điểm</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profileData?.likedPlaces.map((place) => (
                  <Card
                    key={place.id}
                    className="bg-white border-[#E5E7EB] hover:border-[#1A1A1A]/30 rounded-2xl p-4 flex flex-col justify-between transition shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground">
                          {place.province || 'Việt Nam'}
                        </Badge>
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      </div>
                      <h4 className="font-semibold text-[#1A1A1A] text-sm mb-1 line-clamp-1">
                        {place.name}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {place.description}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveLiked(place.id)}
                        className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-rose-600 gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Bỏ thích</span>
                      </Button>
                      <Link
                        href={`/places#${place.id}`}
                        className="text-xs font-medium text-[#1A1A1A] hover:underline flex items-center gap-0.5"
                      >
                        Xem <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Rated Places */}
        {activeTab === 'rated' && (
          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
              <Star className="w-3.5 h-3.5" />
              Địa điểm bạn đã chấm điểm & đánh giá
            </h2>

            {(!profileData?.ratedPlaces || profileData.ratedPlaces.length === 0) ? (
              <Card className="p-10 text-center bg-white border-[#E5E7EB] rounded-2xl">
                <CardContent className="p-0">
                  <Star className="w-9 h-9 text-neutral-300 mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1">Chưa đánh giá địa điểm nào</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Đánh giá các địa điểm bạn đã trải nghiệm để chia sẻ cùng cộng đồng.
                  </p>
                  <Button asChild size="sm">
                    <Link href="/places">Đánh giá địa điểm</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profileData.ratedPlaces.map((item) => (
                  <Card
                    key={item.place.id}
                    className="bg-white border-[#E5E7EB] hover:border-[#1A1A1A]/30 rounded-2xl p-4 flex flex-col justify-between transition shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground">
                          {item.place.province || 'Việt Nam'}
                        </Badge>
                        <Badge variant="secondary" className="gap-1 text-[11px] font-medium">
                          <Star className="w-3 h-3 fill-neutral-700" />
                          <span>{item.rating}/5</span>
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-[#1A1A1A] text-sm mb-1 line-clamp-1">
                        {item.place.name}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {item.place.description}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRating(item.place.id)}
                        className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-rose-600 gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Xóa đánh giá</span>
                      </Button>
                      <Link
                        href={`/places#${item.place.id}`}
                        className="text-xs font-medium text-[#1A1A1A] hover:underline flex items-center gap-0.5"
                      >
                        Chi tiết <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Shared Places */}
        {activeTab === 'shared' && (
          <div className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
              <Share2 className="w-3.5 h-3.5" />
              Địa điểm bạn đã chia sẻ
            </h2>

            {(!profileData?.sharedPlaces || profileData.sharedPlaces.length === 0) ? (
              <Card className="p-10 text-center bg-white border-[#E5E7EB] rounded-2xl">
                <CardContent className="p-0">
                  <Share2 className="w-9 h-9 text-neutral-300 mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1">Chưa có bài chia sẻ nào</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Tại trang Khám phá, bấm nút Chia sẻ để giới thiệu các địa điểm yêu thích lên hồ sơ của bạn.
                  </p>
                  <Button asChild size="sm">
                    <Link href="/places">Khám phá và chia sẻ</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profileData.sharedPlaces.map((item) => (
                  <Card
                    key={item.id}
                    className="bg-white border-[#E5E7EB] hover:border-[#1A1A1A]/30 rounded-2xl p-4 flex flex-col justify-between transition shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground">
                          {item.place.province || 'Việt Nam'}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(item.sharedAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>

                      {item.note && (
                        <div className="p-2 rounded-lg bg-[#FAFAFA] border border-[#E5E7EB] mb-2.5 text-xs text-muted-foreground italic">
                          &ldquo;{item.note}&rdquo;
                        </div>
                      )}

                      <h4 className="font-semibold text-[#1A1A1A] text-sm mb-1 line-clamp-1">
                        {item.place.name}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {item.place.description}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveShared(item.place.id)}
                        className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-rose-600 gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Xóa chia sẻ</span>
                      </Button>
                      <Link
                        href={`/places#${item.place.id}`}
                        className="text-xs font-medium text-[#1A1A1A] hover:underline flex items-center gap-0.5"
                      >
                        Xem <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: My Trips */}
        {activeTab === 'trips' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Lịch sử các chuyến đi đã tạo
              </h2>
              <Button asChild size="sm" className="gap-1.5 text-xs">
                <Link href="/trips/new">+ Tạo chuyến đi mới</Link>
              </Button>
            </div>

            {profileData?.trips.length === 0 ? (
              <Card className="p-10 text-center bg-white border-[#E5E7EB] rounded-2xl">
                <CardContent className="p-0">
                  <Calendar className="w-9 h-9 text-neutral-300 mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1">Chưa có chuyến đi nào</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Tạo chuyến đi đầu tiên để AI tối ưu hóa lịch trình cho bạn.
                  </p>
                  <Button asChild size="sm">
                    <Link href="/trips/new">Lập lịch trình ngay</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {profileData?.trips.map((trip) => (
                  <Card
                    key={trip.id}
                    className="bg-white border-[#E5E7EB] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#1A1A1A]/30 transition shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="lime" className="text-[10px]">
                          {trip.status}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">
                          Tạo ngày {new Date(trip.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-[#1A1A1A] flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        Chuyến đi {trip.destination}
                      </h4>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-0.5">
                        <span>
                          {new Date(trip.startDate).toLocaleDateString('vi-VN')} -{' '}
                          {new Date(trip.endDate).toLocaleDateString('vi-VN')}
                        </span>
                        <span>{trip.groupSize} người</span>
                        <span className="font-medium text-[#1A1A1A]">
                          {trip.budgetPerPerson ? trip.budgetPerPerson.toLocaleString('vi-VN') : 0} đ / người
                        </span>
                      </div>
                    </div>

                    <div>
                      <Button asChild variant="outline" size="sm" className="gap-1 text-xs">
                        <Link href={`/trips/${trip.id}`}>
                          <span>Xem chi tiết</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Preferences & Settings */}
        {activeTab === 'preferences' && (
          <Card className="bg-white border-[#E5E7EB] rounded-2xl p-6 space-y-6 shadow-2xs">
            <CardContent className="p-0 space-y-6">
              <div>
                <h2 className="text-base font-bold text-[#1A1A1A] mb-1 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  Cài đặt hồ sơ & huấn luyện AI gợi ý
                </h2>
                <p className="text-xs text-muted-foreground">
                  Gu du lịch và ngân sách dưới đây sẽ đóng vai trò là đặc trưng người dùng (User Features) truyền vào mô hình học máy để cá nhân hóa kết quả gợi ý.
                </p>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Tên hiển thị của bạn
                </label>
                <Input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Nhập tên của bạn..."
                  className="max-w-md bg-[#FAFAFA]"
                />
              </div>

              {/* Preferred Styles */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Gu du lịch yêu thích (Chọn nhiều)
                </label>
                <div className="flex flex-wrap gap-1.5 max-w-2xl">
                  {AVAILABLE_STYLES.map((style) => {
                    const isSelected = selectedStyles.includes(style);
                    return (
                      <button
                        key={style}
                        type="button"
                        onClick={() => toggleStyle(style)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#1A1A1A] text-white shadow-xs'
                            : 'bg-white border border-[#E5E7EB] text-muted-foreground hover:text-[#1A1A1A] hover:bg-[#FAFAFA]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-[#D4F066]" />}
                        <span>{style}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Budget Level */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
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
                        className={`text-left p-3.5 rounded-xl border transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#F4FCE3] border-[#D9F99D] text-[#365314] shadow-xs'
                            : 'bg-white border-[#E5E7EB] text-muted-foreground hover:border-[#1A1A1A]/30'
                        }`}
                      >
                        <div className="font-semibold text-xs text-[#1A1A1A] mb-1">{b.label}</div>
                        <div className="text-[11px] text-muted-foreground leading-relaxed">{b.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-[#E5E7EB] flex justify-end">
                <Button
                  onClick={handleSavePreferences}
                  disabled={isSavingPref}
                  size="sm"
                  className="gap-1.5 text-xs font-medium"
                >
                  {isSavingPref ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Lưu cài đặt hồ sơ</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
