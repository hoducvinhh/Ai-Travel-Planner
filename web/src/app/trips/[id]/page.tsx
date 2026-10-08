'use client';

import { useEffect, useState } from 'react';
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
} from 'lucide-react';

import ProtectedRoute from '@/components/ProtectedRoute';
import { api } from '@/lib/api';
import PlaceWeatherPill from '@/components/PlaceWeatherPill';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Dynamically import Leaflet map
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-[#F5F5F4] rounded-xl flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
    </div>
  ),
});

// Dynamically import Directions & Weather Modal
const PlaceDirectionsModal = dynamic(
  () => import('@/components/PlaceDirectionsModal'),
  { ssr: false }
);

import { ItineraryPlace as Place, DayPlan, TripItinerary, Trip } from '@/types';

function TripDetailContent() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [directionsPlace, setDirectionsPlace] = useState<Place | null>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const data = await api.get<Trip>(`/trips/${tripId}`);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F8] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400 mx-auto mb-3" />
          <p className="text-muted-foreground text-xs">Đang tải chi tiết lịch trình...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-[#F9F9F8] flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-6 bg-white border-[#E5E7EB]">
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

  const currentDay = trip.itinerary.days.find((d) => d.dayNumber === selectedDay);
  const allPlaces = trip.itinerary.days.flatMap((d) => d.places);

  return (
    <div className="min-h-screen bg-[#F9F9F8] text-[#1A1A1A] pb-24">
      {/* Header */}
      <header className="border-b border-[#E5E7EB] bg-white/95 backdrop-blur-md sticky top-[57px] z-30">
        <div className="container mx-auto px-4 py-3 max-w-6xl">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/trips')}
              className="gap-1.5 text-xs text-muted-foreground hover:text-[#1A1A1A]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </Button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#F0F0EF] text-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h1 className="text-sm font-bold text-[#1A1A1A] line-clamp-1">{trip.destination}</h1>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(trip.startDate).toLocaleDateString('vi-VN')} -{' '}
                  {new Date(trip.endDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-xs">
              <Badge variant="secondary" className="gap-1 font-normal">
                <Users className="w-3 h-3 text-muted-foreground" />
                <span>{trip.groupSize} người</span>
              </Badge>
              <Badge variant="secondary" className="gap-1 font-mono font-medium">
                <DollarSign className="w-3 h-3 text-muted-foreground" />
                <span>{trip.budgetPerPerson.toLocaleString('vi-VN')} đ / người</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Summary Card */}
        <Card className="mb-6 bg-white border-[#E5E7EB] shadow-2xs">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F4FCE3] border border-[#D9F99D] text-[#365314] text-[11px] font-medium mb-2">
                  <Sparkles className="w-3 h-3" />
                  Lịch trình tạo bởi AI ({trip.itinerary.days.length} ngày)
                </div>
                <h2 className="text-xl font-bold text-[#1A1A1A] mb-1">{trip.itinerary.summary}</h2>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-[11px] text-muted-foreground">Tổng chi phí dự kiến</div>
                <div className="text-xl font-bold font-mono text-[#1A1A1A]">
                  {trip.itinerary.totalEstimatedCost.toLocaleString('vi-VN')} đ
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-3 border-t border-[#E5E7EB]">
              <CheckCircle2 className="w-4 h-4 text-[#365314] flex-shrink-0" />
              <span>
                Bao gồm {allPlaces.length} địa điểm được cá nhân hoá theo tiêu chí và sở thích của bạn
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Timeline Sidebar (Day Selector) */}
          <div className="lg:col-span-1 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 px-1">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Lịch trình theo ngày</span>
            </div>

            <div className="space-y-2">
              {trip.itinerary.days.map((day) => {
                const isSelected = selectedDay === day.dayNumber;
                return (
                  <button
                    key={day.dayNumber}
                    onClick={() => setSelectedDay(day.dayNumber)}
                    className={`w-full p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-xs'
                        : 'bg-white border-[#E5E7EB] text-[#1A1A1A] hover:bg-[#FAFAFA]'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm">Ngày {day.dayNumber}</div>
                      <div className={`text-xs mt-0.5 ${isSelected ? 'text-neutral-300' : 'text-muted-foreground'}`}>
                        {day.date}
                      </div>
                    </div>
                    <Badge
                      variant={isSelected ? 'lime' : 'secondary'}
                      className="text-[10px] h-5"
                    >
                      {day.places.length} điểm
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content: Map & Day Places */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map Canvas */}
            <Card className="rounded-2xl overflow-hidden border-[#E5E7EB] bg-white shadow-2xs">
              <div className="px-4 py-2.5 bg-[#FAFAFA] border-b border-[#E5E7EB] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#1A1A1A]">
                  <MapIcon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Bản đồ hành trình Ngày {selectedDay}</span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Bấm ghim trên bản đồ để xem chi tiết
                </span>
              </div>
              <MapComponent
                places={currentDay?.places || []}
                onSelectPlace={(p) => setDirectionsPlace(p)}
              />
            </Card>

            {/* Day Details */}
            {currentDay && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-base font-bold text-[#1A1A1A]">
                    Ngày {currentDay.dayNumber} • {currentDay.date}
                  </h3>
                  {currentDay.notes && (
                    <p className="text-xs text-muted-foreground italic">{currentDay.notes}</p>
                  )}
                </div>

                {/* Places Timeline */}
                <div className="space-y-3">
                  {currentDay.places.map((place, index) => (
                    <Card
                      key={place.placeId}
                      className="relative bg-white border-[#E5E7EB] hover:border-[#1A1A1A]/40 rounded-xl p-4 shadow-2xs transition group"
                    >
                      <div className="flex items-start gap-3">
                        {/* Order pill */}
                        <div className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-1">
                            <div>
                              <h4
                                onClick={() => setDirectionsPlace(place)}
                                className="text-sm font-semibold text-[#1A1A1A] hover:underline cursor-pointer flex items-center gap-1.5"
                                title="Bấm để xem chỉ đường và thời tiết"
                              >
                                <span>{place.name}</span>
                              </h4>
                              <div className="flex flex-wrap items-center gap-1.5 mt-1 mb-2">
                                {place.categories.map((cat) => (
                                  <Badge
                                    key={cat}
                                    variant="outline"
                                    className="text-[10px] px-1.5 py-0 h-4 font-normal text-muted-foreground border-[#E5E7EB]"
                                  >
                                    {cat}
                                  </Badge>
                                ))}

                                <PlaceWeatherPill latitude={place.latitude} longitude={place.longitude} />
                              </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                              <div className="text-[10px] text-muted-foreground">Chi phí ước tính</div>
                              <div className="font-semibold text-xs font-mono text-[#1A1A1A]">
                                {place.priceEstimate > 0
                                  ? `${place.priceEstimate.toLocaleString('vi-VN')} đ`
                                  : 'Miễn phí'}
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                            {place.description}
                          </p>

                          <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB] text-xs">
                            <div className="flex items-center gap-3 text-muted-foreground text-[11px]">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {place.estimatedTime}
                              </span>
                              <span>
                                {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                              </span>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDirectionsPlace(place)}
                              className="h-6 px-2 text-[11px] gap-1 font-medium"
                            >
                              <Navigation className="w-3 h-3" />
                              <span>Chỉ đường</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
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
