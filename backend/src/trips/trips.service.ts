import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../gemini/gemini.service';
import { RecommendationService } from '../recommendation/recommendation.service';
import {
  RouteOptimizerService,
  DayOptimizationStats,
  TripOptimizationStats,
} from './optimizer/route-optimizer.service';

export interface CreateTripDto {
  userId: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  budgetPerPerson: number;
  groupSize: number;
  preferences?: string[];
}

export type TimeSlot = 'morning' | 'afternoon' | 'evening';

export interface TripItinerary {
  days: DayPlan[];
  summary: string;
  totalEstimatedCost: number;
  optimizationStats?: TripOptimizationStats;
}

export interface DayPlan {
  dayNumber: number;
  date: string;
  places: PlaceInItinerary[];
  notes?: string;
  optimizationStats?: DayOptimizationStats;
}

export interface PlaceInItinerary {
  placeId: string;
  name: string;
  description: string;
  categories: string[];
  estimatedTime: string;
  orderInDay: number;
  latitude: number;
  longitude: number;
  priceEstimate: number;
  timeSlot: TimeSlot;
  province?: string;
}

@Injectable()
export class TripsService {
  private readonly logger = new Logger(TripsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gemini: GeminiService,
    private readonly recommendation: RecommendationService,
    private readonly optimizer: RouteOptimizerService,
  ) {}

