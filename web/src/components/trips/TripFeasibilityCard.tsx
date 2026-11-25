'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  DollarSign,
  Sparkles,
  Layers,
  Car,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FeasibilityReport, FeasibilityCriterion, FeasibilityWarning } from '@/types';

interface TripFeasibilityCardProps {
  report?: FeasibilityReport;
  className?: string;
}

export default function TripFeasibilityCard({
  report,
  className = '',
}: TripFeasibilityCardProps) {
  const [expanded, setExpanded] = useState(false);

  if (!report) {
    return null;
  }

  const { overallScore, rating, metrics, warnings, totalDistanceKm, totalTransitTimeHours } = report;

  // Màu sắc theo thang điểm OFS
  const getScoreTheme = (score: number) => {
    if (score >= 85) {
      return {
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        badgeBg: 'bg-emerald-100 text-emerald-800',
        progress: 'bg-emerald-500',
      };
    }
    if (score >= 70) {
      return {
        text: 'text-blue-700',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        badgeBg: 'bg-blue-100 text-blue-800',
        progress: 'bg-blue-500',
      };
    }
    if (score >= 50) {
      return {
        text: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        badgeBg: 'bg-amber-100 text-amber-800',
        progress: 'bg-amber-500',
      };
    }
    return {
      text: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      badgeBg: 'bg-rose-100 text-rose-800',
      progress: 'bg-rose-500',
    };
  };

  const theme = getScoreTheme(overallScore);

  const criteriaList: Array<{
    key: keyof typeof metrics;
    label: string;
    icon: React.ElementType;
    criterion: FeasibilityCriterion;
  }> = [
    {
      key: 'geo',
      label: 'Khoảng cách & Cung đường',
      icon: MapPin,
      criterion: metrics.geo,
    },
    {
      key: 'time',
      label: 'Khung giờ & Nhịp độ',
      icon: Clock,
      criterion: metrics.time,
    },
    {
      key: 'budget',
      label: 'Phù hợp ngân sách',
      icon: DollarSign,
      criterion: metrics.budget,
    },
    {
      key: 'preference',
      label: 'Độ khớp gu du lịch',
      icon: Sparkles,
      criterion: metrics.preference,
    },
    {
      key: 'diversity',
      label: 'Đa dạng trải nghiệm',
      icon: Layers,
      criterion: metrics.diversity,
    },
  ];

  const criticalWarnings = warnings.filter((w) => w.type === 'CRITICAL');
  const regularWarnings = warnings.filter((w) => w.type === 'WARNING');
  const tips = warnings.filter((w) => w.type === 'TIP');

  return (
    <Card className={`bg-white border-[#E5E7EB] shadow-2xs overflow-hidden transition-all duration-200 ${className}`}>
      <CardContent className="p-5">
        {/* Header Block: Điểm số OFS và Tổng quan */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#F0F0EF]">
          <div className="flex items-start sm:items-center gap-3.5">
            {/* Vòng điểm số OFS */}
            <div
              className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-mono border ${theme.bg} ${theme.border} shrink-0`}
            >
              <span className={`text-xl font-extrabold leading-none ${theme.text}`}>
                {Math.round(overallScore)}
              </span>
              <span className="text-[10px] text-muted-foreground font-sans mt-0.5">/100</span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-base font-bold text-[#1A1A1A]">
                  Đánh Giá Tính Khả Thi Của Lịch Trình
                </h3>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${theme.badgeBg}`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  {rating}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1 sm:line-clamp-none">
                Mô hình định lượng 5 chiều: Địa lý di chuyển, Nhịp độ thời gian, Ngân sách, Gu cá nhân và Đa dạng điểm đến.
              </p>
            </div>
          </div>

          {/* Thống kê nhanh tổng chặng */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 bg-[#F9F9F8] px-3.5 py-2 rounded-xl border border-[#F0F0EF]">
            <div className="text-left sm:text-right">
              <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Car className="w-3 h-3" />
                <span>Tổng cung đường</span>
              </div>
              <div className="text-xs font-bold text-[#1A1A1A] font-mono">
                {totalDistanceKm} km
              </div>
            </div>
            <div className="h-6 w-px bg-neutral-200" />
            <div className="text-left sm:text-right">
              <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Thời gian di chuyển</span>
              </div>
              <div className="text-xs font-bold text-[#1A1A1A] font-mono">
                ~{totalTransitTimeHours} giờ
              </div>
            </div>
          </div>
        </div>

        {/* Thanh tiến trình 5 tiêu chuẩn kỹ thuật */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-4 pb-2">
          {criteriaList.map(({ key, label, icon: Icon, criterion }) => {
            const cTheme = getScoreTheme(criterion.score);
            return (
              <div
                key={key}
                className="p-3 rounded-xl bg-[#FBFBFA] border border-[#F0F0EF] hover:border-neutral-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#1A1A1A]">
                    <Icon className="w-3.5 h-3.5 text-neutral-500" />
                    <span className="truncate">{label}</span>
                  </div>
                  <span className={`text-xs font-bold font-mono ${cTheme.text}`}>
                    {Math.round(criterion.score)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden mb-1.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${cTheme.progress}`}
                    style={{ width: `${Math.min(100, Math.max(5, criterion.score))}%` }}
                  />
                </div>

                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-snug">
                  {criterion.summary}
                </p>
              </div>
            );
          })}
        </div>

        {/* Khối Cảnh báo & Khuyến nghị thực tế (nếu có) */}
        {warnings.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-[#F0F0EF]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A]">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Lưu ý & Khuyến cáo thực tế ({warnings.length})</span>
              </div>
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-muted-foreground hover:text-[#1A1A1A] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>{expanded ? 'Thu gọn' : 'Xem chi tiết'}</span>
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Danh sách hiển thị */}
            <div className="space-y-2">
              {/* Nếu chưa expand: chỉ hiện tối đa 2 warning đầu tiên */}
              {(expanded ? warnings : warnings.slice(0, 2)).map((w, idx) => {
                let badgeClass = 'bg-amber-50 text-amber-800 border-amber-200';
                let IconComponent = AlertCircle;
                let title = 'Lưu ý';

                if (w.type === 'CRITICAL') {
                  badgeClass = 'bg-rose-50 text-rose-800 border-rose-200';
                  IconComponent = AlertTriangle;
                  title = 'Cảnh báo quan trọng';
                } else if (w.type === 'TIP') {
                  badgeClass = 'bg-blue-50 text-blue-800 border-blue-200';
                  IconComponent = Info;
                  title = 'Gợi ý tối ưu';
                }

                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs leading-relaxed ${badgeClass}`}
                  >
                    <IconComponent className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold mr-1">[{title}]</span>
                      <span>{w.message}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Khi lịch trình hoàn hảo không có cảnh báo */}
        {warnings.length === 0 && (
          <div className="mt-3 pt-3 border-t border-[#F0F0EF] flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50/50 p-2 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Lịch trình đạt độ cân bằng lý tưởng về cự ly di chuyển, ngân sách phân bổ và khung giờ hoạt động!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
