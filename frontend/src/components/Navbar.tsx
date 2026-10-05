'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
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
  User as UserIcon,
  ShieldCheck,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Không hiển thị Navbar trên trang login / register để giữ giao diện tập trung
  const isAuthPage = pathname === '/login' || pathname === '/register';
  if (isAuthPage) {
    return null;
  }

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
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-base font-bold bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
              AI Travel Planner
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Nền tảng du lịch thông minh</div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Auth Actions (Desktop) */}
        <div className="hidden lg:flex items-center gap-2.5">
          {isLoading ? (
            <div className="w-24 h-8 bg-slate-800/60 animate-pulse rounded-lg" />
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition ${
                  pathname === '/profile'
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200'
                }`}
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-[11px] uppercase">
                  {user.name ? user.name.charAt(0) : user.email.charAt(0)}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold max-w-[100px] truncate">
                    {user.name || user.email.split('@')[0]}
                  </span>
                </div>
                <UserIcon className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <button
                onClick={handleLogout}
                title="Đăng xuất"
                className="flex items-center gap-1 p-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-800 transition"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>Đăng nhập</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-md shadow-emerald-500/20 transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Đăng ký</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-3">
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
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
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
                  pathname === '/profile'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>Hồ sơ cá nhân & Wishlist</span>
              </Link>
            )}
          </nav>

          <div className="pt-3 border-t border-slate-800">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xs uppercase">
                    {user.name ? user.name.charAt(0) : user.email.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{user.name || user.email}</div>
                    <div className="text-[10px] text-emerald-400">{user.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 px-3 rounded-lg text-xs font-medium text-slate-200 bg-slate-900 border border-slate-800"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 px-3 rounded-lg text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
