'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/admin');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center text-[#0F172A]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0D9488] mb-3" />
        <p className="text-xs text-[#64748B] font-medium">Đang xác thực quyền Quản trị viên...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-[80vh] bg-[#F8FAFC] flex items-center justify-center px-4">
        <Card className="max-w-md w-full bg-white border-[#E2E8F0] rounded-2xl p-8 text-center shadow-none">
          <CardContent className="p-0">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-[#EF4444] flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-[#0F172A] mb-2">Truy Cập Bị Từ Chối</h1>
            <p className="text-[#64748B] text-xs leading-relaxed mb-6">
              Khu vực này chỉ dành riêng cho tài khoản Quản trị viên (Admin). Bạn không có quyền truy cập vào trang này.
            </p>
            <Button asChild className="bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs rounded-xl px-5">
              <Link href="/">Trở về Trang chủ</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
