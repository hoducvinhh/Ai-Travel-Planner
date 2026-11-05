'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  Heart,
  Bookmark,
  Star,
  MessageCircle,
  Share2,
  MapPin,
  Compass,
  Search,
  SlidersHorizontal,
  Navigation,
  Send,
  Loader2,
  Check,
  Ticket,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { Place, CommentItem } from '@/types';
import { VIETNAM_PROVINCES, getProvinceMeta } from '@/lib/provinces';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PlaceDirectionsModal = dynamic(
  () => import('@/components/PlaceDirectionsModal'),
  { ssr: false }
);

const SharePlaceModal = dynamic(
  () => import('@/components/SharePlaceModal'),
  { ssr: false }
);

const PROVINCES = [
  { key: 'ALL', label: 'Tất cả điểm đến' },
  ...VIETNAM_PROVINCES.map((p) => ({
    key: p.key,
    label: p.label,
  })),
];

const CATEGORIES = [
  'Tất cả',
  'Thiên nhiên',
  'Văn hóa',
  'Lịch sử',
  'Ẩm thực',
  'Check-in',
  'Giải trí',
  'Mua sắm',
  'Tâm linh',
  'Nghỉ dưỡng',
];

export default function PlacesSocialFeedPage() {
  const { user, isAuthenticated } = useAuth();

  // Filter & Search states
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // In-feed comment expansion & input state
  const [activeCommentsPlaceId, setActiveCommentsPlaceId] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, CommentItem[]>>({});
  const [commentsLoading, setCommentsLoading] = useState<Record<string, boolean>>({});
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});
  const [isSubmittingComment, setIsSubmittingComment] = useState<Record<string, boolean>>({});

  // UI Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Directions & Weather Modal state
  const [directionsPlace, setDirectionsPlace] = useState<Place | null>(null);

  // Share to profile modal state
  const [sharingPlace, setSharingPlace] = useState<Place | null>(null);

  // Star hover preview state
  const [hoverRating, setHoverRating] = useState<Record<string, number>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchPlaces = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sortBy,
      });

      if (selectedProvince !== 'ALL') {
        params.append('province', selectedProvince);
      }
      if (selectedCategory !== 'Tất cả') {
        params.append('category', selectedCategory);
      }
      if (search.trim()) {
        params.append('search', search.trim());
      }
      if (user?.id) {
        params.append('userId', user.id);
      }

      const res = await api.get<{
        items: Place[];
        pagination: { page: number; total: number; totalPages: number };
      }>(`/places?${params.toString()}`);

      setPlaces(res.items || []);
      setTotalPages(res.pagination?.totalPages || 1);
      setTotalCount(res.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, selectedProvince, selectedCategory, search, sortBy, user?.id]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  // Handle Like Toggle
  const handleToggleLike = async (place: Place) => {
    if (!isAuthenticated || !user) {
      showToast('Vui lòng đăng nhập để thích địa điểm!');
      return;
    }

    const prevLiked = !!place.isLiked;
    const nextLiked = !prevLiked;
    setPlaces((prev) =>
      prev.map((p) =>
        p.id === place.id
          ? {
              ...p,
              isLiked: nextLiked,
              likesCount: nextLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
            }
          : p,
      ),
    );

    try {
      const res = await api.post<{ isLiked: boolean; likesCount: number }>('/interactions/toggle-like', {
        userId: user.id,
        placeId: place.id,
      });
      setPlaces((prev) =>
        prev.map((p) =>
          p.id === place.id ? { ...p, isLiked: res.isLiked, likesCount: res.likesCount } : p,
        ),
      );
    } catch {
      setPlaces((prev) =>
        prev.map((p) => (p.id === place.id ? { ...p, isLiked: prevLiked } : p)),
      );
      showToast('Có lỗi xảy ra khi thích địa điểm');
    }
  };

  // Handle Save / Wishlist Toggle
  const handleToggleSave = async (place: Place) => {
    if (!isAuthenticated || !user) {
      showToast('Vui lòng đăng nhập để lưu vào Wishlist!');
      return;
    }

    const prevSaved = !!place.isSaved;
    const nextSaved = !prevSaved;
    setPlaces((prev) =>
      prev.map((p) =>
        p.id === place.id
          ? {
              ...p,
              isSaved: nextSaved,
              savesCount: nextSaved ? p.savesCount + 1 : Math.max(0, p.savesCount - 1),
            }
          : p,
      ),
    );

    try {
      const res = await api.post<{ isSaved: boolean }>('/interactions/toggle-save', {
        userId: user.id,
        placeId: place.id,
      });
      setPlaces((prev) =>
        prev.map((p) => (p.id === place.id ? { ...p, isSaved: res.isSaved } : p)),
      );
      showToast(res.isSaved ? 'Đã lưu vào danh sách Wishlist!' : 'Đã bỏ lưu khỏi Wishlist');
    } catch {
      setPlaces((prev) =>
        prev.map((p) => (p.id === place.id ? { ...p, isSaved: prevSaved } : p)),
      );
      showToast('Có lỗi xảy ra khi lưu địa điểm');
    }
  };

  // Handle Rating (1-5 stars)
  const handleRate = async (placeId: string, ratingValue: number) => {
    if (!isAuthenticated || !user) {
      showToast('Vui lòng đăng nhập để đánh giá địa điểm!');
      return;
    }

    try {
      const res = await api.post<{
        success: boolean;
        userRating: number;
        ratingAvg: number;
        ratingCount: number;
      }>('/interactions/rate', {
        userId: user.id,
        placeId,
        ratingValue,
      });

      setPlaces((prev) =>
        prev.map((p) =>
          p.id === placeId
            ? {
                ...p,
                userRating: res.userRating,
                ratingAvg: res.ratingAvg,
                ratingCount: res.ratingCount,
              }
            : p,
        ),
      );
      showToast(`Cảm ơn bạn đã đánh giá ${ratingValue} sao!`);
    } catch {
      showToast('Có lỗi xảy ra khi gửi đánh giá');
    }
  };

  // Handle Unrate
  const handleUnrate = async (placeId: string) => {
    if (!isAuthenticated || !user) return;

    try {
      const res = await api.post<{
        success: boolean;
        userRating: null;
        ratingAvg: number;
        ratingCount: number;
      }>('/interactions/unrate', {
        userId: user.id,
        placeId,
      });

      setPlaces((prev) =>
        prev.map((p) =>
          p.id === placeId
            ? {
                ...p,
                userRating: null,
                ratingAvg: res.ratingAvg,
                ratingCount: res.ratingCount,
              }
            : p,
        ),
      );
      showToast('Đã hủy đánh giá của bạn');
    } catch {
      showToast('Có lỗi xảy ra khi hủy đánh giá');
    }
  };

  const handleShare = (place: Place) => {
    setSharingPlace(place);
  };

  const toggleComments = async (placeId: string) => {
    if (activeCommentsPlaceId === placeId) {
      setActiveCommentsPlaceId(null);
      return;
    }

    setActiveCommentsPlaceId(placeId);

    if (user?.id) {
      api.post('/interactions/track', {
        userId: user.id,
        placeId,
        eventType: 'VIEW_DETAIL',
      }).catch(() => {});
    }

    if (!commentsMap[placeId]) {
      setCommentsLoading((prev) => ({ ...prev, [placeId]: true }));
      try {
        const comments = await api.get<CommentItem[]>(`/places/${placeId}/comments`);
        setCommentsMap((prev) => ({ ...prev, [placeId]: comments }));
      } catch (err) {
        console.error('Failed to load comments:', err);
      } finally {
        setCommentsLoading((prev) => ({ ...prev, [placeId]: false }));
      }
    }
  };

  const handleCommentSubmit = async (placeId: string) => {
    const text = (newCommentText[placeId] || '').trim();
    if (!text) return;

    if (!isAuthenticated || !user) {
      showToast('Vui lòng đăng nhập để bình luận!');
      return;
    }

    setIsSubmittingComment((prev) => ({ ...prev, [placeId]: true }));
    try {
      const added = await api.post<CommentItem>(`/places/${placeId}/comments`, {
        userId: user.id,
        content: text,
      });

      setCommentsMap((prev) => ({
        ...prev,
        [placeId]: [added, ...(prev[placeId] || [])],
      }));

      setPlaces((prev) =>
        prev.map((p) => (p.id === placeId ? { ...p, commentsCount: p.commentsCount + 1 } : p)),
      );

      setNewCommentText((prev) => ({ ...prev, [placeId]: '' }));
      showToast('Bình luận của bạn đã được đăng!');
    } catch {
      showToast('Có lỗi xảy ra khi gửi bình luận');
    } finally {
      setIsSubmittingComment((prev) => ({ ...prev, [placeId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F8] text-[#1A1A1A] pb-24">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white px-4 py-2.5 rounded-xl shadow-lg border border-[#333333] flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-4 h-4 text-[#D4F066]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <section className="border-b border-[#E5E7EB] bg-white py-8 md:py-10">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[#1A1A1A] mb-2.5">
            Khám phá & trải nghiệm điểm đến
          </h1>

          <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed">
            Tìm kiếm địa điểm du lịch thực tế, lưu lại mục yêu thích và chia sẻ đánh giá trải nghiệm của bạn.
          </p>
        </div>
      </section>

      {/* Search & Filter Controls */}
      <section className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="p-5 bg-white border-[#E5E7EB] shadow-2xs mb-8 space-y-5">
          <CardContent className="p-0 space-y-5">
            {/* Search and Sort row */}
            <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Tìm theo tên địa điểm, quận, mô tả..."
                  className="pl-9 bg-[#FAFAFA] border-[#E5E7EB] text-sm"
                />
              </div>

              <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5 whitespace-nowrap">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" /> Sắp xếp:
                </span>
                <div className="w-[200px]">
                  <Select
                    value={sortBy}
                    onValueChange={(val) => {
                      setSortBy(val);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-9 text-xs bg-[#FAFAFA] border-[#E5E7EB]">
                      <SelectValue placeholder="Sắp xếp theo..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">Độ nổi tiếng (Mặc định)</SelectItem>
                      <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                      <SelectItem value="price_asc">Giá vé: Thấp đến cao</SelectItem>
                      <SelectItem value="price_desc">Giá vé: Cao đến thấp</SelectItem>
                      <SelectItem value="newest">Mới cập nhật</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Province Filter Pills */}
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Tỉnh / Thành phố trọng điểm</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PROVINCES.map((prov) => {
                  const isActive = selectedProvince === prov.key;
                  return (
                    <button
                      key={prov.key}
                      onClick={() => {
                        setSelectedProvince(prov.key);
                        setPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs transition cursor-pointer font-medium ${
                        isActive
                          ? 'bg-[#1A1A1A] text-white shadow-xs'
                          : 'bg-[#F5F5F4] text-[#1A1A1A] hover:bg-[#E5E7EB]'
                      }`}
                    >
                      {prov.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Thể loại trải nghiệm</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs transition cursor-pointer font-medium ${
                        isActive
                          ? 'bg-[#F4FCE3] text-[#365314] font-semibold border border-[#D9F99D] shadow-2xs'
                          : 'bg-white border border-[#E5E7EB] text-muted-foreground hover:text-[#1A1A1A] hover:bg-[#F5F5F4]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Counter & Wishlist Link */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="text-xs text-muted-foreground">
            Hiển thị <span className="font-semibold text-[#1A1A1A]">{places.length}</span> / {totalCount} địa điểm
          </div>
          {isAuthenticated && (
            <Link
              href="/profile"
              className="text-xs text-[#1A1A1A] hover:underline flex items-center gap-1 font-medium transition"
            >
              <Bookmark className="w-3.5 h-3.5" /> Xem Wishlist đã lưu →
            </Link>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 text-neutral-400 animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground text-xs">Đang tải danh sách địa điểm...</p>
          </div>
        ) : places.length === 0 ? (
          <Card className="py-16 text-center bg-white border-[#E5E7EB] p-8">
            <CardContent className="p-0">
              <Compass className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-semibold text-[#1A1A1A] mb-1">Không tìm thấy địa điểm phù hợp</h3>
              <p className="text-muted-foreground text-xs mb-4">
                Hãy thử đổi từ khóa tìm kiếm hoặc bỏ chọn các tiêu chí lọc tỉnh thành/thể loại.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedProvince('ALL');
                  setSelectedCategory('Tất cả');
                  setSearch('');
                  setPage(1);
                }}
              >
                Đặt lại bộ lọc
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Places Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {places.map((place) => {
              const provMeta = getProvinceMeta(place.province);
              const isCommentsOpen = activeCommentsPlaceId === place.id;
              const placeComments = commentsMap[place.id] || [];

              return (
                <Card
                  key={place.id}
                  id={place.id}
                  className="group bg-white border-[#E5E7EB] hover:border-[#1A1A1A]/40 rounded-2xl overflow-hidden shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Visual Banner Area */}
                    <div className="relative h-48 w-full overflow-hidden bg-[#F0F0EF]">
                      {place.imageUrl ? (
                        <img
                          src={place.imageUrl}
                          alt={place.name}
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80';
                          }}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#F5F5F4]">
                          <div className="text-center p-4">
                            <MapPin className="w-8 h-8 text-neutral-400 mx-auto mb-1 opacity-70" />
                            <span className="text-xs text-muted-foreground font-medium">
                              {place.district || provMeta.label}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                        <Badge variant="secondary" className="backdrop-blur-md bg-white/90 text-[#1A1A1A] border-[#E5E7EB] text-[11px] shadow-2xs">
                          {provMeta.label}
                        </Badge>

                        <Badge variant="secondary" className="backdrop-blur-md bg-white/90 text-[#1A1A1A] border-[#E5E7EB] text-[11px] shadow-2xs flex items-center gap-1 font-mono font-medium">
                          <Ticket className="w-3 h-3 text-muted-foreground" />
                          {place.priceEstimate > 0
                            ? `${place.priceEstimate.toLocaleString('vi-VN')} đ`
                            : 'Miễn phí'}
                        </Badge>
                      </div>
                    </div>

                    {/* Content Section */}
                    <CardContent className="p-4 pb-2">
                      {/* Name */}
                      <h3
                        onClick={() => setDirectionsPlace(place)}
                        className="text-base font-semibold text-[#1A1A1A] mb-1.5 line-clamp-1 hover:underline cursor-pointer"
                        title="Bấm để xem chỉ đường & thời tiết"
                      >
                        {place.name}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                        {place.description || 'Địa điểm du lịch nổi tiếng với nhiều hoạt động hấp dẫn.'}
                      </p>

                      {/* Category Badges */}
                      <div className="flex flex-wrap items-center gap-1 mb-3">
                        {place.categories?.slice(0, 3).map((cat) => (
                          <Badge
                            key={cat}
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 h-5 font-normal text-muted-foreground border-[#E5E7EB]"
                          >
                            #{cat}
                          </Badge>
                        ))}
                        {place.indoorOutdoor && (
                          <Badge
                            variant="lime"
                            className="text-[10px] px-1.5 py-0 h-5 font-normal"
                          >
                            {place.indoorOutdoor}
                          </Badge>
                        )}
                      </div>

                      {/* Rating Summary */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 px-0.5">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-[#1A1A1A] fill-[#1A1A1A] flex-shrink-0" />
                          <span className="text-xs font-semibold text-[#1A1A1A]">
                            {place.ratingAvg > 0 ? place.ratingAvg.toFixed(1) : '—'}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            ({place.ratingCount} đánh giá)
                          </span>
                        </div>

                        {place.userRating && (
                          <span className="text-[11px] font-medium text-[#365314] flex items-center gap-1 bg-[#F4FCE3] border border-[#D9F99D] px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" /> Đã chấm {place.userRating}★
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </div>

                  {/* Actions Footer */}
                  <div>
                    <div className="border-t border-[#E5E7EB] px-3 py-2 bg-[#FAFAFA] flex items-center justify-between text-xs">
                      {/* Left: Like & Save & Comment */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleLike(place)}
                          className={`h-7 px-2 text-xs gap-1 font-medium ${
                            place.isLiked ? 'text-rose-600 hover:text-rose-700 bg-rose-50' : 'text-muted-foreground'
                          }`}
                          title={place.isLiked ? 'Bỏ thích' : 'Thích địa điểm'}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${place.isLiked ? 'fill-rose-600 text-rose-600' : ''}`}
                          />
                          <span>{place.likesCount}</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleSave(place)}
                          className={`h-7 px-2 text-xs gap-1 font-medium ${
                            place.isSaved ? 'text-amber-700 hover:text-amber-800 bg-amber-50' : 'text-muted-foreground'
                          }`}
                          title={place.isSaved ? 'Đã lưu trong Wishlist' : 'Lưu vào Wishlist'}
                        >
                          <Bookmark
                            className={`w-3.5 h-3.5 ${place.isSaved ? 'fill-amber-600 text-amber-600' : ''}`}
                          />
                          <span>{place.savesCount}</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleComments(place.id)}
                          className={`h-7 px-2 text-xs gap-1 font-medium ${
                            isCommentsOpen ? 'bg-[#E5E7EB] text-[#1A1A1A]' : 'text-muted-foreground'
                          }`}
                          title="Bình luận"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{place.commentsCount}</span>
                        </Button>
                      </div>

                      {/* Right: Directions & Share */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDirectionsPlace(place);
                          }}
                          className="h-7 px-2.5 text-xs gap-1 font-medium"
                          title="Xem chỉ đường & thời tiết"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Chỉ đường</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare(place)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-[#1A1A1A]"
                          title="Chia sẻ địa điểm"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Expandable Comments Drawer */}
                    {isCommentsOpen && (
                      <div className="border-t border-[#E5E7EB] bg-white p-3 space-y-2.5">
                        <div className="flex gap-1.5 items-center">
                          <Input
                            type="text"
                            value={newCommentText[place.id] || ''}
                            onChange={(e) =>
                              setNewCommentText((prev) => ({
                                ...prev,
                                [place.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleCommentSubmit(place.id);
                            }}
                            placeholder={
                              isAuthenticated
                                ? 'Viết bình luận, chia sẻ trải nghiệm...'
                                : 'Đăng nhập để để lại bình luận...'
                            }
                            disabled={!isAuthenticated}
                            className="h-8 text-xs bg-[#FAFAFA]"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleCommentSubmit(place.id)}
                            disabled={
                              !isAuthenticated ||
                              isSubmittingComment[place.id] ||
                              !(newCommentText[place.id] || '').trim()
                            }
                            className="h-8 w-8 p-0 flex-shrink-0"
                          >
                            {isSubmittingComment[place.id] ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        </div>

                        {commentsLoading[place.id] ? (
                          <div className="text-center py-2 text-xs text-muted-foreground">
                            <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto mb-1 text-neutral-400" />
                            Đang tải bình luận...
                          </div>
                        ) : placeComments.length === 0 ? (
                          <div className="text-center py-2 text-[11px] text-muted-foreground">
                            Chưa có bình luận nào. Hãy là người đầu tiên!
                          </div>
                        ) : (
                          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                            {placeComments.map((c) => (
                              <div
                                key={c.id}
                                className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg p-2 text-xs"
                              >
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="font-medium text-[#1A1A1A] text-[11px]">
                                    {c.user.name || c.user.email.split('@')[0]}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground">
                                    {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                                  </span>
                                </div>
                                <p className="text-muted-foreground text-[11px] leading-relaxed">
                                  {c.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="gap-1 text-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Trang trước
            </Button>

            <span className="text-xs text-muted-foreground px-2">
              Trang <strong className="text-[#1A1A1A]">{page}</strong> / {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="gap-1 text-xs"
            >
              Trang sau <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </section>

      {/* Directions & Weather Modal */}
      {directionsPlace && (
        <PlaceDirectionsModal
          place={directionsPlace}
          onClose={() => setDirectionsPlace(null)}
        />
      )}

      {/* Share to Profile Modal */}
      {sharingPlace && (
        <SharePlaceModal
          place={sharingPlace}
          userId={user?.id}
          onClose={() => setSharingPlace(null)}
          showToast={showToast}
        />
      )}
    </div>
  );
}
