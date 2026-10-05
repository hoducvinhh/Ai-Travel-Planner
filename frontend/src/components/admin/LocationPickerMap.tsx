'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { Search, MapPin, Loader2, Navigation, Compass, Check } from 'lucide-react';

// Fix icon url issue with Leaflet in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onChange: (data: {
    latitude: number;
    longitude: number;
    province?: string;
    district?: string;
    suggestedName?: string;
  }) => void;
}

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    state?: string;
    county?: string;
    suburb?: string;
    quarter?: string;
    city_district?: string;
    town?: string;
  };
}

const CITY_PRESETS = [
  { name: 'Hà Nội', lat: 21.0285, lng: 105.8542 },
  { name: 'Đà Nẵng', lat: 16.0544, lng: 108.2022 },
  { name: 'TP. Hồ Chí Minh', lat: 10.7769, lng: 106.7009 },
  { name: 'Đà Lạt', lat: 11.9404, lng: 108.4583 },
  { name: 'Nha Trang', lat: 12.2388, lng: 109.1967 },
  { name: 'Phú Quốc', lat: 10.2289, lng: 103.9572 },
  { name: 'Huế', lat: 16.4637, lng: 107.5909 },
  { name: 'Sa Pa', lat: 22.3364, lng: 103.8438 },
];

