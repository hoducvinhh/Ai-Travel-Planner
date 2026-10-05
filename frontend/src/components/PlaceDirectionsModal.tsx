'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { Place } from '@/types';
import {
  X,
  Navigation,
  Car,
  Bike,
  Footprints,
  MapPin,
  Clock,
  Compass,
  CloudSun,
  Droplets,
  Wind,
  ExternalLink,
  Loader2,
  AlertTriangle,
  Sparkles,
  LocateFixed,
  RefreshCw,
} from 'lucide-react';

// Fix for default Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface PlaceDirectionsModalProps {
  place: {
    id?: string;
    placeId?: string;
    name: string;
    description?: string;
    categories?: string[];
    latitude: number;
    longitude: number;
    province?: string;
    district?: string;
    priceEstimate?: number;
    [key: string]: any;
  };
  onClose: () => void;
}

type TransportMode = 'motorbike' | 'driving' | 'walking';

interface WeatherData {
  temp: number;
  apparentTemp: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  isRain: boolean;
  advice: string;
}

// Convert WMO Weather Code to Vietnamese string, icon and advice
function interpretWeatherCode(code: number, temp: number): {
  description: string;
  icon: string;
  isRain: boolean;
  advice: string;
} {
  let description = 'Trời đẹp';
  let icon = '☀️';
  let isRain = false;
  let advice = 'Thời tiết rất lý tưởng để tham quan và chụp ảnh ngoài trời!';

  if (code === 0) {
    description = 'Trời nắng trong xanh';
    icon = '☀️';
  } else if (code === 1 || code === 2) {
    description = 'Ít mây, nắng nhẹ';
    icon = '🌤️';
  } else if (code === 3) {
    description = 'Nhiều mây';
    icon = '⛅';
  } else if (code === 45 || code === 48) {
    description = 'Sương mù';
    icon = '🌫️';
    advice = 'Tầm nhìn có thể bị hạn chế, hãy chú ý an toàn khi di chuyển!';
  } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
    description = 'Có mưa rào';
    icon = '🌧️';
    isRain = true;
    advice = 'Đang có mưa, hãy mang theo ô/áo mưa hoặc ưu tiên điểm đến trong nhà!';
  } else if ([95, 96, 99].includes(code)) {
    description = 'Giông bão sét';
    icon = '⛈️';
    isRain = true;
    advice = 'Thời tiết có giông bão, nên hạn chế hoạt động ngoài trời lúc này!';
  }

  if (!isRain && temp >= 34) {
    advice = 'Trời nắng gắt, hãy mang theo nón mũ, kem chống nắng và uống đủ nước!';
  } else if (!isRain && temp <= 16) {
    advice = 'Trời se lạnh, bạn nên mặc thêm áo ấm khi ra ngoài!';
  }

  return { description, icon, isRain, advice };
}

