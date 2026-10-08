'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  Users,
  MessageSquare,
  Heart,
  Send,
  Sparkles,
  PlusCircle,
  Loader2,
  MessageCircle,
} from 'lucide-react';
import { CommunityPostItem, TravelBuddy } from '@/types';

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

  // Feed states
  const [posts, setPosts] = useState<CommunityPostItem[]>([]);
  const [buddies, setBuddies] = useState<TravelBuddy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuddiesLoading, setIsBuddiesLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('Tất cả');
  const [search, setSearch] = useState('');

  // New Post Form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTagsInput, setNewTagsInput] = useState('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  // In-post comments state
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});
  const [isSubmittingComment, setIsSubmittingComment] = useState<Record<string, boolean>>({});

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
        limit: '20',
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

      const res = await api.get<{ items: CommunityPostItem[] }>(`/community/posts?${params.toString()}`);
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

  useEffect(() => {
    fetchPosts();
    fetchBuddies();
  }, [fetchPosts, fetchBuddies]);

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
      const res = await api.post<{ isLiked: boolean; likesCount: number }>(`/community/posts/${post.id}/like`, {
        userId: user.id,
      });
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

  // Submit New Post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      showToast('Vui lòng đăng nhập để đăng bài!');
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

      const created = await api.post<CommunityPostItem>('/community/posts', {
        userId: user.id,
        title: newTitle.trim(),
        content: newContent.trim(),
        tags,
      });

      setPosts((prev) => [created, ...prev]);
      setNewTitle('');
      setNewContent('');
      setNewTagsInput('');
      setShowCreateModal(false);
      showToast('Đăng bài thành công lên diễn đàn!');
    } catch {
      showToast('Có lỗi xảy ra khi đăng bài');
    } finally {
      setIsSubmittingPost(false);
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
      <section className="border-b border-[#E5E7EB] bg-white py-12">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4FCE3] border border-[#D9F99D] text-[#365314] text-xs font-medium mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Cộng đồng x Bạn đồng hành AI</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1A1A1A] mb-2">
            Diễn đàn cộng đồng & kết nối bạn du lịch
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
            Chia sẻ trải nghiệm thực tế, hỏi đáp kinh nghiệm phượt và tự động kết nối với những người dùng có cùng sở thích du lịch nhờ gợi ý AI.
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
                  onClick={() => {
                    if (!isAuthenticated) {
                      showToast('Vui lòng đăng nhập để đăng bài!');
                    } else {
                      setShowCreateModal(true);
                    }
                  }}
                  className="flex-1 text-left px-3.5 py-2 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB] text-muted-foreground text-xs hover:border-[#1A1A1A]/30 hover:text-[#1A1A1A] transition cursor-pointer"
                >
                  Chia sẻ cảm nhận chuyến đi hoặc tìm bạn đồng hành...
                </button>

                <Button
                  size="sm"
                  onClick={() => {
                    if (!isAuthenticated) {
                      showToast('Vui lòng đăng nhập để đăng bài!');
                    } else {
                      setShowCreateModal(true);
                    }
                  }}
                  className="gap-1.5 text-xs font-medium"
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
                    className={`px-3 py-1.5 rounded-xl text-xs transition cursor-pointer whitespace-nowrap font-medium ${
                      isActive
                        ? 'bg-[#1A1A1A] text-white shadow-xs'
                        : 'bg-white border border-[#E5E7EB] text-muted-foreground hover:text-[#1A1A1A] hover:bg-[#FAFAFA]'
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
                  return (
                    <Card
                      key={post.id}
                      className="bg-white border-[#E5E7EB] hover:border-[#1A1A1A]/30 rounded-2xl p-5 shadow-2xs transition space-y-3"
                    >
                      {/* Author Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="w-8 h-8 border border-[#E5E7EB]">
                            <AvatarFallback className="bg-[#F0F0EF] text-[#1A1A1A] text-xs font-semibold">
                              {post.user.name ? post.user.name.charAt(0) : post.user.email.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-xs text-[#1A1A1A]">
                              {post.user.name || post.user.email.split('@')[0]}
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

                        {/* Tags */}
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
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className="text-sm font-bold text-[#1A1A1A] mb-1.5">
                          {post.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                          {post.content}
                        </p>
                      </div>

                      {/* Post Actions */}
                      <div className="pt-2.5 border-t border-[#E5E7EB] flex items-center gap-3 text-xs">
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
                              className="h-8 w-8 p-0 flex-shrink-0"
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
                      <p className="text-[10px] text-muted-foreground">Gợi ý AI</p>
                    </div>
                  </div>
                  <Badge variant="lime" className="text-[10px] h-5">
                    {buddies.length} Gợi ý
                  </Badge>
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Hệ thống tự động so khớp phong cách du lịch và ngân sách để tìm người bạn cùng tần số.
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
                          onClick={() => showToast(`Đã gửi lời chào đến ${buddy.name}!`)}
                          className="w-full h-7 text-[11px] font-medium"
                        >
                          Giao lưu kết nối
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

      {/* Create Post Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-lg bg-white border-[#E5E7EB] p-5 rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-[#1A1A1A] flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Đăng bài viết lên diễn đàn
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreatePost} className="space-y-3.5 mt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Tiêu đề bài viết
              </label>
              <Input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ví dụ: Tìm bạn phượt Đà Lạt 3N2Đ cuối tuần này..."
                required
                className="bg-[#FAFAFA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Nội dung chia sẻ
              </label>
              <Textarea
                rows={4}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Chia sẻ kinh nghiệm hoặc yêu cầu tìm bạn đồng hành..."
                required
                className="bg-[#FAFAFA] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Tags phân loại (phân cách bằng dấu phẩy)
              </label>
              <Input
                type="text"
                value={newTagsInput}
                onChange={(e) => setNewTagsInput(e.target.value)}
                placeholder="Đà Lạt, Săn mây, Tìm bạn đồng hành"
                className="bg-[#FAFAFA]"
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
                disabled={isSubmittingPost}
                className="gap-1.5"
              >
                {isSubmittingPost && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Đăng bài</span>
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