export default function LocationPickerMap({
  latitude,
  longitude,
  onChange,
}: LocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Safe initial coordinates (Vietnam center or provided)
  const currentLat = Number.isFinite(latitude) && latitude !== 0 ? latitude : 16.0544;
  const currentLng = Number.isFinite(longitude) && longitude !== 0 ? longitude : 108.2022;

  // Custom marker icon with emerald pulse
  const createCustomIcon = useCallback(() => {
    return L.divIcon({
      className: 'custom-admin-marker',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px;">
          <div style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background: rgba(16, 185, 129, 0.3); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: white;"></div>
          </div>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
    });
  }, []);

  // Update marker position and notify parent
  const updatePosition = useCallback(
    (lat: number, lng: number, extraData?: { province?: string; district?: string; suggestedName?: string }) => {
      const roundedLat = Math.round(lat * 1000000) / 1000000;
      const roundedLng = Math.round(lng * 1000000) / 1000000;

      if (markerRef.current) {
        markerRef.current.setLatLng([roundedLat, roundedLng]);
      }

      onChange({
        latitude: roundedLat,
        longitude: roundedLng,
        ...extraData,
      });
    },
    [onChange]
  );

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentLat, currentLng],
        zoom: currentLat === 16.0544 && currentLng === 108.2022 ? 6 : 14,
        zoomControl: true,
      });

      // OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Create draggable marker
      const marker = L.marker([currentLat, currentLng], {
        icon: createCustomIcon(),
        draggable: true,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 13px; font-weight: 600; color: #0f172a; padding: 2px;">
          📍 Tọa độ đã chọn<br/>
          <span style="font-weight: 400; color: #64748b; font-size: 11px;">Kéo thả để điều chỉnh vị trí</span>
        </div>
      `);

      // On drag marker
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        updatePosition(pos.lat, pos.lng);
      });

      // On map click: move marker
      map.on('click', (e: L.LeafletMouseEvent) => {
        updatePosition(e.latlng.lat, e.latlng.lng);
      });

      mapRef.current = map;
      markerRef.current = marker;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Sync external coordinates change to map & marker
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      if (Number.isFinite(latitude) && Number.isFinite(longitude) && latitude !== 0 && longitude !== 0) {
        const currentMarkerPos = markerRef.current.getLatLng();
        if (
          Math.abs(currentMarkerPos.lat - latitude) > 0.0001 ||
          Math.abs(currentMarkerPos.lng - longitude) > 0.0001
        ) {
          markerRef.current.setLatLng([latitude, longitude]);
          mapRef.current.setView([latitude, longitude], mapRef.current.getZoom());
        }
      }
    }
  }, [latitude, longitude]);

  // OpenStreetMap Nominatim Live Search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowResults(true);

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchQuery.trim()
      )}&countrycodes=vn&addressdetails=1&limit=6`;

      const response = await fetch(url, {
        headers: {
          'Accept-Language': 'vi,en;q=0.9',
        },
      });

      if (response.ok) {
        const data: SearchResult[] = await response.json();
        setSearchResults(data);
      }
    } catch (err) {
      console.error('Error searching OpenStreetMap Nominatim:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Select a search result
  const handleSelectResult = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    if (mapRef.current) {
      mapRef.current.flyTo([lat, lng], 16, { duration: 1.2 });
    }

    // Extract province and district from Nominatim address
    const province =
      result.address?.state ||
      result.address?.city ||
      '';
    const district =
      result.address?.suburb ||
      result.address?.quarter ||
      result.address?.city_district ||
      result.address?.county ||
      result.address?.town ||
      '';

    const shortName = result.display_name.split(',')[0];

    updatePosition(lat, lng, {
      province,
      district,
      suggestedName: shortName,
    });

    setShowResults(false);
    setSearchQuery(result.display_name.split(',')[0]);
  };

  // Jump to City Preset
  const handleJumpCity = (city: { name: string; lat: number; lng: number }) => {
    if (mapRef.current) {
      mapRef.current.flyTo([city.lat, city.lng], 13, { duration: 1 });
    }
    updatePosition(city.lat, city.lng, { province: city.name });
  };

  return (
    <div className="space-y-3">
      {/* Search Bar - Live OpenStreetMap Nominatim */}
      <div className="relative">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!showResults) setShowResults(true);
              }}
              onFocus={() => {
                if (searchResults.length > 0) setShowResults(true);
              }}
              placeholder="🔍 Tìm địa điểm OSM (VD: Cà phê Giảng, Chợ Bến Thành, Bà Nà Hills...)"
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 disabled:opacity-50 transition"
          >
            {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
            <span>Tìm</span>
          </button>
        </form>

        {/* Live Search Suggestions Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-[1000] overflow-hidden max-h-60 overflow-y-auto">
            <div className="p-2 border-b border-slate-800 text-[11px] font-semibold text-emerald-400 flex items-center justify-between">
              <span>Kết quả OpenStreetMap ({searchResults.length})</span>
              <button
                type="button"
                onClick={() => setShowResults(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕ Đóng
              </button>
            </div>
            {searchResults.map((item) => (
              <button
                key={item.place_id}
                type="button"
                onClick={() => handleSelectResult(item)}
                className="w-full text-left px-3 py-2.5 hover:bg-slate-800/80 border-b border-slate-800/50 last:border-b-0 flex items-start gap-2.5 transition"
              >
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white truncate">
                    {item.display_name.split(',')[0]}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">
                    {item.display_name}
                  </div>
                  <div className="text-[9px] text-teal-400/80 font-mono mt-0.5">
                    Lat: {parseFloat(item.lat).toFixed(4)}, Lng: {parseFloat(item.lon).toFixed(4)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick City Presets */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 flex-shrink-0">
          <Compass className="w-3.5 h-3.5 text-teal-400" />
          Zoom nhanh:
        </span>
        {CITY_PRESETS.map((city) => (
          <button
            key={city.name}
            type="button"
            onClick={() => handleJumpCity(city)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 text-[11px] font-medium transition flex-shrink-0"
          >
            {city.name}
          </button>
        ))}
      </div>

      {/* Leaflet Map Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
        <div
          ref={mapContainerRef}
          className="w-full h-[320px] bg-slate-950 z-0"
          style={{ minHeight: '320px' }}
        />

        {/* Floating Instruction & Coordinates Badge */}
        <div className="absolute top-3 left-3 z-[400] bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-[11px] text-slate-300 flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Click hoặc kéo thả ghim trên bản đồ để chọn tọa độ</span>
        </div>

        <div className="absolute bottom-3 right-3 z-[400] bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/30 font-mono text-[11px] text-emerald-300 shadow-lg flex items-center gap-2">
          <span>Lat: <strong>{latitude ? Number(latitude).toFixed(6) : 'Chưa chọn'}</strong></span>
          <span className="text-slate-600">|</span>
          <span>Lng: <strong>{longitude ? Number(longitude).toFixed(6) : 'Chưa chọn'}</strong></span>
        </div>
      </div>
    </div>
  );
}
