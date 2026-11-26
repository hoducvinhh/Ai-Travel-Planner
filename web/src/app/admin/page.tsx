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
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  Compass,
  Star,
  MessageCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

// Dynamic import for Leaflet map component to prevent SSR window issues
const LocationPickerMap = dynamic(
  () => import('@/components/admin/LocationPickerMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[320px] bg-[#F8FAFC] animate-pulse rounded-xl flex flex-col items-center justify-center text-[#64748B] gap-2 border border-[#E2E8F0]">
        <Loader2 className="w-6 h-6 animate-spin text-[#0D9488]" />
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
    priceEstimate: 50000,
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
      password: '',
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
    } catch {
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
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-24">
        {/* Floating Toast Alert */}
        {toast && (
          <div
            className={`fixed bottom-6 right-6 z-[9999] px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 border ${
              toast.type === 'success'
                ? 'bg-[#0F172A] border-slate-800 text-white'
                : 'bg-[#FFF1F2] border-[#FECDD3] text-[#EF4444]'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#14B8A6]" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#EF4444]" />
            )}
            <span>{toast.message}</span>
          </div>
        )}

        {/* Top Header Banner */}
        <div className="border-b border-[#E2E8F0] bg-white pt-8 pb-6 px-4 md:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#0D9488] text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-bold text-[#0F172A]">
                    Bảng điều khiển quản trị
                  </h1>
                  <Badge variant="teal" className="text-[10px] uppercase font-semibold h-5">
                    Admin
                  </Badge>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Quản lý toàn diện dữ liệu Địa điểm (OpenStreetMap), Người dùng và Hậu kiểm bài đăng cộng đồng
                </p>
              </div>
            </div>

            {/* Quick stats snapshot */}
            <div className="flex items-center gap-2.5">
              <Card className="bg-[#F8FAFC] border-[#E2E8F0] px-3.5 py-2 text-center shadow-2xs">
                <CardContent className="p-0">
                  <div className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider">Địa điểm</div>
                  <div className="text-sm font-bold text-[#0D9488]">{placesTotal}</div>
                </CardContent>
              </Card>
              <Card className="bg-[#F8FAFC] border-[#E2E8F0] px-3.5 py-2 text-center shadow-2xs">
                <CardContent className="p-0">
                  <div className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider">Thành viên</div>
                  <div className="text-sm font-bold text-[#0F172A]">{usersTotal}</div>
                </CardContent>
              </Card>
              <Card className="bg-[#F8FAFC] border-[#E2E8F0] px-3.5 py-2 text-center shadow-2xs">
                <CardContent className="p-0">
                  <div className="text-[10px] text-[#64748B] uppercase font-semibold tracking-wider">Bài viết</div>
                  <div className="text-sm font-bold text-[#0F172A]">{postsTotal}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
          <div className="flex items-center gap-1.5 border-b border-[#E2E8F0] pb-3">
            <button
              onClick={() => setActiveTab('places')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'places'
                  ? 'bg-[#0D9488] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0D9488] hover:bg-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Quản lý địa điểm ({placesTotal})</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-[#0D9488] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0D9488] hover:bg-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Quản lý người dùng ({usersTotal})</span>
            </button>

            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'posts'
                  ? 'bg-[#0D9488] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0D9488] hover:bg-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Bài đăng cộng đồng ({postsTotal})</span>
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
              <Card className="bg-white p-3.5 rounded-2xl border-[#E2E8F0] shadow-2xs">
                <CardContent className="p-0 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 flex-1">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        type="text"
                        value={searchPlace}
                        onChange={(e) => setSearchPlace(e.target.value)}
                        placeholder="Tìm kiếm địa điểm theo tên, quận huyện..."
                        className="pl-8 text-xs h-9 bg-[#F8FAFC]"
                      />
                    </div>

                    {/* Province Filter */}
                    <select
                      value={filterProvince}
                      onChange={(e) => {
                        setFilterProvince(e.target.value);
                        setPlacesPage(1);
                      }}
                      className="px-3 py-1.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] h-9"
                    >
                      {PROVINCE_PRESETS.map((p) => (
                        <option key={p} value={p}>
                          {p === 'Tất cả' ? 'Tất cả Tỉnh/Thành' : p}
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
                      className="px-3 py-1.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] h-9"
                    >
                      <option value="Tất cả">Tất cả thể loại</option>
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchPlaces}
                      title="Làm mới"
                      className="h-9 px-2.5 text-[#64748B] hover:text-[#0D9488] hover:border-[#0D9488]"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </Button>

                    <Button
                      size="sm"
                      onClick={openAddPlaceModal}
                      className="gap-1.5 text-xs font-semibold h-9"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm địa điểm mới</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Places Table */}
              <Card className="bg-white rounded-2xl border-[#E2E8F0] overflow-hidden shadow-2xs">
                {placesLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center text-[#64748B]">
                    <Loader2 className="w-7 h-7 animate-spin text-[#0D9488] mb-2" />
                    <p className="text-xs">Đang tải danh sách địa điểm...</p>
                  </div>
                ) : places.length === 0 ? (
                  <div className="py-16 text-center text-[#64748B]">
                    <MapPin className="w-9 h-9 mx-auto text-[#0D9488]/40 mb-2" />
                    <p className="text-sm font-semibold text-[#0F172A]">Không tìm thấy địa điểm nào</p>
                    <p className="text-xs text-[#64748B] mt-1">Hãy thử đổi từ khóa tìm kiếm</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="bg-[#F8FAFC]">
                      <TableRow>
                        <TableHead className="px-4 py-3">Địa điểm</TableHead>
                        <TableHead className="px-4 py-3">Tỉnh / Thành</TableHead>
                        <TableHead className="px-4 py-3">Tọa độ (OSM)</TableHead>
                        <TableHead className="px-4 py-3">Thể loại</TableHead>
                        <TableHead className="px-4 py-3">Chi phí / Đánh giá</TableHead>
                        <TableHead className="px-4 py-3 text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {places.map((place) => (
                        <TableRow key={place.id}>
                          <TableCell className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {place.imageUrl ? (
                                <img
                                  src={place.imageUrl}
                                  alt={place.name}
                                  className="w-10 h-10 rounded-lg object-cover border border-[#E2E8F0] flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-[#F0FDFA] border border-[#99F6E4] flex items-center justify-center text-[#0D9488] flex-shrink-0">
                                  <MapPin className="w-4 h-4" />
                                </div>
                              )}
                              <div>
                                <div className="font-semibold text-[#0F172A] text-xs line-clamp-1">{place.name}</div>
                                <div className="text-[11px] text-[#64748B] line-clamp-1">{place.description}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            <span className="text-[#0F172A] font-medium text-xs">{place.province || '—'}</span>
                            {place.district && <span className="text-[10px] text-[#64748B] block">{place.district}</span>}
                          </TableCell>
                          <TableCell className="px-4 py-3 font-mono text-[11px] text-[#64748B]">
                            {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            <div className="flex flex-wrap gap-1 max-w-[180px]">
                              {(place.categories || []).slice(0, 2).map((c) => (
                                <Badge
                                  key={c}
                                  variant="teal"
                                  className="px-1.5 py-0 h-4 text-[10px] font-normal"
                                >
                                  {c}
                                </Badge>
                              ))}
                              {(place.categories || []).length > 2 && (
                                <span className="text-[10px] text-[#64748B]">
                                  +{place.categories.length - 2}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            <div className="text-[#0F766E] text-xs font-mono font-semibold">
                              {place.priceEstimate ? `${place.priceEstimate.toLocaleString('vi-VN')} đ` : 'Miễn phí'}
                            </div>
                            <div className="text-[10px] text-[#64748B] flex items-center gap-1">
                              <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                              <span>{place.popularityScore || 0} điểm</span>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditPlaceModal(place)}
                                className="h-7 w-7 p-0 text-[#64748B] hover:text-[#0D9488] hover:bg-[#F0FDFA]"
                                title="Chỉnh sửa"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeletingPlace(place)}
                                className="h-7 w-7 p-0 text-[#64748B] hover:text-[#EF4444] hover:bg-[#FFF1F2]"
                                title="Xóa"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {/* Pagination */}
                {placesTotalPages > 1 && (
                  <div className="px-4 py-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs bg-[#F8FAFC]">
                    <span className="text-muted-foreground">
                      Trang {placesPage} / {placesTotalPages} (Tổng {placesTotal} địa điểm)
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={placesPage <= 1}
                        onClick={() => setPlacesPage((p) => Math.max(1, p - 1))}
                        className="h-7 w-7 p-0"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={placesPage >= placesTotalPages}
                        onClick={() => setPlacesPage((p) => Math.min(placesTotalPages, p + 1))}
                        className="h-7 w-7 p-0"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: USERS CRUD */}
          {/* ========================================================= */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              {/* Action Toolbar */}
              <Card className="bg-white p-3.5 rounded-2xl border-[#E2E8F0] shadow-2xs">
                <CardContent className="p-0 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 flex-1">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        type="text"
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        placeholder="Tìm kiếm người dùng theo tên, email..."
                        className="pl-8 text-xs h-9 bg-[#F8FAFC]"
                      />
                    </div>

                    <select
                      value={filterUserRole}
                      onChange={(e: any) => {
                        setFilterUserRole(e.target.value);
                        setUsersPage(1);
                      }}
                      className="px-3 py-1.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] h-9"
                    >
                      <option value="ALL">Tất cả vai trò</option>
                      <option value="USER">Người dùng (USER)</option>
                      <option value="ADMIN">Quản trị viên (ADMIN)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchUsers}
                      title="Làm mới"
                      className="h-9 px-2.5 text-[#64748B] hover:text-[#0D9488] hover:border-[#0D9488]"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </Button>

                    <Button
                      size="sm"
                      onClick={openAddUserModal}
                      className="gap-1.5 text-xs font-semibold h-9"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm người dùng</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Users Table */}
              <Card className="bg-white rounded-2xl border-[#E2E8F0] overflow-hidden shadow-2xs">
                {usersLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center text-[#64748B]">
                    <Loader2 className="w-7 h-7 animate-spin text-[#0D9488] mb-2" />
                    <p className="text-xs">Đang tải danh sách người dùng...</p>
                  </div>
                ) : usersList.length === 0 ? (
                  <div className="py-16 text-center text-[#64748B]">
                    <Users className="w-9 h-9 mx-auto text-[#0D9488]/40 mb-2" />
                    <p className="text-sm font-semibold text-[#0F172A]">Không tìm thấy người dùng nào</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="bg-[#F8FAFC]">
                      <TableRow>
                        <TableHead className="px-4 py-3">Người dùng</TableHead>
                        <TableHead className="px-4 py-3">Vai trò</TableHead>
                        <TableHead className="px-4 py-3">Sở thích du lịch</TableHead>
                        <TableHead className="px-4 py-3">Hoạt động</TableHead>
                        <TableHead className="px-4 py-3">Ngày tham gia</TableHead>
                        <TableHead className="px-4 py-3 text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersList.map((u) => {
                        const isSelf = u.id === user?.id;
                        return (
                          <TableRow key={u.id}>
                            <TableCell className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-[#F0FDFA] border border-[#99F6E4] text-[#0F766E] font-semibold flex items-center justify-center text-xs uppercase flex-shrink-0">
                                  {u.name ? u.name.charAt(0) : u.email.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-semibold text-[#0F172A] text-xs flex items-center gap-1.5">
                                    <span>{u.name || 'Chưa đặt tên'}</span>
                                    {isSelf && (
                                      <Badge variant="teal" className="text-[9px] px-1 py-0 h-4">
                                        Bạn
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-[#64748B]">{u.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              <Badge
                                variant={u.role === 'ADMIN' ? 'teal' : 'secondary'}
                                className="text-[10px] uppercase font-semibold"
                              >
                                {u.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {(u.preferredStyles || []).map((s: string) => (
                                  <Badge
                                    key={s}
                                    variant="outline"
                                    className="text-[10px] px-1.5 py-0 h-4 font-normal text-[#64748B] border-[#E2E8F0]"
                                  >
                                    {s}
                                  </Badge>
                                ))}
                                {(!u.preferredStyles || u.preferredStyles.length === 0) && (
                                  <span className="text-[#94A3B8] text-[11px]">—</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-[#64748B] text-xs">
                              <div>Chuyến đi: <strong className="text-[#0F172A]">{u._count?.trips || 0}</strong></div>
                              <div>Bài viết: <strong className="text-[#0F172A]">{u._count?.communityPosts || 0}</strong></div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-[#64748B] text-xs">
                              {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditUserModal(u)}
                                  className="h-7 w-7 p-0 text-[#64748B] hover:text-[#0D9488] hover:bg-[#F0FDFA]"
                                  title="Sửa quyền / Thông tin"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={isSelf}
                                  onClick={() => setDeletingUser(u)}
                                  className="h-7 w-7 p-0 text-[#64748B] hover:text-[#EF4444] hover:bg-[#FFF1F2] disabled:opacity-30"
                                  title={isSelf ? 'Không thể tự xóa chính mình' : 'Xóa người dùng'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}

                {/* Users Pagination */}
                {usersTotalPages > 1 && (
                  <div className="px-4 py-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs bg-[#F8FAFC]">
                    <span className="text-muted-foreground">
                      Trang {usersPage} / {usersTotalPages} (Tổng {usersTotal} thành viên)
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={usersPage <= 1}
                        onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                        className="h-7 w-7 p-0"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={usersPage >= usersTotalPages}
                        onClick={() => setUsersPage((p) => Math.min(usersTotalPages, p + 1))}
                        className="h-7 w-7 p-0"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: COMMUNITY POSTS (POST-MODERATION) */}
          {/* ========================================================= */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {/* Action Toolbar */}
              <Card className="bg-white p-3.5 rounded-2xl border-[#E2E8F0] shadow-2xs">
                <CardContent className="p-0 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 flex-1">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        type="text"
                        value={searchPost}
                        onChange={(e) => setSearchPost(e.target.value)}
                        placeholder="Tìm bài đăng theo tiêu đề, nội dung..."
                        className="pl-8 text-xs h-9 bg-[#F8FAFC]"
                      />
                    </div>

                    <Input
                      type="text"
                      value={filterPostTag}
                      onChange={(e) => setFilterPostTag(e.target.value)}
                      placeholder="Lọc theo tag..."
                      className="text-xs h-9 w-40 bg-[#F8FAFC]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchPosts}
                      title="Làm mới"
                      className="h-9 px-2.5 text-[#64748B] hover:text-[#0D9488] hover:border-[#0D9488]"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </Button>

                    <Button
                      size="sm"
                      onClick={openAddPostModal}
                      className="gap-1.5 text-xs font-semibold h-9"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Đăng thông báo admin</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Note on Post-moderation */}
              <div className="p-3 bg-[#F0FDFA] border border-[#99F6E4] rounded-xl text-xs text-[#0F766E] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0D9488]" />
                <span>
                  <strong>Cơ chế hậu kiểm:</strong> Người dùng được đăng bài trực tiếp lên diễn đàn. Tại đây bạn có thể kiểm duyệt, chỉnh sửa hoặc xóa bài viết vi phạm, spam.
                </span>
              </div>

              {/* Posts Table */}
              <Card className="bg-white rounded-2xl border-[#E2E8F0] overflow-hidden shadow-2xs">
                {postsLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center text-[#64748B]">
                    <Loader2 className="w-7 h-7 animate-spin text-[#0D9488] mb-2" />
                    <p className="text-xs">Đang tải danh sách bài viết...</p>
                  </div>
                ) : postsList.length === 0 ? (
                  <div className="py-16 text-center text-[#64748B]">
                    <MessageSquare className="w-9 h-9 mx-auto text-[#0D9488]/40 mb-2" />
                    <p className="text-sm font-semibold text-[#0F172A]">Không tìm thấy bài viết nào</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="bg-[#F8FAFC]">
                      <TableRow>
                        <TableHead className="px-4 py-3">Bài viết</TableHead>
                        <TableHead className="px-4 py-3">Tác giả</TableHead>
                        <TableHead className="px-4 py-3">Tags</TableHead>
                        <TableHead className="px-4 py-3">Tương tác</TableHead>
                        <TableHead className="px-4 py-3">Thời gian</TableHead>
                        <TableHead className="px-4 py-3 text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {postsList.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="px-4 py-3 max-w-[280px]">
                            <div className="font-semibold text-[#0F172A] text-xs line-clamp-1">{post.title}</div>
                            <div className="text-[11px] text-[#64748B] line-clamp-1">{post.content}</div>
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            <span className="font-medium text-[#0F172A] text-xs">{post.user?.name || 'Ẩn danh'}</span>
                            <span className="text-[10px] text-[#64748B] block">{post.user?.email}</span>
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            <div className="flex flex-wrap gap-1 max-w-[150px]">
                              {(post.tags || []).slice(0, 2).map((t: string) => (
                                <Badge
                                  key={t}
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0 h-4 font-normal text-[#64748B] border-[#E2E8F0]"
                                >
                                  #{t}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-xs text-[#64748B]">
                            <div>Thích: <strong className="text-[#0F172A]">{post.likesCount || 0}</strong></div>
                            <button
                              type="button"
                              onClick={() => openViewComments(post)}
                              className="text-xs text-[#0D9488] hover:text-[#0F766E] hover:underline cursor-pointer"
                            >
                              Bình luận: <strong>{post.commentsCount || 0}</strong>
                            </button>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-xs text-[#64748B]">
                            {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openViewComments(post)}
                                className="h-7 w-7 p-0 text-[#64748B] hover:text-[#0D9488] hover:bg-[#F0FDFA]"
                                title="Xem bình luận"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditPostModal(post)}
                                className="h-7 w-7 p-0 text-[#64748B] hover:text-[#0D9488] hover:bg-[#F0FDFA]"
                                title="Chỉnh sửa"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeletingPost(post)}
                                className="h-7 w-7 p-0 text-[#64748B] hover:text-[#EF4444] hover:bg-[#FFF1F2]"
                                title="Xóa"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {/* Posts Pagination */}
                {postsTotalPages > 1 && (
                  <div className="px-4 py-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs bg-[#F8FAFC]">
                    <span className="text-muted-foreground">
                      Trang {postsPage} / {postsTotalPages} (Tổng {postsTotal} bài đăng)
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={postsPage <= 1}
                        onClick={() => setPostsPage((p) => Math.max(1, p - 1))}
                        className="h-7 w-7 p-0"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={postsPage >= postsTotalPages}
                        onClick={() => setPostsPage((p) => Math.min(postsTotalPages, p + 1))}
                        className="h-7 w-7 p-0"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* MODAL 1: ADD / EDIT PLACE */}
        {/* ========================================================= */}
        {isPlaceModalOpen && (
          <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 shadow-xl relative text-[#0F172A]">
              <button
                type="button"
                onClick={() => setIsPlaceModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-[#F0FDFA] border border-[#99F6E4] text-[#0D9488] flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0F172A]">
                    {editingPlace ? 'Chỉnh sửa địa điểm' : 'Thêm địa điểm mới'}
                  </h2>
                  <p className="text-[11px] text-[#64748B]">
                    Sử dụng bản đồ OpenStreetMap bên dưới để tìm kiếm hoặc chấm ghim tọa độ
                  </p>
                </div>
              </div>

              <form onSubmit={handleSavePlace} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wider">
                      Tên địa điểm <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="text"
                      required
                      value={placeForm.name}
                      onChange={(e) => setPlaceForm({ ...placeForm, name: e.target.value })}
                      placeholder="VD: Cà phê Giảng..."
                      className="bg-[#F8FAFC]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wider">
                      Tỉnh / Thành phố
                    </label>
                    <Input
                      type="text"
                      value={placeForm.province}
                      onChange={(e) => setPlaceForm({ ...placeForm, province: e.target.value })}
                      placeholder="VD: Hà Nội..."
                      className="bg-[#F8FAFC]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wider">
                      Quận / Huyện
                    </label>
                    <Input
                      type="text"
                      value={placeForm.district}
                      onChange={(e) => setPlaceForm({ ...placeForm, district: e.target.value })}
                      placeholder="VD: Hoàn Kiếm..."
                      className="bg-[#F8FAFC]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wider">
                    Mô tả chi tiết <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    required
                    rows={3}
                    value={placeForm.description}
                    onChange={(e) => setPlaceForm({ ...placeForm, description: e.target.value })}
                    placeholder="Mô tả đặc điểm nổi bật của địa điểm này..."
                    className="bg-[#F8FAFC] resize-none"
                  />
                </div>

                {/* Map Picker */}
                <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#0F172A] flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-[#0D9488]" />
                      Bản đồ tọa độ (OpenStreetMap)
                    </label>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      Vĩ độ: <strong>{placeForm.latitude.toFixed(6)}</strong> | Kinh độ: <strong>{placeForm.longitude.toFixed(6)}</strong>
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

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[11px] text-muted-foreground block mb-0.5">Vĩ độ:</span>
                      <Input
                        type="number"
                        step="any"
                        value={placeForm.latitude}
                        onChange={(e) =>
                          setPlaceForm({ ...placeForm, latitude: parseFloat(e.target.value) || 0 })
                        }
                        className="font-mono text-xs bg-white"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-muted-foreground block mb-0.5">Kinh độ:</span>
                      <Input
                        type="number"
                        step="any"
                        value={placeForm.longitude}
                        onChange={(e) =>
                          setPlaceForm({ ...placeForm, longitude: parseFloat(e.target.value) || 0 })
                        }
                        className="font-mono text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
                    Danh mục / Thể loại du lịch
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {CATEGORY_OPTIONS.map((cat) => {
                      const isSelected = placeForm.categories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategorySelection(cat)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                            isSelected
                              ? 'bg-[#0D9488] text-white shadow-xs'
                              : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0D9488] hover:border-[#0D9488]'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Ước tính chi phí (VNĐ)
                    </label>
                    <Input
                      type="number"
                      value={placeForm.priceEstimate}
                      onChange={(e) =>
                        setPlaceForm({ ...placeForm, priceEstimate: parseInt(e.target.value) || 0 })
                      }
                      className="bg-[#F8FAFC]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Điểm nổi tiếng (0 - 100)
                    </label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={placeForm.popularityScore}
                      onChange={(e) =>
                        setPlaceForm({ ...placeForm, popularityScore: parseFloat(e.target.value) || 0 })
                      }
                      className="bg-[#F8FAFC]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Không gian
                    </label>
                    <select
                      value={placeForm.indoorOutdoor}
                      onChange={(e) => setPlaceForm({ ...placeForm, indoorOutdoor: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] h-9"
                    >
                      <option value="Ngoài trời">Ngoài trời</option>
                      <option value="Trong nhà">Trong nhà</option>
                      <option value="Kết hợp">Cả hai</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Mức độ vận động
                    </label>
                    <select
                      value={placeForm.activityLevel}
                      onChange={(e) => setPlaceForm({ ...placeForm, activityLevel: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] h-9"
                    >
                      <option value="Nhẹ nhàng">Nhẹ nhàng</option>
                      <option value="Trung bình">Trung bình</option>
                      <option value="Năng động">Năng động</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wider">
                    URL Hình ảnh
                  </label>
                  <Input
                    type="url"
                    value={placeForm.imageUrl}
                    onChange={(e) => setPlaceForm({ ...placeForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="bg-[#F8FAFC]"
                  />
                  {placeForm.imageUrl && (
                    <div className="mt-2 flex items-center gap-3">
                      <img
                        src={placeForm.imageUrl}
                        alt="Preview"
                        className="w-14 h-14 rounded-xl object-cover border border-[#E2E8F0]"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                      <span className="text-[11px] text-[#64748B]">Xem trước ảnh đại diện</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPlaceModalOpen(false)}
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmittingPlace}
                    className="gap-1.5"
                  >
                    {isSubmittingPlace && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{editingPlace ? 'Lưu thay đổi' : 'Thêm địa điểm'}</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL 2: ADD / EDIT USER */}
        {/* ========================================================= */}
        {isUserModalOpen && (
          <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-lg p-6 shadow-xl relative text-[#0F172A]">
              <button
                type="button"
                onClick={() => setIsUserModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-[#F0FDFA] border border-[#99F6E4] text-[#0D9488] flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0F172A]">
                    {editingUser ? 'Cập nhật người dùng' : 'Tạo người dùng mới'}
                  </h2>
                  <p className="text-[11px] text-[#64748B]">
                    {editingUser ? `Chỉnh sửa tài khoản ${editingUser.email}` : 'Thêm thành viên hoặc quản trị viên'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveUser} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wider">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="email@example.com"
                    className="bg-[#F8FAFC]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wider">
                    Họ và tên
                  </label>
                  <Input
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="bg-[#F8FAFC]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wider">
                    {editingUser ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu khởi tạo *'}
                  </label>
                  <Input
                    type="password"
                    required={!editingUser}
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    placeholder={editingUser ? '••••••••' : 'Nhập mật khẩu ít nhất 6 ký tự'}
                    className="bg-[#F8FAFC]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wider">
                      Vai trò
                    </label>
                    <select
                      value={userForm.role}
                      onChange={(e: any) => setUserForm({ ...userForm, role: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] h-9"
                    >
                      <option value="USER">USER (Người dùng)</option>
                      <option value="ADMIN">ADMIN (Quản trị viên)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wider">
                      Mức ngân sách
                    </label>
                    <select
                      value={userForm.budgetLevel}
                      onChange={(e) => setUserForm({ ...userForm, budgetLevel: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] h-9"
                    >
                      <option value="BUDGET">Tiết kiệm</option>
                      <option value="MODERATE">Tiêu chuẩn</option>
                      <option value="LUXURY">Cao cấp</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsUserModalOpen(false)}
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmittingUser}
                    className="gap-1.5"
                  >
                    {isSubmittingUser && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{editingUser ? 'Cập nhật' : 'Tạo người dùng'}</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL 3: ADD / EDIT COMMUNITY POST */}
        {/* ========================================================= */}
        {isPostModalOpen && (
          <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-xl p-6 shadow-xl relative text-[#0F172A]">
              <button
                type="button"
                onClick={() => setIsPostModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-[#F0FDFA] border border-[#99F6E4] text-[#0D9488] flex items-center justify-center font-bold">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0F172A]">
                    {editingPost ? 'Chỉnh sửa bài viết' : 'Tạo bài viết thông báo (Admin)'}
                  </h2>
                  <p className="text-[11px] text-[#64748B]">
                    Bài viết sẽ xuất hiện trực tiếp trên trang Cộng đồng du lịch
                  </p>
                </div>
              </div>

              <form onSubmit={handleSavePost} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wider">
                    Tiêu đề bài viết <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    value={postForm.title}
                    onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                    placeholder="VD: Thông báo cập nhật tính năng mới..."
                    className="bg-[#F8FAFC]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wider">
                    Nội dung bài viết <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    required
                    rows={4}
                    value={postForm.content}
                    onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                    placeholder="Nhập nội dung chia sẻ hoặc thông báo quản trị..."
                    className="bg-[#F8FAFC] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wider">
                    Tags (ngăn cách bằng dấu phẩy)
                  </label>
                  <Input
                    type="text"
                    value={postForm.tagsString}
                    onChange={(e) => setPostForm({ ...postForm, tagsString: e.target.value })}
                    placeholder="Thông báo, Hướng dẫn..."
                    className="bg-[#F8FAFC]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wider">
                    Link hình ảnh (mỗi dòng một link)
                  </label>
                  <Textarea
                    rows={2}
                    value={postForm.imagesString}
                    onChange={(e) => setPostForm({ ...postForm, imagesString: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="bg-[#F8FAFC] font-mono text-[11px] resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPostModalOpen(false)}
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmittingPost}
                    className="gap-1.5"
                  >
                    {isSubmittingPost && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{editingPost ? 'Lưu bài viết' : 'Đăng bài viết'}</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL 4: VIEW & MODERATE COMMENTS */}
        {/* ========================================================= */}
        {viewingCommentsPost && (
          <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-lg p-5 shadow-xl relative max-h-[85vh] flex flex-col text-[#0F172A]">
              <button
                type="button"
                onClick={() => setViewingCommentsPost(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-4 h-4 text-[#0D9488]" />
                <div>
                  <h2 className="text-sm font-bold text-[#0F172A] line-clamp-1">
                    Bình luận bài viết: {viewingCommentsPost.title}
                  </h2>
                  <p className="text-[11px] text-[#64748B]">Kiểm duyệt và xóa bình luận vi phạm</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {commentsLoading ? (
                  <div className="py-12 flex justify-center text-[#64748B]">
                    <Loader2 className="w-6 h-6 animate-spin text-[#0D9488]" />
                  </div>
                ) : postComments.length === 0 ? (
                  <div className="py-12 text-center text-[#64748B] text-xs">Chưa có bình luận nào</div>
                ) : (
                  postComments.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-start justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#0F172A]">
                            {c.user?.name || c.user?.email}
                          </span>
                          <span className="text-[10px] text-[#64748B]">
                            {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <p className="text-[#64748B] mt-1 text-[11px] leading-relaxed">{c.content}</p>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteComment(c.id)}
                        className="h-6 w-6 p-0 text-[#64748B] hover:text-[#EF4444] hover:bg-[#FFF1F2] flex-shrink-0"
                        title="Xóa bình luận này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
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
          <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-sm p-5 text-center shadow-xl text-[#0F172A]">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold mb-1">Xác nhận xóa địa điểm</h3>
              <p className="text-xs text-[#64748B] mb-4">
                Bạn có chắc chắn muốn xóa địa điểm <strong>&quot;{deletingPlace.name}&quot;</strong>? Thao tác này không thể hoàn tác.
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeletingPlace(null)}
                >
                  Hủy
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeletePlace}
                >
                  Xác nhận xóa
                </Button>
              </div>
            </div>
          </div>
        )}

        {deletingUser && (
          <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-sm p-5 text-center shadow-xl text-[#0F172A]">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold mb-1">Xác nhận xóa tài khoản</h3>
              <p className="text-xs text-[#64748B] mb-4">
                Bạn có chắc chắn muốn xóa người dùng <strong>&quot;{deletingUser.email}&quot;</strong>?
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeletingUser(null)}
                >
                  Hủy
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteUser}
                >
                  Xác nhận xóa
                </Button>
              </div>
            </div>
          </div>
        )}

        {deletingPost && (
          <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-sm p-5 text-center shadow-xl text-[#0F172A]">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold mb-1">Xác nhận xóa bài đăng</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Bạn có chắc chắn muốn xóa bài viết <strong>&quot;{deletingPost.title}&quot;</strong>?
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeletingPost(null)}
                >
                  Hủy
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeletePost}
                >
                  Xác nhận xóa
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminRoute>
  );
}
