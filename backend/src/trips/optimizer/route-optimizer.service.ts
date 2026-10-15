import { Injectable, Logger } from '@nestjs/common';

export type TimeSlot = 'morning' | 'afternoon' | 'evening';

export interface PlaceForOptimization {
  placeId: string;
  name: string;
  description?: string;
  categories?: string[];
  estimatedTime?: string;
  orderInDay: number;
  latitude: number;
  longitude: number;
  priceEstimate?: number;
  timeSlot: TimeSlot;
  province?: string;
  imageUrl?: string | null;
}

export interface DayOptimizationStats {
  dayNumber: number;
  originalDistanceKm: number;
  optimizedDistanceKm: number;
  savedDistanceKm: number;
  savedPercentage: number;
}

export interface TripOptimizationStats {
  totalOriginalDistanceKm: number;
  totalOptimizedDistanceKm: number;
  totalSavedDistanceKm: number;
  totalSavedPercentage: number;
  days: DayOptimizationStats[];
}

export interface OptimizeDayResult<T extends PlaceForOptimization = PlaceForOptimization> {
  dayNumber: number;
  places: T[];
  stats: DayOptimizationStats;
}

export interface OptimizeTripResult<T extends PlaceForOptimization = PlaceForOptimization> {
  days: Array<{
    dayNumber: number;
    date?: string;
    places: T[];
    notes?: string;
    optimizationStats?: DayOptimizationStats;
  }>;
  stats: TripOptimizationStats;
}

const SLOT_ORDER: Record<TimeSlot, number> = {
  morning: 1,
  afternoon: 2,
  evening: 3,
};

@Injectable()
export class RouteOptimizerService {
  private readonly logger = new Logger(RouteOptimizerService.name);

  /**
   * Tính khoảng cách Haversine giữa 2 điểm toạ độ (km)
   */
  calculateHaversineDistanceKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    if (lat1 === lat2 && lon1 === lon2) return 0;

    const R = 6371; // Bán kính Trái Đất (km)
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const rLat1 = toRad(lat1);
    const rLat2 = toRad(lat2);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Tính tổng quãng đường di chuyển của một chuỗi địa điểm theo thứ tự (km)
   */
  calculateTotalDistanceKm(places: PlaceForOptimization[]): number {
    if (!places || places.length <= 1) return 0;

    let total = 0;
    for (let i = 0; i < places.length - 1; i++) {
      total += this.calculateHaversineDistanceKm(
        places[i].latitude,
        places[i].longitude,
        places[i + 1].latitude,
        places[i + 1].longitude,
      );
    }
    return Math.round(total * 100) / 100;
  }

  /**
   * Kiểm tra tính hợp lệ của chuỗi địa điểm với ràng buộc thứ tự buổi (morning <= afternoon <= evening)
   */
  isTimeSlotValid(places: PlaceForOptimization[]): boolean {
    for (let i = 0; i < places.length - 1; i++) {
      const currentSlot = SLOT_ORDER[places[i].timeSlot] || 2;
      const nextSlot = SLOT_ORDER[places[i + 1].timeSlot] || 2;
      if (currentSlot > nextSlot) {
        return false;
      }
    }
    return true;
  }

  /**
   * Tối ưu hóa thứ tự địa điểm trong 1 ngày bằng thuật toán TSPTW + 2-Opt Heuristic
   */
  optimizeDayRoute<T extends PlaceForOptimization>(
    places: T[],
    dayNumber: number = 1,
  ): OptimizeDayResult<T> {
    if (!places || places.length <= 2) {
      const dist = this.calculateTotalDistanceKm(places);
      const reindexed = places.map((p, idx) => ({ ...p, orderInDay: idx + 1 }));
      return {
        dayNumber,
        places: reindexed,
        stats: {
          dayNumber,
          originalDistanceKm: dist,
          optimizedDistanceKm: dist,
          savedDistanceKm: 0,
          savedPercentage: 0,
        },
      };
    }

    // 1. Lưu lại khoảng cách ban đầu
    const originalDistance = this.calculateTotalDistanceKm(places);

    // 2. Nhóm hoặc sắp xếp sơ bộ ban đầu đảm bảo thỏa mãn ràng buộc buổi
    let bestRoute = [...places].sort((a, b) => {
      const orderA = SLOT_ORDER[a.timeSlot] || 2;
      const orderB = SLOT_ORDER[b.timeSlot] || 2;
      return orderA - orderB;
    });

    let bestDistance = this.calculateTotalDistanceKm(bestRoute);

    // 3. Vòng lặp cải tiến cục bộ 2-Opt (Local Search)
    let improved = true;
    let iteration = 0;
    const maxIterations = 50;

    while (improved && iteration < maxIterations) {
      improved = false;
      iteration++;

      for (let i = 0; i < bestRoute.length - 1; i++) {
        for (let j = i + 1; j < bestRoute.length; j++) {
          // Thử đảo đoạn con [i..j]
          const candidateRoute = this.twoOptSwap(bestRoute, i, j);

          // Ràng buộc thời gian (TSPTW): Morning <= Afternoon <= Evening
          if (this.isTimeSlotValid(candidateRoute)) {
            const candidateDistance = this.calculateTotalDistanceKm(candidateRoute);
            if (candidateDistance < bestDistance - 0.001) {
              bestRoute = candidateRoute;
              bestDistance = candidateDistance;
              improved = true;
              break;
            }
          }
        }
        if (improved) break;
      }
    }

    // Đánh lại số thứ tự trong ngày
    const optimizedPlaces = bestRoute.map((p, idx) => ({
      ...p,
      orderInDay: idx + 1,
    }));

    const finalDistance = Math.round(bestDistance * 100) / 100;
    const initialDist = Math.round(originalDistance * 100) / 100;
    const savedDist = Math.max(0, Math.round((initialDist - finalDistance) * 100) / 100);
    const savedPct =
      initialDist > 0 ? Math.round((savedDist / initialDist) * 1000) / 10 : 0;

    return {
      dayNumber,
      places: optimizedPlaces,
      stats: {
        dayNumber,
        originalDistanceKm: initialDist,
        optimizedDistanceKm: finalDistance,
        savedDistanceKm: savedDist,
        savedPercentage: savedPct,
      },
    };
  }