  async createTrip(dto: CreateTripDto) {
    this.logger.log(`Creating trip for user ${dto.userId} to ${dto.destination}`);

    // Calculate days
    const diffDays = Math.ceil(
      (new Date(dto.endDate).getTime() - new Date(dto.startDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const days = Math.max(1, diffDays);

    // Create trip record
    const trip = await this.prisma.trip.create({
      data: {
        userId: dto.userId,
        destination: dto.destination,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        budgetPerPerson: dto.budgetPerPerson,
        groupSize: dto.groupSize,
        status: 'DRAFT',
      },
    });

    // Generate itinerary
    try {
      const itinerary = await this.generateItinerary(trip.id, dto, days);

      // Update trip with itinerary
      await this.prisma.trip.update({
        where: { id: trip.id },
        data: {
          itinerary: itinerary as any,
          status: 'GENERATED',
        },
      });

      return {
        ...trip,
        itinerary,
      };
    } catch (error: any) {
      this.logger.error(`Failed to generate itinerary: ${error?.message || 'Unknown error'}`);
      throw error;
    }
  }

  async generateItinerary(
    tripId: string,
    dto: CreateTripDto,
    days: number,
  ): Promise<TripItinerary> {
    this.logger.log(`Generating itinerary for trip ${tripId}`);

    const startDate = new Date(dto.startDate);
    const monthOfYear = startDate.getMonth() + 1;
    const neededCandidates = Math.max(30, days * 6);

    // Step 1: Get recommendations (with automatic fallback to database popularity)
    let placeIds: string[] = [];
    try {
      const recommendations = await this.recommendation.getRecommendations({
        userId: dto.userId,
        destination: dto.destination,
        budgetPerPerson: dto.budgetPerPerson,
        days,
        groupSize: dto.groupSize,
        monthOfYear,
        explicitPreferences: dto.preferences || [],
      });
      placeIds = recommendations?.placeIds || [];
    } catch (recError: any) {
      this.logger.warn(
        `Recommendation service call failed (${recError?.message}). Using direct database fallback.`,
      );
    }

    // Step 2: Fetch place details from database
    let places: any[] = [];
    if (placeIds.length > 0) {
      const fetchedPlaces = await this.prisma.place.findMany({
        where: {
          id: {
            in: placeIds.slice(0, neededCandidates),
          },
        },
      });

      // Preserve the ranked order from recommendations
      const placeMap = new Map(fetchedPlaces.map((p) => [p.id, p]));
      places = placeIds
        .slice(0, neededCandidates)
        .map((id) => placeMap.get(id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p));
    }

    // Parse multi-province destinations if applicable
    const provinces = dto.destination
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    // Fallback: If recommendation returned insufficient places, query database directly
    const minRequiredPlaces = Math.min(25, days * 3);
    if (places.length < minRequiredPlaces) {
      this.logger.warn(
        `Insufficient candidate places (${places.length}). Querying popular places from database for destination: ${dto.destination}`,
      );

      let fallbackPlaces = await this.prisma.place.findMany({
        where: {
          OR: provinces.map((p) => ({
            province: { contains: p, mode: 'insensitive' as const },
          })),
        },
        orderBy: {
          popularityScore: 'desc',
        },
        take: neededCandidates,
      });

      if (fallbackPlaces.length === 0) {
        fallbackPlaces = await this.prisma.place.findMany({
          where: {
            OR: provinces.flatMap((p) => [
              { province: { contains: p, mode: 'insensitive' as const } },
              { district: { contains: p, mode: 'insensitive' as const } },
              { name: { contains: p, mode: 'insensitive' as const } },
            ]),
          },
          orderBy: {
            popularityScore: 'desc',
          },
          take: neededCandidates,
        });
      }

      if (fallbackPlaces.length === 0) {
        fallbackPlaces = await this.prisma.place.findMany({
          orderBy: {
            popularityScore: 'desc',
          },
          take: neededCandidates,
        });
      }

      // Prioritize places matching preferences if provided
      if (dto.preferences && dto.preferences.length > 0 && fallbackPlaces.length > 0) {
        const prefLower = dto.preferences.map((p) => p.toLowerCase().trim());
        fallbackPlaces.sort((a, b) => {
          const aMatches = a.categories.filter((c) =>
            prefLower.some((p) => c.toLowerCase().includes(p) || p.includes(c.toLowerCase())),
          ).length;
          const bMatches = b.categories.filter((c) =>
            prefLower.some((p) => c.toLowerCase().includes(p) || p.includes(c.toLowerCase())),
          ).length;

          if (aMatches !== bMatches) {
            return bMatches - aMatches;
          }
          return b.popularityScore - a.popularityScore;
        });
      }

      places = fallbackPlaces;
    }

    if (places.length === 0) {
      throw new NotFoundException(
        `Không tìm thấy địa điểm du lịch nào phù hợp cho điểm đến "${dto.destination}".`,
      );
    }

    // Step 3: Use LLM (Gemini) to create day-by-day itinerary
    const itinerary = await this.createItineraryWithLLM(
      places,
      days,
      dto.budgetPerPerson,
      dto.groupSize,
      dto.preferences || [],
      startDate,
      provinces,
    );

    // Step 4: Save trip places to database
    await this.saveTripPlaces(tripId, itinerary);

    return itinerary;
  }

  private normalizeTimeSlot(
    slot: any,
    indexInDay: number,
    totalInDay: number,
  ): TimeSlot {
    if (typeof slot === 'string') {
      const s = slot.toLowerCase().trim();
      if (s.includes('morn') || s.includes('sáng') || s.includes('sang')) return 'morning';
      if (
        s.includes('noon') ||
        s.includes('after') ||
        s.includes('chiều') ||
        s.includes('chieu') ||
        s.includes('trưa') ||
        s.includes('trua')
      )
        return 'afternoon';
      if (s.includes('even') || s.includes('night') || s.includes('tối') || s.includes('toi'))
        return 'evening';
    }
    // Phân bổ dự phòng dựa trên thứ tự vị trí trong ngày
    if (totalInDay <= 2) {
      return indexInDay === 0 ? 'morning' : 'afternoon';
    }
    if (indexInDay === 0) return 'morning';
    if (indexInDay >= totalInDay - 1) return 'evening';
    return 'afternoon';
  }

  private async createItineraryWithLLM(
    places: any[],
    days: number,
    budgetPerPerson: number,
    groupSize: number,
    preferences: string[],
    startDate?: Date,
    destinationProvinces?: string[],
  ): Promise<TripItinerary> {
    const minPlaces = Math.min(places.length, days * 3);
    const maxPlaces = Math.min(places.length, days * 5);

    const multiProvinceInstruction =
      destinationProvinces && destinationProvinces.length > 1
        ? `\n**ĐẶC BIỆT - TOUR DU LỊCH LIÊN TỈNH (${destinationProvinces.join(' & ')} - ${days} ngày)**:
Chuyến đi này kết hợp ${destinationProvinces.length} địa phương: ${destinationProvinces.join(', ')}.
YÊU CẦU BẮT BUỘC VỀ PHÂN BỔ KHÔNG GIAN:
- Gom cụm các ngày theo từng địa phương một cách liền mạch, KHÔNG ĐƯỢC đi zíc-zắc qua lại giữa 2 tỉnh trong cùng 1 ngày hoặc giữa các ngày xen kẽ.
- Ví dụ tour 4 ngày Hà Nội & Ninh Bình: Ngày 1 & 2 tập trung trọn vẹn tại Hà Nội; Ngày 3 & 4 di chuyển và tham quan trọn vẹn tại Ninh Bình. Chặng di chuyển liên tỉnh chỉ diễn ra DUY NHẤT 1 lần giữa các cụm ngày!\n`
        : '';

    const prompt = `Bạn là một chuyên gia lên lịch trình du lịch người Việt Nam. Hãy tạo một lịch trình chi tiết ${days} ngày bằng cách sử dụng các địa điểm sau.

**Ngân sách**: ${budgetPerPerson.toLocaleString()} VND mỗi người
**Số người**: ${groupSize} người
**Sở thích**: ${preferences.join(', ') || 'Không chỉ định'}
${multiProvinceInstruction}
**Danh sách địa điểm khả dụng** (đã sắp xếp theo độ phù hợp):
${places.map((p, i) => `${i + 1}. [ID: ${p.id}] ${p.name} - ${p.categories.join(', ')} (${p.priceEstimate.toLocaleString()} VND) tại tọa độ (${p.latitude}, ${p.longitude})`).join('\n')}

**Yêu cầu bắt buộc**:
1. Chọn khoảng ${minPlaces}-${maxPlaces} địa điểm từ danh sách trên sao cho phù hợp với ${days} ngày.
2. TUYỆT ĐỐI KHÔNG ĐƯỢC LẶP LẠI ĐỊA ĐIỂM: Mỗi địa điểm chỉ được xuất hiện DUY NHẤT 1 LẦN trong toàn bộ chuyến đi ${days} ngày. Không được lặp lại bất kỳ địa điểm nào giữa các ngày hoặc trong cùng 1 ngày.
3. PHÂN BỔ MỖI NGÀY TỪ 3 ĐẾN 5 ĐỊA ĐIỂM (TỐI THIỂU 3 ĐỊA ĐIỂM/NGÀY):
   - Mỗi ngày BẮT BUỘC phải chia theo 3 buổi: Sáng (morning), Chiều (afternoon), Tối (evening).
   - Buổi sáng ("morning"): 1-2 địa điểm (tham quan văn hóa, danh lam thắng cảnh, di tích lịch sử, khoảng 08:00 - 11:30).
   - Buổi chiều ("afternoon"): 1-2 địa điểm (vui chơi, trải nghiệm, check-in, ẩm thực, khoảng 13:30 - 17:30).
   - Buổi tối ("evening"): 1 địa điểm (chợ đêm, phố đi bộ, dạo mát, ngắm cảnh đêm, ẩm thực đêm, khoảng 18:30 - 21:30).
   - Tổng cộng mỗi ngày phải từ 3 đến 5 địa điểm. Không được để trống buổi nào nếu số lượng địa điểm khả dụng còn đủ.
4. Các địa điểm trong cùng 1 ngày phải gần nhau về mặt địa lý để thuận tiện di chuyển.
5. Cân nhắc thời gian di chuyển hợp lý giữa các địa điểm.
6. Cân bằng các hoạt động (thiên nhiên, văn hóa, ẩm thực, giải trí...).
7. Đảm bảo tổng chi phí không vượt quá ngân sách.
8. Ghi rõ khung giờ tham quan ước tính trong trường "estimatedTime" (ví dụ: "08:00 - 10:30", "14:00 - 16:30", "19:00 - 21:00").
9. TẤT CẢ NỘI DUNG BAO GỒM TIÊU ĐỀ, MÔ TẢ, LỜI KHUYÊN PHẢI ĐƯỢC VIẾT BẰNG TIẾNG VIỆT 100%.

**Định dạng đầu ra** (Chỉ trả về JSON hợp lệ, không kèm văn bản giải thích nào khác):
\`\`\`json
{
  "days": [
    {
      "dayNumber": 1,
      "date": "Ngày 1",
      "places": [
        {
          "placeId": "uuid-from-list",
          "name": "Tên địa điểm buổi sáng",
          "description": "Lý do nên tham quan địa điểm này",
          "categories": ["Danh mục 1", "Danh mục 2"],
          "estimatedTime": "08:00 - 10:30",
          "timeSlot": "morning",
          "orderInDay": 1,
          "latitude": 0.0,
          "longitude": 0.0,
          "priceEstimate": 0
        },
        {
          "placeId": "uuid-from-list",
          "name": "Tên địa điểm buổi chiều",
          "description": "Lý do nên tham quan địa điểm này",
          "categories": ["Danh mục 1"],
          "estimatedTime": "14:00 - 16:30",
          "timeSlot": "afternoon",
          "orderInDay": 2,
          "latitude": 0.0,
          "longitude": 0.0,
          "priceEstimate": 0
        },
        {
          "placeId": "uuid-from-list",
          "name": "Tên địa điểm buổi tối",
          "description": "Lý do nên tham quan địa điểm này",
          "categories": ["Ẩm thực", "Chợ đêm"],
          "estimatedTime": "19:00 - 21:30",
          "timeSlot": "evening",
          "orderInDay": 3,
          "latitude": 0.0,
          "longitude": 0.0,
          "priceEstimate": 0
        }
      ],
      "notes": "Lưu ý và tổng quan cho ngày này"
    }
  ],
  "summary": "Tóm tắt tổng quan về toàn bộ chuyến đi",
  "totalEstimatedCost": 0
}
\`\`\``;

    try {
      const response = await this.gemini.generateText(prompt);

      // Extract JSON from response
      const jsonMatch =
        response.match(/```(?:json)?\s*([\s\S]*?)\s*```/) ||
        response.match(/(\{[\s\S]*\})/);
      if (!jsonMatch) {
        throw new Error('Failed to parse LLM response');
      }

      const itinerary = JSON.parse(jsonMatch[1]) as TripItinerary;

      // Hậu xử lý: Đảm bảo 100% không có địa điểm nào bị lặp lại giữa các ngày
      const seenPlaceIds = new Set<string>();
      let calculatedTotalCost = 0;

      const slotOrder: Record<TimeSlot, number> = {
        morning: 1,
        afternoon: 2,
        evening: 3,
      };

      for (let dIdx = 0; dIdx < itinerary.days.length; dIdx++) {
        const day = itinerary.days[dIdx];
        if (startDate) {
          const d = new Date(startDate);
          d.setDate(d.getDate() + dIdx);
          day.date = d.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
        }

        day.places = (day.places || []).filter((p) => {
          if (!p.placeId || seenPlaceIds.has(p.placeId)) {
            return false;
          }
          seenPlaceIds.add(p.placeId);
          calculatedTotalCost += Number(p.priceEstimate) || 0;
          return true;
        });

        // Chuẩn hóa timeSlot cho từng địa điểm
        day.places.forEach((p, idx) => {
          p.timeSlot = this.normalizeTimeSlot(p.timeSlot, idx, day.places.length);
        });

        // Sắp xếp thứ tự các điểm trong ngày theo buổi: Sáng -> Chiều -> Tối
        day.places.sort((a, b) => {
          const orderA = slotOrder[a.timeSlot] || 2;
          const orderB = slotOrder[b.timeSlot] || 2;
          return orderA - orderB;
        });

        // Đánh lại số thứ tự trong ngày
        day.places.forEach((p, idx) => {
          p.orderInDay = idx + 1;
        });
      }

      if (calculatedTotalCost > 0) {
        itinerary.totalEstimatedCost = calculatedTotalCost;
      }

      // Tối ưu hóa thứ tự các địa điểm bằng thuật toán TSPTW 2-Opt & tính toán chỉ số tiết kiệm
      const optimized = this.optimizer.optimizeTripDays(itinerary.days);
      itinerary.days = optimized.days as DayPlan[];
      itinerary.optimizationStats = optimized.stats;

      return itinerary;
    } catch (error: any) {
      this.logger.warn(
        `LLM itinerary generation failed: ${error?.message || 'Unknown error'}. Using FALLBACK itinerary with spatial clustering!`,
      );

      const daysCount = Math.max(1, days);
      const clusteredBuckets = this.optimizer.clusterPlacesIntoDays(
        places.map((p) => ({
          placeId: p.id,
          name: p.name,
          categories: p.categories || [],
          orderInDay: 1,
          latitude: Number(p.latitude) || 0,
          longitude: Number(p.longitude) || 0,
          priceEstimate: Number(p.priceEstimate) || 0,
          timeSlot: 'afternoon' as TimeSlot,
          province: p.province || '',
        })),
        daysCount,
        destinationProvinces,
      );

      const mockDays: DayPlan[] = [];
      let totalCost = 0;
      const usedFallbackIds = new Set<string>();

      for (let day = 1; day <= daysCount; day++) {
        const bucket = clusteredBuckets[day - 1] || [];
        const dayPlaces: PlaceInItinerary[] = [];
        const placesPerDay = Math.min(4, Math.max(3, bucket.length));

        for (let i = 0; i < placesPerDay && i < bucket.length; i++) {
          const p = bucket[i];
          if (usedFallbackIds.has(p.placeId)) continue;
          usedFallbackIds.add(p.placeId);

          let slot: TimeSlot = 'afternoon';
          let timeStr = '14:00 - 16:30';
          if (i === 0) {
            slot = 'morning';
            timeStr = '08:30 - 11:00';
          } else if (i === placesPerDay - 1) {
            slot = 'evening';
            timeStr = '19:00 - 21:30';
          } else if (i === 1 && placesPerDay >= 4) {
            slot = 'afternoon';
            timeStr = '13:30 - 15:30';
          }

          dayPlaces.push({
            placeId: p.placeId,
            name: p.name,
            description: 'Khám phá ' + p.name + ' - ' + (p.categories || []).join(', '),
            categories: p.categories || [],
            estimatedTime: timeStr,
            timeSlot: slot,
            orderInDay: dayPlaces.length + 1,
            latitude: p.latitude,
            longitude: p.longitude,
            priceEstimate: p.priceEstimate || 0,
            province: p.province,
          });
          totalCost += p.priceEstimate || 0;
        }

        let dateStr = 'Ngày ' + day;
        if (startDate) {
          const d = new Date(startDate);
          d.setDate(d.getDate() + (day - 1));
          dateStr = d.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
        }

        if (dayPlaces.length > 0) {
          mockDays.push({
            dayNumber: day,
            date: dateStr,
            places: dayPlaces,
            notes: 'Ngày ' + day + ' trải nghiệm các địa điểm gợi ý theo 3 buổi sáng, chiều và tối.',
          });
        }
      }

      // Tối ưu hóa thứ tự 2-Opt cho fallback
      const optimized = this.optimizer.optimizeTripDays(mockDays);

      return {
        days: optimized.days as DayPlan[],
        summary: `Lịch trình ${daysCount} ngày tối ưu hóa thông minh theo không gian địa lý. Dựa trên gợi ý Recommendation Model & K-Means Clustering.`,
        totalEstimatedCost: totalCost,
        optimizationStats: optimized.stats,
      };
    }
  }

  private async saveTripPlaces(tripId: string, itinerary: TripItinerary) {
    const tripPlaces = [];

    for (const day of itinerary.days) {
      for (const place of day.places) {
        tripPlaces.push({
          tripId,
          placeId: place.placeId,
          dayNumber: day.dayNumber,
          orderInDay: place.orderInDay,
          notes: place.description,
        });
      }
    }

    await this.prisma.tripPlace.createMany({
      data: tripPlaces,
    });
  }

  async optimizeTripItinerary(tripId: string) {
    this.logger.log(`Optimizing route for trip ${tripId}`);
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        places: {
          include: {
            place: true,
          },
          orderBy: [
            { dayNumber: 'asc' },
            { orderInDay: 'asc' },
          ],
        },
      },
    });

    if (!trip) {
      throw new NotFoundException(`Trip with ID ${tripId} not found`);
    }

    const itinerary = trip.itinerary as any as TripItinerary;
    if (!itinerary || !itinerary.days) {
      throw new NotFoundException(`Lịch trình chưa được tạo cho chuyến đi này`);
    }

    // Tối ưu hóa thứ tự bằng 2-Opt TSPTW Heuristic
    const optimized = this.optimizer.optimizeTripDays(itinerary.days);
    itinerary.days = optimized.days as DayPlan[];
    itinerary.optimizationStats = optimized.stats;

    // Cập nhật lại bản ghi TripPlace trong database
    await this.prisma.tripPlace.deleteMany({
      where: { tripId },
    });

    await this.saveTripPlaces(tripId, itinerary);

    // Lưu lại itinerary cập nhật vào Trip
    return this.prisma.trip.update({
      where: { id: tripId },
      data: {
        itinerary: itinerary as any,
      },
      include: {
        places: {
          include: {
            place: true,
          },
          orderBy: [
            { dayNumber: 'asc' },
            { orderInDay: 'asc' },
          ],
        },
      },
    });
  }

  async getTripById(tripId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        places: {
          include: {
            place: true,
          },
          orderBy: [
            { dayNumber: 'asc' },
            { orderInDay: 'asc' },
          ],
        },
      },
    });

    if (!trip) {
      throw new NotFoundException(`Trip with ID ${tripId} not found`);
    }

    return trip;
  }

  async getUserTrips(userId: string) {
    return this.prisma.trip.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        places: {
          include: {
            place: true,
          },
        },
      },
    });
  }

  async updateTripStatus(tripId: string, status: string) {
    return this.prisma.trip.update({
      where: { id: tripId },
      data: { status },
    });
  }

  async deleteTrip(tripId: string) {
    return this.prisma.trip.delete({
      where: { id: tripId },
    });
  }
}
