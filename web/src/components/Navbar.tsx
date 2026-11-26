'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  MapPin,
  Calendar,
  Sparkles,
  MessageSquare,
  MessageCircle,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  Compass,
  Users,
  ShieldCheck,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { unreadCount } = useSocket();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Không hiển thị Navbar trên trang login / register để giữ giao diện tập trung
  const currentPath = pathname as string;
  const isAuthPage = currentPath === '/login' || currentPath === '/register';
  if (isAuthPage) {
    return null;
  }

  const isProfilePage = currentPath === '/profile';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navLinks = [
    { href: '/', label: 'Trang chủ', icon: Sparkles },
    { href: '/places', label: 'Khám Phá', icon: Compass },
    { href: '/trips/new', label: 'Tạo Lịch Trình', icon: MapPin },
    { href: '/community', label: 'Cộng Đồng', icon: Users },
    { href: '/trips', label: 'Lịch Trình', icon: Calendar },
    { href: '/question-answer', label: 'Hỏi Đáp AI', icon: MessageSquare },
    ...(user?.role === 'ADMIN'
      ? [{ href: '/admin', label: 'Quản trị', icon: ShieldCheck, isAdmin: true }]
      : []),
  ];

  const isNavLinkActive = (href: string) => {
    if (href === '/') return currentPath === '/';
    if (href === '/trips/new') return currentPath === '/trips/new';
    if (href === '/trips') {
      return currentPath === '/trips' || (currentPath.startsWith('/trips/') && currentPath !== '/trips/new');
    }
    return currentPath === href || currentPath.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#0D9488] text-white flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold text-[#0F172A] leading-tight">
              AI Travel Planner
            </div>
            <div className="text-[10px] font-medium text-[#64748B]">
              Nền tảng du lịch thông minh
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = isNavLinkActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0D9488] text-white'
                    : 'text-[#64748B] hover:text-[#0D9488] hover:bg-[#F0FDFA]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
                {link.isAdmin && (
                  <Badge
                    variant={isActive ? 'outline' : 'teal'}
                    className={`text-[9px] px-1.5 py-0 rounded-full font-semibold ${
                      isActive ? 'bg-white/15 text-white border-white/30' : ''
                    }`}
                  >
                    Admin
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Auth Actions (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {isLoading ? (
            <div className="w-24 h-8 animate-pulse rounded-lg bg-[#F1F5F9]" />
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/messages"
                className={`relative flex items-center justify-center h-8 w-8 rounded-xl border transition ${
                  pathname === '/messages'
                    ? 'bg-[#0D9488] text-white border-[#0D9488]'
                    : 'bg-white border-[#E2E8F0] hover:bg-[#F0FDFA] hover:border-[#99F6E4] text-[#0F172A]'
                }`}
                aria-label="Tin nhắn trực tiếp"
                title="Tin nhắn trực tiếp"
              >
                <MessageCircle className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full text-[9px] font-bold bg-[#FF6B6B] text-white border border-white animate-in zoom-in-50">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>

              <Link
                href="/profile"
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition ${
                  isProfilePage
                    ? 'bg-[#0D9488] text-white border-[#0D9488]'
                    : 'bg-white border-[#E2E8F0] hover:bg-[#F0FDFA] hover:border-[#99F6E4] text-[#0F172A]'
                }`}
              >
                <Avatar className="w-6 h-6 rounded-md">
                  <AvatarFallback
                    className={`font-bold text-[10px] uppercase ${
                      isProfilePage ? 'bg-white/20 text-white' : 'bg-[#F0FDFA] text-[#0F766E]'
                    }`}
                  >
                    {user.name ? user.name.charAt(0) : user.email.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold max-w-[100px] truncate">
                    {user.name || user.email.split('@')[0]}
                  </span>
                </div>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                aria-label="Đăng xuất"
                title="Đăng xuất"
                className="h-8 w-8 rounded-xl text-[#64748B] hover:text-[#EF4444] hover:bg-red-50 border border-[#E2E8F0]"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="outline"
                className="h-8 px-3 rounded-xl text-xs font-medium text-[#0F172A] border-[#E2E8F0] hover:bg-[#F0FDFA] hover:text-[#0D9488] hover:border-[#99F6E4]"
              >
                <Link href="/login" className="flex items-center gap-1.5">
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Đăng nhập</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="default"
                className="h-8 px-3.5 rounded-xl text-xs font-medium text-white bg-[#0D9488] hover:bg-[#0F766E]"
              >
                <Link href="/register" className="flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Đăng ký</span>
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden h-9 w-9 rounded-lg text-[#64748B] hover:text-[#0D9488] hover:bg-[#F0FDFA]"
          aria-label="Mở menu điều hướng"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2E8F0] bg-white px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = isNavLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
                    isActive
                      ? 'bg-[#0D9488] text-white'
                      : 'text-[#64748B] hover:bg-[#F0FDFA] hover:text-[#0D9488]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            {isAuthenticated && (
              <>
                <Link
                  href="/messages"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ${
                    pathname === '/messages'
                      ? 'bg-[#0D9488] text-white'
                      : 'text-[#64748B] hover:bg-[#F0FDFA] hover:text-[#0D9488]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-4 h-4" />
                    <span>Tin nhắn 1-1</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF6B6B] text-white">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
                    isProfilePage
                      ? 'bg-[#0D9488] text-white'
                      : 'text-[#64748B] hover:bg-[#F0FDFA] hover:text-[#0D9488]'
                  }`}
                >
                  <Avatar className="w-4 h-4">
                    <AvatarFallback className="text-[9px] bg-[#F0FDFA] text-[#0F766E]">
                      {user?.name ? user.name.charAt(0) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span>Hồ sơ cá nhân &amp; Wishlist</span>
                </Link>
              </>
            )}
          </nav>

          <div className="pt-3 border-t border-[#E2E8F0]">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="w-7 h-7 rounded-lg">
                    <AvatarFallback className="font-bold text-xs uppercase bg-[#F0FDFA] text-[#0F766E] border border-[#99F6E4]">
                      {user.name ? user.name.charAt(0) : user.email.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-xs font-semibold text-[#0F172A]">
                      {user.name || user.email}
                    </div>
                    <div className="text-[10px] text-[#64748B]">
                      {user.role}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="h-7 px-2.5 text-xs gap-1 text-[#EF4444] hover:bg-red-50 border-red-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng xuất</span>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="h-8 text-xs font-medium text-[#0F172A] bg-white border-[#E2E8F0]"
                >
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    Đăng nhập
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="default"
                  className="h-8 text-xs font-medium text-white bg-[#0D9488] hover:bg-[#0F766E]"
                >
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    Đăng ký
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
