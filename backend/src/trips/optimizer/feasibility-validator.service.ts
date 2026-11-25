import { Injectable, Logger } from '@nestjs/common';
import { RouteOptimizerService } from './route-optimizer.service';

export type TimeSlot = 'morning' | 'afternoon' | 'evening';

export interface PlaceForValidation {
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
}

export interface DayForValidation {
  dayNumber: number;
  date?: string;
  places: PlaceForValidation[];
  notes?: string;
}

export interface ValidationTripInput {
  totalBudget: number;
  daysCount: number;
  groupSize?: number;
  explicitPreferences?: string[];
}

export interface FeasibilityCriterion {
  score: number; // Thang 0 - 100
  weight: number; // Trọng số (ví dụ: 0.30)
  label: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  summary: string;
}

export interface FeasibilityWarning {
  type: 'CRITICAL' | 'WARNING' | 'TIP';
  category: 'geo' | 'time' | 'budget' | 'pref' | 'div';
  dayNumber?: number;
  message: string;
}

export interface FeasibilityDayDetail {
  dayNumber: number;
  placesCount: number;
  distanceKm: number;
  estimatedTransitTimeHours: number;
  dayCost: number;
  warnings: string[];
}

export interface FeasibilityReport {
  overallScore: number; // Overall Feasibility Score (OFS) 0 - 100
  rating: 'Rất khả thi' | 'Khả thi' | 'Cần cân nhắc' | 'Kém khả thi';
  metrics: {
    geo: FeasibilityCriterion;
    time: FeasibilityCriterion;
    budget: FeasibilityCriterion;
    preference: FeasibilityCriterion;
    diversity: FeasibilityCriterion;
  };
  warnings: FeasibilityWarning[];
  dayDetails: FeasibilityDayDetail[];
  totalDistanceKm: number;
  totalTransitTimeHours: number;
  evaluatedAt: string;
}

const NIGHTLIFE_KEYWORDS = new Set([
  'nightlife', 'bar', 'pub', 'club', 'chợ đêm', 'night market',
  'phố đi bộ', 'bia', 'cocktail', 'lounge', 'karaoke'
]);

const NATURE_TREKKING_KEYWORDS = new Set([
  'trekking', 'leo núi', 'hiking', 'nature', 'thiên nhiên', 'thác',
  'rừng', 'forest', 'mountain', 'cave', 'hang động', 'camping', 'cắm trại'
]);

@Injectable()
export class FeasibilityValidatorService {
  private readonly logger = new Logger(FeasibilityValidatorService.name);

  constructor(private readonly optimizer: RouteOptimizerService) {}

