'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Users, ArrowRight, Plus, Loader2, Compass } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { api } from '@/lib/api';
import { Trip } from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function getTripStatus(startDateStr: string, endDateStr: string) {
  const now = Date.now();
  const start = new Date(startDateStr).getTime();
  const end = new Date(endDateStr).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) {
    return { label: 'Lịch trình', isUpcoming: false };
  }
  if (now < start) return { label: 'Sắp khởi hành', isUpcoming: true };
  if (now <= end + 86400000) return { label: 'Đang diễn ra', isUpcoming: true };
  return { label: 'Đã hoàn thành', isUpcoming: false };
}

function getTripDaysCount(trip: Trip): number {
  if (trip.itinerary?.days?.length) return trip.itinerary.days.length;
  const start = new Date(trip.startDate).getTime();
  const end = new Date(trip.endDate).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return 1;
  return Math.max(1, Math.round((end - start) / 86400000) + 1);
}

function TripsContent() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Trip[]>('/trips');
      setTrips(data || []);
    } catch (err: any) {
      console.error('Error fetching trips:', err);
      setError(err?.message || 'Không thể tải danh sách lịch trình');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-7 h-7 animate-spin text-[#0D9488]" />
        <p className="text-xs text-[#64748B]">Đang tải danh sách lịch trình...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-24">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E2E8F0]">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0F172A]">
              Lịch trình du lịch của bạn
            </h1>
            <p className="text-[#64748B] text-xs md:text-sm mt-1">
              Quản lý và xem chi tiết các chuyến đi đã lên kế hoạch cùng trợ lý AI
            </p>
          </div>

          <Button
            asChild
            size="sm"
            className="gap-2 font-medium self-start sm:self-auto bg-[#0D9488] hover:bg-[#0F766E] text-white rounded-xl"
          >
            <Link href="/trips/new">
              <Plus className="w-4 h-4" />
              Lập lịch trình mới
            </Link>
          </Button>
        </div>

        {/* Error / Empty / Trips Grid */}
        {error ? (
          <Card className="text-center py-14 bg-white border-[#E2E8F0] rounded-2xl p-8 shadow-none">
            <CardContent className="p-0">
              <Compass className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
              <h3 className="text-base font-semibold text-[#0F172A] mb-1">Không tải được lịch trình</h3>
              <p className="text-[#64748B] text-xs mb-5">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchTrips} className="rounded-xl border-[#E2E8F0] hover:border-[#0D9488] hover:text-[#0D9488]">
                Thử lại
              </Button>
            </CardContent>
          </Card>
        ) : trips.length === 0 ? (
          <Card className="text-center py-16 bg-white border-[#E2E8F0] rounded-2xl p-8 shadow-none">
            <CardContent className="p-0">
              <MapPin className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
              <h3 className="text-base font-semibold text-[#0F172A] mb-1">Chưa có lịch trình nào</h3>
              <p className="text-[#64748B] text-xs mb-5">
                Bắt đầu khám phá và tạo chuyến đi thông minh đầu tiên của bạn chỉ trong vài phút.
              </p>
              <Button asChild size="sm" className="gap-1.5 bg-[#0D9488] hover:bg-[#0F766E] text-white rounded-xl">
                <Link href="/trips/new">
                  <Plus className="w-4 h-4" />
                  Tạo lịch trình ngay
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {trips.map((trip) => {
              const status = getTripStatus(trip.startDate, trip.endDate);
              const daysCount = getTripDaysCount(trip);
              const placesCount = trip.places?.length || trip.itinerary?.days?.reduce((s, d) => s + (d.places?.length || 0), 0) || 0;

              return (
                <Link key={trip.id} href={`/trips/${trip.id}`} className="group block">
                  <Card className="bg-white border-[#E2E8F0] hover:border-[#0D9488] rounded-2xl p-5 shadow-none transition-colors h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-4">
                        <div className="w-9 h-9 rounded-xl bg-[#F0FDFA] border border-[#99F6E4] text-[#0D9488] flex items-center justify-center group-hover:bg-[#0D9488] group-hover:text-white group-hover:border-[#0D9488] transition-colors">
                          <MapPin className="w-4 h-4" />
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant={status.isUpcoming ? 'teal' : 'secondary'}
                            className="text-[10px] font-medium h-5"
                          >
                            {status.label}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] font-mono h-5 tabular-nums">
                            {daysCount} ngày
                          </Badge>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-[#0F172A] mb-2 group-hover:text-[#0D9488] transition-colors line-clamp-1">
                        {trip.destination}
                      </h3>

                      <div className="space-y-1.5 mb-4 text-xs text-[#64748B]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-[#0D9488]" />
                          <span className="tabular-nums">
                            {new Date(trip.startDate).toLocaleDateString('vi-VN')} -{' '}
                            {new Date(trip.endDate).toLocaleDateString('vi-VN')}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{trip.groupSize} người</span>
                            {placesCount > 0 && (
                              <>
                                <span className="text-[#CBD5E1]">•</span>
                                <span>{placesCount} điểm</span>
                              </>
                            )}
                          </div>
                          <div className="font-mono font-semibold text-[#0F172A] tabular-nums">
                            {trip.budgetPerPerson.toLocaleString('vi-VN')} đ/người
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0] text-xs">
                      <span className="text-[11px] text-[#64748B] tabular-nums">
                        Tạo ngày {new Date(trip.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                      <span className="text-xs font-semibold text-[#0D9488] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                        Chi tiết <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TripsPage() {
  return (
    <ProtectedRoute>
      <TripsContent />
    </ProtectedRoute>
  );
}
