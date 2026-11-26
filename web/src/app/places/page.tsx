'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
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
import { formatIndoorOutdoor } from '@/lib/labels';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
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

function PlacesSocialFeedContent() {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const searchParams = useSearchParams();

  // Filter & Search states (initialized from URL query params if navigated from Landing Page)
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [selectedProvince, setSelectedProvince] = useState(() => searchParams.get('province') || 'ALL');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // In-feed comment expansion & input state
  const [activeCommentsPlaceId, setActiveCommentsPlaceId] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, CommentItem[]>>({});
  const [commentsLoading, setCommentsLoading] = useState<Record<string, boolean>>({});
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});
  const [isSubmittingComment, setIsSubmittingComment] = useState<Record<string, boolean>>({});

  // Directions & Weather Modal state
  const [directionsPlace, setDirectionsPlace] = useState<Place | null>(null);

  // Share to profile modal state
  const [sharingPlace, setSharingPlace] = useState<Place | null>(null);

  // Star hover preview state
  const [hoverRating, setHoverRating] = useState<Record<string, number>>({});

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
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-24">
      {/* Header Section */}
      <section className="border-b border-[#E2E8F0] bg-white py-8 md:py-10">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F172A] mb-2.5">
            Khám phá &amp; trải nghiệm điểm đến
          </h1>

          <p className="text-[#64748B] text-sm max-w-xl mx-auto leading-relaxed">
            Tìm kiếm địa điểm du lịch thực tế, lưu lại mục yêu thích và chia sẻ đánh giá trải nghiệm của bạn.
          </p>
        </div>
      </section>

      {/* Search & Filter Controls */}
      <section className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="p-5 bg-white border-[#E2E8F0] shadow-none mb-8 space-y-5 rounded-2xl">
          <CardContent className="p-0 space-y-5">
            {/* Search and Sort row */}
            <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  aria-label="Tìm theo tên địa điểm"
                  placeholder="Tìm theo tên địa điểm, quận, mô tả..."
                  className="pl-9 bg-[#F8FAFC] border-[#E2E8F0] text-sm"
                />
              </div>

              <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMobileFilters((v) => !v)}
                  className="md:hidden h-9 text-xs gap-1.5 border-[#E2E8F0]"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{showMobileFilters ? 'Ẩn bộ lọc' : 'Bộ lọc'}</span>
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#64748B] hidden sm:flex items-center gap-1.5 whitespace-nowrap">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#64748B]" /> Sắp xếp:
                  </span>
                  <div className="w-[190px] sm:w-[200px]">
                    <Select
                      value={sortBy}
                      onValueChange={(val) => {
                        setSortBy(val);
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="h-9 text-xs bg-[#F8FAFC] border-[#E2E8F0]">
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
            </div>

            <div className={`${showMobileFilters ? 'block' : 'hidden'} md:block space-y-5`}>
              {/* Province Filter Pills */}
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] mb-2.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0D9488]" />
                  <span>Tỉnh / Thành phố trọng điểm</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PROVINCES.map((prov) => {
                    const isActive = selectedProvince === prov.key;
                    return (
                      <button
                        key={prov.key}
                        type="button"
                        onClick={() => {
                          setSelectedProvince(prov.key);
                          setPage(1);
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs transition cursor-pointer font-medium ${
                          isActive
                            ? 'bg-[#0D9488] text-white'
                            : 'bg-[#F1F5F9] text-[#0F172A] hover:bg-[#E2E8F0]'
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
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#0D9488]" />
                  <span>Thể loại trải nghiệm</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => {
                    const isActive = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setPage(1);
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs transition cursor-pointer font-medium border ${
                          isActive
                            ? 'bg-[#F0FDFA] text-[#0F766E] border-[#99F6E4] font-semibold'
                            : 'bg-white border-[#E2E8F0] text-[#64748B] hover:text-[#0D9488] hover:bg-[#F0FDFA]'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Counter & Wishlist Link */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="text-xs text-[#64748B]">
            Hiển thị <span className="font-semibold text-[#0F172A]">{places.length}</span> / {totalCount} địa điểm
          </div>
          {isAuthenticated && (
            <Link
              href="/profile"
              className="text-xs text-[#0D9488] hover:underline flex items-center gap-1 font-medium transition"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#F59E0B]" /> Xem Wishlist đã lưu →
            </Link>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 text-[#0D9488] animate-spin mx-auto mb-3" />
            <p className="text-[#64748B] text-xs">Đang tải danh sách địa điểm...</p>
          </div>
        ) : places.length === 0 ? (
          <Card className="py-16 text-center bg-white border-[#E2E8F0] p-8 rounded-2xl shadow-none">
            <CardContent className="p-0">
              <Compass className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
              <h3 className="text-base font-semibold text-[#0F172A] mb-1">Không tìm thấy địa điểm phù hợp</h3>
              <p className="text-[#64748B] text-xs mb-4">
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
                className="border-[#E2E8F0] hover:border-[#0D9488] hover:text-[#0D9488]"
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
                  className="group bg-white border-[#E2E8F0] hover:border-[#0D9488]/50 rounded-2xl overflow-hidden shadow-none transition-colors flex flex-col justify-between"
                >
                  <div>
                    {/* Visual Banner Area */}
                    <div className="relative h-48 w-full overflow-hidden bg-[#F1F5F9]">
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
                        <div className="w-full h-full flex items-center justify-center bg-[#F1F5F9]">
                          <div className="text-center p-4">
                            <MapPin className="w-8 h-8 text-[#94A3B8] mx-auto mb-1" />
                            <span className="text-xs text-[#64748B] font-medium">
                              {place.district || provMeta.label}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                        <Badge variant="secondary" className="backdrop-blur-md bg-white/92 text-[#0F172A] border-[#E2E8F0] text-[11px]">
                          {provMeta.label}
                        </Badge>

                        <Badge variant="secondary" className="backdrop-blur-md bg-white/92 text-[#0F172A] border-[#E2E8F0] text-[11px] flex items-center gap-1 font-mono font-medium">
                          <Ticket className="w-3 h-3 text-[#0D9488]" />
                          {place.priceEstimate > 0
                            ? `${place.priceEstimate.toLocaleString('vi-VN')} đ`
                            : 'Miễn phí'}
                        </Badge>
                      </div>
                    </div>

                    {/* Content Section */}
                    <CardContent className="p-4 pb-2">
                      {/* Name */}
                      <h3 className="mb-1.5">
                        <button
                          type="button"
                          onClick={() => setDirectionsPlace(place)}
                          className="text-left text-base font-semibold text-[#0F172A] line-clamp-1 hover:text-[#0D9488] hover:underline cursor-pointer transition-colors"
                          title="Bấm để xem chỉ đường & thời tiết"
                        >
                          {place.name}
                        </button>
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-[#64748B] line-clamp-2 mb-3 leading-relaxed">
                        {place.description || 'Địa điểm du lịch nổi tiếng với nhiều hoạt động hấp dẫn.'}
                      </p>

                      {/* Category Badges */}
                      <div className="flex flex-wrap items-center gap-1 mb-3">
                        {place.categories?.slice(0, 3).map((cat) => (
                          <Badge
                            key={cat}
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 h-5 font-normal text-[#64748B] border-[#E2E8F0]"
                          >
                            #{cat}
                          </Badge>
                        ))}
                        {place.indoorOutdoor && (
                          <Badge
                            variant="teal"
                            className="text-[10px] px-1.5 py-0 h-5 font-normal"
                          >
                            {formatIndoorOutdoor(place.indoorOutdoor)}
                          </Badge>
                        )}
                      </div>

                      {/* Rating Summary & Interactive Star Picker */}
                      <div className="flex items-center justify-between gap-2 text-xs text-[#64748B] mb-3 px-0.5">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B] flex-shrink-0" />
                          <span className="text-xs font-semibold text-[#0F172A] tabular-nums">
                            {place.ratingAvg > 0 ? place.ratingAvg.toFixed(1) : '—'}
                          </span>
                          <span className="text-[11px] text-[#64748B] tabular-nums">
                            ({place.ratingCount})
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <div
                            className="flex items-center gap-0.5"
                            onMouseLeave={() =>
                              setHoverRating((prev) => ({ ...prev, [place.id]: 0 }))
                            }
                          >
                            {[1, 2, 3, 4, 5].map((starVal) => {
                              const activeStars =
                                hoverRating[place.id] || place.userRating || 0;
                              const isFilled = starVal <= activeStars;
                              return (
                                <button
                                  key={starVal}
                                  type="button"
                                  onMouseEnter={() =>
                                    setHoverRating((prev) => ({ ...prev, [place.id]: starVal }))
                                  }
                                  onClick={() => handleRate(place.id, starVal)}
                                  aria-label={`Đánh giá ${starVal} sao cho ${place.name}`}
                                  title={`Chấm ${starVal} sao`}
                                  className="p-0.5 cursor-pointer transition-transform hover:scale-110"
                                >
                                  <Star
                                    className={`w-3.5 h-3.5 ${
                                      isFilled
                                        ? 'text-[#F59E0B] fill-[#F59E0B]'
                                        : 'text-[#CBD5E1]'
                                    }`}
                                  />
                                </button>
                              );
                            })}
                          </div>
                          {place.userRating && (
                            <button
                              type="button"
                              onClick={() => handleUnrate(place.id)}
                              title="Bấm để hủy đánh giá"
                              className="text-[10px] font-medium text-[#B45309] bg-[#FFFBEB] border border-[#FDE68A] hover:bg-[#FEF3C7] px-1.5 py-0.5 rounded-full ml-1 cursor-pointer"
                            >
                              {place.userRating}★ ✕
                            </button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  {/* Actions Footer */}
                  <div>
                    <div className="border-t border-[#E2E8F0] px-3 py-2 bg-[#F8FAFC] flex items-center justify-between text-xs">
                      {/* Left: Like & Save & Comment */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleLike(place)}
                          className={`h-7 px-2 text-xs gap-1 font-medium ${
                            place.isLiked
                              ? 'text-[#FF6B6B] bg-[#FFF1F2] hover:bg-[#FFE4E6] hover:text-[#FF6B6B]'
                              : 'text-[#64748B] hover:text-[#0F172A]'
                          }`}
                          title={place.isLiked ? 'Bỏ thích' : 'Thích địa điểm'}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${place.isLiked ? 'fill-[#FF6B6B] text-[#FF6B6B]' : ''}`}
                          />
                          <span className="tabular-nums">{place.likesCount}</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleSave(place)}
                          className={`h-7 px-2 text-xs gap-1 font-medium ${
                            place.isSaved
                              ? 'text-[#B45309] bg-[#FFFBEB] hover:bg-[#FEF3C7] hover:text-[#B45309]'
                              : 'text-[#64748B] hover:text-[#0F172A]'
                          }`}
                          title={place.isSaved ? 'Đã lưu trong Wishlist' : 'Lưu vào Wishlist'}
                        >
                          <Bookmark
                            className={`w-3.5 h-3.5 ${place.isSaved ? 'fill-[#F59E0B] text-[#F59E0B]' : ''}`}
                          />
                          <span className="tabular-nums">{place.savesCount}</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleComments(place.id)}
                          className={`h-7 px-2 text-xs gap-1 font-medium ${
                            isCommentsOpen ? 'bg-[#F0FDFA] text-[#0D9488]' : 'text-[#64748B] hover:text-[#0F172A]'
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
                          className="h-7 px-2.5 text-xs gap-1 font-medium border-[#E2E8F0] hover:border-[#0D9488] hover:text-[#0D9488] hover:bg-[#F0FDFA]"
                          title="Xem chỉ đường & thời tiết"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Chỉ đường</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare(place)}
                          aria-label="Chia sẻ địa điểm"
                          className="h-7 w-7 p-0 text-[#64748B] hover:text-[#0D9488]"
                          title="Chia sẻ địa điểm"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Expandable Comments Drawer */}
                    {isCommentsOpen && (
                      <div className="border-t border-[#E2E8F0] bg-white p-3 space-y-2.5">
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
                            className="h-8 text-xs bg-[#F8FAFC]"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleCommentSubmit(place.id)}
                            disabled={
                              !isAuthenticated ||
                              isSubmittingComment[place.id] ||
                              !(newCommentText[place.id] || '').trim()
                            }
                            aria-label="Gửi bình luận"
                            className="h-8 w-8 p-0 flex-shrink-0 bg-[#0D9488] hover:bg-[#0F766E] text-white"
                          >
                            {isSubmittingComment[place.id] ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        </div>

                        {commentsLoading[place.id] ? (
                          <div className="text-center py-2 text-xs text-[#64748B]">
                            <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto mb-1 text-[#0D9488]" />
                            Đang tải bình luận...
                          </div>
                        ) : placeComments.length === 0 ? (
                          <div className="text-center py-2 text-[11px] text-[#64748B]">
                            Chưa có bình luận nào. Hãy là người đầu tiên!
                          </div>
                        ) : (
                          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                            {placeComments.map((c) => (
                              <div
                                key={c.id}
                                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2 text-xs"
                              >
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="font-medium text-[#0F172A] text-[11px]">
                                    {c.user.name || c.user.email.split('@')[0]}
                                  </span>
                                  <span className="text-[10px] text-[#64748B]">
                                    {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                                  </span>
                                </div>
                                <p className="text-[#64748B] text-[11px] leading-relaxed">
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
              className="gap-1 text-xs border-[#E2E8F0]"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Trang trước
            </Button>

            <span className="text-xs text-[#64748B] px-2">
              Trang <strong className="text-[#0F172A]">{page}</strong> / {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="gap-1 text-xs border-[#E2E8F0]"
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

export default function PlacesSocialFeedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
          <Loader2 className="w-7 h-7 animate-spin text-[#0D9488]" />
        </div>
      }
    >
      <PlacesSocialFeedContent />
    </Suspense>
  );
}
