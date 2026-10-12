'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ItineraryPlace as Place, MapComponentProps, TimeSlot } from '@/types';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function getSessionMeta(slot?: TimeSlot, index = 0, total = 1) {
  let resolved: TimeSlot = 'afternoon';
  if (slot && ['morning', 'afternoon', 'evening'].includes(slot)) {
    resolved = slot;
  } else if (total <= 2) {
    resolved = index === 0 ? 'morning' : 'afternoon';
  } else if (index === 0) {
    resolved = 'morning';
  } else if (index >= total - 1) {
    resolved = 'evening';
  }

  if (resolved === 'morning') {
    return { label: '🌅 Buổi sáng', color: '#D97706', tagBg: '#FEF3C7', ringColor: '#F59E0B' };
  }
  if (resolved === 'evening') {
    return { label: '🌙 Buổi tối', color: '#4F46E5', tagBg: '#E0E7FF', ringColor: '#6366F1' };
  }
  return { label: '☀️ Buổi chiều', color: '#0284C7', tagBg: '#E0F2FE', ringColor: '#0EA5E9' };
}

export default function MapComponent({ places, onSelectPlace, selectedPlaceId }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // Initialize and update markers
  useEffect(() => {
    if (!mapContainerRef.current || places.length === 0) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(
        [places[0].latitude, places[0].longitude],
        13
      );

      L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
        attribution: '&copy; Google Maps',
      }).addTo(mapRef.current);

      setTimeout(() => {
        if (mapRef.current) mapRef.current.invalidateSize();
      }, 200);
    }

    const map = mapRef.current;

    // Clear existing markers and routes
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });
    markersRef.current.clear();

    const markers: L.Marker[] = [];
    places.forEach((place, index) => {
      const isSelected = selectedPlaceId === place.placeId;
      const session = getSessionMeta(place.timeSlot, index, places.length);
      const order = place.orderInDay || index + 1;

      const markerHtml = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
          <div style="
            background: #1A1A1A;
            color: #FFFFFF;
            width: ${isSelected ? '38px' : '32px'};
            height: ${isSelected ? '38px' : '32px'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: ${isSelected ? '15px' : '13px'};
            border: 3px solid ${session.ringColor};
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            transition: all 0.2s ease;
          ">
            ${order}
          </div>
          <div style="
            position: absolute;
            bottom: -6px;
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 6px solid #1A1A1A;
          "></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-itinerary-marker',
        html: markerHtml,
        iconSize: [38, 44],
        iconAnchor: [19, 38],
      });

      const marker = L.marker([place.latitude, place.longitude], {
        icon: customIcon,
      }).addTo(map);

      const priceStr = place.priceEstimate > 0
        ? `${place.priceEstimate.toLocaleString('vi-VN')} đ`
        : 'Miễn phí';

      const popupHtml = `
        <div style="min-width: 220px; font-family: inherit; padding: 4px;">
          <div style="display: inline-block; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 9999px; background: ${session.tagBg}; color: ${session.color}; margin-bottom: 6px;">
            ${session.label} • ${place.estimatedTime || 'Tham quan'}
          </div>
          <div style="font-weight: 700; font-size: 14px; color: #1A1A1A; margin-bottom: 4px; line-height: 1.3;">
            ${order}. ${place.name}
          </div>
          <div style="font-size: 11px; color: #6B7280; margin-bottom: 8px;">
            Chi phí ước tính: <b>${priceStr}</b>
          </div>
          <button id="btn-map-dir-${place.placeId}" style="
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            width: 100%;
            padding: 8px 12px;
            background: #1A1A1A;
            color: #ffffff;
            border-radius: 8px;
            border: none;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
          ">
            🧭 Chỉ đường & Thời tiết
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-map-dir-${place.placeId}`);
        if (btn && onSelectPlace) {
          btn.onclick = () => onSelectPlace(place);
        }
      });

      markers.push(marker);
      markersRef.current.set(place.placeId, marker);
    });

    // Draw route line connecting places in order
    if (places.length > 1) {
      const routeCoordinates: [number, number][] = places.map((p) => [
        p.latitude,
        p.longitude,
      ]);

      L.polyline(routeCoordinates, {
        color: '#1A1A1A',
        weight: 3,
        opacity: 0.6,
        dashArray: '6, 8',
      }).addTo(map);
    }

    // Fit map bounds
    if (markers.length > 0 && !selectedPlaceId) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.15));
    }
  }, [places, selectedPlaceId, onSelectPlace]);

  // Handle selected place focus
  useEffect(() => {
    if (!selectedPlaceId || !mapRef.current) return;
    const marker = markersRef.current.get(selectedPlaceId);
    if (marker) {
      const latLng = marker.getLatLng();
      mapRef.current.setView(latLng, 15, { animate: true });
      marker.openPopup();
    }
  }, [selectedPlaceId]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[400px] md:h-[480px] bg-[#F5F5F4]"
      style={{ zIndex: 0 }}
    />
  );
}
