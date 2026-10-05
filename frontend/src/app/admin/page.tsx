'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import AdminRoute from '@/components/AdminRoute';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Place } from '@/types';
import {
  MapPin,
  Users,
  MessageSquare,
  ShieldCheck,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  Compass,
  DollarSign,
  Star,
  Eye,
  Key,
  Calendar,
  Sparkles,
  MessageCircle,
  ThumbsUp,
} from 'lucide-react';

// Dynamic import for Leaflet map component to prevent SSR window issues
const LocationPickerMap = dynamic(
  () => import('@/components/admin/LocationPickerMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[320px] bg-slate-900 animate-pulse rounded-2xl flex flex-col items-center justify-center text-slate-500 gap-2 border border-slate-800">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
        <span className="text-xs">Đang tải bản đồ OpenStreetMap...</span>
      </div>
    ),
  }
);

const CATEGORY_OPTIONS = [
  'Khám phá',
  'Văn hóa',
  'Lịch sử',
  'Ẩm thực',
  'Thiên nhiên',
  'Check-in',
  'Nghỉ dưỡng',
  'Giải trí',
  'Mua sắm',
  'Tâm linh',
  'Biển đảo',
  'Núi rừng',
];

const PROVINCE_PRESETS = [
  'Tất cả',
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Đà Nẵng',
  'Lâm Đồng',
  'Khánh Hòa',
  'Kiên Giang',
  'Thừa Thiên Huế',
  'Quảng Nam',
  'Lào Cai',
  'Quảng Ninh',
  'Ninh Bình',
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'places' | 'users' | 'posts'>('places');

  // Notification Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // -------------------------------------------------------------
  // TAB 1: PLACES MANAGEMENT
  // -------------------------------------------------------------
  const [places, setPlaces] = useState<Place[]>([]);
  const [placesLoading, setPlacesLoading] = useState(true);
  const [placesPage, setPlacesPage] = useState(1);
  const [placesTotalPages, setPlacesTotalPages] = useState(1);
  const [placesTotal, setPlacesTotal] = useState(0);
  const [searchPlace, setSearchPlace] = useState('');
  const [filterProvince, setFilterProvince] = useState('Tất cả');
  const [filterCategory, setFilterCategory] = useState('Tất cả');

  // Place Modal state
  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [placeForm, setPlaceForm] = useState({
    name: '',
    description: '',
    categories: [] as string[],
    latitude: 21.0285,
    longitude: 105.8542,
    province: '',
    district: '',
    priceEstimate: 0,
    popularityScore: 80,
    indoorOutdoor: 'Ngoài trời',
    activityLevel: 'Trung bình',
    imageUrl: '',
  });
  const [isSubmittingPlace, setIsSubmittingPlace] = useState(false);
  const [deletingPlace, setDeletingPlace] = useState<Place | null>(null);

  const fetchPlaces = useCallback(async () => {
    setPlacesLoading(true);
    try {
      const params = new URLSearchParams({
        page: placesPage.toString(),
        limit: '10',
        sortBy: 'newest',
      });
      if (filterProvince !== 'Tất cả') params.append('province', filterProvince);
      if (filterCategory !== 'Tất cả') params.append('category', filterCategory);
      if (searchPlace.trim()) params.append('search', searchPlace.trim());

      const res = await api.get<{
        items: Place[];
        pagination: { total: number; totalPages: number };
      }>(`/places?${params.toString()}`);

      setPlaces(res.items || []);
      setPlacesTotal(res.pagination?.total || 0);
      setPlacesTotalPages(res.pagination?.totalPages || 1);
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi tải danh sách địa điểm', 'error');
    } finally {
      setPlacesLoading(false);
    }
  }, [placesPage, filterProvince, filterCategory, searchPlace]);

  useEffect(() => {
    if (activeTab === 'places') {
      fetchPlaces();
    }
  }, [fetchPlaces, activeTab]);

  const openAddPlaceModal = () => {
    setEditingPlace(null);
    setPlaceForm({
      name: '',
      description: '',
      categories: ['Khám phá', 'Văn hóa'],
      latitude: 21.0285,
      longitude: 105.8542,
      province: 'Hà Nội',
      district: 'Hoàn Kiếm',
      priceEstimate: 50000,
      popularityScore: 85,
      indoorOutdoor: 'Ngoài trời',
      activityLevel: 'Trung bình',
      imageUrl: '',
    });
    setIsPlaceModalOpen(true);
  };

  const openEditPlaceModal = (p: Place) => {
    setEditingPlace(p);
    setPlaceForm({
      name: p.name,
      description: p.description,
      categories: p.categories || [],
      latitude: p.latitude,
      longitude: p.longitude,
      province: p.province || '',
      district: p.district || '',
      priceEstimate: p.priceEstimate || 0,
      popularityScore: p.popularityScore || 0,
      indoorOutdoor: p.indoorOutdoor || 'Ngoài trời',
      activityLevel: p.activityLevel || 'Trung bình',
      imageUrl: p.imageUrl || '',
    });
    setIsPlaceModalOpen(true);
  };

  const handleSavePlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placeForm.name.trim() || !placeForm.description.trim()) {
      showToast('Vui lòng điền đầy đủ tên và mô tả địa điểm', 'error');
      return;
    }
    if (!placeForm.latitude || !placeForm.longitude) {
      showToast('Vui lòng chọn tọa độ kinh độ và vĩ độ trên bản đồ', 'error');
      return;
    }

    setIsSubmittingPlace(true);
    try {
      if (editingPlace) {
        await api.patch(`/places/${editingPlace.id}`, placeForm);
        showToast(`Đã cập nhật địa điểm "${placeForm.name}" thành công!`);
      } else {
        await api.post('/places', placeForm);
        showToast(`Đã thêm địa điểm mới "${placeForm.name}" thành công!`);
      }
      setIsPlaceModalOpen(false);
      fetchPlaces();
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi lưu địa điểm', 'error');
    } finally {
      setIsSubmittingPlace(false);
    }
  };

  const handleDeletePlace = async () => {
    if (!deletingPlace) return;
    try {
      await api.delete(`/places/${deletingPlace.id}`);
      showToast(`Đã xóa địa điểm "${deletingPlace.name}" thành công!`);
      setDeletingPlace(null);
      fetchPlaces();
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi xóa địa điểm', 'error');
    }
  };

  const toggleCategorySelection = (cat: string) => {
    setPlaceForm((prev) => {
      const exists = prev.categories.includes(cat);
      if (exists) {
        return { ...prev, categories: prev.categories.filter((c) => c !== cat) };
      } else {
        return { ...prev, categories: [...prev.categories, cat] };
      }
    });
  };

  // -------------------------------------------------------------
  // TAB 2: USERS MANAGEMENT
  // -------------------------------------------------------------
  const [usersList, setUsersList] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersTotal, setUsersTotal] = useState(0);
  const [searchUser, setSearchUser] = useState('');
  const [filterUserRole, setFilterUserRole] = useState<'ALL' | 'USER' | 'ADMIN'>('ALL');

  // User Modal state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [userForm, setUserForm] = useState({
    email: '',
    name: '',
    password: '',
    role: 'USER' as 'USER' | 'ADMIN',
    preferredStyles: [] as string[],
    budgetLevel: 'MODERATE',
  });
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);
  const [deletingUser, setDeletingUser] = useState<any | null>(null);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const params = new URLSearchParams({
        page: usersPage.toString(),
        limit: '10',
      });
      if (filterUserRole !== 'ALL') params.append('role', filterUserRole);
      if (searchUser.trim()) params.append('search', searchUser.trim());

      const res = await api.get<{
        items: any[];
        pagination: { total: number; totalPages: number };
      }>(`/users?${params.toString()}`);

      setUsersList(res.items || []);
      setUsersTotal(res.pagination?.total || 0);
      setUsersTotalPages(res.pagination?.totalPages || 1);
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi tải danh sách người dùng', 'error');
    } finally {
      setUsersLoading(false);
    }
  }, [usersPage, filterUserRole, searchUser]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [fetchUsers, activeTab]);

  const openAddUserModal = () => {
    setEditingUser(null);
    setUserForm({
      email: '',
      name: '',
      password: '',
      role: 'USER',
      preferredStyles: ['Khám phá', 'Ẩm thực'],
      budgetLevel: 'MODERATE',
    });
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (u: any) => {
    setEditingUser(u);
    setUserForm({
      email: u.email,
      name: u.name || '',
      password: '', // blank unless want to reset
      role: u.role,
      preferredStyles: u.preferredStyles || [],
      budgetLevel: u.budgetLevel || 'MODERATE',
    });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.email.trim()) {
      showToast('Vui lòng nhập email', 'error');
      return;
    }
    if (!editingUser && !userForm.password.trim()) {
      showToast('Vui lòng nhập mật khẩu cho người dùng mới', 'error');
      return;
    }

    setIsSubmittingUser(true);
    try {
      if (editingUser) {
        const payload: any = {
          name: userForm.name,
          email: userForm.email,
          role: userForm.role,
          preferredStyles: userForm.preferredStyles,
          budgetLevel: userForm.budgetLevel,
        };
        if (userForm.password.trim()) {
          payload.password = userForm.password.trim();
        }
        await api.patch(`/users/${editingUser.id}`, payload);
        showToast(`Đã cập nhật tài khoản "${userForm.email}"!`);
      } else {
        await api.post('/users', userForm);
        showToast(`Đã tạo người dùng mới "${userForm.email}"!`);
      }
      setIsUserModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi lưu người dùng', 'error');
    } finally {
      setIsSubmittingUser(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    try {
      await api.delete(`/users/${deletingUser.id}`);
      showToast(`Đã xóa người dùng "${deletingUser.email}" thành công!`);
      setDeletingUser(null);
      fetchUsers();
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi xóa người dùng', 'error');
    }
  };

  // -------------------------------------------------------------
  // TAB 3: COMMUNITY POSTS MODERATION
  // -------------------------------------------------------------
  const [postsList, setPostsList] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsPage, setPostsPage] = useState(1);
  const [postsTotalPages, setPostsTotalPages] = useState(1);
  const [postsTotal, setPostsTotal] = useState(0);
  const [searchPost, setSearchPost] = useState('');
  const [filterPostTag, setFilterPostTag] = useState('');

  // Post Edit Modal
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    tagsString: '',
    imagesString: '',
  });
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [deletingPost, setDeletingPost] = useState<any | null>(null);

  // Comments view modal
  const [viewingCommentsPost, setViewingCommentsPost] = useState<any | null>(null);
  const [postComments, setPostComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    setPostsLoading(true);
    try {
      const params = new URLSearchParams({
        page: postsPage.toString(),
        limit: '10',
      });
      if (searchPost.trim()) params.append('search', searchPost.trim());
      if (filterPostTag.trim()) params.append('tag', filterPostTag.trim());

      const res = await api.get<{
        items: any[];
        pagination: { total: number; totalPages: number };
      }>(`/community/posts?${params.toString()}`);

      setPostsList(res.items || []);
      setPostsTotal(res.pagination?.total || 0);
      setPostsTotalPages(res.pagination?.totalPages || 1);
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi tải bài đăng cộng đồng', 'error');
    } finally {
      setPostsLoading(false);
    }
  }, [postsPage, searchPost, filterPostTag]);

  useEffect(() => {
    if (activeTab === 'posts') {
      fetchPosts();
    }
  }, [fetchPosts, activeTab]);

  const openAddPostModal = () => {
    setEditingPost(null);
    setPostForm({
      title: '',
      content: '',
      tagsString: 'Thông báo, Hướng dẫn',
      imagesString: '',
    });
    setIsPostModalOpen(true);
  };

  const openEditPostModal = (post: any) => {
    setEditingPost(post);
    setPostForm({
      title: post.title,
      content: post.content,
      tagsString: (post.tags || []).join(', '),
      imagesString: (post.images || []).join('\n'),
    });
    setIsPostModalOpen(true);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.title.trim() || !postForm.content.trim()) {
      showToast('Tiêu đề và nội dung bài viết không được để trống', 'error');
      return;
    }

    const tags = postForm.tagsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const images = postForm.imagesString
      .split('\n')
      .map((i) => i.trim())
      .filter(Boolean);

    setIsSubmittingPost(true);
    try {
      if (editingPost) {
        await api.patch(`/community/posts/${editingPost.id}`, {
          title: postForm.title,
          content: postForm.content,
          tags,
          images,
        });
        showToast('Cập nhật bài viết thành công!');
      } else {
        await api.post('/community/posts', {
          title: postForm.title,
          content: postForm.content,
          tags,
          images,
          userId: user?.id,
        });
        showToast('Đăng bài thông báo mới thành công!');
      }
      setIsPostModalOpen(false);
      fetchPosts();
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi lưu bài viết', 'error');
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const handleDeletePost = async () => {
    if (!deletingPost) return;
    try {
      await api.delete(`/community/posts/${deletingPost.id}`);
      showToast('Đã xóa bài viết thành công!');
      setDeletingPost(null);
      fetchPosts();
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi xóa bài viết', 'error');
    }
  };

  const openViewComments = async (post: any) => {
    setViewingCommentsPost(post);
    setCommentsLoading(true);
    try {
      const data = await api.get<any[]>(`/community/posts/${post.id}/comments`);
      setPostComments(data || []);
    } catch (err: any) {
      showToast('Lỗi khi tải bình luận bài viết', 'error');
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await api.delete(`/community/comments/${commentId}`);
      setPostComments((prev) => prev.filter((c) => c.id !== commentId));
      showToast('Đã xóa bình luận vi phạm!');
      fetchPosts();
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi xóa bình luận', 'error');
    }
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
        {/* Floating Toast Alert */}
        {toast && (
          <div
            className={`fixed bottom-6 right-6 z-[9999] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md animate-bounce border ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{toast.message}</span>
          </div>
        )}

        {/* Top Header Banner */}
        <div className="border-b border-slate-800/80 bg-gradient-to-r from-slate-950 via-purple-950/20 to-slate-950 pt-8 pb-6 px-4 md:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-purple-600/20 border border-purple-400/30">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-emerald-200 bg-clip-text text-transparent">
                    Bảng Điều Khiển Quản Trị
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 border border-purple-500/40 text-purple-300">
                    Admin
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Quản lý toàn diện dữ liệu Địa điểm (OpenStreetMap), Người dùng và Hậu kiểm bài đăng cộng đồng
                </p>
              </div>
            </div>

            {/* Quick stats snapshot */}
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Địa điểm</div>
                <div className="text-sm font-bold text-emerald-400">{placesTotal}</div>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Thành viên</div>
                <div className="text-sm font-bold text-purple-400">{usersTotal}</div>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Bài cộng đồng</div>
                <div className="text-sm font-bold text-cyan-400">{postsTotal}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab('places')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition shadow-sm ${
                activeTab === 'places'
                  ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Quản lý Địa Điểm ({placesTotal})</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition shadow-sm ${
                activeTab === 'users'
                  ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300 shadow-purple-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Quản lý Người Dùng ({usersTotal})</span>
            </button>

            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition shadow-sm ${
                activeTab === 'posts'
                  ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Bài Đăng Cộng Đồng ({postsTotal})</span>
            </button>
          </div>
        </div>

        {/* TAB CONTENT CONTAINER */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
          {/* ========================================================= */}
          {/* TAB 1: PLACES CRUD */}
          {/* ========================================================= */}
          {activeTab === 'places' && (
            <div className="space-y-4">
              {/* Action Toolbar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <div className="flex flex-wrap items-center gap-2.5 flex-1">
                  {/* Search */}
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchPlace}
                      onChange={(e) => setSearchPlace(e.target.value)}
                      placeholder="Tìm kiếm địa điểm theo tên, quận huyện..."
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Province Filter */}
                  <select
                    value={filterProvince}
                    onChange={(e) => {
                      setFilterProvince(e.target.value);
                      setPlacesPage(1);
                    }}
                    className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-emerald-500"
                  >
                    {PROVINCE_PRESETS.map((p) => (
                      <option key={p} value={p}>
                        {p === 'Tất cả' ? '📍 Tất cả Tỉnh/Thành' : p}
                      </option>
                    ))}
                  </select>

                  {/* Category Filter */}
                  <select
                    value={filterCategory}
                    onChange={(e) => {
                      setFilterCategory(e.target.value);
                      setPlacesPage(1);
                    }}
                    className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Tất cả">🏷️ Tất cả Thể loại</option>
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchPlaces}
                    title="Làm mới"
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:text-emerald-400 text-slate-400 transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={openAddPlaceModal}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold text-xs transition shadow-md shadow-emerald-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Địa Điểm Mới</span>
                  </button>
                </div>
              </div>

              {/* Places Table */}
              <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                {placesLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-2" />
                    <p className="text-xs">Đang tải danh sách địa điểm...</p>
                  </div>
                ) : places.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <MapPin className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                    <p className="text-sm font-semibold text-slate-300">Không tìm thấy địa điểm nào</p>
                    <p className="text-xs text-slate-500 mt-1">Hãy thử đổi từ khóa tìm kiếm hoặc bấm Thêm Địa Điểm Mới</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider font-semibold">
                        <tr>
                          <th className="px-4 py-3">Địa điểm</th>
                          <th className="px-4 py-3">Tỉnh / Thành</th>
                          <th className="px-4 py-3">Tọa độ (OSM)</th>
                          <th className="px-4 py-3">Thể loại</th>
                          <th className="px-4 py-3">Chi phí / Đánh giá</th>
                          <th className="px-4 py-3 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {places.map((place) => (
                          <tr key={place.id} className="hover:bg-slate-800/30 transition">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {place.imageUrl ? (
                                  <img
                                    src={place.imageUrl}
                                    alt={place.name}
                                    className="w-11 h-11 rounded-xl object-cover border border-slate-800 flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-slate-600 flex-shrink-0">
                                    <MapPin className="w-5 h-5" />
                                  </div>
                                )}
                                <div>
                                  <div className="font-semibold text-white line-clamp-1">{place.name}</div>
                                  <div className="text-[11px] text-slate-400 line-clamp-1">{place.description}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-slate-300 font-medium">{place.province || '—'}</span>
                              {place.district && <span className="text-[10px] text-slate-500 block">{place.district}</span>}
                            </td>
                            <td className="px-4 py-3 font-mono text-[11px] text-teal-400">
                              {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1 max-w-[180px]">
                                {(place.categories || []).slice(0, 2).map((c) => (
                                  <span
                                    key={c}
                                    className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px]"
                                  >
                                    {c}
                                  </span>
                                ))}
                                {(place.categories || []).length > 2 && (
                                  <span className="text-[10px] text-slate-500">
                                    +{place.categories.length - 2}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-slate-200">
                                {place.priceEstimate ? `${place.priceEstimate.toLocaleString()} đ` : 'Miễn phí'}
                              </div>
                              <div className="text-[10px] text-amber-400 flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-400" />
                                <span>{place.popularityScore || 0} điểm</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => openEditPlaceModal(place)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition"
                                  title="Chỉnh sửa"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeletingPlace(place)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                                  title="Xóa"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                {placesTotalPages > 1 && (
                  <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Trang {placesPage} / {placesTotalPages} (Tổng {placesTotal} địa điểm)
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={placesPage <= 1}
                        onClick={() => setPlacesPage((p) => Math.max(1, p - 1))}
                        className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-30"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        disabled={placesPage >= placesTotalPages}
                        onClick={() => setPlacesPage((p) => Math.min(placesTotalPages, p + 1))}
                        className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-30"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: USERS CRUD */}
          {/* ========================================================= */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              {/* Action Toolbar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <div className="flex flex-wrap items-center gap-2.5 flex-1">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                      placeholder="Tìm kiếm người dùng theo tên, email..."
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <select
                    value={filterUserRole}
                    onChange={(e: any) => {
                      setFilterUserRole(e.target.value);
                      setUsersPage(1);
                    }}
                    className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-purple-500"
                  >
                    <option value="ALL">🛡️ Tất cả vai trò</option>
                    <option value="USER">Người dùng (USER)</option>
                    <option value="ADMIN">Quản trị viên (ADMIN)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchUsers}
                    title="Làm mới"
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:text-purple-400 text-slate-400 transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={openAddUserModal}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-purple-600/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Người Dùng</span>
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                {usersLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-400 mb-2" />
                    <p className="text-xs">Đang tải danh sách người dùng...</p>
                  </div>
                ) : usersList.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                    <p className="text-sm font-semibold text-slate-300">Không tìm thấy người dùng nào</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider font-semibold">
                        <tr>
                          <th className="px-4 py-3">Người dùng</th>
                          <th className="px-4 py-3">Vai trò</th>
                          <th className="px-4 py-3">Sở thích du lịch</th>
                          <th className="px-4 py-3">Hoạt động</th>
                          <th className="px-4 py-3">Ngày tham gia</th>
                          <th className="px-4 py-3 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {usersList.map((u) => {
                          const isSelf = u.id === user?.id;
                          return (
                            <tr key={u.id} className="hover:bg-slate-800/30 transition">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold flex items-center justify-center text-xs uppercase flex-shrink-0">
                                    {u.name ? u.name.charAt(0) : u.email.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-white flex items-center gap-1.5">
                                      <span>{u.name || 'Chưa đặt tên'}</span>
                                      {isSelf && (
                                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                          Bạn
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-slate-400">{u.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                                    u.role === 'ADMIN'
                                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                                  }`}
                                >
                                  {u.role}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                  {(u.preferredStyles || []).map((s: string) => (
                                    <span
                                      key={s}
                                      className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300"
                                    >
                                      {s}
                                    </span>
                                  ))}
                                  {(!u.preferredStyles || u.preferredStyles.length === 0) && (
                                    <span className="text-slate-500 text-[11px]">Chưa chọn</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-slate-400 text-[11px]">
                                <div>Chuyến đi: <strong className="text-slate-200">{u._count?.trips || 0}</strong></div>
                                <div>Bài viết: <strong className="text-slate-200">{u._count?.communityPosts || 0}</strong></div>
                              </td>
                              <td className="px-4 py-3 text-slate-400 text-[11px]">
                                {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => openEditUserModal(u)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-slate-800 transition"
                                    title="Sửa quyền / Thông tin"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    disabled={isSelf}
                                    onClick={() => setDeletingUser(u)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 disabled:opacity-30 transition"
                                    title={isSelf ? 'Không thể tự xóa chính mình' : 'Xóa người dùng'}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Users Pagination */}
                {usersTotalPages > 1 && (
                  <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Trang {usersPage} / {usersTotalPages} (Tổng {usersTotal} thành viên)
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={usersPage <= 1}
                        onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                        className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-30"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        disabled={usersPage >= usersTotalPages}
                        onClick={() => setUsersPage((p) => Math.min(usersTotalPages, p + 1))}
                        className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-30"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: COMMUNITY POSTS (POST-MODERATION) */}
          {/* ========================================================= */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {/* Action Toolbar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <div className="flex flex-wrap items-center gap-2.5 flex-1">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchPost}
                      onChange={(e) => setSearchPost(e.target.value)}
                      placeholder="Tìm bài đăng theo tiêu đề, nội dung..."
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <input
                    type="text"
                    value={filterPostTag}
                    onChange={(e) => setFilterPostTag(e.target.value)}
                    placeholder="Lọc theo tag..."
                    className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchPosts}
                    title="Làm mới"
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:text-cyan-400 text-slate-400 transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={openAddPostModal}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold text-xs transition shadow-md shadow-cyan-600/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Đăng Thông Báo Admin</span>
                  </button>
                </div>
              </div>

              {/* Note on Post-moderation */}
              <div className="p-3 bg-slate-900/40 border border-slate-800/80 rounded-xl text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>
                  <strong>Cơ chế Hậu kiểm:</strong> Người dùng được đăng bài trực tiếp lên cộng đồng. Tại đây bạn có thể chỉnh sửa hoặc xóa bài viết vi phạm, spam hoặc kiểm duyệt bình luận độc hại.
                </span>
              </div>

              {/* Posts Table */}
              <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                {postsLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mb-2" />
                    <p className="text-xs">Đang tải danh sách bài viết...</p>
                  </div>
                ) : postsList.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <MessageSquare className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                    <p className="text-sm font-semibold text-slate-300">Không có bài đăng nào</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider font-semibold">
                        <tr>
                          <th className="px-4 py-3">Bài viết</th>
                          <th className="px-4 py-3">Tác giả</th>
                          <th className="px-4 py-3">Tags</th>
                          <th className="px-4 py-3">Tương tác</th>
                          <th className="px-4 py-3">Ngày đăng</th>
                          <th className="px-4 py-3 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {postsList.map((post) => (
                          <tr key={post.id} className="hover:bg-slate-800/30 transition">
                            <td className="px-4 py-3 max-w-xs">
                              <div className="font-semibold text-white line-clamp-1">{post.title}</div>
                              <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{post.content}</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-medium text-slate-200">{post.user?.name || post.user?.email || 'Vô danh'}</div>
                              <div className="text-[10px] text-slate-500">{post.user?.email}</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1 max-w-[160px]">
                                {(post.tags || []).map((t: string) => (
                                  <span key={t} className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] border border-cyan-500/20">
                                    #{t}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-[11px]">
                              <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1 text-slate-300">
                                  <ThumbsUp className="w-3 h-3 text-emerald-400" />
                                  {post.likesCount || 0}
                                </span>
                                <button
                                  onClick={() => openViewComments(post)}
                                  className="flex items-center gap-1 text-slate-300 hover:text-cyan-300 underline"
                                  title="Xem & kiểm duyệt bình luận"
                                >
                                  <MessageCircle className="w-3 h-3 text-cyan-400" />
                                  {post.commentsCount || 0} bình luận
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-400 text-[11px]">
                              {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => openEditPostModal(post)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
                                  title="Chỉnh sửa bài viết"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeletingPost(post)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                                  title="Xóa bài viết vi phạm"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Posts Pagination */}
                {postsTotalPages > 1 && (
                  <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Trang {postsPage} / {postsTotalPages} (Tổng {postsTotal} bài đăng)
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={postsPage <= 1}
                        onClick={() => setPostsPage((p) => Math.max(1, p - 1))}
                        className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-30"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        disabled={postsPage >= postsTotalPages}
                        onClick={() => setPostsPage((p) => Math.min(postsTotalPages, p + 1))}
                        className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 disabled:opacity-30"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* MODAL 1: ADD / EDIT PLACE (WITH LEAFLET OSM MAP PICKER) */}
        {/* ========================================================= */}
        {isPlaceModalOpen && (
          <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
              <button
                onClick={() => setIsPlaceModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-6">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {editingPlace ? 'Chỉnh Sửa Địa Điểm' : 'Thêm Địa Điểm Mới'}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Sử dụng bản đồ OpenStreetMap bên dưới để tìm kiếm hoặc chấm ghim tọa độ
                  </p>
                </div>
              </div>

              <form onSubmit={handleSavePlace} className="space-y-5">
                {/* Name & Province / District */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Tên địa điểm <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={placeForm.name}
                      onChange={(e) => setPlaceForm({ ...placeForm, name: e.target.value })}
                      placeholder="VD: Cà phê Giảng, Chợ Bến Thành..."
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Tỉnh / Thành phố</label>
                    <input
                      type="text"
                      value={placeForm.province}
                      onChange={(e) => setPlaceForm({ ...placeForm, province: e.target.value })}
                      placeholder="VD: Hà Nội, TP. Hồ Chí Minh..."
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Quận / Huyện</label>
                    <input
                      type="text"
                      value={placeForm.district}
                      onChange={(e) => setPlaceForm({ ...placeForm, district: e.target.value })}
                      placeholder="VD: Hoàn Kiếm, Quận 1..."
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mô tả chi tiết <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={placeForm.description}
                    onChange={(e) => setPlaceForm({ ...placeForm, description: e.target.value })}
                    placeholder="Mô tả các đặc điểm nổi bật, lịch sử, văn hóa hoặc điểm hấp dẫn của địa điểm này..."
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* INTERACTIVE OPENSTREETMAP COORDINATE PICKER */}
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Compass className="w-4 h-4" />
                      Bản đồ Tọa độ (Chấm ghim hoặc Tìm kiếm OpenStreetMap)
                    </label>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Vĩ độ (Lat): <strong>{placeForm.latitude.toFixed(6)}</strong> | Kinh độ (Lng):{' '}
                      <strong>{placeForm.longitude.toFixed(6)}</strong>
                    </div>
                  </div>

                  <LocationPickerMap
                    latitude={placeForm.latitude}
                    longitude={placeForm.longitude}
                    onChange={(coords) => {
                      setPlaceForm((prev) => ({
                        ...prev,
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        ...(coords.province && !prev.province ? { province: coords.province } : {}),
                        ...(coords.district && !prev.district ? { district: coords.district } : {}),
                        ...(coords.suggestedName && !prev.name ? { name: coords.suggestedName } : {}),
                      }));
                    }}
                  />

                  {/* Manual Coordinates Input */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-0.5">Vĩ độ (Latitude):</span>
                      <input
                        type="number"
                        step="any"
                        value={placeForm.latitude}
                        onChange={(e) =>
                          setPlaceForm({ ...placeForm, latitude: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-0.5">Kinh độ (Longitude):</span>
                      <input
                        type="number"
                        step="any"
                        value={placeForm.longitude}
                        onChange={(e) =>
                          setPlaceForm({ ...placeForm, longitude: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Categories Multiselect */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Danh mục / Thể loại du lịch
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORY_OPTIONS.map((cat) => {
                      const isSelected = placeForm.categories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategorySelection(cat)}
                          className={`px-3 py-1 rounded-xl text-xs font-medium transition ${
                            isSelected
                              ? 'bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-500/20'
                              : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {isSelected ? `✓ ${cat}` : cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Extra Details: Price, Popularity, Space, Activity */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Ước tính chi phí (VNĐ)
                    </label>
                    <input
                      type="number"
                      value={placeForm.priceEstimate}
                      onChange={(e) =>
                        setPlaceForm({ ...placeForm, priceEstimate: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Điểm nổi tiếng (0 - 100)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={placeForm.popularityScore}
                      onChange={(e) =>
                        setPlaceForm({ ...placeForm, popularityScore: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Không gian
                    </label>
                    <select
                      value={placeForm.indoorOutdoor}
                      onChange={(e) => setPlaceForm({ ...placeForm, indoorOutdoor: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"
                    >
                      <option value="Ngoài trời">Ngoài trời</option>
                      <option value="Trong nhà">Trong nhà</option>
                      <option value="Kết hợp">Cả hai</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Mức độ vận động
                    </label>
                    <select
                      value={placeForm.activityLevel}
                      onChange={(e) => setPlaceForm({ ...placeForm, activityLevel: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"
                    >
                      <option value="Nhẹ nhàng">Nhẹ nhàng</option>
                      <option value="Trung bình">Trung bình</option>
                      <option value="Năng động">Năng động / Thể thao</option>
                    </select>
                  </div>
                </div>

                {/* Image URL with preview */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">URL Hình ảnh</label>
                  <input
                    type="url"
                    value={placeForm.imageUrl}
                    onChange={(e) => setPlaceForm({ ...placeForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                  {placeForm.imageUrl && (
                    <div className="mt-2 flex items-center gap-3">
                      <img
                        src={placeForm.imageUrl}
                        alt="Preview"
                        className="w-16 h-16 rounded-xl object-cover border border-slate-800"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                      <span className="text-[11px] text-slate-500">Xem trước ảnh đại diện</span>
                    </div>
                  )}
                </div>

                {/* Modal Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsPlaceModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingPlace}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-2 transition"
                  >
                    {isSubmittingPlace && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{editingPlace ? 'Lưu Thay Đổi' : 'Thêm Địa Điểm'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL 2: ADD / EDIT USER */}
        {/* ========================================================= */}
        {isUserModalOpen && (
          <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-6">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {editingUser ? 'Cập Nhật Người Dùng' : 'Tạo Người Dùng Mới'}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    {editingUser ? `Chỉnh sửa tài khoản ${editingUser.email}` : 'Thêm thành viên hoặc quản trị viên mới'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Họ và tên</label>
                  <input
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {editingUser ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu khởi tạo *'}
                  </label>
                  <input
                    type="password"
                    required={!editingUser}
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    placeholder={editingUser ? '••••••••' : 'Nhập mật khẩu ít nhất 6 ký tự'}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Vai trò (Role)</label>
                    <select
                      value={userForm.role}
                      onChange={(e: any) => setUserForm({ ...userForm, role: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="USER">USER (Người dùng thường)</option>
                      <option value="ADMIN">ADMIN (Quản trị viên)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Mức ngân sách</label>
                    <select
                      value={userForm.budgetLevel}
                      onChange={(e) => setUserForm({ ...userForm, budgetLevel: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white"
                    >
                      <option value="BUDGET">Tiết kiệm (Budget)</option>
                      <option value="MODERATE">Tiêu chuẩn (Moderate)</option>
                      <option value="LUXURY">Cao cấp (Luxury)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsUserModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingUser}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/20 disabled:opacity-50 flex items-center gap-2 transition"
                  >
                    {isSubmittingUser && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{editingUser ? 'Cập Nhật' : 'Tạo Người Dùng'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL 3: ADD / EDIT COMMUNITY POST */}
        {/* ========================================================= */}
        {isPostModalOpen && (
          <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl relative">
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-6">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {editingPost ? 'Chỉnh Sửa Bài Viết' : 'Tạo Bài Viết Thông Báo (Admin)'}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Bài viết sẽ xuất hiện trực tiếp trên trang Cộng đồng du lịch
                  </p>
                </div>
              </div>

              <form onSubmit={handleSavePost} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tiêu đề bài viết <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={postForm.title}
                    onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                    placeholder="VD: Thông báo cập nhật bản đồ du lịch AI mới..."
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nội dung bài viết <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={postForm.content}
                    onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                    placeholder="Nhập nội dung chia sẻ, kinh nghiệm du lịch hoặc thông báo quản trị..."
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tags (ngăn cách bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    value={postForm.tagsString}
                    onChange={(e) => setPostForm({ ...postForm, tagsString: e.target.value })}
                    placeholder="Thông báo, Hà Nội, Kinh nghiệm..."
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Link hình ảnh (mỗi dòng một link)
                  </label>
                  <textarea
                    rows={2}
                    value={postForm.imagesString}
                    onChange={(e) => setPostForm({ ...postForm, imagesString: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-[11px]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsPostModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingPost}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-cyan-600/20 disabled:opacity-50 flex items-center gap-2 transition"
                  >
                    {isSubmittingPost && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{editingPost ? 'Lưu Bài Viết' : 'Đăng Bài Viết'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL 4: VIEW & MODERATE COMMENTS */}
        {/* ========================================================= */}
        {viewingCommentsPost && (
          <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
              <button
                onClick={() => setViewingCommentsPost(null)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5 text-cyan-400" />
                <div>
                  <h2 className="text-sm font-bold text-white line-clamp-1">
                    Bình luận bài viết: {viewingCommentsPost.title}
                  </h2>
                  <p className="text-[11px] text-slate-400">Kiểm duyệt và xóa bình luận vi phạm</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {commentsLoading ? (
                  <div className="py-12 flex justify-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                  </div>
                ) : postComments.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs">Chưa có bình luận nào</div>
                ) : (
                  postComments.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-200">
                            {c.user?.name || c.user?.email}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <p className="text-slate-300 mt-1">{c.content}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition flex-shrink-0"
                        title="Xóa bình luận này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* DELETE CONFIRMATION MODALS */}
        {/* ========================================================= */}
        {deletingPlace && (
          <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Xác nhận xóa địa điểm</h3>
              <p className="text-xs text-slate-400 mb-5">
                Bạn có chắc chắn muốn xóa địa điểm <strong>&quot;{deletingPlace.name}&quot;</strong>? Thao tác này không thể hoàn tác.
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setDeletingPlace(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeletePlace}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/20"
                >
                  Xác nhận Xóa
                </button>
              </div>
            </div>
          </div>
        )}

        {deletingUser && (
          <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Xác nhận xóa tài khoản</h3>
              <p className="text-xs text-slate-400 mb-5">
                Bạn có chắc chắn muốn xóa người dùng <strong>&quot;{deletingUser.email}&quot;</strong>? Mọi dữ liệu liên quan sẽ bị xóa theo.
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setDeletingUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/20"
                >
                  Xác nhận Xóa
                </button>
              </div>
            </div>
          </div>
        )}

        {deletingPost && (
          <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Xác nhận xóa bài đăng</h3>
              <p className="text-xs text-slate-400 mb-5">
                Bạn có chắc chắn muốn xóa bài viết <strong>&quot;{deletingPost.title}&quot;</strong>?
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setDeletingPost(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeletePost}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/20"
                >
                  Xác nhận Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminRoute>
  );
}
