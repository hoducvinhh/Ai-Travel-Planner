'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Users, DollarSign, ArrowRight, Plus, Loader2 } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { api } from '@/lib/api';
import { Trip } from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function TripsContent() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await api.get<Trip[]>('/trips');
        setTrips(data || []);
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F8] text-[#1A1A1A] pb-24">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E5E7EB]">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">Lịch trình du lịch của bạn</h1>
            <p className="text-muted-foreground text-xs md:text-sm mt-1">
              Quản lý và xem chi tiết các chuyến đi đã lên kế hoạch cùng trợ lý AI
            </p>
          </div>

          <Button asChild size="sm" className="gap-2 font-medium self-start sm:self-auto">
            <Link href="/trips/new">
              <Plus className="w-4 h-4" />
              Lập lịch trình mới
            </Link>
          </Button>
        </div>

        {/* Trips Grid */}
        {trips.length === 0 ? (
          <Card className="text-center py-16 bg-white border-[#E5E7EB] p-8 shadow-2xs">
            <CardContent className="p-0">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <h3 className="text-base font-semibold text-[#1A1A1A] mb-1">Chưa có lịch trình nào</h3>
              <p className="text-muted-foreground text-xs mb-5">
                Bắt đầu khám phá và tạo chuyến đi thông minh đầu tiên của bạn chỉ trong vài phút.
              </p>
              <Button asChild size="sm" className="gap-1.5">
                <Link href="/trips/new">
                  <Plus className="w-4 h-4" />
                  Tạo lịch trình ngay
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                href={`/trips/${trip.id}`}
                className="group block"
              >
                <Card className="bg-white border-[#E5E7EB] hover:border-[#1A1A1A]/40 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#F0F0EF] text-[#1A1A1A] flex items-center justify-center">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <Badge
                        variant={trip.status === 'GENERATED' ? 'lime' : 'secondary'}
                        className="text-[11px] font-normal"
                      >
                        {trip.status === 'GENERATED' ? 'Đã tạo lịch trình' : trip.status}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-bold text-[#1A1A1A] mb-2 group-hover:underline">
                      {trip.destination}
                    </h3>

                    <div className="space-y-1.5 mb-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>
                          {new Date(trip.startDate).toLocaleDateString('vi-VN')} -{' '}
                          {new Date(trip.endDate).toLocaleDateString('vi-VN')}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 pt-0.5">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{trip.groupSize} người</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium text-[#1A1A1A]">
                          <DollarSign className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
                          <span>{trip.budgetPerPerson.toLocaleString('vi-VN')} đ / người</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB] text-xs">
                    <span className="text-[11px] text-muted-foreground">
                      Tạo ngày {new Date(trip.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="text-xs font-medium text-[#1A1A1A] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                      Chi tiết <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
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
