'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  Users,
  MessageSquare,
  Heart,
  Send,
  Sparkles,
  Share2,
  Tag,
  Search,
  PlusCircle,
  Loader2,
  CheckCircle,
  Compass,
  MapPin,
  Calendar,
  MessageCircle,
} from 'lucide-react';
import { CommunityPostItem, TravelBuddy } from '@/types';

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
    } catch (err) {
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
      showToast('Đăng bài thành công lên diễn đàn! 🎉');
    } catch (err) {
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
    } catch (err) {
      showToast('Có lỗi xảy ra khi gửi bình luận');
    } finally {
      setIsSubmittingComment((prev) => ({ ...prev, [postId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white pb-24">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 border border-emerald-500/40 text-emerald-300 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md py-12">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Users className="w-3.5 h-3.5" />
            Diễn Đàn Cộng Đồng & Kết Nối Bạn Đồng Hành
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">
            Giao Lưu & Tìm Bạn Du Lịch{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Cùng Gu
            </span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Chia sẻ trải nghiệm thực tế, hỏi đáp kinh nghiệm phượt và tự động kết nối với những người dùng có cùng sở thích du lịch nhờ thuật toán so khớp AI.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="container mx-auto px-4 max-w-6xl py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Community Posts Feed (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post Prompt Box */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 backdrop-blur-md shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-sm uppercase">
                  {user?.name ? user.name.charAt(0) : user?.email ? user.email.charAt(0) : 'U'}
                </div>
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      showToast('Vui lòng đăng nhập để đăng bài!');
                    } else {
                      setShowCreateModal(true);
                    }
                  }}
                  className="flex-1 text-left px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 text-xs hover:border-emerald-500/40 hover:text-slate-200 transition"
                >
                  Chia sẻ cảm nhận chuyến đi hoặc tìm bạn đồng hành...
                </button>
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      showToast('Vui lòng đăng nhập để đăng bài!');
                    } else {
                      setShowCreateModal(true);
                    }
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 hover:scale-105 transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Đăng bài</span>
                </button>
              </div>
            </div>

            {/* Filter Tags */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {POPULAR_TAGS.map((tag) => {
                const isActive = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md'
                        : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
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
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-400">Đang tải bài viết cộng đồng...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-3xl">
                <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-300 mb-1">Chưa có bài viết nào</h3>
                <p className="text-xs text-slate-500">
                  Hãy là người đầu tiên chia sẻ cảm nhận hoặc kêu gọi bạn đồng hành!
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {posts.map((post) => {
                  const isCommentsOpen = !!expandedComments[post.id];
                  return (
                    <article
                      key={post.id}
                      className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/30 rounded-3xl p-6 shadow-xl backdrop-blur-md transition space-y-4"
                    >
                      {/* Author Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-500 p-0.5 shadow-md">
                            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-bold text-xs text-emerald-400 uppercase">
                              {post.user.name ? post.user.name.charAt(0) : post.user.email.charAt(0)}
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-sm text-white">
                              {post.user.name || post.user.email.split('@')[0]}
                            </div>
                            <div className="text-[10px] text-slate-500">
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
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-medium border border-emerald-500/20"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className="text-base font-black text-slate-100 mb-2">
                          {post.title}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                          {post.content}
                        </p>
                      </div>

                      {/* Post Actions */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center gap-4 text-xs">
                        <button
                          onClick={() => handleToggleLike(post)}
                          className={`flex items-center gap-1.5 font-semibold transition ${
                            post.isLiked
                              ? 'text-rose-400'
                              : 'text-slate-400 hover:text-rose-400'
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              post.isLiked ? 'fill-rose-500 text-rose-500' : ''
                            }`}
                          />
                          <span>{post.likesCount} Thích</span>
                        </button>

                        <button
                          onClick={() =>
                            setExpandedComments((prev) => ({
                              ...prev,
                              [post.id]: !prev[post.id],
                            }))
                          }
                          className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 font-semibold transition"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.commentsCount} Bình luận</span>
                        </button>
                      </div>

                      {/* Comments Area */}
                      {isCommentsOpen && (
                        <div className="pt-3 border-t border-slate-800/80 space-y-3">
                          {/* Input */}
                          <div className="flex gap-2">
                            <input
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
                              className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                            />
                            <button
                              onClick={() => handleAddComment(post.id)}
                              disabled={
                                !isAuthenticated ||
                                isSubmittingComment[post.id] ||
                                !(newCommentText[post.id] || '').trim()
                              }
                              className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-400 disabled:opacity-40 transition"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Recent Comments */}
                          <div className="space-y-2">
                            {post.recentComments?.length === 0 ? (
                              <div className="text-[11px] text-slate-500 text-center py-1">
                                Chưa có bình luận nào.
                              </div>
                            ) : (
                              post.recentComments.map((rc) => (
                                <div
                                  key={rc.id}
                                  className="bg-slate-950/70 rounded-xl p-2.5 text-xs border border-slate-800/60"
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold text-emerald-400 text-[11px]">
                                      {rc.user.name || rc.user.email.split('@')[0]}
                                    </span>
                                    <span className="text-[9px] text-slate-500">
                                      {new Date(rc.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                  </div>
                                  <p className="text-slate-300 text-[11px] leading-relaxed">
                                    {rc.content}
                                  </p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Travel Buddy Finder (Widget) */}
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md sticky top-24 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Bạn Đồng Hành Hợp Gu</h3>
                    <p className="text-[11px] text-slate-400">Travel Buddy Finder (AI)</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  {buddies.length} Gợi ý
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Hệ thống tự động so khớp tập sở thích (`preferredStyles`) và ngân sách để gợi ý những người bạn có cùng đam mê du lịch.
              </p>

              {isBuddiesLoading ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-1 text-teal-400" />
                  Đang tìm bạn đồng hành...
                </div>
              ) : buddies.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  Chưa tìm thấy người dùng phù hợp. Hãy cập nhật sở thích trong hồ sơ nhé!
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {buddies.slice(0, 8).map((buddy) => (
                    <div
                      key={buddy.id}
                      className="bg-slate-950/80 border border-slate-800/80 hover:border-teal-500/40 rounded-2xl p-3.5 transition group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center font-bold text-xs text-teal-300 uppercase">
                            {buddy.name ? buddy.name.charAt(0) : buddy.email.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-white group-hover:text-teal-300 transition-colors">
                              {buddy.name}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {buddy.tripsCount} chuyến đi đã tạo
                            </div>
                          </div>
                        </div>

                        {/* Match Percentage Badge */}
                        <div className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-[10px]">
                          {buddy.matchScore}% Hợp gu
                        </div>
                      </div>

                      {/* Mutual Styles Tags */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {buddy.preferredStyles?.slice(0, 3).map((st) => {
                          const isMutual = buddy.mutualStyles?.includes(st);
                          return (
                            <span
                              key={st}
                              className={`px-1.5 py-0.5 rounded text-[9px] font-medium border ${
                                isMutual
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : 'bg-slate-900 text-slate-400 border-slate-800'
                              }`}
                            >
                              {isMutual ? '✨ ' : ''}
                              {st}
                            </span>
                          );
                        })}
                      </div>

                      <button
                        onClick={() =>
                          showToast(`Đã gửi lời chào giao lưu đến ${buddy.name}! 💬`)
                        }
                        className="w-full py-1.5 rounded-xl bg-slate-900 hover:bg-teal-500 hover:text-slate-950 border border-slate-800 text-slate-300 text-[11px] font-semibold transition"
                      >
                        Giao lưu kết nối
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-400" />
                Đăng Bài Viết Lên Diễn Đàn
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tiêu đề bài viết
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Tìm bạn phượt Đà Lạt 3N2Đ cuối tuần này..."
                  required
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nội dung chia sẻ
                </label>
                <textarea
                  rows={5}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Chia sẻ kinh nghiệm, lịch trình hoặc yêu cầu tìm bạn đồng hành..."
                  required
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tags phân loại (phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={newTagsInput}
                  onChange={(e) => setNewTagsInput(e.target.value)}
                  placeholder="Đà Lạt, Săn mây, Tìm bạn đồng hành"
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPost}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  {isSubmittingPost && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Đăng bài ngay</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
