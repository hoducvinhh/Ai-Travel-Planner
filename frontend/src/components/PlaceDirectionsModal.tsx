'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  Navigation,
  Car,
  Bike,
  Footprints,
  MapPin,
  Clock,
  CloudSun,
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudFog,
  Droplets,
  Wind,
  ExternalLink,
  Loader2,
  Sparkles,
  LocateFixed,
  Map as MapIcon,
  Layers,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

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
  code: number;
  isRain: boolean;
  advice: string;
}

function interpretWeatherCode(code: number, temp: number): {
  description: string;
  code: number;
  isRain: boolean;
  advice: string;
} {
  let description = 'Trời đẹp';
  let isRain = false;
  let advice = 'Thời tiết rất lý tưởng để tham quan và chụp ảnh ngoài trời!';

  if (code === 0) {
    description = 'Trời nắng trong xanh';
  } else if (code === 1 || code === 2) {
    description = 'Ít mây, nắng nhẹ';
  } else if (code === 3) {
    description = 'Nhiều mây';
  } else if (code === 45 || code === 48) {
    description = 'Sương mù';
    advice = 'Tầm nhìn có thể bị hạn chế, hãy chú ý an toàn khi di chuyển!';
  } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
    description = 'Có mưa rào';
    isRain = true;
    advice = 'Đang có mưa, hãy mang theo ô/áo mưa hoặc ưu tiên điểm đến trong nhà!';
  } else if ([95, 96, 99].includes(code)) {
    description = 'Giông bão sét';
    isRain = true;
    advice = 'Thời tiết có giông bão, nên hạn chế hoạt động ngoài trời lúc này!';
  }

  if (!isRain && temp >= 34) {
    advice = 'Trời nắng gắt, hãy mang theo nón mũ, kem chống nắng và uống đủ nước!';
  } else if (!isRain && temp <= 16) {
    advice = 'Trời se lạnh, bạn nên mặc thêm áo ấm khi ra ngoài!';
  }

  return { description, code, isRain, advice };
}

