import { FeasibilityValidatorService } from './feasibility-validator.service';
import { RouteOptimizerService } from './route-optimizer.service';

describe('FeasibilityValidatorService', () => {
  let service: FeasibilityValidatorService;
  let optimizer: RouteOptimizerService;

  beforeEach(() => {
    optimizer = new RouteOptimizerService();
    service = new FeasibilityValidatorService(optimizer);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate high OFS score for an ideal itinerary', () => {
    // Kịch bản lý tưởng: 3 ngày, mỗi ngày 3 điểm gần nhau (< 5km), giá hợp lý, đúng sở thích
    const mockDays = [
      {
        dayNumber: 1,
        places: [
          {
            placeId: 'p1',
            name: 'Hồ Hoàn Kiếm',
            categories: ['culture', 'nature', 'historical'],
            orderInDay: 1,
            latitude: 21.0285,
            longitude: 105.8542,
            priceEstimate: 0,
            timeSlot: 'morning' as const,
          },
          {
            placeId: 'p2',
            name: 'Đền Ngọc Sơn',
            categories: ['culture', 'historical'],
            orderInDay: 2,
            latitude: 21.0305,
            longitude: 105.8525,
            priceEstimate: 30000,
            timeSlot: 'afternoon' as const,
          },
          {
            placeId: 'p3',
            name: 'Chợ Đêm Phố Cổ',
            categories: ['nightlife', 'shopping', 'food'],
            orderInDay: 3,
            latitude: 21.0345,
            longitude: 105.8505,
            priceEstimate: 100000,
            timeSlot: 'evening' as const,
          },
        ],
      },
    ];

    const report = service.validateItinerary(mockDays, {
      totalBudget: 1500000,
      daysCount: 1,
      explicitPreferences: ['culture', 'food'],
    });

    expect(report.overallScore).toBeGreaterThanOrEqual(85);
    expect(report.rating).toBe('Rất khả thi');
    expect(report.metrics.geo.score).toBe(100);
    expect(report.metrics.time.score).toBe(100);
    expect(report.metrics.budget.score).toBe(100);
    expect(report.metrics.preference.score).toBe(100);
    expect(report.warnings.length).toBe(0);
  });

  it('should penalize and flag critical warning for excessive distance (> 40km)', () => {
    // 2 điểm cách nhau rất xa: Hà Nội -> Chùa Hương (~55km)
    const mockDays = [
      {
        dayNumber: 1,
        places: [
          {
            placeId: 'p1',
            name: 'Hồ Hoàn Kiếm',
            categories: ['culture'],
            orderInDay: 1,
            latitude: 21.0285,
            longitude: 105.8542,
            priceEstimate: 0,
            timeSlot: 'morning' as const,
          },
          {
            placeId: 'p2',
            name: 'Chùa Hương',
            categories: ['culture'],
            orderInDay: 2,
            latitude: 20.6186,
            longitude: 105.7547,
            priceEstimate: 80000,
            timeSlot: 'afternoon' as const,
          },
        ],
      },
    ];

    const report = service.validateItinerary(mockDays, {
      totalBudget: 1000000,
      daysCount: 1,
    });

    expect(report.metrics.geo.score).toBeLessThan(50);
    const criticalWarning = report.warnings.find((w) => w.type === 'CRITICAL');
    expect(criticalWarning).toBeDefined();
    expect(criticalWarning?.message).toContain('> 40km');
  });

  it('should penalize and flag warning when cost exceeds budget (> 30%)', () => {
    const mockDays = [
      {
        dayNumber: 1,
        places: [
          {
            placeId: 'p1',
            name: 'Khu du lịch VinWonders',
            categories: ['entertainment'],
            orderInDay: 1,
            latitude: 12.22,
            longitude: 109.24,
            priceEstimate: 950000,
            timeSlot: 'morning' as const,
          },
        ],
      },
    ];

    // Ngân sách chỉ 300,000 VND -> Chi phí 950,000 vượt > 200%
    const report = service.validateItinerary(mockDays, {
      totalBudget: 300000,
      daysCount: 1,
    });

    expect(report.metrics.budget.score).toBeLessThan(70);
    const budgetWarning = report.warnings.find((w) => w.category === 'budget');
    expect(budgetWarning).toBeDefined();
  });

  it('should penalize when nightlife is scheduled in morning or nature trekking at evening', () => {
    const mockDays = [
      {
        dayNumber: 1,
        places: [
          {
            placeId: 'p1',
            name: 'Bar Pub Acoustic',
            categories: ['nightlife', 'bar'],
            orderInDay: 1,
            latitude: 21.02,
            longitude: 105.85,
            priceEstimate: 100000,
            timeSlot: 'morning' as const, // SAI: Bar ở buổi sáng
          },
          {
            placeId: 'p2',
            name: 'Trekking Rừng Quốc Gia',
            categories: ['nature', 'trekking'],
            orderInDay: 2,
            latitude: 21.03,
            longitude: 105.86,
            priceEstimate: 50000,
            timeSlot: 'evening' as const, // SAI: Trekking ban đêm
          },
        ],
      },
    ];

    const report = service.validateItinerary(mockDays, {
      totalBudget: 1000000,
      daysCount: 1,
    });

    expect(report.metrics.time.score).toBeLessThan(80);
    const timeWarnings = report.warnings.filter((w) => w.category === 'time');
    expect(timeWarnings.length).toBeGreaterThanOrEqual(2);
  });

  it('should auto-repair misassigned slots by swapping nightlife to evening and nature to day', () => {
    const misassignedDays = [
      {
        dayNumber: 1,
        places: [
          {
            placeId: 'p1',
            name: 'Bar Pub Acoustic',
            categories: ['nightlife', 'bar'],
            orderInDay: 1,
            latitude: 21.02,
            longitude: 105.85,
            priceEstimate: 100000,
            timeSlot: 'morning' as const, // Vi phạm: nightlife buổi sáng
          },
          {
            placeId: 'p2',
            name: 'Bảo tàng Lịch sử',
            categories: ['culture', 'museum'],
            orderInDay: 2,
            latitude: 21.025,
            longitude: 105.855,
            priceEstimate: 40000,
            timeSlot: 'evening' as const, // Bình thường: bảo tàng buổi tối
          },
        ],
      },
    ];

    const { repairedDays, repairCount } = service.autoRepairItinerary(misassignedDays);
    expect(repairCount).toBeGreaterThan(0);
    expect(repairedDays[0].places[0].name).toBe('Bảo tàng Lịch sử');
    expect(repairedDays[0].places[0].timeSlot).toBe('morning');
    expect(repairedDays[0].places[1].name).toBe('Bar Pub Acoustic');
    expect(repairedDays[0].places[1].timeSlot).toBe('evening');
  });
});
