'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export type ToastVariant = 'default' | 'success' | 'error';

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, variant: ToastVariant = 'default') => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev.slice(-2), { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3400);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.length > 0 && (
        <div
          aria-live="polite"
          className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm w-[calc(100vw-2.5rem)] sm:w-auto pointer-events-none"
        >
          {toasts.map((toast) => {
            const Icon =
              toast.variant === 'error'
                ? AlertCircle
                : toast.variant === 'success'
                ? CheckCircle2
                : Info;
            const iconColor =
              toast.variant === 'error'
                ? 'text-[#FF6B6B]'
                : toast.variant === 'success'
                ? 'text-[#14B8A6]'
                : 'text-[#14B8A6]';

            return (
              <div
                key={toast.id}
                role="status"
                className="pointer-events-auto bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-lg border border-slate-800 flex items-center justify-between gap-3 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 ${iconColor} shrink-0`} />
                  <span className="leading-snug break-words">{toast.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => dismissToast(toast.id)}
                  aria-label="Đóng thông báo"
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition shrink-0 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}
