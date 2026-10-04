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
}

export interface DayPlan {
  dayNumber: number;
  date: string;
  places: ItineraryPlace[];
  notes?: string;
}

export interface TripItinerary {
  days: DayPlan[];
  summary: string;
  totalEstimatedCost: number;
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
}