function getWeatherIconComponent(code: number) {
  if (code === 0) return <Sun className="w-5 h-5 text-amber-500" />;
  if (code === 1 || code === 2) return <CloudSun className="w-5 h-5 text-amber-500" />;
  if (code === 3) return <Cloud className="w-5 h-5 text-neutral-500" />;
  if (code === 45 || code === 48) return <CloudFog className="w-5 h-5 text-neutral-500" />;
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain className="w-5 h-5 text-sky-500" />;
  if ([95, 96, 99].includes(code)) return <CloudLightning className="w-5 h-5 text-amber-600" />;
  return <Sun className="w-5 h-5 text-amber-500" />;
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

  const [mapStyle, setMapStyle] = useState<'google' | 'osm' | 'satellite'>('google');

  const defaultStartLat = place.latitude ? place.latitude + 0.025 : 21.0285;
  const defaultStartLng = place.longitude ? place.longitude + 0.025 : 105.8542;

  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({
    lat: defaultStartLat,
    lng: defaultStartLng,
  });
  const [isRealGps, setIsRealGps] = useState(false);
  const [locationStatus, setLocationStatus] = useState<
    'idle' | 'requesting' | 'granted' | 'denied'
  >('idle');
  const [locationMessage, setLocationMessage] = useState(
    'Đang dùng điểm xuất phát mẫu (~3km). Bạn có thể bấm để lấy GPS thực.'
  );

  const [transportMode, setTransportMode] = useState<TransportMode>('motorbike');
  const [routeDistanceKm, setRouteDistanceKm] = useState<number | null>(null);
  const [modeDurations, setModeDurations] = useState<{
    motorbike: number | null;
    driving: number | null;
    walking: number | null;
  }>({
    motorbike: null,
    driving: null,
    walking: null,
  });
  const [isRouting, setIsRouting] = useState(false);

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  const applyTileLayer = useCallback((style: 'osm' | 'google' | 'satellite', map: L.Map) => {
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let layer: L.TileLayer;
    if (style === 'osm') {
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
      layer = L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
        attribution: '&copy; Google Maps',
      });
    }

    layer.addTo(map);
    tileLayerRef.current = layer;
  }, []);

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
            const { description, code, isRain, advice } = interpretWeatherCode(
              current.weather_code,
              current.temperature_2m
            );
            setWeather({
              temp: Math.round(current.temperature_2m),
              apparentTemp: Math.round(current.apparent_temperature),
              humidity: current.relative_humidity_2m,
              windSpeed: Math.round(current.wind_speed_10m),
              description,
              code,
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
          setLocationMessage('Không lấy được GPS. Đang dùng điểm xuất phát mẫu.');
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 60000,
      }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [place.latitude, place.longitude],
        zoom: 13,
      });

      applyTileLayer(mapStyle, map);

      const placeIcon = L.divIcon({
        className: 'dest-marker',
        html: `
          <div style="display:flex; flex-direction:column; align-items:center;">
            <div style="background: #1A1A1A; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.25);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div style="background: #1A1A1A; color: #FFFFFF; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 6px; margin-top: 4px; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
              ${place.name}
            </div>
          </div>
        `,
        iconSize: [120, 60],
        iconAnchor: [60, 18],
      });

      L.marker([place.latitude, place.longitude], { icon: placeIcon }).addTo(map);

      map.on('click', (e: L.LeafletMouseEvent) => {
        setUserCoords({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
        setIsRealGps(false);
        setLocationMessage('Đã đặt vị trí xuất phát theo điểm bạn bấm trên bản đồ.');
      });

      mapRef.current = map;

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

  const handleSwitchMapStyle = (newStyle: 'osm' | 'google' | 'satellite') => {
    setMapStyle(newStyle);
    if (mapRef.current) {
      applyTileLayer(newStyle, mapRef.current);
    }
  };

  useEffect(() => {
    if (!mapRef.current || !userCoords) return;

    const map = mapRef.current;

    if (!userMarkerRef.current) {
      const userIcon = L.divIcon({
        className: 'user-radar-marker',
        html: `
          <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(26, 26, 26, 0.2); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 22px; height: 22px; border-radius: 50%; background: #1A1A1A; border: 2.5px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const userMarker = L.marker([userCoords.lat, userCoords.lng], {
        icon: userIcon,
        draggable: true,
      }).addTo(map);

      userMarker.bindPopup(`
        <div style="font-size: 12px; font-weight: 600; color: #1A1A1A;">
          Điểm xuất phát của bạn<br/>
          <span style="font-weight: 400; font-size: 10px; color: #6B7280;">(Kéo thả để đổi điểm đi)</span>
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

    async function calculateRoute() {
      if (!userCoords) return;
      setIsRouting(true);

      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${userCoords.lng},${userCoords.lat};${place.longitude},${place.latitude}?overview=full&geometries=geojson`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.routes && data.routes.length > 0) {
            const primaryRoute = data.routes[0];
            const distanceMeters = primaryRoute.distance;
            const distanceKm = Math.round((distanceMeters / 1000) * 10) / 10;
            setRouteDistanceKm(distanceKm);

            const drivingMins = Math.max(1, Math.round(primaryRoute.duration / 60));
            const bikeSpeed = distanceKm < 10 ? 28 : distanceKm < 50 ? 35 : 40;
            let motorbikeMins = Math.max(1, Math.round((distanceKm / bikeSpeed) * 60));
            if (distanceKm < 15 && motorbikeMins > drivingMins) {
              motorbikeMins = Math.max(1, Math.round(drivingMins * 0.9));
            }
            const walkingMins = Math.max(2, Math.round((distanceKm / 4.8) * 60));

            setModeDurations({
              motorbike: motorbikeMins,
              driving: drivingMins,
              walking: walkingMins,
            });

            if (routeLayerRef.current) {
              map.removeLayer(routeLayerRef.current);
            }

            const coordinates = primaryRoute.geometry.coordinates.map(
              (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
            );

            const routeLine = L.polyline(coordinates, {
              color: '#1A1A1A',
              weight: 4.5,
              opacity: 0.85,
              dashArray: transportMode === 'walking' ? '6, 6' : undefined,
            }).addTo(map);

            routeLayerRef.current = routeLine;

            const bounds = L.latLngBounds([
              [userCoords.lat, userCoords.lng],
              [place.latitude, place.longitude],
            ]);
            map.fitBounds(bounds, { padding: [50, 50] });
          }
        }
      } catch (err) {
        console.error('Lỗi khi tính toán tuyến đường OSRM:', err);
        const R = 6371;
        const dLat = ((place.latitude - userCoords.lat) * Math.PI) / 180;
        const dLon = ((place.longitude - userCoords.lng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((userCoords.lat * Math.PI) / 180) *
            Math.cos((place.latitude * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const estRoadKm = Math.round(R * c * 1.25 * 10) / 10;
        setRouteDistanceKm(estRoadKm);

        const drivingMins = Math.max(1, Math.round((estRoadKm / (estRoadKm < 15 ? 30 : 60)) * 60));
        const bikeSpeed = estRoadKm < 10 ? 28 : estRoadKm < 50 ? 35 : 40;
        const motorbikeMins = Math.max(1, Math.round((estRoadKm / bikeSpeed) * 60));
        const walkingMins = Math.max(2, Math.round((estRoadKm / 4.8) * 60));

        setModeDurations({
          motorbike: motorbikeMins,
          driving: drivingMins,
          walking: walkingMins,
        });
      } finally {
        setIsRouting(false);
      }
    }

    calculateRoute();
  }, [userCoords, place.latitude, place.longitude, place.name, transportMode]);

  useEffect(() => {
    if (!routeLayerRef.current) return;
    routeLayerRef.current.setStyle({
      color: '#1A1A1A',
      dashArray: transportMode === 'walking' ? '6, 6' : undefined,
    });
  }, [transportMode]);

  const formatDuration = (mins: number | null) => {
    if (mins === null) return '—';
    if (mins < 60) return `${mins} phút`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h >= 48) {
      const days = Math.floor(h / 24);
      const remH = h % 24;
      return remH > 0 ? `${days} ngày ${remH} giờ` : `${days} ngày`;
    }
    return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[92vh] p-0 overflow-hidden flex flex-col bg-white border-[#E5E7EB] text-[#1A1A1A] rounded-2xl shadow-xl">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E7EB] bg-[#FAFAFA]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F0F0EF] border border-[#E5E7EB] text-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                <Navigation className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-base font-semibold text-[#1A1A1A] truncate">
                    Chỉ đường & thời tiết: {place.name}
                  </DialogTitle>
                  <Badge variant="outline" className="text-[11px] font-normal text-muted-foreground">
                    Bản đồ vệ tinh & OSRM
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">
                    {place.district ? `${place.district}, ` : ''}
                    {place.province || 'Việt Nam'}
                  </span>
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* GPS Status Banner */}
        <div className="bg-[#F9F9F8] border-b border-[#E5E7EB] px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground truncate">
            <span
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                isRealGps ? 'bg-[#365314] ring-2 ring-[#D9F99D]' : 'bg-neutral-400'
              }`}
            />
            <span className="truncate">
              {isRealGps ? 'Vị trí GPS thực' : 'Điểm mẫu'} — {locationMessage}
            </span>
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={requestLocation}
            disabled={locationStatus === 'requesting'}
            className="h-7 text-xs gap-1.5 self-start sm:self-auto flex-shrink-0"
          >
            {locationStatus === 'requesting' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <LocateFixed className="w-3.5 h-3.5" />
            )}
            Lấy lại GPS
          </Button>
        </div>

        {/* Transport Modes & Live Weather */}
        <div className="p-4 bg-white border-b border-[#E5E7EB] grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
          {/* Transport mode pills */}
          <div className="space-y-2">
            <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Thời gian ước tính theo phương tiện:</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTransportMode('motorbike')}
                className={`flex flex-col items-center justify-center py-2 px-2.5 rounded-xl border text-xs transition cursor-pointer ${
                  transportMode === 'motorbike'
                    ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-xs'
                    : 'bg-white border-[#E5E7EB] text-[#1A1A1A] hover:bg-[#F5F5F4]'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Bike className="w-3.5 h-3.5" />
                  <span className="font-medium">Xe máy</span>
                </div>
                <span className={`text-[12px] font-semibold font-mono ${transportMode === 'motorbike' ? 'text-[#D4F066]' : 'text-[#1A1A1A]'}`}>
                  {formatDuration(modeDurations.motorbike)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTransportMode('driving')}
                className={`flex flex-col items-center justify-center py-2 px-2.5 rounded-xl border text-xs transition cursor-pointer ${
                  transportMode === 'driving'
                    ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-xs'
                    : 'bg-white border-[#E5E7EB] text-[#1A1A1A] hover:bg-[#F5F5F4]'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Car className="w-3.5 h-3.5" />
                  <span className="font-medium">Ô tô</span>
                </div>
                <span className={`text-[12px] font-semibold font-mono ${transportMode === 'driving' ? 'text-[#D4F066]' : 'text-[#1A1A1A]'}`}>
                  {formatDuration(modeDurations.driving)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTransportMode('walking')}
                className={`flex flex-col items-center justify-center py-2 px-2.5 rounded-xl border text-xs transition cursor-pointer ${
                  transportMode === 'walking'
                    ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-xs'
                    : 'bg-white border-[#E5E7EB] text-[#1A1A1A] hover:bg-[#F5F5F4]'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Footprints className="w-3.5 h-3.5" />
                  <span className="font-medium">Đi bộ</span>
                </div>
                <span className={`text-[12px] font-semibold font-mono ${transportMode === 'walking' ? 'text-[#D4F066]' : 'text-[#1A1A1A]'}`}>
                  {formatDuration(modeDurations.walking)}
                </span>
              </button>
            </div>

            <div className="text-[11px] text-muted-foreground flex items-center justify-between px-1">
              <span>
                Khoảng cách: <strong className="text-[#1A1A1A]">{routeDistanceKm !== null ? `${routeDistanceKm} km` : '...'}</strong>
              </span>
              {isRouting && (
                <span className="flex items-center gap-1 text-muted-foreground text-[10px]">
                  <Loader2 className="w-3 h-3 animate-spin" /> Đang tính toán...
                </span>
              )}
            </div>
          </div>

          {/* Weather card */}
          <Card className="p-3 bg-[#FAFAFA] border-[#E5E7EB] shadow-2xs">
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <CloudSun className="w-3.5 h-3.5 text-neutral-600" />
                  Thời tiết hôm nay
                </span>
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 font-normal text-muted-foreground">
                  Open-Meteo
                </Badge>
              </div>

              {weatherLoading ? (
                <div className="py-2 flex items-center justify-center text-muted-foreground text-xs gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang tải thông tin thời tiết...</span>
                </div>
              ) : weather ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-white border border-[#E5E7EB]">
                        {getWeatherIconComponent(weather.code)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#1A1A1A] flex items-center gap-1.5">
                          <span>{weather.temp}°C</span>
                          <span className="text-[11px] font-normal text-muted-foreground">
                            (cảm giác {weather.apparentTemp}°C)
                          </span>
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {weather.description}
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-[11px] text-muted-foreground space-y-0.5">
                      <div className="flex items-center gap-1 justify-end">
                        <Droplets className="w-3 h-3" />
                        <span>Độ ẩm: {weather.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <Wind className="w-3 h-3" />
                        <span>Gió: {weather.windSpeed} km/h</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-[#E5E7EB] text-[11px] text-[#1A1A1A] flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-neutral-700" />
                    <span className="line-clamp-2">{weather.advice}</span>
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-muted-foreground text-center py-2">
                  Chưa thể tải dữ liệu thời tiết
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Map canvas */}
        <div className="relative flex-1 min-h-[350px] md:min-h-[420px] bg-[#F5F5F4]">
          <div ref={mapContainerRef} className="w-full h-full min-h-[350px] md:min-h-[420px]" />

          {/* Floating instructions */}
          <div className="absolute top-3 left-3 z-[400] flex flex-col gap-1.5 max-w-[65%] pointer-events-none">
            <div className="bg-white/95 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] text-[11px] text-[#1A1A1A] flex items-center gap-2 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#1A1A1A] flex-shrink-0" />
              <span>Kéo chấm hoặc bấm map để đổi điểm đi</span>
            </div>
          </div>

          {/* Layer switcher */}
          <div className="absolute top-3 right-3 z-[400] flex items-center gap-1 bg-white/95 backdrop-blur-xs p-1 rounded-xl border border-[#E5E7EB] shadow-xs text-[11px]">
            <button
              type="button"
              onClick={() => handleSwitchMapStyle('osm')}
              className={`px-2 py-1 rounded-lg transition font-medium cursor-pointer ${
                mapStyle === 'osm'
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'text-muted-foreground hover:text-[#1A1A1A]'
              }`}
            >
              OSM
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMapStyle('google')}
              className={`px-2 py-1 rounded-lg transition font-medium cursor-pointer ${
                mapStyle === 'google'
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'text-muted-foreground hover:text-[#1A1A1A]'
              }`}
            >
              Google
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMapStyle('satellite')}
              className={`px-2 py-1 rounded-lg transition font-medium cursor-pointer ${
                mapStyle === 'satellite'
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'text-muted-foreground hover:text-[#1A1A1A]'
              }`}
            >
              Vệ tinh
            </button>
          </div>

          {/* External Google Maps Button */}
          <div className="absolute bottom-4 right-4 z-[400]">
            <Button
              asChild
              variant="default"
              size="sm"
              className="shadow-md gap-1.5"
            >
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${place.latitude},${place.longitude}&travelmode=${
                  transportMode === 'walking' ? 'walking' : transportMode === 'motorbike' ? 'two-wheeler' : 'driving'
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Mở Google Maps
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
