'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Clock,
  Navigation,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Map as MapIcon,
  Sparkles,
  Sunrise,
  Sun,
  Moon,
  Compass,
  Zap,
  Route,
} from 'lucide-react';

import ProtectedRoute from '@/components/ProtectedRoute';
import { api } from '@/lib/api';
import PlaceWeatherPill from '@/components/PlaceWeatherPill';
import TripFeasibilityCard from '@/components/trips/TripFeasibilityCard';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';

// Dynamically import Leaflet map
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] md:h-[480px] bg-[#F5F5F4] rounded-xl flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
    </div>
  ),
});

// Dynamically import Directions & Weather Modal
const PlaceDirectionsModal = dynamic(
  () => import('@/components/PlaceDirectionsModal'),
  { ssr: false }
);

import { ItineraryPlace as Place, DayPlan, TripItinerary, Trip, TimeSlot } from '@/types';

// Helper to normalize timeSlot if missing or from older trip records
function normalizePlaceSlot(place: Place, index: number, total: number): TimeSlot {
  if (place.timeSlot && ['morning', 'afternoon', 'evening'].includes(place.timeSlot)) {
    return place.timeSlot;
  }
  const time = (place.estimatedTime || '').toLowerCase();
  if (time.includes('sáng') || time.includes('morn') || /0[6-9]:|1[0-1]:/.test(time)) return 'morning';
  if (time.includes('tối') || time.includes('even') || time.includes('night') || /1[8-9]:|2[0-3]:/.test(time)) return 'evening';
  if (time.includes('chiều') || time.includes('trưa') || time.includes('after') || /1[2-7]:/.test(time)) return 'afternoon';

  if (total <= 2) return index === 0 ? 'morning' : 'afternoon';
  if (index === 0) return 'morning';
  if (index >= total - 1) return 'evening';
  return 'afternoon';
}

// Helper to format actual calendar date for each day to avoid duplicate "Ngày 1 / Ngày 1"
function formatDayDate(startDateStr?: string, dayNumber: number = 1, rawDate?: string): string {
  if (startDateStr) {
    const start = new Date(startDateStr);
    if (!isNaN(start.getTime())) {
      const d = new Date(start);
      d.setDate(start.getDate() + (dayNumber - 1));

      const weekday = d.toLocaleDateString('vi-VN', { weekday: 'long' });
      const dayFormatted = d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      return `${weekday}, ${dayFormatted}`;
    }
  }

  if (rawDate) {
    const clean = rawDate.trim();
    if (!/^ngày\s*\d+$/i.test(clean) && clean !== `${dayNumber}`) {
      return clean;
    }
  }

  return `Lịch trình ngày ${dayNumber}`;
}

interface SessionConfig {
  slot: TimeSlot;
  label: string;
  icon: typeof Sunrise;
  timeRange: string;
  theme: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  emptyNote: string;
}

const SESSION_DEFINITIONS: SessionConfig[] = [
  {
    slot: 'morning',
    label: 'Buổi Sáng',
    icon: Sunrise,
    timeRange: '08:00 - 11:30',
    theme: 'Tham quan văn hoá, di tích & Khởi đầu ngày mới',
    accentBg: 'bg-[#FFFBEB]',
    accentText: 'text-[#B45309]',
    accentBorder: 'border-[#FDE68A]',
    emptyNote: 'Buổi sáng tự do: Thưởng thức bữa sáng, cà phê hoặc nghỉ ngơi chuẩn bị cho chuyến đi.',
  },
  {
    slot: 'afternoon',
    label: 'Buổi Chiều',
    icon: Sun,
    timeRange: '13:30 - 17:30',
    theme: 'Vui chơi, trải nghiệm khám phá & Ẩm thực địa phương',
    accentBg: 'bg-[#F0FDFA]',
    accentText: 'text-[#0F766E]',
    accentBorder: 'border-[#99F6E4]',
    emptyNote: 'Buổi chiều tự do: Tự do tham quan các điểm lân cận hoặc mua sắm.',
  },
  {
    slot: 'evening',
    label: 'Buổi Tối',
    icon: Moon,
    timeRange: '18:30 - 21:30',
    theme: 'Ẩm thực đêm, phố đi bộ, chợ đêm & Ngắm cảnh',
    accentBg: 'bg-[#F1F5F9]',
    accentText: 'text-[#0F172A]',
    accentBorder: 'border-[#CBD5E1]',
    emptyNote: 'Buổi tối tự do: Dạo mát, thưởng thức ẩm thực đường phố hoặc nghỉ ngơi tại khách sạn.',
  },
];

function TripDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const tripId = params.id as string;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedSession, setSelectedSession] = useState<'all' | TimeSlot>('all');
  const [focusedPlaceId, setFocusedPlaceId] = useState<string | null>(null);
  const [directionsPlace, setDirectionsPlace] = useState<Place | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationNotice, setOptimizationNotice] = useState<string | null>(null);

  const handleOptimizeRoute = async () => {
    if (!tripId || isOptimizing) return;
    setIsOptimizing(true);
    setOptimizationNotice(null);
    try {
      const updated = await api.post<Trip>(`/trips/${tripId}/optimize`);
      if (updated && updated.itinerary && updated.itinerary.days && trip?.places) {
        const placeMap = new Map(trip.places.map((tp) => [tp.placeId, tp.place]));
        updated.itinerary.days.forEach((day) => {
          day.places?.forEach((p) => {
            const matched = placeMap.get(p.placeId);
            if (matched?.imageUrl && !p.imageUrl) {
              p.imageUrl = matched.imageUrl;
            }
          });
        });
      }
      setTrip(updated);
      const stats = updated.itinerary?.optimizationStats;
      if (stats && stats.totalSavedDistanceKm > 0) {
        setOptimizationNotice(
          `Tối ưu hóa thành công! Đã tiết kiệm ${stats.totalSavedDistanceKm} km (-${stats.totalSavedPercentage}% quãng đường di chuyển).`
        );
      } else {
        setOptimizationNotice(
          'Lộ trình đã được tối ưu hóa đường đi ngắn nhất thỏa mãn các khung giờ!'
        );
      }
    } catch (err: any) {
      console.error('Error optimizing trip route:', err);
      showToast(err.message || 'Không thể tối ưu hóa lộ trình', 'error');
    } finally {
      setIsOptimizing(false);
    }
  };

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const data = await api.get<Trip>(`/trips/${tripId}`);
        // Tự động bổ sung imageUrl cho từng địa điểm từ trip.places nếu chưa có
        if (data && data.itinerary && data.itinerary.days && data.places) {
          const placeMap = new Map(data.places.map((tp) => [tp.placeId, tp.place]));
          data.itinerary.days.forEach((day) => {
            day.places?.forEach((p) => {
              const matched = placeMap.get(p.placeId);
              if (matched?.imageUrl && !p.imageUrl) {
                p.imageUrl = matched.imageUrl;
              }
            });
          });
        }
        setTrip(data);
      } catch (err: any) {
        setError(err.message || 'Không tìm thấy lịch trình');
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      fetchTrip();
    }
  }, [tripId]);

  const currentDay = useMemo(() => {
    return trip?.itinerary?.days?.find((d) => d.dayNumber === selectedDay);
  }, [trip, selectedDay]);

  const allPlaces = useMemo(() => {
    return trip?.itinerary?.days?.flatMap((d) => d.places) || [];
  }, [trip]);

  // Group current day's places by session
  const groupedSessions = useMemo(() => {
    if (!currentDay || !currentDay.places) return [];

    const totalInDay = currentDay.places.length;
    return SESSION_DEFINITIONS.map((def) => {
      const placesInSlot = currentDay.places.filter(
        (p, idx) => normalizePlaceSlot(p, idx, totalInDay) === def.slot
      );
      return {
        ...def,
        places: placesInSlot,
      };
    });
  }, [currentDay]);

  // Places currently rendered on the map based on session filter
  const displayedPlaces = useMemo(() => {
    if (!currentDay) return [];
    if (selectedSession === 'all') return currentDay.places;
    const sessionGroup = groupedSessions.find((s) => s.slot === selectedSession);
    return sessionGroup ? sessionGroup.places : currentDay.places;
  }, [currentDay, selectedSession, groupedSessions]);

  const handleSelectDay = (dayNum: number) => {
    setSelectedDay(dayNum);
    setSelectedSession('all');
    setFocusedPlaceId(null);
  };

  const handleFocusOnMap = (place: Place) => {
    setFocusedPlaceId(place.placeId);
    const mapEl = document.getElementById('map-container-card');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D9488] mx-auto mb-3" />
          <p className="text-[#64748B] text-xs">Đang tải chi tiết lịch trình...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-6 bg-white border-[#E2E8F0]">
          <CardContent className="p-0">
            <p className="text-destructive text-sm font-medium mb-4">{error || 'Không tìm thấy lịch trình'}</p>
            <Button
              variant="default"
              size="sm"
              onClick={() => router.push('/trips')}
            >
              Về danh sách chuyến đi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-24">
      {/* Top Header */}
      <header className="border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md sticky top-[61px] z-30">
        <div className="container mx-auto px-4 py-3 max-w-6xl">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/trips')}
              className="gap-1.5 text-xs text-[#64748B] hover:text-[#0D9488]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </Button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#F0FDFA] border border-[#99F6E4] text-[#0D9488] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h1 className="text-sm font-bold text-[#0F172A] line-clamp-1">{trip.destination}</h1>
                <p className="text-[11px] text-[#64748B]">
                  {new Date(trip.startDate).toLocaleDateString('vi-VN')} -{' '}
                  {new Date(trip.endDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-xs">
              <Badge variant="secondary" className="gap-1 font-normal bg-[#F1F5F9] text-[#0F172A]">
                <Users className="w-3 h-3 text-[#0D9488]" />
                <span>{trip.groupSize} người</span>
              </Badge>
              <Badge variant="secondary" className="gap-1 font-mono font-medium bg-[#F1F5F9] text-[#0F172A] tabular-nums">
                <DollarSign className="w-3 h-3 text-[#0D9488]" />
                <span>{trip.budgetPerPerson.toLocaleString('vi-VN')} đ / người</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Summary Card */}
        <Card className="mb-6 bg-white border-[#E2E8F0] shadow-none rounded-2xl">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F0FDFA] border border-[#99F6E4] text-[#0F766E] text-[11px] font-medium">
                    <Sparkles className="w-3 h-3 text-[#0D9488]" />
                    Lịch trình tạo bởi AI ({trip.itinerary.days.length} ngày • 3 buổi mỗi ngày)
                  </div>
                  {trip.itinerary?.optimizationStats && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0D9488] text-white text-[11px] font-medium tabular-nums">
                      <Zap className="w-3 h-3 text-white" />
                      Đã tối ưu cung đường (-{trip.itinerary.optimizationStats.totalSavedPercentage}%)
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-[#0F172A] mb-1">{trip.itinerary.summary}</h2>
              </div>
              <div className="flex flex-col sm:items-end gap-2">
                <div className="text-left sm:text-right">
                  <div className="text-[11px] text-[#64748B]">Tổng chi phí dự kiến</div>
                  <div className="text-xl font-bold font-mono text-[#0D9488] tabular-nums">
                    {trip.itinerary.totalEstimatedCost.toLocaleString('vi-VN')} đ
                  </div>
                </div>
                <Button
                  onClick={handleOptimizeRoute}
                  disabled={isOptimizing}
                  size="sm"
                  className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-medium text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  {isOptimizing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Zap className="w-3.5 h-3.5 text-white" />
                  )}
                  <span>{isOptimizing ? 'Đang tối ưu lộ trình...' : 'Tối ưu hóa lộ trình'}</span>
                </Button>
              </div>
            </div>

            {/* Optimization Success Notice */}
            {optimizationNotice && (
              <div className="mb-4 p-3 rounded-xl bg-[#F0FDFA] border border-[#99F6E4] text-xs text-[#0F766E] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#10B981]" />
                <span className="font-medium">{optimizationNotice}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-[#64748B] pt-3 border-t border-[#E2E8F0]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0D9488] flex-shrink-0" />
                <span>
                  Bao gồm {allPlaces.length} địa điểm tối ưu theo các buổi Sáng, Chiều, Tối
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[#64748B] ml-auto">
                <span className="flex items-center gap-1">
                  <Sunrise className="w-3 h-3 text-[#F59E0B]" /> Sáng
                </span>
                <span className="flex items-center gap-1">
                  <Sun className="w-3 h-3 text-[#0D9488]" /> Chiều
                </span>
                <span className="flex items-center gap-1">
                  <Moon className="w-3 h-3 text-[#0F172A]" /> Tối
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thẻ đánh giá tính khả thi lịch trình */}
        {trip.itinerary?.feasibilityReport && (
          <TripFeasibilityCard report={trip.itinerary.feasibilityReport} className="mb-6" />
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Day Selector Sidebar */}
          <div className="lg:col-span-1 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#64748B] flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#0D9488]" />
                <span>Lịch trình theo ngày</span>
              </div>
              <span className="text-[11px] font-normal lowercase">
                {trip.itinerary.days.length} ngày
              </span>
            </div>

            <div className="space-y-2">
              {trip.itinerary.days.map((day) => {
                const isSelected = selectedDay === day.dayNumber;
                const totalInThisDay = day.places?.length || 0;
                
                // Count per session for quick overview
                const mCount = day.places?.filter((p, i) => normalizePlaceSlot(p, i, totalInThisDay) === 'morning').length || 0;
                const aCount = day.places?.filter((p, i) => normalizePlaceSlot(p, i, totalInThisDay) === 'afternoon').length || 0;
                const eCount = day.places?.filter((p, i) => normalizePlaceSlot(p, i, totalInThisDay) === 'evening').length || 0;

                return (
                  <button
                    key={day.dayNumber}
                    onClick={() => handleSelectDay(day.dayNumber)}
                    className={`w-full p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-[#0D9488] border-[#0D9488] text-white'
                        : 'bg-white border-[#E2E8F0] text-[#0F172A] hover:border-[#0D9488]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="font-semibold text-sm">Ngày {day.dayNumber}</div>
                        <div className={`text-xs mt-0.5 capitalize ${isSelected ? 'text-teal-50' : 'text-[#64748B]'}`}>
                          {formatDayDate(trip.startDate, day.dayNumber, day.date)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {day.optimizationStats && day.optimizationStats.savedDistanceKm > 0 && (
                          <span
                            className={`inline-flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded-full font-medium tabular-nums ${
                              isSelected
                                ? 'bg-white text-[#0D9488]'
                                : 'bg-[#F0FDFA] text-[#0F766E] border border-[#99F6E4]'
                            }`}
                            title={`Tiết kiệm ${day.optimizationStats.savedDistanceKm} km (${day.optimizationStats.savedPercentage}%)`}
                          >
                            <Zap className="w-2.5 h-2.5" />
                            -{day.optimizationStats.savedPercentage}%
                          </span>
                        )}
                        <Badge
                          variant={isSelected ? 'outline' : 'secondary'}
                          className={`text-[10px] h-5 ${isSelected ? 'bg-white/15 text-white border-white/25' : ''}`}
                        >
                          {totalInThisDay} điểm
                        </Badge>
                      </div>
                    </div>

                    {/* Session rhythm indicator chips */}
                    <div className={`flex items-center gap-1.5 text-[10px] pt-1 border-t ${isSelected ? 'border-white/20' : 'border-[#E2E8F0]'}`}>
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] tabular-nums ${
                          isSelected
                            ? 'bg-white/15 text-white'
                            : 'bg-[#F1F5F9] text-[#64748B]'
                        }`}
                        title="Buổi sáng"
                      >
                        <Sunrise className="w-2.5 h-2.5" />
                        {mCount}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] tabular-nums ${
                          isSelected
                            ? 'bg-white/15 text-white'
                            : 'bg-[#F1F5F9] text-[#64748B]'
                        }`}
                        title="Buổi chiều"
                      >
                        <Sun className="w-2.5 h-2.5" />
                        {aCount}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] tabular-nums ${
                          isSelected
                            ? 'bg-white/15 text-white'
                            : 'bg-[#F1F5F9] text-[#64748B]'
                        }`}
                        title="Buổi tối"
                      >
                        <Moon className="w-2.5 h-2.5" />
                        {eCount}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content: Map & Itinerary Sessions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interactive Map Canvas */}
            <Card id="map-container-card" className="rounded-2xl overflow-hidden border-[#E2E8F0] bg-white shadow-none">
              <div className="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#0F172A]">
                  <MapIcon className="w-3.5 h-3.5 text-[#0D9488]" />
                  <span>
                    Bản đồ hành trình Ngày {selectedDay}
                    {selectedSession !== 'all' && (
                      <span className="font-normal text-[#64748B]">
                        {' '}• {SESSION_DEFINITIONS.find((s) => s.slot === selectedSession)?.label}
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                  <Compass className="w-3 h-3 text-[#0D9488]" />
                  <span>{displayedPlaces.length} điểm hiển thị</span>
                </div>
              </div>
              <MapComponent
                places={displayedPlaces}
                onSelectPlace={(p) => setDirectionsPlace(p)}
                selectedPlaceId={focusedPlaceId}
              />
            </Card>

            {/* Day Details & Sessions Section */}
            {currentDay && (
              <div className="space-y-5">
                {/* Day Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A] flex flex-wrap items-center gap-2">
                      <span>Ngày {currentDay.dayNumber}</span>
                      <span className="text-[#64748B] font-normal text-sm capitalize">
                        • {formatDayDate(trip.startDate, currentDay.dayNumber, currentDay.date)}
                      </span>
                    </h3>
                    {currentDay.notes && (
                      <p className="text-xs text-[#64748B] mt-0.5">{currentDay.notes}</p>
                    )}
                  </div>
                </div>

                {/* Session Filter / Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0] overflow-x-auto">
                  <button
                    onClick={() => setSelectedSession('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      selectedSession === 'all'
                        ? 'bg-[#0D9488] text-white'
                        : 'text-[#64748B] hover:text-[#0F172A] hover:bg-white/70'
                    }`}
                  >
                    <span>Tất cả các buổi</span>
                    <span className="text-[10px] opacity-80">({currentDay.places.length})</span>
                  </button>

                  {groupedSessions.map((session) => {
                    const Icon = session.icon;
                    const isActive = selectedSession === session.slot;
                    return (
                      <button
                        key={session.slot}
                        onClick={() => setSelectedSession(session.slot)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                          isActive
                            ? 'bg-[#0D9488] text-white'
                            : 'text-[#64748B] hover:text-[#0F172A] hover:bg-white/70'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{session.label}</span>
                        <span className="text-[10px] opacity-80">({session.places.length})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Sessions Timeline List */}
                <div className="space-y-6">
                  {groupedSessions
                    .filter((session) => selectedSession === 'all' || selectedSession === session.slot)
                    .map((session) => {
                      const Icon = session.icon;
                      const hasPlaces = session.places.length > 0;

                      return (
                        <div key={session.slot} className="space-y-3">
                          {/* Session Header Card */}
                          <div className={`flex items-center justify-between p-3 rounded-xl border ${session.accentBg} ${session.accentBorder}`}>
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] flex items-center justify-center flex-shrink-0">
                                <Icon className={`w-4 h-4 ${session.accentText}`} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">
                                    {session.label}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] px-1.5 py-0 h-4 bg-white border-[#E2E8F0] text-[#0F172A]"
                                  >
                                    {session.timeRange}
                                  </Badge>
                                </div>
                                <p className="text-[11px] text-[#64748B] line-clamp-1 mt-0.5">
                                  {session.theme}
                                </p>
                              </div>
                            </div>

                            <Badge
                              variant="secondary"
                              className="text-[11px] font-semibold bg-white border border-[#E2E8F0] text-[#0F172A] h-6 px-2"
                            >
                              {session.places.length} địa điểm
                            </Badge>
                          </div>

                          {/* Session Places */}
                          {hasPlaces ? (
                            <div className="space-y-3 relative pl-2 sm:pl-3">
                              {/* Vertical connector line */}
                              <div className="absolute left-5 sm:left-6 top-3 bottom-3 w-0.5 bg-[#E2E8F0] -z-0" />

                              {session.places.map((place) => (
                                <Card
                                  key={place.placeId}
                                  className="relative z-10 bg-white border-[#E2E8F0] hover:border-[#0D9488]/50 rounded-xl p-4 shadow-none transition group"
                                >
                                  <div className="flex items-start gap-3">
                                    {/* Order Pill */}
                                    <div className="w-6 h-6 rounded-full bg-[#0D9488] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                                      {place.orderInDay}
                                    </div>

                                    {/* Thumbnail ảnh địa điểm */}
                                    {place.imageUrl && (
                                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-[#E2E8F0] flex-shrink-0 bg-[#F1F5F9] hidden xs:block">
                                        <img
                                          src={place.imageUrl}
                                          alt={place.name}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                          loading="lazy"
                                          onError={(e) => {
                                            (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
                                          }}
                                        />
                                      </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1.5">
                                        <div>
                                          <h4 className="text-sm font-bold text-[#0F172A]">
                                            <button
                                              type="button"
                                              onClick={() => setDirectionsPlace(place)}
                                              className="text-left hover:text-[#0D9488] hover:underline cursor-pointer"
                                              title="Bấm để xem chỉ đường và thời tiết"
                                            >
                                              {place.name}
                                            </button>
                                          </h4>

                                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                            {/* Session time slot indicator */}
                                            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${session.accentBg} ${session.accentText} ${session.accentBorder}`}>
                                              <Icon className="w-2.5 h-2.5" />
                                              {place.estimatedTime || session.timeRange}
                                            </span>

                                            {place.categories.map((cat) => (
                                              <Badge
                                                key={cat}
                                                variant="outline"
                                                className="text-[10px] px-1.5 py-0 h-4 font-normal text-[#64748B] border-[#E2E8F0]"
                                              >
                                                {cat}
                                              </Badge>
                                            ))}

                                            <PlaceWeatherPill
                                              latitude={place.latitude}
                                              longitude={place.longitude}
                                            />
                                          </div>
                                        </div>

                                        <div className="text-left sm:text-right flex-shrink-0">
                                          <div className="text-[10px] text-[#64748B]">Chi phí ước tính</div>
                                          <div className="font-semibold text-xs font-mono text-[#0D9488] tabular-nums">
                                            {place.priceEstimate > 0
                                              ? `${place.priceEstimate.toLocaleString('vi-VN')} đ`
                                              : 'Miễn phí'}
                                          </div>
                                        </div>
                                      </div>

                                      <p className="text-xs text-[#64748B] mb-3 leading-relaxed">
                                        {place.description}
                                      </p>

                                      <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] text-xs">
                                        <div className="flex items-center gap-3 text-[#64748B] text-[11px]">
                                          <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {place.estimatedTime}
                                          </span>
                                          <span className="hidden sm:inline">
                                            {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleFocusOnMap(place)}
                                            className="h-6 px-2 text-[11px] gap-1 text-[#64748B] hover:text-[#0D9488]"
                                            title="Xem vị trí trên bản đồ"
                                          >
                                            <MapPin className="w-3 h-3" />
                                            <span>Xem trên bản đồ</span>
                                          </Button>

                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setDirectionsPlace(place)}
                                            className="h-6 px-2.5 text-[11px] gap-1 font-medium bg-white hover:bg-[#F0FDFA] hover:text-[#0D9488] hover:border-[#0D9488] border-[#E2E8F0]"
                                          >
                                            <Navigation className="w-3 h-3" />
                                            <span>Chỉ đường</span>
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 rounded-xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] text-center text-xs text-[#64748B]">
                              {session.emptyNote}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Directions & Weather Modal */}
      {directionsPlace && (
        <PlaceDirectionsModal
          place={directionsPlace}
          onClose={() => setDirectionsPlace(null)}
        />
      )}
    </div>
  );
}

export default function TripDetailPage() {
  return (
    <ProtectedRoute>
      <TripDetailContent />
    </ProtectedRoute>
  );
}
