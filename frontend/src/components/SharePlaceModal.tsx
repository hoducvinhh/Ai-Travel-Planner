'use client';

import React, { useState } from 'react';
import { Place } from '@/types';
import { api } from '@/lib/api';
import {
  X,
  Share2,
  Copy,
  Check,
  Send,
  Sparkles,
  MapPin,
  Ticket,
  Loader2,
  Heart,
} from 'lucide-react';

interface SharePlaceModalProps {
  place: Place;
  userId?: string;
  onClose: () => void;
  onShared?: (note?: string) => void;
  showToast: (msg: string) => void;
}

const QUICK_TAGS = [
  'View đẹp mê ly ✨',
  'Ẩm thực ngon đỉnh 🍜',
  'Không gian cực chill 🍃',
  'Rất đáng trải nghiệm 🌟',
  'Gợi ý cho cuối tuần 🎒',
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
      showToast('Đã sao chép liên kết vào bộ nhớ tạm! 📋');
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

      showToast('Đã chia sẻ địa điểm lên trang cá nhân của bạn! 🚀');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-slate-900/95 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col gap-5 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glow effect */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Chia sẻ địa điểm</h3>
              <p className="text-xs text-slate-400">Đăng lên trang cá nhân để bạn bè cùng khám phá</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Place Card Preview */}
        <div className="flex gap-3.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 relative z-10">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 relative">
            {place.imageUrl ? (
              <img
                src={place.imageUrl}
                alt={place.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-slate-900 to-emerald-950 text-2xl">
                🏞️
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div>
              <h4 className="text-sm font-bold text-white truncate">{place.name}</h4>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="truncate">{place.district ? `${place.district}, ` : ''}{place.province || 'Việt Nam'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <Ticket className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {place.priceEstimate > 0
                  ? `${place.priceEstimate.toLocaleString('vi-VN')}đ`
                  : 'Miễn phí'}
              </span>
            </div>
          </div>
        </div>

        {/* Note / Caption Input */}
        <div className="space-y-2 relative z-10">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Cảm nghĩ của bạn về địa điểm này (tùy chọn)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Bạn thấy địa điểm này thế nào? Có mẹo gì hay muốn nhắn nhủ không?..."
            rows={3}
            maxLength={300}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/40 resize-none transition"
          />

          {/* Quick Tags Suggestions */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => addTagToNote(tag)}
                className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-emerald-500/20 hover:text-emerald-300 border border-slate-700/60 text-[11px] text-slate-300 transition"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800 relative z-10">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Đã sao chép</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Sao chép link</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleShareToProfile}
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang chia sẻ...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Chia sẻ lên trang cá nhân</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
