'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  MapPin,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/trips';

  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Vui lòng điền đầy đủ email và mật khẩu');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Mật khẩu phải chứa ít nhất 6 ký tự');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      router.push(redirect);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đăng ký không thành công. Vui lòng thử lại!';
      setErrorMessage(msg || 'Đăng ký không thành công. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative z-10">
      {/* Main Frosted Glass Card */}
      <Card className="bg-white/95 backdrop-blur-md border border-white/50 shadow-2xl rounded-2xl p-6 sm:p-8">
        <CardContent className="p-0">
          {/* Brand Header */}
          <div className="text-center mb-5">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#0D9488] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#0F172A]">
                AI Travel Planner
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-[#0F172A] mb-1">Tạo tài khoản mới</h1>
            <p className="text-xs text-[#64748B]">
              Bắt đầu lên lịch trình du lịch thông minh cùng AI ngay hôm nay
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-[#EF4444] text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="leading-snug">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Name input */}
            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wider">
                Họ và tên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                  <UserIcon className="w-4 h-4" />
                </div>
                <Input
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="pl-9 bg-[#F8FAFC] border-[#E2E8F0]"
                />
              </div>
            </div>

            {/* Email input */}
            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wider">
                Email <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                  <Mail className="w-4 h-4" />
                </div>
                <Input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="pl-9 bg-[#F8FAFC] border-[#E2E8F0]"
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wider">
                Mật khẩu <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                  <Lock className="w-4 h-4" />
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="pl-9 pr-10 bg-[#F8FAFC] border-[#E2E8F0]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748B] hover:text-[#0D9488] transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password input */}
            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1 uppercase tracking-wider">
                Xác nhận mật khẩu <span className="text-[#0F172A]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                  <Lock className="w-4 h-4" />
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="pl-9 pr-10 bg-[#F8FAFC] border-[#E2E8F0]"
                />
                {confirmPassword && confirmPassword === password && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#10B981] pointer-events-none">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 font-semibold text-xs gap-2 mt-2 bg-[#0D9488] hover:bg-[#0F766E] text-white rounded-xl cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang tạo tài khoản...</span>
                </>
              ) : (
                <>
                  <span>Đăng ký</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Switch to Login */}
          <div className="mt-5 pt-4 border-t border-[#E2E8F0] text-center">
            <p className="text-xs text-[#64748B]">
              Đã có tài khoản?{' '}
              <Link
                href={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'}
                className="text-[#0D9488] font-semibold hover:underline"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-5 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0F172A]/45 hover:bg-[#0F172A]/65 backdrop-blur-sm border border-white/25 text-xs text-white font-medium transition"
        >
          ← Quay về trang chủ
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen bg-[#0F172A] flex flex-col justify-center items-center px-4 py-10 overflow-hidden">
      {/* Crisp scenic Da Lat background */}
      <Image
        src="/images/provinces/dalat.jpg"
        alt="Bình minh sương sớm trên hồ Đà Lạt"
        fill
        priority
        quality={95}
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Directional Ocean Teal / Slate atmospheric overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/82 via-[#0F172A]/58 to-[#0D9488]/48"
      />

      <Suspense
        fallback={
          <div className="relative z-10 flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-white" />
          </div>
        }
      >
        <RegisterForm />
      </Suspense>

      {/* Subtle destination attribution */}
      <div className="hidden sm:inline-flex items-center gap-1.5 absolute bottom-5 right-6 z-10 px-3 py-1 rounded-full bg-[#0F172A]/45 backdrop-blur-sm border border-white/20 text-[11px] text-white/90">
        <MapPin className="w-3 h-3 text-[#14B8A6]" />
        <span>Đà Lạt • Lâm Đồng</span>
      </div>
    </div>
  );
}
