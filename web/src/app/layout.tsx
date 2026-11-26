import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import { AuthProvider } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';
import { ToastProvider } from '@/components/ui/toast';
import Navbar from '@/components/Navbar';
import OnboardingModal from '@/components/onboarding/OnboardingModal';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AI Travel Planner | Lập Kế Hoạch Du Lịch Thông Minh',
  description: 'Hệ thống AI kết hợp Machine Learning và LLM để tạo lịch trình du lịch cá nhân hóa',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A]">
        <ToastProvider>
          <AuthProvider>
            <SocketProvider>
              <Navbar />
              <OnboardingModal />
              {children}
            </SocketProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

