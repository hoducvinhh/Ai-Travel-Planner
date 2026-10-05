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
  MapIcon,
} from 'lucide-react';

import ProtectedRoute from '@/components/ProtectedRoute';
import { api } from '@/lib/api';
import PlaceWeatherPill from '@/components/PlaceWeatherPill';

// Dynamically import Leaflet map (client-side only)
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-slate-900 rounded-xl flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
    </div>
  ),
});

// Dynamically import Directions & Weather Modal (client-side only)
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
        setError(err.message || 'Trip not found');
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-400 mx-auto mb-4" />
          <p className="text-slate-300">Đang tải lịch trình...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">❌ {error || 'Không tìm thấy lịch trình'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-emerald-500 rounded-xl hover:bg-emerald-600 transition"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const currentDay = trip.itinerary.days.find((d) => d.dayNumber === selectedDay);
  const allPlaces = trip.itinerary.days.flatMap((d) => d.places);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Quay lại</span>
            </button>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <div>
                <h1 className="text-lg font-bold">{trip.destination}</h1>
                <p className="text-xs text-slate-400">
                  {new Date(trip.startDate).toLocaleDateString('vi-VN')} -{' '}
                  {new Date(trip.endDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Users className="w-4 h-4" />
                <span>{trip.groupSize} người</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <DollarSign className="w-4 h-4" />
                <span>{trip.budgetPerPerson.toLocaleString()} VNĐ</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Summary Card */}
        <div className="mb-8 p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{trip.itinerary.summary}</h2>
              <p className="text-slate-400">
                Lịch trình {trip.itinerary.days.length} ngày được tạo bởi AI
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400 mb-1">Tổng chi phí dự kiến</div>
              <div className="text-2xl font-bold text-emerald-400">
                {trip.itinerary.totalEstimatedCost.toLocaleString()} VNĐ
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">
              Bao gồm {allPlaces.length} địa điểm được AI gợi ý dựa trên sở thích của bạn
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Timeline Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              Lịch trình theo ngày
            </h3>

            <div className="space-y-2">
              {trip.itinerary.days.map((day) => (
                <button
                  key={day.dayNumber}
                  onClick={() => setSelectedDay(day.dayNumber)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    selectedDay === day.dayNumber
                      ? 'bg-emerald-500/20 border-2 border-emerald-500'
                      : 'bg-slate-900/50 border-2 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">Ngày {day.dayNumber}</span>
                    <span className="text-xs text-slate-400">{day.places.length} địa điểm</span>
                  </div>
                  <div className="text-sm text-slate-400">{day.date}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-slate-800">
              <div className="bg-slate-900/50 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapIcon className="w-5 h-5 text-emerald-400" />
                  <span className="font-semibold">Bản đồ địa điểm</span>
                </div>
                <span className="text-xs text-slate-400">
                  Bấm ghim trên bản đồ để xem chỉ đường
                </span>
              </div>
              <MapComponent
                places={currentDay?.places || []}
                onSelectPlace={(p) => setDirectionsPlace(p)}
              />
            </div>

            {/* Day Details */}
            {currentDay && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">
                    Ngày {currentDay.dayNumber} - {currentDay.date}
                  </h3>
                  {currentDay.notes && (
                    <p className="text-sm text-slate-400 italic">{currentDay.notes}</p>
                  )}
                </div>

                {/* Places Timeline */}
                <div className="space-y-4">
                  {currentDay.places.map((place, index) => (
                    <div
                      key={place.placeId}
                      className="relative p-5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 transition group"
                    >
                      {/* Order Badge */}
                      <div className="absolute -left-3 top-5 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm border-4 border-slate-950 shadow-md">
                        {index + 1}
                      </div>

                      <div className="ml-6">
                        <div className="flex items-start justify-between mb-3 gap-3">
                          <div>
                            <h4
                              onClick={() => setDirectionsPlace(place)}
                              className="text-lg font-bold mb-1 hover:text-emerald-400 cursor-pointer transition flex items-center gap-2 group/title"
                              title="Bấm để xem chỉ đường và thời tiết"
                            >
                              <span>{place.name}</span>
                              <span className="text-xs text-emerald-400/80 font-normal opacity-0 group-hover/title:opacity-100 transition flex items-center gap-1">
                                <Navigation className="w-3 h-3" /> Chỉ đường
                              </span>
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              {place.categories.map((cat) => (
                                <span
                                  key={cat}
                                  className="px-2 py-1 text-xs rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                >
                                  {cat}
                                </span>
                              ))}

                              {/* Thời tiết thực tế tại địa điểm này */}
                              <PlaceWeatherPill latitude={place.latitude} longitude={place.longitude} />
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <div className="text-sm text-slate-400 mb-1">Chi phí</div>
                            <div className="font-bold text-emerald-400">
                              {place.priceEstimate.toLocaleString()} VNĐ
                            </div>
                          </div>
                        </div>

                        <p className="text-slate-300 mb-3 text-sm leading-relaxed">{place.description}</p>

                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-slate-500" />
                            <span>{place.estimatedTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Navigation className="w-4 h-4 text-slate-500" />
                            <span>
                              {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                            </span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => setDirectionsPlace(place)}
                            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 rounded-lg transition-colors border border-emerald-500/30 font-medium text-xs cursor-pointer shadow-sm"
                            title="Chỉ đường từ vị trí của bạn đến địa điểm này"
                          >
                            <Navigation className="w-4 h-4" />
                            <span>Chỉ đường</span>
                          </button>
                        </div>
                      </div>
                    </div>
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