  /**
   * Phép biến đổi 2-Opt Swap: đảo ngược hành trình đoạn con giữa i và j
   */
  private twoOptSwap<T>(route: T[], i: number, j: number): T[] {
    const result = route.slice(0, i);
    const reversedSegment = route.slice(i, j + 1).reverse();
    result.push(...reversedSegment);
    result.push(...route.slice(j + 1));
    return result;
  }

  /**
   * Tối ưu hóa toàn bộ chuyến đi nhiều ngày (TSPTW cho từng ngày & tính metric toàn cục)
   */
  optimizeTripDays<T extends PlaceForOptimization>(
    days: Array<{
      dayNumber: number;
      date?: string;
      places: T[];
      notes?: string;
      optimizationStats?: DayOptimizationStats;
    }>,
  ): OptimizeTripResult<T> {
    const optimizedDays = [];
    const dayStats: DayOptimizationStats[] = [];

    let totalOriginal = 0;
    let totalOptimized = 0;

    for (const day of days) {
      const optResult = this.optimizeDayRoute(day.places || [], day.dayNumber);
      dayStats.push(optResult.stats);
      totalOriginal += optResult.stats.originalDistanceKm;
      totalOptimized += optResult.stats.optimizedDistanceKm;

      optimizedDays.push({
        ...day,
        places: optResult.places,
        optimizationStats: optResult.stats,
      });
    }

    totalOriginal = Math.round(totalOriginal * 100) / 100;
    totalOptimized = Math.round(totalOptimized * 100) / 100;
    const totalSaved = Math.max(0, Math.round((totalOriginal - totalOptimized) * 100) / 100);
    const totalSavedPct =
      totalOriginal > 0 ? Math.round((totalSaved / totalOriginal) * 1000) / 10 : 0;

    const stats: TripOptimizationStats = {
      totalOriginalDistanceKm: totalOriginal,
      totalOptimizedDistanceKm: totalOptimized,
      totalSavedDistanceKm: totalSaved,
      totalSavedPercentage: totalSavedPct,
      days: dayStats,
    };

    return {
      days: optimizedDays,
      stats,
    };
  }

  /**
   * Gom cụm không gian (Spatial Clustering) phân bổ địa điểm vào các ngày.
   * Hỗ trợ đặc biệt cho Tour Liên Tỉnh: nhóm các ngày theo cụm tỉnh trước để triệt tiêu di chuyển zíc-zắc.
   */
  clusterPlacesIntoDays<T extends PlaceForOptimization>(
    places: T[],
    daysCount: number,
    destinationProvinces?: string[],
  ): T[][] {
    if (daysCount <= 1 || places.length <= daysCount) {
      return [places];
    }

    // Trường hợp 1: Tour Liên Tỉnh có từ 2 tỉnh trở lên
    if (destinationProvinces && destinationProvinces.length > 1) {
      return this.clusterMultiProvincePlaces(places, daysCount, destinationProvinces);
    }

    // Trường hợp 2: Đơn tỉnh - K-Means Clustering theo toạ độ địa lý (Lat, Lon)
    return this.geographicKMeansClustering(places, daysCount);
  }

