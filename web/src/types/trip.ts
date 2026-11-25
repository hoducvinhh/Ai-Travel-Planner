export type TimeSlot = 'morning' | 'afternoon' | 'evening';

export interface ItineraryPlace {
  placeId: string;
  name: string;
  description: string;
  categories: string[];
  estimatedTime: string;
  orderInDay: number;
  latitude: number;
  longitude: number;
  priceEstimate: number;
  timeSlot?: TimeSlot;
  imageUrl?: string;
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

export interface DayPlan {
  dayNumber: number;
  date: string;
  places: ItineraryPlace[];
  notes?: string;
  optimizationStats?: DayOptimizationStats;
}

export interface FeasibilityCriterion {
  score: number;
  weight: number;
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
  overallScore: number;
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

export interface TripItinerary {
  days: DayPlan[];
  summary: string;
  totalEstimatedCost: number;
  optimizationStats?: TripOptimizationStats;
  feasibilityReport?: FeasibilityReport;
}

export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budgetPerPerson: number;
  groupSize: number;
  status: string;
  createdAt: string;
  itinerary: TripItinerary;
  places?: Array<{
    id: string;
    tripId: string;
    placeId: string;
    dayNumber: number;
    orderInDay: number;
    place?: {
      id: string;
      name: string;
      description?: string;
      imageUrl?: string;
      latitude?: number;
      longitude?: number;
      categories?: string[];
    };
  }>;
}

export interface MapComponentProps {
  places: ItineraryPlace[];
  onSelectPlace?: (place: ItineraryPlace) => void;
  selectedPlaceId?: string | null;
}
