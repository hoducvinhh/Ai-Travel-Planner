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

export default function MapComponent({ places }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || places.length === 0) return;

    // Initialize map if not already created
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(
        [places[0].latitude, places[0].longitude],
        13
      );

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Clear existing markers and routes
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Add markers with custom numbered icons
    const markers: L.Marker[] = [];
    places.forEach((place, index) => {
      const numberIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 16px;
          border: 3px solid white;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        ">${index + 1}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([place.latitude, place.longitude], {
        icon: numberIcon,
      }).addTo(map);

      marker.bindPopup(`
        <div style="min-width: 200px;">
          <div style="font-weight: bold; margin-bottom: 4px; font-size: 14px;">
            ${index + 1}. ${place.name}
          </div>
          <div style="font-size: 12px; color: #64748b;">
            ${place.latitude.toFixed(4)}, ${place.longitude.toFixed(4)}
          </div>
        </div>
      `);

      markers.push(marker);
    });

    // Draw route line between places
    if (places.length > 1) {
      const routeCoordinates: [number, number][] = places.map((p) => [
        p.latitude,
        p.longitude,
      ]);

      L.polyline(routeCoordinates, {
        color: '#10b981',
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10',
      }).addTo(map);
    }

    // Fit map to show all markers
    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.1));
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [places]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[400px] md:h-[500px] bg-slate-900"
      style={{ zIndex: 0 }}
    />
  );
}
