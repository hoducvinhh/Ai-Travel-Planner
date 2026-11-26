'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

import { ItineraryPlace as Place, MapComponentProps } from '@/types';

const FALLBACK_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`;
const DEFAULT_BANNER = 'https://images.unsplash.com/photo-1528127269322-539801943592?w=500&q=80';

export default function MapComponent({ places, onSelectPlace, selectedPlaceId }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    if (!mapContainerRef.current || places.length === 0) return;

    // Initialize map if not already created
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(
        [places[0].latitude, places[0].longitude],
        13
      );

      // Clean, fast, watermark-free map tiles
      L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
        attribution: '&copy; Google Maps',
      }).addTo(mapRef.current);

      // Invalidate size to guarantee sharp rendering
      setTimeout(() => {
        if (mapRef.current) mapRef.current.invalidateSize();
      }, 200);
    }

    const map = mapRef.current;
    markersMapRef.current.clear();

    // Clear existing markers and routes
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Add markers with custom photo thumbnail icons
    const markers: L.Marker[] = [];
    places.forEach((place, index) => {
      const imgUrl = place.imageUrl || FALLBACK_SVG;

      // Custom Pin Marker: Circular photo avatar with number badge and pointer
      const photoMarkerIcon = L.divIcon({
        className: 'custom-photo-marker-wrapper',
        html: `
          <div class="custom-photo-pin" style="position: relative; width: 44px; height: 50px; cursor: pointer; display: flex; flex-direction: column; align-items: center;">
            <!-- Number badge on top-right -->
            <div style="position: absolute; top: -4px; right: -2px; z-index: 10; background: #0D9488; color: #ffffff; font-size: 11px; font-weight: 700; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #ffffff; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
              ${index + 1}
            </div>
            <!-- Circular Photo Avatar -->
            <div style="width: 40px; height: 40px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.3); overflow: hidden; background: #f1f5f9; display: flex; align-items: center; justify-content: center;">
              <img src="${imgUrl}" alt="${place.name}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.onerror=null; this.src='${FALLBACK_SVG}';" />
            </div>
            <!-- Triangular Pointer Tip -->
            <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 7px solid #ffffff; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.25)); margin-top: -2px;"></div>
          </div>
        `,
        iconSize: [44, 50],
        iconAnchor: [22, 48],
        popupAnchor: [0, -48],
      });

      const marker = L.marker([place.latitude, place.longitude], {
        icon: photoMarkerIcon,
      }).addTo(map);

      // Save marker for quick lookup when focusing
      markersMapRef.current.set(place.placeId, marker);

      // Rich Card Popup with Place Cover Image
      const popupHtml = `
        <div style="width: 250px; font-family: inherit; overflow: hidden; border-radius: 14px; background: #ffffff;">
          <!-- Cover Image Banner -->
          <div style="position: relative; width: 100%; height: 115px; background: #f1f5f9; overflow: hidden;">
            <img src="${imgUrl}" alt="${place.name}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.onerror=null; this.src='${DEFAULT_BANNER}';" />
            
            <!-- Top-left pill: Step number + Session -->
            <div style="position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); color: #ffffff; font-size: 10px; font-weight: 600; padding: 2.5px 8px; border-radius: 9999px; display: flex; align-items: center; gap: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.25);">
              <span>#${index + 1}</span>
              ${place.timeSlot ? `<span>• ${place.timeSlot === 'morning' ? 'Sáng' : place.timeSlot === 'evening' ? 'Tối' : 'Chiều'}</span>` : ''}
            </div>

            <!-- Bottom-right pill: Price / Free -->
            <div style="position: absolute; bottom: 8px; right: 8px; background: rgba(15,23,42,0.82); backdrop-filter: blur(4px); font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.25);">
              ${place.priceEstimate > 0 
                ? `<span style="color: #FDE68A; font-family: monospace;">${place.priceEstimate.toLocaleString('vi-VN')} đ</span>`
                : `<span style="color: #5EEAD4;">Miễn phí</span>`
              }
            </div>
          </div>

          <!-- Body Content -->
          <div style="padding: 10px 12px 12px;">
            <!-- Place Title -->
            <div style="font-weight: 700; font-size: 13px; color: #0F172A; line-height: 1.35; margin-bottom: 5px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;" title="${place.name}">
              ${index + 1}. ${place.name}
            </div>

            <!-- Categories / Time metadata -->
            <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 4px; margin-bottom: 10px;">
              ${(place.categories || []).slice(0, 2).map((cat) => `
                <span style="font-size: 10px; background: #F1F5F9; color: #64748B; border: 1px solid #E2E8F0; padding: 1px 6px; border-radius: 4px; font-weight: 500;">
                  ${cat}
                </span>
              `).join('')}
              ${place.estimatedTime ? `
                <span style="font-size: 10px; background: #F0FDFA; color: #0F766E; border: 1px solid #99F6E4; padding: 1px 6px; border-radius: 4px; font-weight: 500;">
                  ${place.estimatedTime}
                </span>
              ` : ''}
            </div>

            <!-- Action Button -->
            <button id="btn-map-dir-${place.placeId}" style="
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
              width: 100%;
              padding: 7px 12px;
              background: #0D9488;
              color: #ffffff;
              border-radius: 8px;
              border: none;
              font-size: 11px;
              font-weight: 600;
              cursor: pointer;
              box-shadow: 0 2px 4px rgba(13,148,136,0.2);
              transition: all 0.15s ease;
            " onmouseover="this.style.background='#0F766E'" onmouseout="this.style.background='#0D9488'">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
              <span>Chỉ đường & Thời tiết</span>
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        minWidth: 250,
        maxWidth: 260,
        className: 'custom-map-popup',
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-map-dir-${place.placeId}`);
        if (btn && onSelectPlace) {
          btn.onclick = () => onSelectPlace(place);
        }
      });

      markers.push(marker);
    });

    // Draw route line between places
    if (places.length > 1) {
      const routeCoordinates: [number, number][] = places.map((p) => [
        p.latitude,
        p.longitude,
      ]);

      L.polyline(routeCoordinates, {
        color: '#0D9488',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
      }).addTo(map);
    }

    // Fit map to show all markers
    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.12));
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [places]);

  // Automatically focus and open popup if selectedPlaceId changes
  useEffect(() => {
    if (!selectedPlaceId || !mapRef.current) return;
    const marker = markersMapRef.current.get(selectedPlaceId);
    if (marker) {
      marker.openPopup();
      const latLng = marker.getLatLng();
      mapRef.current.setView([latLng.lat, latLng.lng], 15, { animate: true });
    }
  }, [selectedPlaceId]);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] bg-[#F1F5F9] overflow-hidden">
      <div
        ref={mapContainerRef}
        className="w-full h-full"
        style={{ zIndex: 0 }}
      />
      <style>{`
        .custom-photo-marker-wrapper {
          background: transparent !important;
          border: none !important;
        }
        .custom-photo-pin {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .custom-photo-pin:hover {
          transform: scale(1.15);
          z-index: 1000 !important;
        }
        .custom-map-popup .leaflet-popup-content-wrapper {
          padding: 0 !important;
          border-radius: 14px !important;
          overflow: hidden !important;
          box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.25), 0 4px 10px -2px rgba(0, 0, 0, 0.1) !important;
          border: 1px solid #E2E8F0 !important;
        }
        .custom-map-popup .leaflet-popup-content {
          margin: 0 !important;
          line-height: 1.4 !important;
          width: 250px !important;
        }
        .custom-map-popup .leaflet-popup-tip-container {
          margin-top: -1px;
        }
        .custom-map-popup a.leaflet-popup-close-button {
          top: 7px !important;
          right: 7px !important;
          width: 22px !important;
          height: 22px !important;
          background: rgba(0, 0, 0, 0.6) !important;
          color: #ffffff !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 13px !important;
          padding: 0 !important;
          border: none !important;
          transition: background 0.2s !important;
          z-index: 30 !important;
        }
        .custom-map-popup a.leaflet-popup-close-button:hover {
          background: rgba(0, 0, 0, 0.85) !important;
        }
      `}</style>
    </div>
  );
}
