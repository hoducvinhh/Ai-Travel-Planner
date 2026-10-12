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

export interface TripItinerary {
  days: DayPlan[];
  summary: string;
  totalEstimatedCost: number;
  optimizationStats?: TripOptimizationStats;
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
}

export interface MapComponentProps {
  places: ItineraryPlace[];
  onSelectPlace?: (place: ItineraryPlace) => void;
  selectedPlaceId?: string | null;
}
