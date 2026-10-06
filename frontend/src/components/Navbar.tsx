'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  MapPin,
  Calendar,
  Sparkles,
  MessageSquare,
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
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Không hiển thị Navbar trên trang login / register để giữ giao diện tập trung
  const currentPath = pathname as string;
  const isAuthPage = currentPath === '/login' || currentPath === '/register';
  if (isAuthPage) {
    return null;
  }

  const isQaPage = currentPath === '/question-answer';
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

  return (
    <header
      className={`sticky top-0 z-50 transition-colors ${
        isQaPage
          ? 'border-b border-[#E5E7EB] bg-white/95 backdrop-blur-md'
          : 'border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${
              isQaPage
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/20'
            }`}
          >
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div
              className={`text-base font-bold ${
                isQaPage
                  ? 'text-[#1A1A1A]'
                  : 'bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent'
              }`}
            >
              AI Travel Planner
            </div>
            <div
              className={`text-[10px] font-medium ${
                isQaPage ? 'text-[#6B7280]' : 'text-slate-400'
              }`}
            >
              Nền tảng du lịch thông minh
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            if (isQaPage) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#1A1A1A] text-white shadow-xs'
                      : 'text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F5F5F4]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                  {link.isAdmin && (
                    <Badge variant="default" className="text-[9px] px-1.5 py-0 rounded-full font-semibold">
                      Admin
                    </Badge>
                  )}
                </Link>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? link.isAdmin
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-sm shadow-purple-500/20'
                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : link.isAdmin
                    ? 'text-purple-400 hover:text-purple-300 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
                {link.isAdmin && (
                  <Badge variant="secondary" className="text-[9px] px-1 py-0 rounded uppercase tracking-wider">
                    Admin
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Auth Actions (Desktop) */}
        <div className="hidden lg:flex items-center gap-2.5">
          {isLoading ? (
            <div
              className={`w-24 h-8 animate-pulse rounded-lg ${
                isQaPage ? 'bg-[#F0F0EF]' : 'bg-slate-800/60'
              }`}
            />
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition ${
                  isQaPage
                    ? isProfilePage
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'bg-white border-[#E5E7EB] hover:bg-[#F5F5F4] text-[#1A1A1A]'
                    : isProfilePage
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200'
                }`}
              >
                <Avatar className="w-6 h-6 rounded-md">
                  <AvatarFallback
                    className={`font-bold text-[10px] uppercase ${
                      isQaPage
                        ? 'bg-[#F5F5F4] text-[#1A1A1A]'
                        : 'bg-emerald-500/20 text-emerald-400'
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
                title="Đăng xuất"
                className={`h-8 w-8 rounded-xl ${
                  isQaPage
                    ? 'text-[#6B7280] hover:text-rose-600 hover:bg-rose-50 border border-[#E5E7EB]'
                    : 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30'
                }`}
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="outline"
                className={`h-8 px-3 rounded-xl text-xs font-medium ${
                  isQaPage
                    ? 'text-[#1A1A1A] border-[#E5E7EB] hover:bg-[#F5F5F4]'
                    : 'text-slate-200 hover:text-white bg-slate-900 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Link href="/login" className="flex items-center gap-1.5">
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Đăng nhập</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="default"
                className={`h-8 px-3.5 rounded-xl text-xs font-medium text-white shadow-xs ${
                  isQaPage
                    ? 'bg-[#1A1A1A] hover:bg-[#2C2C2C]'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/20'
                }`}
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
          className={`lg:hidden h-9 w-9 rounded-lg ${
            isQaPage
              ? 'text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F5F5F4]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden border-t px-4 py-4 space-y-3 ${
            isQaPage
              ? 'border-[#E5E7EB] bg-white'
              : 'border-slate-800 bg-slate-950'
          }`}
        >
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
                    isActive
                      ? isQaPage
                        ? 'bg-[#1A1A1A] text-white'
                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : isQaPage
                      ? 'text-[#6B7280] hover:bg-[#F5F5F4] hover:text-[#1A1A1A]'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            {isAuthenticated && (
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
                  isProfilePage
                    ? isQaPage
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : isQaPage
                    ? 'text-[#6B7280] hover:bg-[#F5F5F4] hover:text-[#1A1A1A]'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Avatar className="w-4 h-4">
                  <AvatarFallback className="text-[9px]">U</AvatarFallback>
                </Avatar>
                <span>Hồ sơ cá nhân & Wishlist</span>
              </Link>
            )}
          </nav>

          <div
            className={`pt-3 border-t ${
              isQaPage ? 'border-[#E5E7EB]' : 'border-slate-800'
            }`}
          >
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="w-7 h-7 rounded-lg">
                    <AvatarFallback
                      className={`font-bold text-xs uppercase ${
                        isQaPage
                          ? 'bg-[#F5F5F4] text-[#1A1A1A] border border-[#E5E7EB]'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {user.name ? user.name.charAt(0) : user.email.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div
                      className={`text-xs font-semibold ${
                        isQaPage ? 'text-[#1A1A1A]' : 'text-slate-200'
                      }`}
                    >
                      {user.name || user.email}
                    </div>
                    <div
                      className={`text-[10px] ${
                        isQaPage ? 'text-[#6B7280]' : 'text-emerald-400'
                      }`}
                    >
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
                  className={`h-7 px-2.5 text-xs gap-1 ${
                    isQaPage
                      ? 'text-rose-600 hover:bg-rose-50 border-rose-200'
                      : 'text-rose-400 hover:bg-rose-500/10 border-rose-500/30'
                  }`}
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
                  className={`h-8 text-xs font-medium ${
                    isQaPage
                      ? 'text-[#1A1A1A] bg-white border-[#E5E7EB]'
                      : 'text-slate-200 bg-slate-900 border-slate-800'
                  }`}
                >
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    Đăng nhập
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="default"
                  className={`h-8 text-xs font-medium text-white ${
                    isQaPage
                      ? 'bg-[#1A1A1A] hover:bg-[#2C2C2C]'
                      : 'bg-emerald-600 hover:bg-emerald-500'
                  }`}
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
