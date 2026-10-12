import { RouteOptimizerService, PlaceForOptimization } from './route-optimizer.service';

describe('RouteOptimizerService', () => {
  let service: RouteOptimizerService;

  beforeEach(() => {
    service = new RouteOptimizerService();
  });

  describe('calculateHaversineDistanceKm', () => {
    it('should return 0 when coordinates are identical', () => {
      const dist = service.calculateHaversineDistanceKm(21.0285, 105.8542, 21.0285, 105.8542);
      expect(dist).toBe(0);
    });

    it('should accurately calculate distance between Hanoi Old Quarter and West Lake (~4 km)', () => {
      // Hồ Gươm (21.0285, 105.8542) và Chùa Trấn Quốc Hồ Tây (21.0478, 105.8365)
      const dist = service.calculateHaversineDistanceKm(21.0285, 105.8542, 21.0478, 105.8365);
      expect(dist).toBeGreaterThan(2.5);
      expect(dist).toBeLessThan(4.5);
    });
  });

  describe('isTimeSlotValid', () => {
    it('should validate monotonic progression morning -> afternoon -> evening', () => {
      const places: PlaceForOptimization[] = [
        { placeId: '1', name: 'P1', orderInDay: 1, latitude: 21, longitude: 105, timeSlot: 'morning' },
        { placeId: '2', name: 'P2', orderInDay: 2, latitude: 21, longitude: 105, timeSlot: 'morning' },
        { placeId: '3', name: 'P3', orderInDay: 3, latitude: 21, longitude: 105, timeSlot: 'afternoon' },
        { placeId: '4', name: 'P4', orderInDay: 4, latitude: 21, longitude: 105, timeSlot: 'evening' },
      ];
      expect(service.isTimeSlotValid(places)).toBe(true);
    });

    it('should invalidate when evening comes before afternoon or morning', () => {
      const places: PlaceForOptimization[] = [
        { placeId: '1', name: 'P1', orderInDay: 1, latitude: 21, longitude: 105, timeSlot: 'evening' },
        { placeId: '2', name: 'P2', orderInDay: 2, latitude: 21, longitude: 105, timeSlot: 'morning' },
      ];
      expect(service.isTimeSlotValid(places)).toBe(false);
    });
  });

  describe('optimizeDayRoute (2-Opt TSPTW)', () => {
    it('should optimize a zig-zag route within afternoon slot while preserving slot order', () => {
      // Giả sử có 4 địa điểm:
      // P1 (Sáng, Km 0)
      // P2 (Chiều, Km 30) - bị xếp trước P3
      // P3 (Chiều, Km 10)
      // P4 (Tối, Km 40)
      // Ban đầu: P1(0) -> P2(30) -> P3(10) -> P4(40):
      // Quãng đường: |30-0| + |10-30| + |40-10| = 30 + 20 + 30 = 80 km.
      // Sau tối ưu: P1(0) -> P3(10) -> P2(30) -> P4(40):
      // Quãng đường: |10-0| + |30-10| + |40-30| = 10 + 20 + 10 = 40 km (Giảm 50%!).

      const zigZagPlaces: PlaceForOptimization[] = [
        { placeId: 'p1', name: 'Chùa Một Cột', orderInDay: 1, latitude: 21.0, longitude: 105.0, timeSlot: 'morning' },
        { placeId: 'p2', name: 'Làng lụa Vạn Phúc (xa)', orderInDay: 2, latitude: 21.3, longitude: 105.0, timeSlot: 'afternoon' },
        { placeId: 'p3', name: 'Bảo tàng Dân tộc học (gần)', orderInDay: 3, latitude: 21.1, longitude: 105.0, timeSlot: 'afternoon' },
        { placeId: 'p4', name: 'Hồ Tây ngắm đêm', orderInDay: 4, latitude: 21.4, longitude: 105.0, timeSlot: 'evening' },
      ];

      const result = service.optimizeDayRoute(zigZagPlaces, 1);

      expect(result.stats.savedPercentage).toBeGreaterThan(20);
      expect(result.stats.optimizedDistanceKm).toBeLessThan(result.stats.originalDistanceKm);

      // Kiểm tra thứ tự hợp lệ
      expect(service.isTimeSlotValid(result.places)).toBe(true);

      // Điểm p3 phải đứng trước p2 sau khi tối ưu
      const indexP3 = result.places.findIndex((p) => p.placeId === 'p3');
      const indexP2 = result.places.findIndex((p) => p.placeId === 'p2');
      expect(indexP3).toBeLessThan(indexP2);
    });
  });

  describe('clusterPlacesIntoDays (Multi-Province Tour Support)', () => {
    it('should allocate Day 1-2 to Hanoi and Day 3-4 to Ninh Binh for a 4-day tour', () => {
      const places: PlaceForOptimization[] = [
        { placeId: 'hn1', name: 'Hồ Gươm', orderInDay: 1, latitude: 21.0285, longitude: 105.8542, timeSlot: 'morning', province: 'Hà Nội' },
        { placeId: 'hn2', name: 'Văn Miếu', orderInDay: 2, latitude: 21.0292, longitude: 105.8359, timeSlot: 'afternoon', province: 'Hà Nội' },
        { placeId: 'hn3', name: 'Hồ Tây', orderInDay: 3, latitude: 21.0558, longitude: 105.8239, timeSlot: 'evening', province: 'Hà Nội' },
        { placeId: 'hn4', name: 'Lăng Bác', orderInDay: 4, latitude: 21.0368, longitude: 105.8346, timeSlot: 'morning', province: 'Hà Nội' },
        { placeId: 'nb1', name: 'Tràng An', orderInDay: 5, latitude: 20.2506, longitude: 105.9142, timeSlot: 'morning', province: 'Ninh Bình' },
        { placeId: 'nb2', name: 'Bái Đính', orderInDay: 6, latitude: 20.2688, longitude: 105.8572, timeSlot: 'afternoon', province: 'Ninh Bình' },
        { placeId: 'nb3', name: 'Tam Cốc', orderInDay: 7, latitude: 20.2222, longitude: 105.9392, timeSlot: 'evening', province: 'Ninh Bình' },
        { placeId: 'nb4', name: 'Hang Múa', orderInDay: 8, latitude: 20.2312, longitude: 105.9412, timeSlot: 'morning', province: 'Ninh Bình' },
      ];

      const days = service.clusterPlacesIntoDays(places, 4, ['Hà Nội', 'Ninh Bình']);

      expect(days.length).toBe(4);

      // Ngày 1 và Ngày 2 chỉ gồm các điểm Hà Nội
      const day1Provinces = days[0].map((p) => p.province);
      const day2Provinces = days[1].map((p) => p.province);
      expect(day1Provinces.every((p) => p === 'Hà Nội')).toBe(true);
      expect(day2Provinces.every((p) => p === 'Hà Nội')).toBe(true);

      // Ngày 3 và Ngày 4 chỉ gồm các điểm Ninh Bình
      const day3Provinces = days[2].map((p) => p.province);
      const day4Provinces = days[3].map((p) => p.province);
      expect(day3Provinces.every((p) => p === 'Ninh Bình')).toBe(true);
      expect(day4Provinces.every((p) => p === 'Ninh Bình')).toBe(true);
    });
  });

  describe('optimizeTripDays', () => {
    it('should optimize all days and provide consolidated trip stats', () => {
      const days = [
        {
          dayNumber: 1,
          date: '01/05/2026',
          places: [
            { placeId: 'p1', name: 'Điểm 1', orderInDay: 1, latitude: 21.0, longitude: 105.0, timeSlot: 'morning' as const },
            { placeId: 'p2', name: 'Điểm 2 xa', orderInDay: 2, latitude: 21.3, longitude: 105.0, timeSlot: 'afternoon' as const },
            { placeId: 'p3', name: 'Điểm 3 gần', orderInDay: 3, latitude: 21.1, longitude: 105.0, timeSlot: 'afternoon' as const },
          ],
        },
      ];

      const result = service.optimizeTripDays(days);
      expect(result.days.length).toBe(1);
      expect(result.stats.totalSavedPercentage).toBeGreaterThanOrEqual(0);
      expect(result.days[0].optimizationStats).toBeDefined();
    });
  });
});
