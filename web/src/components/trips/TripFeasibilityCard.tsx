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

  // Màu sắc ngữ nghĩa theo thang điểm OFS (Ocean Teal / Emerald Travel)
  const getScoreTheme = (score: number) => {
    if (score >= 85) {
      return {
        text: 'text-[#059669]',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        badgeBg: 'bg-emerald-100 text-emerald-800',
        progress: 'bg-[#10B981]',
        scoreSubtext: 'text-[#64748B]',
      };
    }
    if (score >= 70) {
      return {
        text: 'text-[#0D9488]',
        bg: 'bg-[#F0FDFA]',
        border: 'border-[#99F6E4]',
        badgeBg: 'bg-[#CCFBF1] text-[#0F766E]',
        progress: 'bg-[#0D9488]',
        scoreSubtext: 'text-[#64748B]',
      };
    }
    if (score >= 50) {
      return {
        text: 'text-[#B45309]',
        bg: 'bg-[#FFFBEB]',
        border: 'border-[#FDE68A]',
        badgeBg: 'bg-[#FEF3C7] text-[#B45309]',
        progress: 'bg-[#F59E0B]',
        scoreSubtext: 'text-[#64748B]',
      };
    }
    return {
      text: 'text-[#DC2626]',
      bg: 'bg-red-50',
      border: 'border-red-200',
      badgeBg: 'bg-red-100 text-red-800',
      progress: 'bg-[#EF4444]',
      scoreSubtext: 'text-[#64748B]',
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
    <Card className={`bg-white border-[#E2E8F0] shadow-2xs overflow-hidden transition-all duration-200 ${className}`}>
      <CardContent className="p-5">
        {/* Header Block: Điểm số OFS và Tổng quan */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-start sm:items-center gap-3.5">
            {/* Vòng điểm số OFS */}
            <div
              className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-mono border ${theme.bg} ${theme.border} shrink-0`}
            >
              <span className={`text-xl font-extrabold leading-none tabular-nums ${theme.text}`}>
                {Math.round(overallScore)}
              </span>
              <span className={`text-[10px] font-sans mt-0.5 ${theme.scoreSubtext}`}>/100</span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-base font-bold text-[#0F172A]">
                  Đánh Giá Tính Khả Thi Của Lịch Trình
                </h3>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${theme.badgeBg}`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  {rating}
                </span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed line-clamp-1 sm:line-clamp-none">
                Mô hình định lượng 5 chiều: Địa lý di chuyển, Nhịp độ thời gian, Ngân sách, Gu cá nhân và Đa dạng điểm đến.
              </p>
            </div>
          </div>

          {/* Thống kê nhanh tổng chặng */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 bg-[#F8FAFC] px-3.5 py-2 rounded-xl border border-[#E2E8F0]">
            <div className="text-left sm:text-right">
              <div className="text-[10px] text-[#64748B] flex items-center gap-1">
                <Car className="w-3 h-3 text-[#0D9488]" />
                <span>Tổng cung đường</span>
              </div>
              <div className="text-xs font-bold text-[#0F172A] font-mono">
                {totalDistanceKm} km
              </div>
            </div>
            <div className="h-6 w-px bg-[#E2E8F0]" />
            <div className="text-left sm:text-right">
              <div className="text-[10px] text-[#64748B] flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#0D9488]" />
                <span>Thời gian di chuyển</span>
              </div>
              <div className="text-xs font-bold text-[#0F172A] font-mono">
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
                className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#99F6E4] transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#0F172A]">
                    <Icon className="w-3.5 h-3.5 text-[#0D9488]" />
                    <span className="truncate">{label}</span>
                  </div>
                  <span className={`text-xs font-bold font-mono ${cTheme.text}`}>
                    {Math.round(criterion.score)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${cTheme.progress}`}
                    style={{ width: `${Math.min(100, Math.max(5, criterion.score))}%` }}
                  />
                </div>

                <p className="text-[11px] text-[#64748B] line-clamp-2 leading-snug">
                  {criterion.summary}
                </p>
              </div>
            );
          })}
        </div>

        {/* Khối Cảnh báo & Khuyến nghị thực tế (nếu có) */}
        {warnings.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Lưu ý &amp; Khuyến cáo thực tế ({warnings.length})</span>
              </div>
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-[#64748B] hover:text-[#0D9488] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>{expanded ? 'Thu gọn' : 'Xem chi tiết'}</span>
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Danh sách hiển thị */}
            <div className="space-y-2">
              {/* Nếu chưa expand: chỉ hiện tối đa 2 warning đầu tiên */}
              {(expanded ? warnings : warnings.slice(0, 2)).map((w, idx) => {
                let badgeClass = 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]';
                let IconComponent = AlertCircle;
                let title = 'Lưu ý';

                if (w.type === 'CRITICAL') {
                  badgeClass = 'bg-red-50 text-red-800 border-red-200';
                  IconComponent = AlertTriangle;
                  title = 'Cảnh báo quan trọng';
                } else if (w.type === 'TIP') {
                  badgeClass = 'bg-[#F0FDFA] text-[#0F766E] border-[#99F6E4]';
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
          <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex items-center gap-2 text-xs text-[#0F766E] bg-[#F0FDFA] p-2.5 rounded-lg border border-[#99F6E4]">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>Lịch trình đạt độ cân bằng lý tưởng về cự ly di chuyển, ngân sách phân bổ và khung giờ hoạt động!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
