import React, { useState } from 'react';
import {
  Compass,
  Search,
  Plus,
  ArrowUpRight,
  X,
  Check,
  ChevronRight,
  LucideIcon,
} from 'lucide-react';

/**
 * 1. Lightweight Integrated Card
 */
export function UniversalCard({
  title,
  subtitle,
  badge,
  icon: Icon,
  children,
  onClick,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`group p-5 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#1A1A1A]/30 transition-all shadow-2xs hover:shadow-xs ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-9 h-9 rounded-xl bg-[#F5F5F4] border border-[#E5E7EB] flex items-center justify-center text-[#1A1A1A] shrink-0">
              <Icon className="w-4 h-4 text-[#1A1A1A]" />
            </div>
          )}
          <div>
            <h4 className="text-sm font-semibold text-[#1A1A1A] line-clamp-1">
              {title}
            </h4>
            {subtitle && (
              <p className="text-xs text-[#6B7280] line-clamp-2 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {badge && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F4FCE3] text-[#365314] border border-[#D9F99D] font-medium shrink-0">
            {badge}
          </span>
        )}
      </div>

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

/**
 * 2. Segmented Pill Tab Switcher
 */
export function UniversalSegmentedTabs({
  options,
  activeKey,
  onChange,
}: {
  options: { key: string; label: string; icon?: LucideIcon }[];
  activeKey: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="inline-flex items-center p-1 rounded-full bg-[#F0F0EF] border border-[#E5E7EB] text-xs">
      {options.map((opt) => {
        const isActive = opt.key === activeKey;
        const Icon = opt.icon;
        return (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium transition-all ${
              isActive
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'text-[#6B7280] hover:text-[#1A1A1A]'
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5 text-inherit" />}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * 3. Search Field Component
 */
export function UniversalSearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Tìm kiếm...',
}: {
  value: string;
  onChange: (val: string) => void;
  onClear?: () => void;
  placeholder?: string;
}) {
  return (
    <div className="relative flex items-center bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 shadow-2xs focus-within:border-[#1A1A1A] focus-within:ring-2 focus-within:ring-[#1A1A1A]/10 transition-all">
      <Search className="w-3.5 h-3.5 text-[#9CA3AF] mr-2 shrink-0 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-xs text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none"
      />
      {value && onClear && (
        <button
          onClick={onClear}
          className="p-0.5 text-[#9CA3AF] hover:text-[#1A1A1A] transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

/**
 * 4. Minimal Dialog / Modal
 */
export function UniversalModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white border border-[#E5E7EB] rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#F0F0EF] flex items-center justify-between gap-3 shrink-0">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-[#1A1A1A]">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-[#6B7280] mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="p-1.5 rounded-xl text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F5F5F4] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