  /**
   * Phân bổ cụm cho tour liên tỉnh: ngày 1..d1 ở Tỉnh 1, ngày d1+1..d2 ở Tỉnh 2,...
   */
  private clusterMultiProvincePlaces<T extends PlaceForOptimization>(
    places: T[],
    daysCount: number,
    provinces: string[],
  ): T[][] {
    const provGroups: Record<string, T[]> = {};
    provinces.forEach((p) => {
      provGroups[p.toLowerCase().trim()] = [];
    });

    const otherPlaces: T[] = [];

    // Nhóm theo tỉnh
    for (const place of places) {
      let matched = false;
      const placeProv = (place.province || '').toLowerCase();
      for (const p of provinces) {
        const pClean = p.toLowerCase().trim();
        if (placeProv.includes(pClean) || place.name.toLowerCase().includes(pClean)) {
          provGroups[pClean].push(place);
          matched = true;
          break;
        }
      }
      if (!matched) {
        otherPlaces.push(place);
      }
    }

    // Chia đều số ngày cho các tỉnh
    const daysPerProvince = Math.max(1, Math.floor(daysCount / provinces.length));
    const dayBuckets: T[][] = Array.from({ length: daysCount }, () => []);

    let currentDayIdx = 0;
    provinces.forEach((p, pIdx) => {
      const pClean = p.toLowerCase().trim();
      const pPlaces = provGroups[pClean];
      const isLast = pIdx === provinces.length - 1;
      const provDays = isLast ? daysCount - currentDayIdx : daysPerProvince;

      // Gom cụm K-Means nội bộ trong tỉnh đó cho provDays ngày
      const subClusters = this.geographicKMeansClustering(pPlaces, Math.max(1, provDays));
      for (let s = 0; s < provDays && currentDayIdx < daysCount; s++) {
        if (subClusters[s]) {
          dayBuckets[currentDayIdx].push(...subClusters[s]);
        }
        currentDayIdx++;
      }
    });

    // Phân bổ nốt các điểm còn sót (nếu có) vào các ngày ít điểm nhất
    for (const rem of otherPlaces) {
      let minBucket = dayBuckets[0];
      for (const bucket of dayBuckets) {
        if (bucket.length < minBucket.length) {
          minBucket = bucket;
        }
      }
      minBucket.push(rem);
    }

    return dayBuckets;
  }

  /**
   * Geographic K-Means Clustering trên toạ độ Lat/Lon
   */
  private geographicKMeansClustering<T extends PlaceForOptimization>(
    places: T[],
    k: number,
  ): T[][] {
    if (places.length <= k) {
      const result: T[][] = Array.from({ length: k }, () => []);
      places.forEach((p, i) => result[i % k].push(p));
      return result;
    }

    // Khởi tạo tâm cụm K-Means++
    const centroids: { lat: number; lon: number }[] = [];
    centroids.push({ lat: places[0].latitude, lon: places[0].longitude });

    for (let c = 1; c < k; c++) {
      let maxDist = -1;
      let farthestPlace = places[0];

      for (const p of places) {
        let minDistToCentroid = Infinity;
        for (const cent of centroids) {
          const d = this.calculateHaversineDistanceKm(p.latitude, p.longitude, cent.lat, cent.lon);
          if (d < minDistToCentroid) minDistToCentroid = d;
        }
        if (minDistToCentroid > maxDist) {
          maxDist = minDistToCentroid;
          farthestPlace = p;
        }
      }
      centroids.push({ lat: farthestPlace.latitude, lon: farthestPlace.longitude });
    }

    let assignments: number[] = new Array(places.length).fill(0);
    let changed = true;
    let iteration = 0;

    while (changed && iteration < 20) {
      changed = false;
      iteration++;

      // Gán từng điểm vào tâm cụm gần nhất
      for (let i = 0; i < places.length; i++) {
        const p = places[i];
        let minDist = Infinity;
        let nearestCluster = 0;

        for (let c = 0; c < k; c++) {
          const d = this.calculateHaversineDistanceKm(
            p.latitude,
            p.longitude,
            centroids[c].lat,
            centroids[c].lon,
          );
          if (d < minDist) {
            minDist = d;
            nearestCluster = c;
          }
        }

        if (assignments[i] !== nearestCluster) {
          assignments[i] = nearestCluster;
          changed = true;
        }
      }

      // Cập nhật lại tâm cụm
      for (let c = 0; c < k; c++) {
        const clusterPlaces = places.filter((_, idx) => assignments[idx] === c);
        if (clusterPlaces.length > 0) {
          const avgLat =
            clusterPlaces.reduce((sum, p) => sum + p.latitude, 0) / clusterPlaces.length;
          const avgLon =
            clusterPlaces.reduce((sum, p) => sum + p.longitude, 0) / clusterPlaces.length;
          centroids[c] = { lat: avgLat, lon: avgLon };
        }
      }
    }

    // Nhóm thành kết quả mảng K ngày
    const clusters: T[][] = Array.from({ length: k }, () => []);
    places.forEach((p, idx) => {
      clusters[assignments[idx]].push(p);
    });

    // Cân bằng cụm nếu có cụm rỗng
    for (let c = 0; c < k; c++) {
      if (clusters[c].length === 0) {
        // Lấy 1 điểm từ cụm có nhiều điểm nhất
        let maxCluster = clusters[0];
        for (const cl of clusters) {
          if (cl.length > maxCluster.length) maxCluster = cl;
        }
        if (maxCluster.length > 1) {
          clusters[c].push(maxCluster.pop()!);
        }
      }
    }

    return clusters;
  }
}