export default function PlaceDirectionsModal({
  place,
  onClose,
}: PlaceDirectionsModalProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Map layer style
  const [mapStyle, setMapStyle] = useState<'google' | 'osm' | 'satellite'>('google');

  // Initial sensible start coordinates: approximately 3km from destination by default
  const defaultStartLat = place.latitude ? place.latitude + 0.025 : 21.0285;
  const defaultStartLng = place.longitude ? place.longitude + 0.025 : 105.8542;

  // Starting location states
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({
    lat: defaultStartLat,
    lng: defaultStartLng,
  });
  const [isRealGps, setIsRealGps] = useState(false);
  const [locationStatus, setLocationStatus] = useState<
    'idle' | 'requesting' | 'granted' | 'denied'
  >('idle');
  const [locationMessage, setLocationMessage] = useState('Đang dùng điểm xuất phát mẫu (~3km). Bạn có thể bấm để lấy GPS thực.');

  // Transport mode & Routing stats
  const [transportMode, setTransportMode] = useState<TransportMode>('motorbike');
  const [routeDistanceKm, setRouteDistanceKm] = useState<number | null>(null);
  const [travelDurationMinutes, setTravelDurationMinutes] = useState<number | null>(null);
  const [isRouting, setIsRouting] = useState(false);

  // Weather state
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // Apply Tile Layer Function
  const applyTileLayer = useCallback((style: 'osm' | 'google' | 'satellite', map: L.Map) => {
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let layer: L.TileLayer;
    if (style === 'osm') {
      // 100% OpenStreetMap official data - NO WATERMARK
      layer = L.tileLayer(
        'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
        {
          subdomains: ['a', 'b', 'c'],
          maxZoom: 20,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      );
    } else if (style === 'satellite') {
      layer = L.tileLayer('https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
        attribution: '&copy; Google Satellite',
      });
    } else {
      // Google Maps Streets - Clean, Fast, High Resolution in Vietnam
      layer = L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
        attribution: '&copy; Google Maps',
      });
    }

    layer.addTo(map);
    tileLayerRef.current = layer;
  }, []);

  // Fetch Live Weather from Open-Meteo API
  useEffect(() => {
    async function fetchWeather() {
      setWeatherLoading(true);
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Asia%2FBangkok`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const current = data.current;
          if (current) {
            const { description, icon, isRain, advice } = interpretWeatherCode(
              current.weather_code,
              current.temperature_2m
            );
            setWeather({
              temp: Math.round(current.temperature_2m),
              apparentTemp: Math.round(current.apparent_temperature),
              humidity: current.relative_humidity_2m,
              windSpeed: Math.round(current.wind_speed_10m),
              description,
              icon,
              isRain,
              advice,
            });
          }
        }
      } catch (err) {
        console.error('Lỗi tải thời tiết Open-Meteo:', err);
      } finally {
        setWeatherLoading(false);
      }
    }

    fetchWeather();
  }, [place.latitude, place.longitude]);

  // Request browser Geolocation API
  const requestLocation = useCallback(() => {
    setLocationStatus('requesting');
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      setLocationMessage('Trình duyệt không hỗ trợ Geolocation API.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsRealGps(true);
        setLocationStatus('granted');
        setLocationMessage('Đã nhận diện vị trí GPS thực tế của bạn!');
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocationStatus('denied');
        if (err.code === 1) {
          setLocationMessage('Bạn đã từ chối quyền vị trí. Nhấn vào ổ khóa trên thanh URL để Bật vị trí.');
        } else {
          setLocationMessage('Không lấy được GPS (thiết bị chưa bật định vị). Đang dùng điểm xuất phát mẫu.');
        }
      },
      {
        enableHighAccuracy: false, // Don't require GPS chip to avoid desktop timeouts
        timeout: 8000,
        maximumAge: 60000,
      }
    );
  }, []);

  // Request location on modal mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [place.latitude, place.longitude],
        zoom: 13,
      });

      // Apply initial tile layer
      applyTileLayer(mapStyle, map);

      // Destination Place Marker (Emerald Icon)
      const placeIcon = L.divIcon({
        className: 'dest-marker',
        html: `
          <div style="display:flex; flex-direction:column; align-items:center;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.5); font-size: 18px;">
              📍
            </div>
            <div style="background: rgba(15, 23, 42, 0.95); color: #fff; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.4); margin-top: 3px; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
              ${place.name}
            </div>
          </div>
        `,
        iconSize: [120, 60],
        iconAnchor: [60, 20],
      });

      L.marker([place.latitude, place.longitude], { icon: placeIcon }).addTo(map);

      // Allow clicking on map to change starting location
      map.on('click', (e: L.LeafletMouseEvent) => {
        setUserCoords({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
        setIsRealGps(false);
        setLocationMessage('Đã đặt vị trí xuất phát theo điểm bạn bấm trên bản đồ.');
      });

      mapRef.current = map;

      // Invalidate size after modal render to fix blank/white tiles
      const timer1 = setTimeout(() => map.invalidateSize(), 150);
      const timer2 = setTimeout(() => map.invalidateSize(), 450);
      const timer3 = setTimeout(() => map.invalidateSize(), 800);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [applyTileLayer, mapStyle, place]);

  // Switch Map Layer
  const handleSwitchMapStyle = (newStyle: 'osm' | 'google' | 'satellite') => {
    setMapStyle(newStyle);
    if (mapRef.current) {
      applyTileLayer(newStyle, mapRef.current);
    }
  };

  // Update User Marker & Calculate Route
  useEffect(() => {
    if (!mapRef.current || !userCoords) return;

    const map = mapRef.current;

    // Create or update user location marker (pulsing blue)
    if (!userMarkerRef.current) {
      const userIcon = L.divIcon({
        className: 'user-radar-marker',
        html: `
          <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background: rgba(59, 130, 246, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 24px; height: 24px; border-radius: 50%; background: #2563eb; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px;">
              👤
            </div>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      const userMarker = L.marker([userCoords.lat, userCoords.lng], {
        icon: userIcon,
        draggable: true,
      }).addTo(map);

      userMarker.bindPopup(`
        <div style="font-size: 12px; font-weight: 600; color: #1e293b;">
          📍 Điểm xuất phát của bạn<br/>
          <span style="font-weight: 400; font-size: 10px; color: #64748b;">(Kéo thả để đổi điểm đi)</span>
        </div>
      `);

      userMarker.on('dragend', () => {
        const pos = userMarker.getLatLng();
        setUserCoords({ lat: pos.lat, lng: pos.lng });
        setIsRealGps(false);
        setLocationMessage('Đã cập nhật vị trí xuất phát theo điểm bạn kéo thả.');
      });

      userMarkerRef.current = userMarker;
    } else {
      userMarkerRef.current.setLatLng([userCoords.lat, userCoords.lng]);
    }

    // Call OSRM Route API
    async function calculateRoute() {
      if (!userCoords) return;
      setIsRouting(true);

      try {
        const osrmProfile = transportMode === 'walking' ? 'walking' : 'driving';
        const url = `https://router.project-osrm.org/route/v1/${osrmProfile}/${userCoords.lng},${userCoords.lat};${place.longitude},${place.latitude}?overview=full&geometries=geojson`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.routes && data.routes.length > 0) {
            const primaryRoute = data.routes[0];
            const distanceMeters = primaryRoute.distance;
            const distanceKm = Math.round((distanceMeters / 1000) * 10) / 10;
            setRouteDistanceKm(distanceKm);

            // Calculate duration based on transport mode
            let durationMins = 0;
            if (transportMode === 'driving') {
              durationMins = Math.round(primaryRoute.duration / 60);
            } else if (transportMode === 'motorbike') {
              // Motorbikes in Vietnam average ~32 km/h
              const hours = distanceKm / 32;
              durationMins = Math.max(2, Math.round(hours * 60));
            } else if (transportMode === 'walking') {
              // Walking speed ~4.8 km/h
              const hours = distanceKm / 4.8;
              durationMins = Math.max(3, Math.round(hours * 60));
            }
            setTravelDurationMinutes(durationMins);

            // Draw route line on map
            if (routeLayerRef.current) {
              map.removeLayer(routeLayerRef.current);
            }

            const coordinates = primaryRoute.geometry.coordinates.map(
              (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
            );

            const routeLine = L.polyline(coordinates, {
              color: transportMode === 'walking' ? '#38bdf8' : transportMode === 'motorbike' ? '#10b981' : '#a855f7',
              weight: 5,
              opacity: 0.9,
              dashArray: transportMode === 'walking' ? '8, 8' : undefined,
            }).addTo(map);

            routeLayerRef.current = routeLine;

            // Fit map to show both user and destination
            const bounds = L.latLngBounds([
              [userCoords.lat, userCoords.lng],
              [place.latitude, place.longitude],
            ]);
            map.fitBounds(bounds, { padding: [50, 50] });
          }
        }
      } catch (err) {
        console.error('Lỗi khi tính toán tuyến đường OSRM:', err);
      } finally {
        setIsRouting(false);
      }
    }

    calculateRoute();
  }, [userCoords, transportMode, place]);

  // Format Duration string
  const formatDuration = (mins: number | null) => {
    if (mins === null) return '—';
    if (mins < 60) return `${mins} phút`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl relative flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-5 md:p-6 border-b border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold flex-shrink-0">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-bold text-white line-clamp-1">
                  Chỉ Đường & Thời Tiết: {place.name}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
                  OpenStreetMap
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  {place.district ? `${place.district}, ` : ''}
                  {place.province || 'Việt Nam'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* GPS Banner & Starting Point Notice */}
        <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <div className={`w-2.5 h-2.5 rounded-full ${isRealGps ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>
              {isRealGps ? '📍 Đang dùng vị trí GPS thực của bạn' : '📌 Điểm xuất phát: Mẫu / Tuỳ chọn'}
              {' — '}{locationMessage}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={requestLocation}
              disabled={locationStatus === 'requesting'}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] shadow-sm disabled:opacity-50 transition"
            >
              {locationStatus === 'requesting' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LocateFixed className="w-3.5 h-3.5" />
              )}
              <span>Lấy vị trí GPS</span>
            </button>
          </div>
        </div>

        {/* Top Info Bar: Transport Mode Tabs & Live Weather Card */}
        <div className="p-4 md:p-5 bg-slate-950/60 border-b border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
          {/* Transport Mode Switcher */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Thời gian di chuyển theo phương tiện:</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Motorbike */}
              <button
                type="button"
                onClick={() => setTransportMode('motorbike')}
                className={`flex flex-col items-center justify-center py-2 px-2.5 rounded-xl border text-xs font-semibold transition ${
                  transportMode === 'motorbike'
                    ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Bike className="w-4 h-4 text-emerald-400" />
                  <span>Xe máy</span>
                </div>
                <span className="text-[12px] font-bold font-mono text-emerald-300">
                  {formatDuration(travelDurationMinutes)}
                </span>
              </button>

              {/* Car */}
              <button
                type="button"
                onClick={() => setTransportMode('driving')}
                className={`flex flex-col items-center justify-center py-2 px-2.5 rounded-xl border text-xs font-semibold transition ${
                  transportMode === 'driving'
                    ? 'bg-purple-500/20 border-purple-500/60 text-purple-300 shadow-md shadow-purple-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Car className="w-4 h-4 text-purple-400" />
                  <span>Ô tô</span>
                </div>
                <span className="text-[12px] font-bold font-mono text-purple-300">
                  {formatDuration(travelDurationMinutes)}
                </span>
              </button>

              {/* Walking */}
              <button
                type="button"
                onClick={() => setTransportMode('walking')}
                className={`flex flex-col items-center justify-center py-2 px-2.5 rounded-xl border text-xs font-semibold transition ${
                  transportMode === 'walking'
                    ? 'bg-sky-500/20 border-sky-500/60 text-sky-300 shadow-md shadow-sky-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Footprints className="w-4 h-4 text-sky-400" />
                  <span>Đi bộ</span>
                </div>
                <span className="text-[12px] font-bold font-mono text-sky-300">
                  {formatDuration(travelDurationMinutes)}
                </span>
              </button>
            </div>

            {/* Distance Summary */}
            <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
              <span>
                Khoảng cách lộ trình: <strong className="text-white">{routeDistanceKm !== null ? `${routeDistanceKm} km` : 'Đang tính...'}</strong>
              </span>
              {isRouting && (
                <span className="flex items-center gap-1 text-emerald-400 text-[10px]">
                  <Loader2 className="w-3 h-3 animate-spin" /> Đang vẽ đường...
                </span>
              )}
            </div>
          </div>

          {/* Live Weather Widget (Open-Meteo) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-inner">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                Thời tiết tại điểm đến hôm nay
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                Open-Meteo
              </span>
            </div>

            {weatherLoading ? (
              <div className="py-2 flex items-center justify-center text-slate-500 text-xs gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>Đang tải thông tin thời tiết...</span>
              </div>
            ) : weather ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{weather.icon}</span>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>{weather.temp}°C</span>
                        <span className="text-[11px] font-normal text-slate-400">
                          (Cảm giác {weather.apparentTemp}°C)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 font-medium">
                        {weather.description}
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-[10px] text-slate-400 space-y-0.5">
                    <div className="flex items-center gap-1 justify-end">
                      <Droplets className="w-3 h-3 text-cyan-400" />
                      <span>Độ ẩm: {weather.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <Wind className="w-3 h-3 text-teal-400" />
                      <span>Gió: {weather.windSpeed} km/h</span>
                    </div>
                  </div>
                </div>

                {/* Smart Travel Advice */}
                <div className="pt-1.5 border-t border-slate-800 text-[11px] text-amber-300 flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-400" />
                  <span className="line-clamp-2">{weather.advice}</span>
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-slate-500 text-center py-2">
                Không thể tải dữ liệu thời tiết lúc này
              </div>
            )}
          </div>
        </div>

        {/* Leaflet Routing Map Canvas */}
        <div className="relative flex-1 min-h-[350px] md:min-h-[420px] bg-slate-950">
          <div ref={mapContainerRef} className="w-full h-full min-h-[350px] md:min-h-[420px]" />

          {/* Floating Badges */}
          <div className="absolute top-3 left-3 z-[400] flex flex-col gap-1.5 max-w-[60%]">
            <div className="bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-[11px] text-slate-200 flex items-center gap-2 shadow-lg">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
              <span>Chấm xanh: Vị trí của bạn (Kéo thả hoặc bấm map để đổi)</span>
            </div>

            <div className="bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-[11px] text-slate-200 flex items-center gap-2 shadow-lg truncate">
              <span className="truncate">📍 Ghim đến: {place.name}</span>
            </div>
          </div>

          {/* Map Layer Switcher */}
          <div className="absolute top-3 right-3 z-[400] flex items-center gap-1 bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg text-[10px] font-semibold">
            <button
              type="button"
              onClick={() => handleSwitchMapStyle('osm')}
              className={`px-2 py-1 rounded-lg transition ${
                mapStyle === 'osm'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🗺️ OSM
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMapStyle('google')}
              className={`px-2 py-1 rounded-lg transition ${
                mapStyle === 'google'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📍 Google
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMapStyle('satellite')}
              className={`px-2 py-1 rounded-lg transition ${
                mapStyle === 'satellite'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🛰️ Vệ tinh
            </button>
          </div>

          {/* External Google Maps Button */}
          <div className="absolute bottom-4 right-4 z-[400]">
            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${place.latitude},${place.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950/90 hover:bg-slate-900 border border-slate-700 text-white text-xs font-semibold shadow-xl transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
              <span>Mở điều hướng Google Maps</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
