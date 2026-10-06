import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Compass,
  Search,
  Plus,
  ArrowUpRight,
  X,
  ListFilter,
  Grid,
  LucideIcon,
  Sparkles,
} from 'lucide-react';

/**
 * 1. Card Component sử dụng shadcn/ui + Lucide Icon
 */
export function UniversalCardDemo({
  title,
  subtitle,
  badge,
  icon: Icon,
  onClick,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: LucideIcon;
  onClick?: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      className={`group rounded-2xl border-[#E5E7EB] bg-white shadow-2xs hover:shadow-xs transition-all ${
        onClick ? 'cursor-pointer hover:border-[#1A1A1A]/30' : ''
      }`}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-5">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-9 h-9 rounded-xl bg-[#F5F5F4] border border-[#E5E7EB] flex items-center justify-center text-[#1A1A1A] shrink-0">
              <Icon className="w-4 h-4 text-[#1A1A1A]" />
            </div>
          )}
          <div>
            <CardTitle className="text-sm font-semibold text-[#1A1A1A] line-clamp-1">
              {title}
            </CardTitle>
            {subtitle && (
              <CardDescription className="text-xs text-[#6B7280] line-clamp-2 mt-0.5">
                {subtitle}
              </CardDescription>
            )}
          </div>
        </div>

        {badge && (
          <Badge variant="lime" className="text-[10px] shrink-0 font-medium">
            {badge}
          </Badge>
        )}
      </CardHeader>
    </Card>
  );
}

/**
 * 2. Segmented Pill Tabs sử dụng shadcn/ui Tabs + Lucide Icons
 */
export function UniversalPillTabsDemo({
  onTabChange,
}: {
  onTabChange?: (tab: string) => void;
}) {
  return (
    <Tabs defaultValue="details" onValueChange={onTabChange}>
      <TabsList className="rounded-full bg-[#F0F0EF] border border-[#E5E7EB] p-1">
        <TabsTrigger
          value="details"
          className="rounded-full px-3.5 py-1.5 text-xs font-medium data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white shadow-xs transition-all"
        >
          <ListFilter className="w-3.5 h-3.5 mr-1.5" />
          <span>Chi tiết theo chủ đề</span>
        </TabsTrigger>
        <TabsTrigger
          value="grid"
          className="rounded-full px-3.5 py-1.5 text-xs font-medium data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white shadow-xs transition-all"
        >
          <Grid className="w-3.5 h-3.5 mr-1.5" />
          <span>Lưới 10 chủ đề</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

/**
 * 3. Search Field sử dụng shadcn/ui Input + Lucide Search Icon
 */
export function UniversalSearchFieldDemo({
  value,
  onChange,
  onClear,
  placeholder = 'Tìm kiếm chủ đề, địa danh...',
}: {
  value: string;
  onChange: (val: string) => void;
  onClear?: () => void;
  placeholder?: string;
}) {
  return (
    <div className="relative flex items-center bg-white border border-[#E5E7EB] rounded-xl px-3 py-1.5 shadow-2xs focus-within:border-[#1A1A1A] focus-within:ring-2 focus-within:ring-[#1A1A1A]/10 transition-all">
      <Search className="w-3.5 h-3.5 text-[#9CA3AF] mr-2 shrink-0 pointer-events-none" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-0 p-0 h-auto text-xs text-[#1A1A1A] placeholder-[#9CA3AF] focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent shadow-none"
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
 * 4. Modal Dialog sử dụng shadcn/ui Dialog + Lucide Icons
 */
export function UniversalDialogDemo({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border-[#E5E7EB] bg-white p-5 shadow-xl max-w-2xl">
        <DialogHeader className="pb-3 border-b border-[#F0F0EF]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <DialogTitle className="text-sm sm:text-base font-semibold text-[#1A1A1A]">
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="text-xs text-[#6B7280]">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>
        <div className="py-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
