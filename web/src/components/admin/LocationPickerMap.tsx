'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { Search, MapPin, Loader2, Navigation, Compass, X, Database, Globe } from 'lucide-react';
import { api } from '@/lib/api';
import { Place } from '@/types';

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

export interface LocationPickerResult {
  id: string;
  name: string;
  subtitle: string;
  lat: number;
  lng: number;
  province?: string;
  district?: string;
  source: 'osm' | 'db';
}

const CITY_PRESETS = [
  { name: 'Hà Nội', lat: 21.0285, lng: 105.8542 },
  { name: 'TP. Hồ Chí Minh', lat: 10.7769, lng: 106.7009 },
  { name: 'Đà Nẵng', lat: 16.0544, lng: 108.2022 },
  { name: 'Đà Lạt', lat: 11.9404, lng: 108.4583 },
  { name: 'Hội An', lat: 15.8801, lng: 108.3380 },
  { name: 'Huế', lat: 16.4637, lng: 107.5909 },
  { name: 'Nha Trang', lat: 12.2388, lng: 109.1967 },
  { name: 'Phú Quốc', lat: 10.2289, lng: 103.9572 },
  { name: 'Hạ Long', lat: 20.9505, lng: 107.0734 },
  { name: 'Sa Pa', lat: 22.3364, lng: 103.8438 },
  { name: 'Ninh Bình', lat: 20.2506, lng: 105.9745 },
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
  const [searchResults, setSearchResults] = useState<LocationPickerResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Safe initial coordinates (Vietnam center or provided)
  const currentLat = Number.isFinite(latitude) && latitude !== 0 ? latitude : 16.0544;
  const currentLng = Number.isFinite(longitude) && longitude !== 0 ? longitude : 108.2022;

  // Custom marker icon with emerald pulse
  const createCustomIcon = useCallback(() => {
    return L.divIcon({
      className: 'custom-admin-marker',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px;">
          <div style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background: rgba(16, 185, 129, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;">
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

  // Map Layer type
  const [mapStyle, setMapStyle] = useState<'google' | 'osm' | 'satellite'>('google');
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Function to switch tile layer
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
          attribution: '&copy; OpenStreetMap contributors',
        }
      );
    } else if (style === 'satellite') {
      layer = L.tileLayer('https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
        attribution: '&copy; Google Satellite',
      });
    } else {
      // Google Maps Streets
      layer = L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
        attribution: '&copy; Google Maps',
      });
    }

    layer.addTo(map);
    tileLayerRef.current = layer;
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentLat, currentLng],
        zoom: currentLat === 16.0544 && currentLng === 108.2022 ? 6 : 14,
        zoomControl: true,
      });

      applyTileLayer(mapStyle, map);

      const marker = L.marker([currentLat, currentLng], {
        icon: createCustomIcon(),
        draggable: true,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 13px; font-weight: 600; color: #0f172a; padding: 2px;">
          📍 Tọa độ đã chọn<br/>
          <span style="font-weight: 400; color: #64748b; font-size: 11px;">Kéo thả để điều chỉnh vị trí chính xác</span>
        </div>
      `);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        updatePosition(pos.lat, pos.lng);
      });

      map.on('click', (e: L.LeafletMouseEvent) => {
        updatePosition(e.latlng.lat, e.latlng.lng);
      });

      mapRef.current = map;
      markerRef.current = marker;

      const timer1 = setTimeout(() => map.invalidateSize(), 150);
      const timer2 = setTimeout(() => map.invalidateSize(), 400);
      const timer3 = setTimeout(() => map.invalidateSize(), 800);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [applyTileLayer, createCustomIcon, currentLat, currentLng, mapStyle, updatePosition]);

  // When mapStyle changes
  const handleSwitchMapStyle = (newStyle: 'osm' | 'google' | 'satellite') => {
    setMapStyle(newStyle);
    if (mapRef.current) {
      applyTileLayer(newStyle, mapRef.current);
    }
  };

  // Sync external coordinates change to map & marker (smooth pan)
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      if (Number.isFinite(latitude) && Number.isFinite(longitude) && latitude !== 0 && longitude !== 0) {
        const currentMarkerPos = markerRef.current.getLatLng();
        const dist = Math.hypot(currentMarkerPos.lat - latitude, currentMarkerPos.lng - longitude);
        if (dist > 0.0001) {
          markerRef.current.setLatLng([latitude, longitude]);
          const mapCenter = mapRef.current.getCenter();
          const centerDist = Math.hypot(mapCenter.lat - latitude, mapCenter.lng - longitude);
          if (centerDist > 0.002) {
            mapRef.current.panTo([latitude, longitude]);
          }
        }
      }
    }
  }, [latitude, longitude]);

  // Multi-source Search: Photon (OSM) + Nominatim fallback + Local DB
  const executeSearch = async (queryText: string, autoSelectFirst = false) => {
    const q = queryText.trim();
    if (!q) return;

    setIsSearching(true);
    setShowResults(true);

    try {
      const results: LocationPickerResult[] = [];

      // 1. Primary: Photon OSM API (Fast, reliable in VN, no CORS/DNS blocks)
      try {
        const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=6`;
        const response = await fetch(photonUrl);
        if (response.ok) {
          const data = await response.json();
          if (data.features && Array.isArray(data.features)) {
            for (const f of data.features) {
              const props = f.properties || {};
              const coords = f.geometry?.coordinates; // [lng, lat]
              if (coords && coords.length >= 2) {
                const lng = coords[0];
                const lat = coords[1];
                const name = props.name || props.street || q;
                const province = props.city || props.state || '';
                const district = props.district || props.suburb || props.county || '';
                const addressParts = [
                  props.housenumber,
                  props.street,
                  district,
                  province,
                  props.country,
                ].filter(Boolean);

                results.push({
                  id: `osm-${props.osm_id || Math.random()}`,
                  name,
                  subtitle: addressParts.join(', ') || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
                  lat,
                  lng,
                  province,
                  district,
                  source: 'osm',
                });
              }
            }
          }
        }
      } catch (err) {
        console.warn('Photon geocoding error:', err);
      }

      // 2. Secondary: Fallback to Nominatim if Photon returned nothing
      if (results.length === 0) {
        try {
          const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            q
          )}&countrycodes=vn&addressdetails=1&limit=5`;
          const response = await fetch(nomUrl, {
            headers: { 'Accept-Language': 'vi,en;q=0.9' },
          });
          if (response.ok) {
            const data = await response.json();
            for (const item of data) {
              results.push({
                id: `nom-${item.place_id}`,
                name: item.display_name.split(',')[0],
                subtitle: item.display_name,
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon),
                province: item.address?.state || item.address?.city || '',
                district: item.address?.suburb || item.address?.quarter || item.address?.county || '',
                source: 'osm',
              });
            }
          }
        } catch (err) {
          // ignore network/DNS failures
        }
      }

      // 3. Search local database places
      try {
        const dbRes = await api.get<{ items: Place[] }>(`/places?search=${encodeURIComponent(q)}&limit=3`);
        if (dbRes?.items?.length) {
          for (const p of dbRes.items) {
            results.unshift({
              id: `db-${p.id}`,
              name: p.name,
              subtitle: `${p.district ? p.district + ', ' : ''}${p.province || 'Việt Nam'} (Trong CSDL)`,
              lat: p.latitude,
              lng: p.longitude,
              province: p.province || '',
              district: p.district || '',
              source: 'db',
            });
          }
        }
      } catch (err) {
        // non-fatal
      }

      setSearchResults(results);

      // If user hit Enter or clicked "Tìm" and we got results, jump immediately to the top result!
      if (autoSelectFirst && results.length > 0) {
        handleSelectResult(results[0]);
      }
    } catch (err) {
      console.error('Error searching location:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Select a search result
  const handleSelectResult = (result: LocationPickerResult) => {
    const lat = result.lat;
    const lng = result.lng;

    if (mapRef.current) {
      mapRef.current.flyTo([lat, lng], 16, { duration: 1.2 });
    }

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      markerRef.current
        .bindPopup(`
          <div style="font-family: inherit; font-size: 13px; font-weight: 600; color: #0f172a; padding: 2px;">
            📍 ${result.name}<br/>
            <span style="font-weight: 400; color: #64748b; font-size: 11px;">${result.subtitle}</span>
          </div>
        `)
        .openPopup();
    }

    updatePosition(lat, lng, {
      province: result.province,
      district: result.district,
      suggestedName: result.name,
    });

    setShowResults(false);
    setSearchQuery(result.name);
  };

  // Jump to City Preset
  const handleJumpCity = (city: { name: string; lat: number; lng: number }) => {
    if (mapRef.current) {
      mapRef.current.flyTo([city.lat, city.lng], 13, { duration: 1 });
    }
    if (markerRef.current) {
      markerRef.current.setLatLng([city.lat, city.lng]);
      markerRef.current
        .bindPopup(`
          <div style="font-family: inherit; font-size: 13px; font-weight: 600; color: #0f172a; padding: 2px;">
            📍 ${city.name}<br/>
            <span style="font-weight: 400; color: #64748b; font-size: 11px;">Kéo thả để điều chỉnh vị trí chính xác</span>
          </div>
        `)
        .openPopup();
    }
    updatePosition(city.lat, city.lng, { province: city.name });
  };

  // Live typing with debounce
  const handleInputChange = (text: string) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setShowResults(true);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      executeSearch(text, false);
    }, 400);
  };

  return (
    <div className="space-y-3">
      {/* Search Bar - NO FORM TAG (Prevents outer modal form submission!) */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setShowResults(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  executeSearch(searchQuery, true);
                }
              }}
              placeholder="Tìm địa điểm OSM (VD: Cà phê Giảng, Chợ Bến Thành, Bà Nà Hills...)"
              className="w-full pl-9 pr-9 py-2 text-xs bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]/20 transition"
            />
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />

            {searchQuery && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSearchQuery('');
                  setSearchResults([]);
                  setShowResults(false);
                }}
                aria-label="Xóa từ khóa tìm kiếm"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              executeSearch(searchQuery, true);
            }}
            disabled={isSearching}
            className="px-4 py-2 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 transition cursor-pointer"
          >
            {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
            <span>Tìm</span>
          </button>
        </div>

        {/* Live Search Suggestions Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-[1000] overflow-hidden max-h-64 overflow-y-auto">
            <div className="p-2.5 border-b border-[#E2E8F0] text-[11px] font-semibold text-[#0F766E] flex items-center justify-between bg-[#F0FDFA]">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#0D9488]" />
                Gợi ý địa điểm ({searchResults.length}) - Bấm để nhảy map
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowResults(false);
                }}
                aria-label="Đóng gợi ý"
                className="inline-flex items-center gap-1 text-[#64748B] hover:text-[#0F172A] text-[11px] cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Đóng</span>
              </button>
            </div>
            {searchResults.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelectResult(item);
                }}
                className="w-full text-left px-3 py-2.5 hover:bg-[#F0FDFA] border-b border-[#F1F5F9] last:border-b-0 flex items-start gap-2.5 transition group cursor-pointer"
              >
                {item.source === 'db' ? (
                  <Database className="w-4 h-4 text-[#0D9488] flex-shrink-0 mt-0.5" />
                ) : (
                  <Globe className="w-4 h-4 text-[#64748B] flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-[#0F172A] group-hover:text-[#0D9488] truncate">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-[#64748B] line-clamp-1">
                    {item.subtitle}
                  </div>
                  <div className="text-[9px] text-[#64748B] font-mono mt-0.5 flex items-center gap-2">
                    <span>Lat: {item.lat.toFixed(4)}, Lng: {item.lng.toFixed(4)}</span>
                    {item.province && (
                      <span className="px-1.5 py-0.2 rounded bg-[#F0FDFA] border border-[#99F6E4] text-[#0F766E]">
                        {item.province}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick City Presets */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-[11px] font-semibold text-[#64748B] flex items-center gap-1 flex-shrink-0">
          <Compass className="w-3.5 h-3.5 text-[#0D9488]" />
          Zoom nhanh:
        </span>
        {CITY_PRESETS.map((city) => (
          <button
            key={city.name}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleJumpCity(city);
            }}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#E2E8F0] hover:border-[#0D9488] hover:bg-[#F0FDFA] text-[#0F172A] hover:text-[#0D9488] text-[11px] font-medium transition flex-shrink-0 cursor-pointer"
          >
            {city.name}
          </button>
        ))}
      </div>

      {/* Leaflet Map Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0]">
        <div
          ref={mapContainerRef}
          className="w-full h-[320px] bg-[#F1F5F9] z-0"
          style={{ minHeight: '320px' }}
        />

        {/* Floating Instruction */}
        <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E2E8F0] text-[11px] text-[#0F172A] flex items-center gap-2 shadow-sm max-w-[50%] truncate">
          <span className="w-2 h-2 rounded-full bg-[#0D9488] flex-shrink-0" />
          <span className="truncate font-medium">Click hoặc kéo thả ghim</span>
        </div>

        {/* Layer Style Switcher Buttons */}
        <div className="absolute top-3 right-3 z-[400] flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-[#E2E8F0] shadow-sm text-[10px] font-semibold">
          <button
            type="button"
            onClick={() => handleSwitchMapStyle('osm')}
            className={`px-2 py-1 rounded-lg transition cursor-pointer ${
              mapStyle === 'osm'
                ? 'bg-[#0D9488] text-white'
                : 'text-[#64748B] hover:text-[#0D9488]'
            }`}
          >
            OSM
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMapStyle('google')}
            className={`px-2 py-1 rounded-lg transition cursor-pointer ${
              mapStyle === 'google'
                ? 'bg-[#0D9488] text-white'
                : 'text-[#64748B] hover:text-[#0D9488]'
            }`}
          >
            Google
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMapStyle('satellite')}
            className={`px-2 py-1 rounded-lg transition cursor-pointer ${
              mapStyle === 'satellite'
                ? 'bg-[#0D9488] text-white'
                : 'text-[#64748B] hover:text-[#0D9488]'
            }`}
          >
            Vệ tinh
          </button>
        </div>

        <div className="absolute bottom-3 right-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E2E8F0] font-mono text-[11px] text-[#0F172A] shadow-sm flex items-center gap-2">
          <span>Lat: <strong className="text-[#0D9488]">{latitude ? Number(latitude).toFixed(6) : 'Chưa chọn'}</strong></span>
          <span className="text-[#CBD5E1]">|</span>
          <span>Lng: <strong className="text-[#0D9488]">{longitude ? Number(longitude).toFixed(6) : 'Chưa chọn'}</strong></span>
        </div>
      </div>
    </div>
  );
}
