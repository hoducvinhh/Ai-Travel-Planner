'use client';

import React, { useState } from 'react';
import { Place } from '@/types';
import { api } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Share2,
  Copy,
  Check,
  Send,
  Sparkles,
  MapPin,
  Ticket,
  Loader2,
} from 'lucide-react';

interface SharePlaceModalProps {
  place: Place;
  userId?: string;
  onClose: () => void;
  onShared?: (note?: string) => void;
  showToast: (msg: string) => void;
}

const QUICK_TAGS = [
  'View đẹp chụp ảnh',
  'Ẩm thực đặc sắc',
  'Không gian thư giãn',
  'Đáng để trải nghiệm',
  'Gợi ý đi cuối tuần',
];

export default function SharePlaceModal({
  place,
  userId,
  onClose,
  onShared,
  showToast,
}: SharePlaceModalProps) {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/places#${place.id}`;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
      setCopied(true);
      showToast('Đã sao chép liên kết vào bộ nhớ tạm!');
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      showToast('Không thể sao chép liên kết');
    }
  };

  const handleShareToProfile = async () => {
    if (!userId) {
      showToast('Vui lòng đăng nhập để chia sẻ lên trang cá nhân!');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/interactions/share', {
        userId,
        placeId: place.id,
        note: note.trim() || undefined,
      });

      showToast('Đã chia sẻ địa điểm lên trang cá nhân của bạn!');
      if (onShared) onShared(note.trim());
      onClose();
    } catch (err: any) {
      showToast(err?.message || 'Có lỗi xảy ra khi chia sẻ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTagToNote = (tag: string) => {
    if (note.includes(tag)) return;
    setNote((prev) => (prev ? `${prev} ${tag}` : tag));
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl border-[#E5E7EB] bg-white p-6 shadow-xl">
        <DialogHeader className="pb-3 border-b border-[#F0F0EF]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] text-white flex items-center justify-center shrink-0">
              <Share2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-[#1A1A1A]">
                Chia sẻ địa điểm
              </DialogTitle>
              <DialogDescription className="text-xs text-[#6B7280]">
                Đăng lên trang cá nhân để bạn bè cùng khám phá
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Place Card Preview */}
        <div className="flex gap-3.5 p-3.5 rounded-xl bg-[#F9F9F8] border border-[#E5E7EB]">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F5F5F4] border border-[#E5E7EB] flex-shrink-0 relative">
            {place.imageUrl ? (
              <img
                src={place.imageUrl}
                alt={place.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#9CA3AF]">
                <MapPin className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div>
              <h4 className="text-sm font-semibold text-[#1A1A1A] truncate">
                {place.name}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#6B7280] flex-shrink-0" />
                <span className="truncate">
                  {place.district ? `${place.district}, ` : ''}
                  {place.province || 'Việt Nam'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#1A1A1A]">
              <Ticket className="w-3.5 h-3.5 text-[#6B7280]" />
              <span>
                {place.priceEstimate > 0
                  ? `${place.priceEstimate.toLocaleString('vi-VN')}đ`
                  : 'Miễn phí'}
              </span>
            </div>
          </div>
        </div>

        {/* Note / Caption Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#1A1A1A] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#6B7280]" />
            Cảm nghĩ của bạn về địa điểm này (tùy chọn)
          </label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Bạn thấy địa điểm này thế nào? Có mẹo gì hay muốn nhắn nhủ không?..."
            rows={3}
            maxLength={300}
            className="rounded-xl border-[#E5E7EB] text-xs text-[#1A1A1A] placeholder-[#9CA3AF] resize-none focus-visible:ring-1 focus-visible:ring-[#1A1A1A]"
          />

          {/* Quick Tags Suggestions */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => addTagToNote(tag)}
                className="px-2.5 py-1 rounded-full bg-[#F5F5F4] hover:bg-[#E5E7EB] border border-[#E5E7EB] text-[11px] text-[#4B5563] transition-colors"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#F0F0EF]">
          <Button
            type="button"
            variant="outline"
            onClick={handleCopyLink}
            className="rounded-xl text-xs gap-1.5 border-[#E5E7EB]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#1A1A1A]" />
                <span>Đã sao chép</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép link</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="default"
            onClick={handleShareToProfile}
            disabled={isSubmitting}
            className="flex-1 rounded-xl text-xs gap-1.5 bg-[#1A1A1A] text-white hover:bg-[#2C2C2C]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang chia sẻ...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Chia sẻ lên trang cá nhân</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
