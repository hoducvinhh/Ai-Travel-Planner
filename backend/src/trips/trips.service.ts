import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../gemini/gemini.service';
import { RecommendationService } from '../recommendation/recommendation.service';

export interface CreateTripDto {
  userId: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  budgetPerPerson: number;
  groupSize: number;
  preferences?: string[];
}

export interface TripItinerary {
  days: DayPlan[];
  summary: string;
  totalEstimatedCost: number;
}

export interface DayPlan {
  dayNumber: number;
  date: string;
  places: PlaceInItinerary[];
  notes?: string;
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
}

@Injectable()
export class TripsService {
  private readonly logger = new Logger(TripsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gemini: GeminiService,
    private readonly recommendation: RecommendationService,
  ) {}

  async createTrip(dto: CreateTripDto) {
    this.logger.log(`Creating trip for user ${dto.userId} to ${dto.destination}`);

    // Calculate days
    const days = Math.ceil(
      (new Date(dto.endDate).getTime() - new Date(dto.startDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );

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

    // Step 1: Get ML recommendations (Top 50)
    const startDate = new Date(dto.startDate);
    const monthOfYear = startDate.getMonth() + 1;

    const recommendations = await this.recommendation.getRecommendations({
      userId: dto.userId,
      destination: dto.destination,
      budgetPerPerson: dto.budgetPerPerson,
      days,
      groupSize: dto.groupSize,
      monthOfYear,
      explicitPreferences: dto.preferences || [],
    });

    if (recommendations.placeIds.length === 0) {
      throw new Error('No recommendations available for this destination');
    }

    // Step 2: Fetch place details
    const places = await this.prisma.place.findMany({
      where: {
        id: {
          in: recommendations.placeIds.slice(0, 30), // Take top 30 for LLM
        },
      },
    });

    // Step 3: Use LLM (Gemini) to create day-by-day itinerary
    const itinerary = await this.createItineraryWithLLM(
      places,
      days,
      dto.budgetPerPerson,
      dto.groupSize,
      dto.preferences || [],
    );

    // Step 4: Save trip places to database
    await this.saveTripPlaces(tripId, itinerary);

    return itinerary;
  }

  private async createItineraryWithLLM(
    places: any[],
    days: number,
    budgetPerPerson: number,
    groupSize: number,
    preferences: string[],
  ): Promise<TripItinerary> {
    const prompt = `Bạn là một chuyên gia lên lịch trình du lịch người Việt Nam. Hãy tạo một lịch trình chi tiết ${days} ngày bằng cách sử dụng các địa điểm sau.

**Ngân sách**: ${budgetPerPerson.toLocaleString()} VND mỗi người
**Số người**: ${groupSize} người
**Sở thích**: ${preferences.join(', ') || 'Không chỉ định'}

**Danh sách địa điểm khả dụng** (đã sắp xếp theo độ phù hợp):
${places.map((p, i) => `${i + 1}. [ID: ${p.id}] ${p.name} - ${p.categories.join(', ')} (${p.priceEstimate.toLocaleString()} VND) tại tọa độ (${p.latitude}, ${p.longitude})`).join('\n')}

**Yêu cầu bắt buộc**:
1. Chọn 10-15 địa điểm từ danh sách trên
2. Phân bổ hợp lý trong ${days} ngày (3-5 địa điểm/ngày)
3. Các địa điểm trong cùng 1 ngày phải gần nhau về mặt địa lý
4. Cân nhắc thời gian di chuyển giữa các địa điểm
5. Cân bằng các hoạt động (thiên nhiên, văn hóa, ẩm thực...)
6. Đảm bảo tổng chi phí không vượt quá ngân sách
7. Ước tính thời gian tham quan cho mỗi địa điểm
8. TẤT CẢ NỘI DUNG BAO GỒM TIÊU ĐỀ, MÔ TẢ, LỜI KHUYÊN PHẢI ĐƯỢC VIẾT BẰNG TIẾNG VIỆT 100%.

**Định dạng đầu ra** (Chỉ trả về JSON, không kèm giải thích):
\`\`\`json
{
  "days": [
    {
      "dayNumber": 1,
      "date": "Ngày 1",
      "places": [
        {
          "placeId": "uuid-from-list",
          "name": "Tên địa điểm",
          "description": "Lý do nên tham quan địa điểm này",
          "categories": ["Danh mục 1", "Danh mục 2"],
          "estimatedTime": "2 giờ",
          "orderInDay": 1,
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
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
      if (!jsonMatch) {
        throw new Error('Failed to parse LLM response');
      }

      const itinerary = JSON.parse(jsonMatch[1]) as TripItinerary;
      return itinerary;
    } catch (error: any) {
      this.logger.warn(`LLM itinerary generation failed: ${error?.message || 'Unknown error'}. Using FALLBACK itinerary!`);
      
      const mockDays = [];
      let currentPlaceIndex = 0;
      let totalCost = 0;
      
      // Calculate how many days based on dates, or default to 3 places per day
      const daysCount = Math.max(1, Math.ceil(places.length / 3));
      
      for (let day = 1; day <= daysCount; day++) {
        const dayPlaces = [];
        for (let i = 0; i < 3; i++) {
          if (currentPlaceIndex < places.length) {
            const p = places[currentPlaceIndex];
            dayPlaces.push({
              placeId: p.id,
              name: p.name,
              description: 'Khám phá ' + p.name + ' - ' + p.categories.join(', '),
              categories: p.categories,
              estimatedTime: '2 hours',
              orderInDay: i + 1,
              latitude: Number(p.latitude) || 0,
              longitude: Number(p.longitude) || 0,
              priceEstimate: Number(p.priceEstimate) || 0
            });
            totalCost += Number(p.priceEstimate) || 0;
            currentPlaceIndex++;
          }
        }
        if (dayPlaces.length > 0) {
          mockDays.push({
            dayNumber: day,
            date: 'Ngày ' + day,
            places: dayPlaces,
            notes: 'Ngày ' + day + ' trải nghiệm các địa điểm gợi ý'
          });
        }
      }

      return {
        days: mockDays,
        summary: 'Lịch trình dự phòng tự động (AI tạm thời bận). Dựa trên gợi ý Recommendation Model.',
        totalEstimatedCost: totalCost
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
