'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api, formatImageUrl, uploadImageApi } from '@/lib/api';
import {
  Users,
  MessageSquare,
  Heart,
  Send,
  Sparkles,
  PlusCircle,
  Loader2,
  MessageCircle,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
  Calendar,
  MapPin,
  Copy,
  ExternalLink,
  Edit3,
  Trash2,
  CheckCircle2,
  Upload,
} from 'lucide-react';
import { CommunityPostItem, TravelBuddy, Trip } from '@/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const POPULAR_TAGS = [
  'Tất cả',
  'Tìm bạn đồng hành',
  'Đà Lạt',
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Phượt',
  'Ẩm thực',
  'Kinh nghiệm du lịch',
  'Săn mây',
];

export default function CommunityPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Feed states
  const [posts, setPosts] = useState<CommunityPostItem[]>([]);
  const [buddies, setBuddies] = useState<TravelBuddy[]>([]);
  const [userTrips, setUserTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuddiesLoading, setIsBuddiesLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('Tất cả');
  const [search, setSearch] = useState('');

  // Create & Edit Post Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTagsInput, setNewTagsInput] = useState('');
  const [newImages, setNewImages] = useState<string[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [cloningTripId, setCloningTripId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // In-post comments state
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});
  const [isSubmittingComment, setIsSubmittingComment] = useState<Record<string, boolean>>({});

  // Image Preview Modal
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Delete confirmation
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        limit: '30',
      });
      if (selectedTag !== 'Tất cả') {
        params.append('tag', selectedTag);
      }
      if (search.trim()) {
        params.append('search', search.trim());
      }
      if (user?.id) {
        params.append('userId', user.id);
      }

      const res = await api.get<{ items: CommunityPostItem[] }>(
        `/community/posts?${params.toString()}`,
      );
      setPosts(res.items || []);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTag, search, user?.id]);

  const fetchBuddies = useCallback(async () => {
    setIsBuddiesLoading(true);
    try {
      const url = user?.id ? `/community/travel-buddies?userId=${user.id}` : '/community/travel-buddies';
      const res = await api.get<TravelBuddy[]>(url);
      setBuddies(res || []);
    } catch (err) {
      console.error('Failed to load travel buddies:', err);
    } finally {
      setIsBuddiesLoading(false);
    }
  }, [user?.id]);

  const fetchUserTrips = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const trips = await api.get<Trip[]>('/trips');
      setUserTrips(trips || []);
    } catch (err) {
      console.error('Failed to load trips for post attachment:', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchPosts();
    fetchBuddies();
    if (isAuthenticated) {
      fetchUserTrips();
    }
  }, [fetchPosts, fetchBuddies, fetchUserTrips, isAuthenticated]);

  // Open modal for Create Post
  const handleOpenCreateModal = () => {
    if (!isAuthenticated) {
      showToast('Vui lòng đăng nhập để đăng bài!');
      return;
    }
    setEditingPostId(null);
    setNewTitle('');
    setNewContent('');
    setNewTagsInput('');
    setNewImages([]);
    setSelectedTripId('');
    setCustomImageUrl('');
    setShowCreateModal(true);
  };

  // Open modal for Edit Post
  const handleOpenEditModal = (post: CommunityPostItem) => {
    setEditingPostId(post.id);
    setNewTitle(post.title);
    setNewContent(post.content);
    setNewTagsInput(post.tags?.join(', ') || '');
    setNewImages(post.images || []);
    setSelectedTripId(post.tripId || '');
    setCustomImageUrl('');
    setShowCreateModal(true);
  };

  // Handle Image File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      showToast('Kích thước ảnh tối đa là 5MB');
      return;
    }

    setIsUploadingImage(true);
    try {
      const res = await uploadImageApi(file);
      setNewImages((prev) => [...prev, res.url]);
      showToast('Tải ảnh thành công!');
    } catch (err: any) {
      showToast(err.message || 'Không thể tải ảnh lên');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Add Direct Image URL
  const handleAddImageUrl = () => {
    const trimmed = customImageUrl.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      showToast('Vui lòng nhập đường dẫn URL hợp lệ bắt đầu bằng http:// hoặc https://');
      return;
    }
    setNewImages((prev) => [...prev, trimmed]);
    setCustomImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle Like Post
  const handleToggleLike = async (post: CommunityPostItem) => {
    if (!isAuthenticated || !user) {
      showToast('Vui lòng đăng nhập để thích bài viết!');
      return;
    }

    const prevLiked = !!post.isLiked;
    const nextLiked = !prevLiked;

    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              isLiked: nextLiked,
              likesCount: nextLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
            }
          : p,
      ),
    );

    try {
      const res = await api.post<{ isLiked: boolean; likesCount: number }>(
        `/community/posts/${post.id}/like`,
        {
          userId: user.id,
        },
      );
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, isLiked: res.isLiked, likesCount: res.likesCount } : p)),
      );
    } catch {
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, isLiked: prevLiked } : p)),
      );
      showToast('Có lỗi xảy ra khi thích bài viết');
    }
  };

  // Submit Post (Create or Update)
  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      showToast('Vui lòng đăng nhập để tiếp tục!');
      return;
    }

    if (!newTitle.trim() || !newContent.trim()) {
      showToast('Vui lòng nhập đầy đủ tiêu đề và nội dung');
      return;
    }

    setIsSubmittingPost(true);
    try {
      const tags = newTagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      if (editingPostId) {
        // Cập nhật bài viết
        const updated = await api.patch<CommunityPostItem>(`/community/posts/${editingPostId}`, {
          title: newTitle.trim(),
          content: newContent.trim(),
          tags,
          images: newImages,
          tripId: selectedTripId || null,
        });

        setPosts((prev) =>
          prev.map((p) => (p.id === editingPostId ? { ...p, ...updated } : p)),
        );
        showToast('Đã cập nhật bài viết thành công!');
      } else {
        // Tạo bài viết mới
        const created = await api.post<CommunityPostItem>('/community/posts', {
          userId: user.id,
          title: newTitle.trim(),
          content: newContent.trim(),
          tags,
          images: newImages,
          tripId: selectedTripId || null,
        });

        setPosts((prev) => [created, ...prev]);
        showToast('Đăng bài thành công lên diễn đàn!');
      }

      setShowCreateModal(false);
      setEditingPostId(null);
    } catch (err: any) {
      showToast(err.message || 'Có lỗi xảy ra khi lưu bài viết');
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // Delete Post
  const handleDeletePost = async (postId: string) => {
    try {
      await api.delete(`/community/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setDeletingPostId(null);
      showToast('Đã xóa bài viết thành công');
    } catch (err: any) {
      showToast(err.message || 'Không thể xóa bài viết');
    }
  };

  // Clone Trip
  const handleCloneTrip = async (tripId: string) => {
    if (!isAuthenticated || !user) {
      showToast('Vui lòng đăng nhập để nhân bản chuyến đi!');
      return;
    }

    setCloningTripId(tripId);
    try {
      const cloned = await api.post<Trip>(`/trips/${tripId}/clone`);
      showToast('Đã nhân bản chuyến đi thành công!');
      router.push(`/trips/${cloned.id}`);
    } catch (err: any) {
      showToast(err.message || 'Không thể nhân bản chuyến đi');
    } finally {
      setCloningTripId(null);
    }
  };

  // Start chat with author (Join trip or buddy chat)
  const handleStartChatWithAuthor = async (
    targetUserId: string,
    destination?: string,
    startDate?: string,
  ) => {
    if (!isAuthenticated || !user) {
      showToast('Vui lòng đăng nhập để nhắn tin!');
      router.push('/login');
      return;
    }

    if (user.id === targetUserId) {
      showToast('Đây là bài viết của bạn!');
      return;
    }

    try {
      const conv = await api.post<{ id: string }>('/messages/conversations', {
        targetUserId,
      });

      let seedMessage = '';
      if (destination && startDate) {
        seedMessage = `Chào bạn, mình thấy lịch trình đi ${destination} ngày ${new Date(
          startDate,
        ).toLocaleDateString('vi-VN')} của bạn rất thú vị, mình muốn đăng ký đi cùng được không?`;
      }

      const queryParams = new URLSearchParams({
        conversationId: conv.id,
      });
      if (seedMessage) {
        queryParams.append('seedMessage', seedMessage);
      }

      router.push(`/messages?${queryParams.toString()}`);
    } catch (err: any) {
      showToast(err.message || 'Không thể mở cuộc trò chuyện');
    }
  };

  // Add Comment to Post
  const handleAddComment = async (postId: string) => {
    const text = (newCommentText[postId] || '').trim();
    if (!text) return;

    if (!isAuthenticated || !user) {
      showToast('Vui lòng đăng nhập để bình luận!');
      return;
    }

    setIsSubmittingComment((prev) => ({ ...prev, [postId]: true }));
    try {
      const added = await api.post<any>(`/community/posts/${postId}/comments`, {
        userId: user.id,
        content: text,
      });

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                commentsCount: p.commentsCount + 1,
                recentComments: [...p.recentComments, added],
              }
            : p,
        ),
      );

      setNewCommentText((prev) => ({ ...prev, [postId]: '' }));
      showToast('Bình luận đã được đăng!');
    } catch {
      showToast('Có lỗi xảy ra khi gửi bình luận');
    } finally {
      setIsSubmittingComment((prev) => ({ ...prev, [postId]: false }));
    }
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

      {/* Hero Header */}
      <section className="border-b border-[#E5E7EB] bg-white py-10">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4FCE3] border border-[#D9F99D] text-[#365314] text-xs font-medium mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Cộng đồng du lịch & Kết nối bạn đồng hành</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1A1A1A] mb-2">
            Diễn đàn chia sẻ & kết nối du lịch
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
            Chia sẻ trải nghiệm khám phá, tìm bạn đồng hành cùng gu, lưu lại lịch trình hữu ích và trao đổi kinh nghiệm du lịch thực tế khắp Việt Nam.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-6xl py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Feed (2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Create Post Prompt Card */}
            <Card className="bg-white border-[#E5E7EB] shadow-2xs p-4 rounded-2xl">
              <CardContent className="p-0 flex items-center gap-3">
                <Avatar className="w-9 h-9 border border-[#E5E7EB]">
                  <AvatarFallback className="bg-[#F0F0EF] text-[#1A1A1A] text-xs font-semibold">
                    {user?.name ? user.name.charAt(0) : user?.email ? user.email.charAt(0) : 'U'}
                  </AvatarFallback>
                </Avatar>

                <button
                  type="button"
                  onClick={handleOpenCreateModal}
                  className="flex-1 text-left px-3.5 py-2.5 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB] text-muted-foreground text-xs hover:border-[#1A1A1A]/30 hover:text-[#1A1A1A] transition cursor-pointer"
                >
                  Bạn có chuyến đi sắp tới hay kinh nghiệm muốn chia sẻ?
                </button>

                <Button
                  size="sm"
                  onClick={handleOpenCreateModal}
                  className="gap-1.5 text-xs font-medium bg-[#1A1A1A] text-white hover:bg-[#2C2C2C]"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Đăng bài</span>
                </Button>
              </CardContent>
            </Card>

            {/* Tags Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {POPULAR_TAGS.map((tag) => {
                const isActive = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs transition cursor-pointer whitespace-nowrap font-medium ${
                      isActive
                        ? 'bg-[#1A1A1A] text-white shadow-xs'
                        : 'bg-white border border-[#E5E7EB] text-muted-foreground hover:text-[#1A1A1A] hover:bg-[#F5F5F4]'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>

            {/* Posts List */}
            {isLoading ? (
              <div className="py-20 text-center">
                <Loader2 className="w-7 h-7 text-neutral-400 animate-spin mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Đang tải bài viết...</p>
              </div>
            ) : posts.length === 0 ? (
              <Card className="p-10 text-center bg-white border-[#E5E7EB] rounded-2xl">
                <CardContent className="p-0">
                  <MessageSquare className="w-9 h-9 text-neutral-300 mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1">Chưa có bài viết nào</h3>
                  <p className="text-xs text-muted-foreground">
                    Hãy là người đầu tiên chia sẻ cảm nhận hoặc kêu gọi bạn đồng hành!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => {
                  const isCommentsOpen = !!expandedComments[post.id];
                  const isAuthor = user?.id === post.userId;
                  const canManage = isAuthor || user?.role === 'ADMIN';

                  // Xác định kịch bản đính kèm lịch trình:
                  const isAttachedTrip = !!post.trip;
                  const isUpcomingOrLookingBuddy =
                    isAttachedTrip &&
                    (new Date(post.trip!.startDate).getTime() > Date.now() ||
                      post.tags?.some((t) => t.toLowerCase().includes('tìm bạn') || t.toLowerCase().includes('đồng hành')));

                  return (
                    <Card
                      key={post.id}
                      className="bg-white border-[#E5E7EB] hover:border-[#1A1A1A]/30 rounded-2xl p-5 shadow-2xs transition space-y-4"
                    >
                      {/* Author Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="w-9 h-9 border border-[#E5E7EB]">
                            <AvatarFallback className="bg-[#F0F0EF] text-[#1A1A1A] text-xs font-semibold">
                              {post.user.name ? post.user.name.charAt(0) : post.user.email.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-xs text-[#1A1A1A]">
                                {post.user.name || post.user.email.split('@')[0]}
                              </span>
                              {isAuthor && (
                                <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 border-[#E5E7EB]">
                                  Tác giả
                                </Badge>
                              )}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                day: '2-digit',
                                month: '2-digit',
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Top Right: Tags & Actions for Author */}
                        <div className="flex items-center gap-2">
                          <div className="flex flex-wrap gap-1">
                            {post.tags?.map((t) => (
                              <Badge
                                key={t}
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 h-4 font-normal text-muted-foreground border-[#E5E7EB]"
                              >
                                #{t}
                              </Badge>
                            ))}
                          </div>

                          {canManage && (
                            <div className="flex items-center gap-1 pl-2 border-l border-[#E5E7EB]">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenEditModal(post)}
                                className="h-7 w-7 text-[#6B7280] hover:text-[#1A1A1A]"
                                title="Sửa bài viết"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeletingPostId(post.id)}
                                className="h-7 w-7 text-[#6B7280] hover:text-rose-600"
                                title="Xóa bài viết"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Title & Text Content */}
                      <div>
                        <h3 className="text-sm font-bold text-[#1A1A1A] mb-1.5">
                          {post.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                          {post.content}
                        </p>
                      </div>

                      {/* Image Gallery Grid */}
                      {post.images && post.images.length > 0 && (
                        <div
                          className={`grid gap-2 rounded-xl overflow-hidden ${
                            post.images.length === 1
                              ? 'grid-cols-1'
                              : post.images.length === 2
                              ? 'grid-cols-2'
                              : 'grid-cols-3'
                          }`}
                        >
                          {post.images.map((imgUrl, idx) => (
                            <div
                              key={idx}
                              onClick={() => setPreviewImage(formatImageUrl(imgUrl))}
                              className="relative cursor-pointer group bg-[#F0F0EF] overflow-hidden rounded-xl border border-[#E5E7EB]"
                            >
                              <img
                                src={formatImageUrl(imgUrl)}
                                alt={`Ảnh ${idx + 1}`}
                                className="w-full h-44 sm:h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* CARD LỊCH TRÌNH ĐÍNH KÈM THÔNG MINH (2 KỊCH BẢN) */}
                      {isAttachedTrip && post.trip && (
                        <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#FDFDFD] space-y-3">
                          {isUpcomingOrLookingBuddy ? (
                            /* KỊCH BẢN A: SẮP ĐI - TÌM BẠN ĐỒNG HÀNH */
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1.5">
                                  <Badge
                                    variant="lime"
                                    className="text-[10px] font-medium px-2 py-0.5 gap-1"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                    <span>
                                      🟢 Sắp khởi hành:{' '}
                                      {new Date(post.trip.startDate).toLocaleDateString('vi-VN')}
                                    </span>
                                  </Badge>
                                </div>
                                <span className="text-[10px] text-muted-foreground font-medium">
                                  {post.trip.groupSize} người •{' '}
                                  {post.trip.budgetPerPerson?.toLocaleString()} VND / người
                                </span>
                              </div>

                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-[#F0F0EF] flex items-center justify-center text-[#1A1A1A]">
                                    <MapPin className="w-3.5 h-3.5" />
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-[#1A1A1A]">
                                      {post.trip.destination}
                                    </h4>
                                    <p className="text-[10px] text-muted-foreground">
                                      {new Date(post.trip.startDate).toLocaleDateString('vi-VN')} -{' '}
                                      {new Date(post.trip.endDate).toLocaleDateString('vi-VN')}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() =>
                                      handleStartChatWithAuthor(
                                        post.userId,
                                        post.trip?.destination,
                                        post.trip?.startDate,
                                      )
                                    }
                                    className="h-7 px-3 text-xs gap-1.5 bg-[#1A1A1A] hover:bg-[#2C2C2C] text-white rounded-lg shadow-xs"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5 text-[#D4F066]" />
                                    <span>Nhắn tin tham gia</span>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => router.push(`/trips/${post.trip?.id}`)}
                                    className="h-7 px-2.5 text-xs text-[#1A1A1A] border-[#E5E7EB]"
                                  >
                                    Chi tiết
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* KỊCH BẢN B: ĐÃ ĐI VỀ - CHIA SẺ KINH NGHIỆM / REVIEW */
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1.5">
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] font-medium px-2 py-0.5 border-[#E5E7EB] text-[#1A1A1A] gap-1"
                                  >
                                    <MapPin className="w-3 h-3 text-muted-foreground" />
                                    <span>Lịch trình tham quan</span>
                                  </Badge>
                                </div>
                                <span className="text-[10px] text-muted-foreground">
                                  {post.trip.destination}
                                </span>
                              </div>

                              {post.trip.places && post.trip.places.length > 0 && (
                                <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-2.5">
                                  {post.trip.places.map((tp, pIdx) => (
                                    <div
                                      key={pIdx}
                                      className="flex items-center gap-1.5 bg-white border border-[#E5E7EB] px-2 py-1 rounded-lg text-[10px] whitespace-nowrap text-[#1A1A1A]"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
                                      <span>{tp.place.name}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#F0F0EF]">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => router.push(`/trips/${post.trip?.id}`)}
                                  className="h-7 px-2.5 text-xs gap-1 border-[#E5E7EB] text-[#1A1A1A]"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>Xem chi tiết</span>
                                </Button>

                                <Button
                                  size="sm"
                                  variant="default"
                                  disabled={cloningTripId === post.trip.id}
                                  onClick={() => handleCloneTrip(post.trip!.id)}
                                  className="h-7 px-3 text-xs gap-1.5 bg-[#1A1A1A] hover:bg-[#2C2C2C] text-white"
                                >
                                  {cloningTripId === post.trip.id ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Copy className="w-3 h-3 text-[#D4F066]" />
                                  )}
                                  <span>Nhân bản chuyến đi (1-Click)</span>
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Post Actions: Like & Comment Counter */}
                      <div className="pt-2.5 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleLike(post)}
                            className={`h-7 px-2 text-xs gap-1 font-medium ${
                              post.isLiked ? 'text-rose-600 bg-rose-50' : 'text-muted-foreground'
                            }`}
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-rose-600 text-rose-600' : ''}`}
                            />
                            <span>{post.likesCount} Thích</span>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setExpandedComments((prev) => ({
                                ...prev,
                                [post.id]: !prev[post.id],
                              }))
                            }
                            className="h-7 px-2 text-xs gap-1 font-medium text-muted-foreground hover:text-[#1A1A1A]"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{post.commentsCount} Bình luận</span>
                          </Button>
                        </div>

                        {/* Direct Message Author button */}
                        {!isAuthor && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStartChatWithAuthor(post.userId)}
                            className="h-7 px-2 text-xs gap-1 text-[#6B7280] hover:text-[#1A1A1A]"
                            title="Nhắn tin với tác giả"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Nhắn tin</span>
                          </Button>
                        )}
                      </div>

                      {/* Comments Drawer */}
                      {isCommentsOpen && (
                        <div className="pt-3 border-t border-[#E5E7EB] space-y-2.5">
                          <div className="flex gap-1.5">
                            <Input
                              type="text"
                              value={newCommentText[post.id] || ''}
                              onChange={(e) =>
                                setNewCommentText((prev) => ({
                                  ...prev,
                                  [post.id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddComment(post.id);
                              }}
                              placeholder={
                                isAuthenticated
                                  ? 'Bình luận thảo luận...'
                                  : 'Đăng nhập để bình luận...'
                              }
                              disabled={!isAuthenticated}
                              className="h-8 text-xs bg-[#FAFAFA]"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleAddComment(post.id)}
                              disabled={
                                !isAuthenticated ||
                                isSubmittingComment[post.id] ||
                                !(newCommentText[post.id] || '').trim()
                              }
                              className="h-8 w-8 p-0 flex-shrink-0 bg-[#1A1A1A] text-white"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </Button>
                          </div>

                          <div className="space-y-1.5">
                            {post.recentComments?.length === 0 ? (
                              <div className="text-[11px] text-muted-foreground text-center py-1">
                                Chưa có bình luận nào.
                              </div>
                            ) : (
                              post.recentComments.map((rc) => (
                                <div
                                  key={rc.id}
                                  className="bg-[#FAFAFA] rounded-xl p-2.5 text-xs border border-[#E5E7EB]"
                                >
                                  <div className="flex items-center justify-between mb-0.5">
                                    <span className="font-semibold text-[#1A1A1A] text-[11px]">
                                      {rc.user.name || rc.user.email.split('@')[0]}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                      {new Date(rc.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                  </div>
                                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                                    {rc.content}
                                  </p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Travel Buddy Finder */}
          <div className="space-y-6">
            <Card className="bg-white border-[#E5E7EB] shadow-2xs rounded-2xl p-5 sticky top-20 space-y-4">
              <CardContent className="p-0 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#F0F0EF] text-[#1A1A1A]">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xs text-[#1A1A1A]">Bạn đồng hành hợp gu</h3>
                      <p className="text-[10px] text-muted-foreground">Gợi ý AI & Chat 1-1</p>
                    </div>
                  </div>
                  <Badge variant="lime" className="text-[10px] h-5">
                    {buddies.length} Gợi ý
                  </Badge>
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  So khớp sở thích du lịch và ngân sách để tìm người bạn cùng tần số. Bấm &quot;Giao lưu kết nối&quot; để trò chuyện trực tiếp!
                </p>

                {isBuddiesLoading ? (
                  <div className="py-6 text-center text-xs text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin mx-auto mb-1 text-neutral-400" />
                    Đang tìm kiếm...
                  </div>
                ) : buddies.length === 0 ? (
                  <div className="py-4 text-center text-xs text-muted-foreground">
                    Chưa tìm thấy bạn đồng hành phù hợp.
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-0.5">
                    {buddies.slice(0, 8).map((buddy) => (
                      <div
                        key={buddy.id}
                        className="bg-[#FAFAFA] border border-[#E5E7EB] hover:border-[#1A1A1A]/30 rounded-xl p-3 transition"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-7 h-7 border border-[#E5E7EB]">
                              <AvatarFallback className="bg-white text-[#1A1A1A] text-[11px] font-semibold">
                                {buddy.name ? buddy.name.charAt(0) : buddy.email.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-xs text-[#1A1A1A]">
                                {buddy.name}
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                {buddy.tripsCount} chuyến đi
                              </div>
                            </div>
                          </div>

                          <Badge variant="lime" className="text-[10px] h-4 font-mono">
                            {buddy.matchScore}% Hợp gu
                          </Badge>
                        </div>

                        {/* Styles */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {buddy.preferredStyles?.slice(0, 3).map((st) => (
                            <Badge
                              key={st}
                              variant="outline"
                              className="text-[9px] px-1 py-0 h-4 font-normal text-muted-foreground border-[#E5E7EB]"
                            >
                              {st}
                            </Badge>
                          ))}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStartChatWithAuthor(buddy.id)}
                          className="w-full h-7 text-[11px] font-medium gap-1.5 border-[#E5E7EB] hover:bg-[#1A1A1A] hover:text-white transition"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>Giao lưu kết nối</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CREATE & EDIT POST MODAL */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-lg bg-white border-[#E5E7EB] p-5 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-[#1A1A1A] flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              {editingPostId ? 'Chỉnh sửa bài viết' : 'Đăng bài viết lên diễn đàn'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitPost} className="space-y-4 mt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Tiêu đề bài viết <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ví dụ: Tìm 2 bạn phượt săn mây Đà Lạt 3N2Đ cuối tuần này..."
                required
                className="bg-[#FAFAFA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Nội dung chia sẻ <span className="text-rose-500">*</span>
              </label>
              <Textarea
                rows={4}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Chia sẻ kinh nghiệm, lịch trình dự kiến hoặc điều kiện tuyển bạn đồng hành..."
                required
                className="bg-[#FAFAFA] resize-none text-xs"
              />
            </div>

            {/* ĐÍNH KÈM CHUYẾN ĐI (TRIP SELECTOR) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Đính kèm lịch trình của bạn (Tùy chọn)</span>
              </label>
              <select
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              >
                <option value="">-- Không đính kèm lịch trình --</option>
                {userTrips.map((trip) => (
                  <option key={trip.id} value={trip.id}>
                    {trip.destination} ({new Date(trip.startDate).toLocaleDateString('vi-VN')} -{' '}
                    {new Date(trip.endDate).toLocaleDateString('vi-VN')})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-muted-foreground mt-1">
                Nếu chuyến đi có ngày trong tương lai hoặc tag #Tìm bạn đồng hành, bài viết sẽ tự động có nút &quot;Nhắn tin tham gia&quot;.
              </p>
            </div>

            {/* UPLOAD & DÁN LINK ẢNH */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Hình ảnh bài viết (Lưu URL máy chủ & Link ngoài)</span>
              </label>

              {/* Upload file + Paste URL controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="community-image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full text-xs gap-1.5 border-[#E5E7EB] bg-[#FAFAFA] hover:bg-[#F0F0EF]"
                  >
                    {isUploadingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>Tải ảnh từ máy (Max 5MB)</span>
                  </Button>
                </div>

                <div className="flex gap-1">
                  <Input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="Dán link ảnh URL..."
                    className="h-8 text-xs bg-[#FAFAFA]"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddImageUrl}
                    className="h-8 px-2.5 text-xs border-[#E5E7EB]"
                  >
                    Thêm
                  </Button>
                </div>
              </div>

              {/* Danh sách ảnh đã chọn */}
              {newImages.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {newImages.map((img, i) => (
                    <div key={i} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-[#E5E7EB]">
                      <img
                        src={formatImageUrl(img)}
                        alt={`Ảnh ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white rounded-full p-0.5 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* TAGS INPUT */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Tags phân loại (phân cách bằng dấu phẩy)
              </label>
              <Input
                type="text"
                value={newTagsInput}
                onChange={(e) => setNewTagsInput(e.target.value)}
                placeholder="Đà Lạt, Săn mây, Tìm bạn đồng hành"
                className="bg-[#FAFAFA] text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCreateModal(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmittingPost || isUploadingImage}
                className="gap-1.5 bg-[#1A1A1A] text-white hover:bg-[#2C2C2C]"
              >
                {isSubmittingPost && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{editingPostId ? 'Lưu thay đổi' : 'Đăng bài'}</span>
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* CONFIRM DELETE MODAL */}
      <Dialog open={!!deletingPostId} onOpenChange={() => setDeletingPostId(null)}>
        <DialogContent className="max-w-sm bg-white border-[#E5E7EB] p-5 rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-[#1A1A1A]">
              Xác nhận xóa bài viết?
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground mt-1">
            Hành động này sẽ xóa vĩnh viễn bài đăng của bạn cùng tất cả lượt thích và bình luận liên quan.
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingPostId(null)}
              className="text-xs"
            >
              Hủy
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => deletingPostId && handleDeletePost(deletingPostId)}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs"
            >
              Xác nhận xóa
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* IMAGE PREVIEW MODAL */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-3xl bg-black/95 p-2 rounded-2xl border-none shadow-2xl overflow-hidden flex items-center justify-center">
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="max-h-[80vh] w-auto max-w-full rounded-xl object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
