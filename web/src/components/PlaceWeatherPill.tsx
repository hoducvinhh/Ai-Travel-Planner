'use client';

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudRain,
  CloudLightning,
  Loader2,
  LucideIcon,
} from 'lucide-react';

interface PlaceWeatherPillProps {
  latitude: number;
  longitude: number;
}

function getWeatherInfo(code: number): { text: string; Icon: LucideIcon } {
  if (code === 0) return { text: 'Nắng trong', Icon: Sun };
  if (code === 1 || code === 2) return { text: 'Nắng nhẹ', Icon: CloudSun };
  if (code === 3) return { text: 'Nhiều mây', Icon: Cloud };
  if (code === 45 || code === 48) return { text: 'Sương mù', Icon: CloudFog };
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { text: 'Có mưa', Icon: CloudRain };
  if ([95, 96, 99].includes(code)) return { text: 'Giông bão', Icon: CloudLightning };
  return { text: 'Trời đẹp', Icon: CloudSun };
}

// Simple in-memory cache by lat/lng rounded to 2 decimals
const weatherCache: Record<string, { temp: number; text: string; Icon: LucideIcon; humidity: number }> = {};

export default function PlaceWeatherPill({ latitude, longitude }: PlaceWeatherPillProps) {
  const [weather, setWeather] = useState<{
    temp: number;
    text: string;
    Icon: LucideIcon;
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
              Icon: info.Icon,
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
      <Badge variant="secondary" className="gap-1 text-[11px] font-normal border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]">
        <Loader2 className="w-3 h-3 animate-spin text-[#0D9488]" />
        <span>Thời tiết...</span>
      </Badge>
    );
  }

  if (!weather) return null;

  const WeatherIcon = weather.Icon;

  return (
    <Badge
      variant="secondary"
      className="gap-1.5 text-[11px] font-medium border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] hover:bg-[#F0FDFA] hover:border-[#99F6E4] transition-colors"
      title={`Thời tiết hiện tại: ${weather.temp}°C, ${weather.text}, độ ẩm ${weather.humidity}%`}
    >
      <WeatherIcon className="w-3.5 h-3.5 text-[#0D9488]" />
      <span className="font-semibold">{weather.temp}°C</span>
      <span className="text-[#64748B]">({weather.text})</span>
    </Badge>
  );
}