  /**
   * Tự động sửa lỗi vi phạm khung giờ và nhịp độ lịch trình (Local Spatial Repair)
   * Giúp tự động hoán đổi các điểm Nightlife vào ban đêm và Trekking vào ban ngày
   */
  autoRepairItinerary(days: DayForValidation[]): {
    repairedDays: DayForValidation[];
    repairCount: number;
  } {
    let repairCount = 0;
    const repairedDays = days.map((day) => {
      const places = [...(day.places || [])];
      if (places.length <= 1) return { ...day, places };

      for (let i = 0; i < places.length; i++) {
        const p = places[i];
        const cats = (p.categories || []).map((c) => c.toLowerCase());
        const isNightlife = cats.some((c) => NIGHTLIFE_KEYWORDS.has(c)) ||
          [...NIGHTLIFE_KEYWORDS].some((kw) => p.name.toLowerCase().includes(kw));
        const isTrekkingNature = cats.some((c) => NATURE_TREKKING_KEYWORDS.has(c)) ||
          [...NATURE_TREKKING_KEYWORDS].some((kw) => p.name.toLowerCase().includes(kw));

        // 1. Sửa lỗi Nightlife bị xếp vào morning / afternoon
        if (isNightlife && p.timeSlot !== 'evening') {
          // Tìm 1 điểm ở buổi evening không phải nightlife để đổi chỗ
          const eveningCandidateIdx = places.findIndex(
            (other, idx) =>
              idx !== i &&
              other.timeSlot === 'evening' &&
              !(other.categories || []).some((c) => NIGHTLIFE_KEYWORDS.has(c.toLowerCase())),
          );

          if (eveningCandidateIdx !== -1) {
            const tempSlot = p.timeSlot;
            p.timeSlot = 'evening';
            places[eveningCandidateIdx].timeSlot = tempSlot;
            repairCount++;
            this.logger.log(
              `[AutoRepair] Hoán đổi slot buổi tối cho điểm nightlife "${p.name}" với "${places[eveningCandidateIdx].name}"`,
            );
          } else {
            p.timeSlot = 'evening';
            repairCount++;
          }
        }

        // 2. Sửa lỗi Trekking bị xếp vào evening
        if (isTrekkingNature && p.timeSlot === 'evening') {
          // Tìm 1 điểm ở morning / afternoon để đổi chỗ
          const dayCandidateIdx = places.findIndex(
            (other, idx) =>
              idx !== i &&
              (other.timeSlot === 'morning' || other.timeSlot === 'afternoon') &&
              !(other.categories || []).some((c) => NATURE_TREKKING_KEYWORDS.has(c.toLowerCase())),
          );

          if (dayCandidateIdx !== -1) {
            const tempSlot = places[dayCandidateIdx].timeSlot;
            places[dayCandidateIdx].timeSlot = 'evening';
            p.timeSlot = tempSlot;
            repairCount++;
            this.logger.log(
              `[AutoRepair] Hoán đổi slot ban ngày cho điểm trekking "${p.name}" với "${places[dayCandidateIdx].name}"`,
            );
          } else {
            p.timeSlot = 'afternoon';
            repairCount++;
          }
        }
      }

      // Sắp xếp lại thứ tự theo thứ tự slot (morning -> afternoon -> evening)
      const SLOT_WEIGHT: Record<TimeSlot, number> = { morning: 1, afternoon: 2, evening: 3 };
      places.sort((a, b) => (SLOT_WEIGHT[a.timeSlot] || 2) - (SLOT_WEIGHT[b.timeSlot] || 2));
      places.forEach((p, idx) => {
        p.orderInDay = idx + 1;
      });

      return { ...day, places };
    });

    return { repairedDays, repairCount };
  }

