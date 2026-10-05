'use client';

import React, { useEffect, useState } from 'react';
import { CloudSun, Droplets, Loader2 } from 'lucide-react';

interface PlaceWeatherPillProps {
  latitude: number;
  longitude: number;
}

function getWeatherInfo(code: number): { text: string; icon: string } {
  if (code === 0) return { text: 'Nắng trong', icon: '☀️' };
  if (code === 1 || code === 2) return { text: 'Nắng nhẹ', icon: '🌤️' };
  if (code === 3) return { text: 'Nhiều mây', icon: '⛅' };
  if (code === 45 || code === 48) return { text: 'Sương mù', icon: '🌫️' };
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { text: 'Có mưa', icon: '🌧️' };
  if ([95, 96, 99].includes(code)) return { text: 'Giông bão', icon: '⛈️' };
  return { text: 'Trời đẹp', icon: '🌤️' };
}

// Simple in-memory cache by lat/lng rounded to 2 decimals
const weatherCache: Record<string, { temp: number; text: string; icon: string; humidity: number }> = {};

export default function PlaceWeatherPill({ latitude, longitude }: PlaceWeatherPillProps) {
  const [weather, setWeather] = useState<{
    temp: number;
    text: string;
    icon: string;
    humidity: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      setLoading(false);
      return;
    }

    const cacheKey = `${latitude.toFixed(2)}_${longitude.toFixed(2)}`;
    if (weatherCache[cacheKey]) {
      setWeather(weatherCache[cacheKey]);
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchWeather() {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=Asia%2FBangkok`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.current && isMounted) {
            const info = getWeatherInfo(data.current.weather_code);
            const wData = {
              temp: Math.round(data.current.temperature_2m),
              text: info.text,
              icon: info.icon,
              humidity: data.current.relative_humidity_2m,
            };
            weatherCache[cacheKey] = wData;
            setWeather(wData);
          }
        }
      } catch (err) {
        console.error('Error fetching weather pill:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchWeather();

    return () => {
      isMounted = false;
    };
  }, [latitude, longitude]);

  if (loading) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400">
        <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
        <span>Thời tiết...</span>
      </span>
    );
  }

  if (!weather) return null;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[11px] font-medium shadow-sm"
      title={`Thời tiết hiện tại: ${weather.temp}°C, ${weather.text}, độ ẩm ${weather.humidity}%`}
    >
      <span>{weather.icon}</span>
      <span className="font-bold">{weather.temp}°C</span>
      <span className="text-amber-200/80">({weather.text})</span>
    </span>
  );
}
