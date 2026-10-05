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
  Tag,
  Sparkles,
  Ticket,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Place, CommentItem } from '@/types';

const PlaceDirectionsModal = dynamic(
  () => import('@/components/PlaceDirectionsModal'),
  { ssr: false }
);

const PROVINCES = [
  { key: 'ALL', label: 'Tất cả điểm đến', icon: '🌟' },
  { key: 'Hanoi', label: 'Hà Nội', icon: '🏛️' },
  { key: 'Ho Chi Minh', label: 'TP. Hồ Chí Minh', icon: '🏙️' },
  { key: 'Lam Dong', label: 'Đà Lạt (Lâm Đồng)', icon: '🌲' },
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
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'price_asc' | 'price_desc' | 'newest'>('popularity');
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

    // Optimistic UI update
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
    } catch (err) {
      // Revert on error
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
      showToast(res.isSaved ? 'Đã lưu vào danh sách Wishlist! 🔖' : 'Đã bỏ lưu khỏi Wishlist');
    } catch (err) {
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
      showToast(`Cảm ơn bạn đã đánh giá ${ratingValue} sao! ⭐`);
    } catch (err) {
      showToast('Có lỗi xảy ra khi gửi đánh giá');
    }
  };

  // Share place
  const handleShare = async (place: Place) => {
    const url = `${window.location.origin}/places#${place.id}`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      showToast('Đã sao chép liên kết địa điểm vào bộ nhớ tạm! 📋');
    }

    if (user?.id) {
      api.post('/interactions/track', {
        userId: user.id,
        placeId: place.id,
        eventType: 'SHARE',
      }).catch(() => {});
    }
  };

  // Toggle comments expand and fetch comments
  const toggleComments = async (placeId: string) => {
    if (activeCommentsPlaceId === placeId) {
      setActiveCommentsPlaceId(null);
      return;
    }

    setActiveCommentsPlaceId(placeId);

    // Track VIEW_DETAIL interaction
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

  // Submit comment
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
      showToast('Bình luận của bạn đã được đăng! 💬');
    } catch (err) {
      showToast('Có lỗi xảy ra khi gửi bình luận');
    } finally {
      setIsSubmittingComment((prev) => ({ ...prev, [placeId]: false }));
    }
  };

  const getProvinceBadge = (province?: string) => {
    if (province?.toLowerCase().includes('hanoi') || province?.includes('Hà Nội')) {
      return { text: 'Hà Nội', bg: 'bg-blue-500/15 text-blue-400 border-blue-500/30' };
    }
    if (
      province?.toLowerCase().includes('ho chi minh') ||
      province?.includes('Hồ Chí Minh')
    ) {
      return { text: 'TP. Hồ Chí Minh', bg: 'bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30' };
    }
    return { text: 'Đà Lạt (Lâm Đồng)', bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white pb-20">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 border border-emerald-500/40 text-emerald-300 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md py-12 md:py-16">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5" />
            Social Travel Feed • Khám Phá 200 Điểm Đến Thật
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Khám Phá & Chia Sẻ Điểm Đến{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Cá Nhân Hóa
            </span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Tương tác với các địa điểm bằng cách Thích, Lưu và Đánh giá. Mô hình Machine Learning (LightFM)
            sẽ học trực tiếp sở thích của bạn để thiết kế lịch trình du lịch thông minh nhất.
          </p>

          {/* Quick Stats Banner */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-medium text-slate-300">
            <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>200 Địa điểm tuyển chọn</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-400" />
              <span>Học máy tự động thích nghi</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Hà Nội • TP.HCM • Đà Lạt</span>
            </div>
          </div>
        </div>
      </section>

      {/* Control Bar: Search & Filters */}
      <section className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md shadow-xl mb-8 space-y-5">
          {/* Top row: Search input & Sort */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Tìm theo tên địa điểm, quận, mô tả..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" /> Sắp xếp:
              </span>
              <select
                value={sortBy}
                onChange={(e: any) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500 transition"
              >
                <option value="popularity">Độ nổi tiếng (Mặc định)</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="price_asc">Giá vé: Thấp đến cao</option>
                <option value="price_desc">Giá vé: Cao đến thấp</option>
                <option value="newest">Mới cập nhật</option>
              </select>
            </div>
          </div>

          {/* Destination Province Pills */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              Chọn Tỉnh / Thành Phố
            </div>
            <div className="flex flex-wrap gap-2">
              {PROVINCES.map((prov) => {
                const isActive = selectedProvince === prov.key;
                return (
                  <button
                    key={prov.key}
                    onClick={() => {
                      setSelectedProvince(prov.key);
                      setPage(1);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 border border-emerald-400/30 scale-105'
                        : 'bg-slate-950/60 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span>{prov.icon}</span>
                    <span>{prov.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categories Horizontal Pills */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              Thể Loại Trải Nghiệm
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-950/40 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Count Summary */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="text-sm text-slate-400">
            Hiển thị <span className="font-bold text-emerald-400">{places.length}</span> / {totalCount} địa điểm
          </div>
          {isAuthenticated && (
            <Link
              href="/profile"
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition"
            >
              <Bookmark className="w-3.5 h-3.5" /> Xem danh sách đã lưu (Wishlist) →
            </Link>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mx-auto mb-4" />
            <p className="text-slate-400 text-sm">Đang tải bảng tin địa điểm du lịch...</p>
          </div>
        ) : places.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
            <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-200 mb-1">Không tìm thấy địa điểm nào</h3>
            <p className="text-slate-400 text-sm mb-4">
              Hãy thử tìm với từ khóa khác hoặc bỏ bớt các bộ lọc địa phương/thể loại.
            </p>
            <button
              onClick={() => {
                setSelectedProvince('ALL');
                setSelectedCategory('Tất cả');
                setSearch('');
                setPage(1);
              }}
              className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold hover:bg-emerald-500/30 transition"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        ) : (
          /* Places Grid / Social Post Feed */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place) => {
              const provBadge = getProvinceBadge(place.province);
              const isCommentsOpen = activeCommentsPlaceId === place.id;
              const placeComments = commentsMap[place.id] || [];

              return (
                <div
                  key={place.id}
                  id={place.id}
                  className="group bg-slate-900/80 border border-slate-800/90 hover:border-emerald-500/40 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between backdrop-blur-sm"
                >
                  {/* Card Header & Body */}
                  <div>
                    {/* Visual Banner Area */}
                    <div className="relative h-48 w-full overflow-hidden bg-gradient-to-tr from-slate-950 via-slate-800 to-emerald-950">
                      {place.imageUrl ? (
                        <img
                          src={place.imageUrl}
                          alt={place.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center relative">
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
                          <div className="text-center z-20 px-4">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-2 text-2xl shadow-lg">
                              {provBadge.text === 'Hà Nội' ? '🏛️' : provBadge.text.includes('Hồ Chí Minh') ? '🏙️' : '🌲'}
                            </div>
                            <span className="text-xs font-medium text-slate-300 line-clamp-1">
                              {place.district || provBadge.text}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md shadow-md ${provBadge.bg}`}
                        >
                          {provBadge.text}
                        </span>

                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-950/80 border border-slate-700/80 text-amber-300 backdrop-blur-md flex items-center gap-1 shadow-md">
                          <Ticket className="w-3 h-3 text-amber-400" />
                          {place.priceEstimate > 0
                            ? `${place.priceEstimate.toLocaleString('vi-VN')}đ`
                            : 'Miễn phí'}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5">
                      {/* Name */}
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-emerald-300 transition-colors">
                        {place.name}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                        {place.description || 'Địa điểm du lịch nổi tiếng với nhiều trải nghiệm đặc sắc.'}
                      </p>

                      {/* Category Badges & Meta */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-4">
                        {place.categories?.slice(0, 3).map((cat) => (
                          <span
                            key={cat}
                            className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-medium text-slate-300"
                          >
                            #{cat}
                          </span>
                        ))}
                        {place.indoorOutdoor && (
                          <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-400 text-[10px] font-medium border border-teal-500/20">
                            {place.indoorOutdoor}
                          </span>
                        )}
                      </div>

                      {/* Star Rating Interactive Bar */}
                      <div className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-2">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-amber-300 mr-1.5">
                            {place.ratingAvg > 0 ? place.ratingAvg.toFixed(1) : 'Chưa có'}
                          </span>
                          {[1, 2, 3, 4, 5].map((star) => {
                            const isFilled = (place.userRating || place.ratingAvg) >= star;
                            return (
                              <button
                                key={star}
                                onClick={() => handleRate(place.id, star)}
                                title={`Đánh giá ${star} sao`}
                                className="p-0.5 hover:scale-125 transition-transform"
                              >
                                <Star
                                  className={`w-3.5 h-3.5 ${
                                    isFilled
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-slate-600 hover:text-amber-300'
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>
                        <span className="text-[10px] text-slate-500">
                          ({place.ratingCount} đánh giá)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Social Action Bar */}
                  <div>
                    <div className="border-t border-slate-800/80 px-4 py-3 bg-slate-950/40 flex items-center justify-between text-xs">
                      {/* Left: Like & Save & Comment buttons */}
                      <div className="flex items-center gap-1 sm:gap-2">
                        {/* Like Button */}
                        <button
                          onClick={() => handleToggleLike(place)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-semibold transition ${
                            place.isLiked
                              ? 'text-rose-400 bg-rose-500/15 border border-rose-500/30'
                              : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
                          }`}
                          title={place.isLiked ? 'Bỏ thích' : 'Thích địa điểm'}
                        >
                          <Heart
                            className={`w-4 h-4 transition-transform active:scale-125 ${
                              place.isLiked ? 'fill-rose-500 text-rose-500' : ''
                            }`}
                          />
                          <span>{place.likesCount}</span>
                        </button>

                        {/* Save / Wishlist Button */}
                        <button
                          onClick={() => handleToggleSave(place)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-semibold transition ${
                            place.isSaved
                              ? 'text-amber-400 bg-amber-500/15 border border-amber-500/30'
                              : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                          }`}
                          title={place.isSaved ? 'Đã lưu trong Wishlist' : 'Lưu vào Wishlist'}
                        >
                          <Bookmark
                            className={`w-4 h-4 transition-transform active:scale-125 ${
                              place.isSaved ? 'fill-amber-400 text-amber-400' : ''
                            }`}
                          />
                          <span>{place.savesCount}</span>
                        </button>

                        {/* Comment Button */}
                        <button
                          onClick={() => toggleComments(place.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-semibold transition ${
                            isCommentsOpen
                              ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30'
                              : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
                          }`}
                          title="Bình luận"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{place.commentsCount}</span>
                        </button>
                      </div>

                      {/* Right: Map & Share */}
                      <div className="flex items-center gap-1">
                        {/* Map Directions & Weather */}
                        <button
                          type="button"
                          onClick={() => setDirectionsPlace(place)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-teal-300 hover:bg-teal-500/10 border border-transparent hover:border-teal-500/30 transition text-xs font-semibold"
                          title="Xem chỉ đường & Thời tiết thực tế"
                        >
                          <Navigation className="w-3.5 h-3.5 text-teal-400" />
                          <span className="hidden sm:inline">Chỉ đường</span>
                        </button>

                        {/* Share Button */}
                        <button
                          onClick={() => handleShare(place)}
                          className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
                          title="Chia sẻ địa điểm"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* In-feed Expanded Comments Section */}
                    {isCommentsOpen && (
                      <div className="border-t border-slate-800 bg-slate-950/80 p-4 space-y-3 animate-fadeIn">
                        {/* Add Comment Input */}
                        <div className="flex gap-2 items-center">
                          <input
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
                                ? 'Viết cảm nghĩ, review về địa điểm này...'
                                : 'Đăng nhập để để lại bình luận...'
                            }
                            disabled={!isAuthenticated}
                            className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                          />
                          <button
                            onClick={() => handleCommentSubmit(place.id)}
                            disabled={
                              !isAuthenticated ||
                              isSubmittingComment[place.id] ||
                              !(newCommentText[place.id] || '').trim()
                            }
                            className="p-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-400 disabled:opacity-40 transition shadow-md"
                          >
                            {isSubmittingComment[place.id] ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {/* Comments List */}
                        {commentsLoading[place.id] ? (
                          <div className="text-center py-3 text-xs text-slate-500">
                            <Loader2 className="w-4 h-4 animate-spin mx-auto mb-1 text-emerald-400" />
                            Đang tải bình luận...
                          </div>
                        ) : placeComments.length === 0 ? (
                          <div className="text-center py-2 text-[11px] text-slate-500">
                            Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm nhận!
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {placeComments.map((c) => (
                              <div
                                key={c.id}
                                className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-2.5 text-xs"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-semibold text-emerald-400 text-[11px]">
                                    {c.user.name || c.user.email.split('@')[0]}
                                  </span>
                                  <span className="text-[10px] text-slate-500">
                                    {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                                  </span>
                                </div>
                                <p className="text-slate-300 text-[11px] leading-relaxed">
                                  {c.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-4 h-4" /> Trang trước
            </button>

            <span className="text-xs font-semibold text-slate-400 px-3">
              Trang <span className="text-emerald-400 font-bold">{page}</span> / {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition"
            >
              Trang sau <ChevronRight className="w-4 h-4" />
            </button>
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
    </div>
  );
}