  /**
   * Đánh giá tính khả thi 5 chiều của lịch trình du lịch
   */
  validateItinerary(
    days: DayForValidation[],
    input: ValidationTripInput,
  ): FeasibilityReport {
    const daysCount = Math.max(1, input.daysCount || days.length || 1);
    const dailyBudget = input.totalBudget > 0 ? input.totalBudget / daysCount : 0;
    const explicitPrefs = (input.explicitPreferences || []).map((p) => p.toLowerCase());

    const warnings: FeasibilityWarning[] = [];
    const dayDetails: FeasibilityDayDetail[] = [];

    let totalTripDistanceKm = 0;
    let totalTripTransitHours = 0;

    // --- 1. Chỉ số Khả thi Địa lý & Di chuyển (S_geo) ---
    // d_k: khoảng cách giữa 2 điểm liên tiếp
    // t_transit = d_k / 25 km/h + 0.15h (9 phút đỗ/dừng chờ)
    let totalLegsCount = 0;
    let sumGeoLegScores = 0;

    // --- 2. Chỉ số Khả thi Khung giờ & Nhịp độ (S_time) ---
    let sumTimeDayScores = 0;

    // --- 3. Chỉ số Phù hợp Ngân sách (S_budget) ---
    let sumBudgetDayScores = 0;

    // --- 5. Chỉ số Đa dạng Trải nghiệm (S_div) ---
    let sumDivDayScores = 0;

    // Duyệt qua từng ngày để tính toán
    for (const day of days) {
      const places = day.places || [];
      const dayWarnings: string[] = [];
      let dayDistanceKm = 0;
      let dayCost = 0;

      // 1. Phân tích chặng di chuyển trong ngày
      if (places.length >= 2) {
        for (let i = 0; i < places.length - 1; i++) {
          const p1 = places[i];
          const p2 = places[i + 1];
          const d_k = this.optimizer.calculateHaversineDistanceKm(
            p1.latitude,
            p1.longitude,
            p2.latitude,
            p2.longitude,
          );

          dayDistanceKm += d_k;
          totalLegsCount++;

          let legScore = 100;
          if (d_k <= 12) {
            legScore = 100;
          } else if (d_k <= 25) {
            legScore = Math.max(0, 100 - (d_k - 12) * 3);
          } else {
            // d_k > 25km: trừ 50 điểm
            legScore = Math.max(0, 50 - (d_k - 25) * 2);
          }
          sumGeoLegScores += legScore;

          // Cảnh báo khoảng cách
          if (d_k > 40) {
            const warnMsg = `Ngày ${day.dayNumber}: Chặng di chuyển giữa "${p1.name}" và "${p2.name}" dài tới ${d_k.toFixed(1)} km (> 40km), vượt ngưỡng an toàn trong ngày.`;
            dayWarnings.push(warnMsg);
            warnings.push({
              type: 'CRITICAL',
              category: 'geo',
              dayNumber: day.dayNumber,
              message: warnMsg,
            });
          } else if (d_k > 25) {
            const tTransitMin = Math.round((d_k / 25 + 0.15) * 60);
            const warnMsg = `Ngày ${day.dayNumber}: Chặng giữa "${p1.name}" và "${p2.name}" cách nhau ${d_k.toFixed(1)} km (dự kiến mất ~${tTransitMin} phút di chuyển).`;
            dayWarnings.push(warnMsg);
            warnings.push({
              type: 'WARNING',
              category: 'geo',
              dayNumber: day.dayNumber,
              message: warnMsg,
            });
          }
        }
      } else if (places.length === 1) {
        // Chỉ có 1 điểm trong ngày
        sumGeoLegScores += 100;
        totalLegsCount++;
      }

      const dayTransitHours = dayDistanceKm > 0 ? dayDistanceKm / 25 + (places.length - 1) * 0.15 : 0;
      totalTripDistanceKm += dayDistanceKm;
      totalTripTransitHours += dayTransitHours;

      // 2. Phân tích Khung giờ & Nhịp độ (S_time)
      let dayTimeScore = 100;
      const N = places.length;

      if (N > 5) {
        const excess = N - 5;
        dayTimeScore -= excess * 15;
        const msg = `Ngày ${day.dayNumber}: Lịch trình có ${N} địa điểm, có thể gây quá tải thời gian (lý tưởng: 2 - 4 điểm/ngày).`;
        dayWarnings.push(msg);
        warnings.push({
          type: 'WARNING',
          category: 'time',
          dayNumber: day.dayNumber,
          message: msg,
        });
      } else if (N < 2 && daysCount > 1) {
        dayTimeScore -= 10;
      }

      // Kiểm tra logic buổi
      for (const p of places) {
        const cats = (p.categories || []).map((c) => c.toLowerCase());
        const isNightlife = cats.some((c) => NIGHTLIFE_KEYWORDS.has(c)) ||
          [...NIGHTLIFE_KEYWORDS].some((kw) => p.name.toLowerCase().includes(kw));
        const isTrekkingNature = cats.some((c) => NATURE_TREKKING_KEYWORDS.has(c)) ||
          [...NATURE_TREKKING_KEYWORDS].some((kw) => p.name.toLowerCase().includes(kw));

        if (isNightlife && p.timeSlot !== 'evening') {
          dayTimeScore -= 15;
          const msg = `Ngày ${day.dayNumber}: Điểm "${p.name}" (hoạt động ban đêm) đang được xếp vào buổi ${p.timeSlot === 'morning' ? 'sáng' : 'chiều'}, nên chuyển sang buổi tối.`;
          dayWarnings.push(msg);
          warnings.push({
            type: 'WARNING',
            category: 'time',
            dayNumber: day.dayNumber,
            message: msg,
          });
        }

        if (isTrekkingNature && p.timeSlot === 'evening') {
          dayTimeScore -= 15;
          const msg = `Ngày ${day.dayNumber}: Hoạt động trải nghiệm thiên nhiên/trekking tại "${p.name}" được xếp vào buổi tối, tiềm ẩn rủi ro thiếu sáng và an toàn.`;
          dayWarnings.push(msg);
          warnings.push({
            type: 'WARNING',
            category: 'time',
            dayNumber: day.dayNumber,
            message: msg,
          });
        }

        // Tính chi phí
        dayCost += Number(p.priceEstimate) || 0;
      }
      dayTimeScore = Math.max(0, Math.min(100, dayTimeScore));
      sumTimeDayScores += dayTimeScore;

      // 3. Phù hợp Ngân sách (S_budget)
      let dayBudgetScore = 100;
      if (dailyBudget > 0) {
        if (dayCost <= dailyBudget) {
          dayBudgetScore = 100;
        } else {
          const overRatio = (dayCost - dailyBudget) / dailyBudget;
          dayBudgetScore = Math.max(0, 100 - Math.round(overRatio * 100));

          if (overRatio > 0.30) {
            const overPercent = Math.round(overRatio * 100);
            const msg = `Ngày ${day.dayNumber}: Dự kiến chi phí vé/dịch vụ (${dayCost.toLocaleString('vi-VN')} đ) vượt ${overPercent}% mức ngân sách ngày (${dailyBudget.toLocaleString('vi-VN')} đ).`;
            dayWarnings.push(msg);
            warnings.push({
              type: 'WARNING',
              category: 'budget',
              dayNumber: day.dayNumber,
              message: msg,
            });
          }
        }
      }
      sumBudgetDayScores += dayBudgetScore;

      // 5. Đa dạng Trải nghiệm (S_div)
      // Tránh việc xếp liên tiếp > 2 điểm cùng thể loại trong ngày
      let dayDivScore = 100;
      if (places.length >= 3) {
        for (let i = 0; i <= places.length - 3; i++) {
          const c0 = places[i].categories || [];
          const c1 = places[i + 1].categories || [];
          const c2 = places[i + 2].categories || [];

          // Tìm thể loại chung giữa 3 điểm liên tiếp
          const intersection = c0.filter(
            (c) => c1.includes(c) && c2.includes(c) && !['tourist_attraction', 'point_of_interest'].includes(c)
          );

          if (intersection.length > 0) {
            dayDivScore -= 15;
            const msg = `Ngày ${day.dayNumber}: Có 3 điểm liên tiếp cùng nhóm trải nghiệm (${intersection[0]}: "${places[i].name}", "${places[i+1].name}", "${places[i+2].name}"). Nên đa dạng hóa các hoạt động.`;
            dayWarnings.push(msg);
            warnings.push({
              type: 'TIP',
              category: 'div',
              dayNumber: day.dayNumber,
              message: msg,
            });
          }
        }
      }
      dayDivScore = Math.max(0, Math.min(100, dayDivScore));
      sumDivDayScores += dayDivScore;

      dayDetails.push({
        dayNumber: day.dayNumber,
        placesCount: places.length,
        distanceKm: Math.round(dayDistanceKm * 10) / 10,
        estimatedTransitTimeHours: Math.round(dayTransitHours * 10) / 10,
        dayCost,
        warnings: dayWarnings,
      });
    }

    // --- Tổng hợp điểm 5 chiều ---

    // 1. S_geo
    const s_geo = totalLegsCount > 0
      ? Math.round(sumGeoLegScores / totalLegsCount)
      : 100;

    // 2. S_time
    const s_time = days.length > 0
      ? Math.round(sumTimeDayScores / days.length)
      : 100;

    // 3. S_budget
    const s_budget = days.length > 0
      ? Math.round(sumBudgetDayScores / days.length)
      : 100;

    // 4. S_pref: Tỷ lệ các điểm trùng khớp với explicitPreferences của người dùng
    let s_pref = 100;
    const allPlaces = days.flatMap((d) => d.places || []);
    if (explicitPrefs.length > 0 && allPlaces.length > 0) {
      let matchedCount = 0;
      for (const p of allPlaces) {
        const placeCats = (p.categories || []).map((c) => c.toLowerCase());
        const placeName = p.name.toLowerCase();
        const hasMatch = explicitPrefs.some(
          (pref) => placeCats.some((c) => c.includes(pref) || pref.includes(c)) || placeName.includes(pref),
        );
        if (hasMatch) matchedCount++;
      }
      s_pref = Math.round((matchedCount / allPlaces.length) * 100);
      if (s_pref < 50) {
        warnings.push({
          type: 'TIP',
          category: 'pref',
          message: `Chỉ có ${s_pref}% điểm tham quan khớp với sở thích chọn lọc (${explicitPrefs.join(', ')}). Có thể tùy chỉnh thêm các điểm theo gu của bạn.`,
        });
      }
    }

    // 5. S_div
    const s_div = days.length > 0
      ? Math.round(sumDivDayScores / days.length)
      : 100;

    // --- Tính OFS (Overall Feasibility Score) ---
    // OFS = 0.30 * S_geo + 0.25 * S_time + 0.20 * S_budget + 0.15 * S_pref + 0.10 * S_div
    const ofsRaw =
      0.30 * s_geo +
      0.25 * s_time +
      0.20 * s_budget +
      0.15 * s_pref +
      0.10 * s_div;

    const overallScore = Math.round(ofsRaw * 10) / 10;

    // Phân loại rating
    let rating: FeasibilityReport['rating'] = 'Khả thi';
    if (overallScore >= 85) {
      rating = 'Rất khả thi';
    } else if (overallScore >= 70) {
      rating = 'Khả thi';
    } else if (overallScore >= 50) {
      rating = 'Cần cân nhắc';
    } else {
      rating = 'Kém khả thi';
    }

    const getStatus = (score: number): FeasibilityCriterion['status'] => {
      if (score >= 85) return 'excellent';
      if (score >= 70) return 'good';
      if (score >= 50) return 'warning';
      return 'critical';
    };

    return {
      overallScore,
      rating,
      metrics: {
        geo: {
          score: s_geo,
          weight: 0.30,
          label: 'Khoảng cách & Cung đường di chuyển',
          status: getStatus(s_geo),
          summary: `Tổng chặng ${totalTripDistanceKm.toFixed(1)} km (~${totalTripTransitHours.toFixed(1)} giờ di chuyển).`,
        },
        time: {
          score: s_time,
          weight: 0.25,
          label: 'Nhịp độ & Khung giờ hoạt động',
          status: getStatus(s_time),
          summary: `Phân bổ ${days.length} ngày, trung bình ${(allPlaces.length / Math.max(1, days.length)).toFixed(1)} điểm/ngày.`,
        },
        budget: {
          score: s_budget,
          weight: 0.20,
          label: 'Phù hợp ngân sách dự kiến',
          status: getStatus(s_budget),
          summary: dailyBudget > 0
            ? `Ngân sách phân bổ ${Math.round(dailyBudget).toLocaleString('vi-VN')} đ/ngày.`
            : 'Ngân sách linh hoạt theo sở thích.',
        },
        preference: {
          score: s_pref,
          weight: 0.15,
          label: 'Độ khớp sở thích cá nhân',
          status: getStatus(s_pref),
          summary: explicitPrefs.length > 0
            ? `${s_pref}% số điểm khớp với gu du lịch đã chọn.`
            : 'Được gợi ý theo các danh lam đặc sắc nhất.',
        },
        diversity: {
          score: s_div,
          weight: 0.10,
          label: 'Đa dạng hóa trải nghiệm',
          status: getStatus(s_div),
          summary: s_div >= 85
            ? 'Cân bằng tốt giữa các hoạt động văn hóa, ẩm thực và cảnh quan.'
            : 'Có một số hoạt động tương đồng được xếp gần nhau.',
        },
      },
      warnings,
      dayDetails,
      totalDistanceKm: Math.round(totalTripDistanceKm * 10) / 10,
      totalTransitTimeHours: Math.round(totalTripTransitHours * 10) / 10,
      evaluatedAt: new Date().toISOString(),
    };
  }
}
