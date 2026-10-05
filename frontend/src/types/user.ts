import type { Place } from '@/types/place';
import type { Trip } from '@/types/trip';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN';
  preferredStyles?: string[];
  budgetLevel?: string;
  createdAt?: string;
}

export interface UserRatedPlaceItem {
  place: Place;
  rating: number;
  ratedAt: string;
}

export interface UserSharedPlaceItem {
  id: string;
  place: Place;
  note?: string;
  sharedAt: string;
}

export interface UserProfileData {
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
    preferredStyles?: string[];
    budgetLevel?: string;
    createdAt: string;
  };
  trips: Trip[];
  savedPlaces: Place[];
  likedPlaces: Place[];
  ratedPlaces?: UserRatedPlaceItem[];
  sharedPlaces?: UserSharedPlaceItem[];
  stats: {
    tripsCount: number;
    likedCount: number;
    savedCount: number;
    ratedCount: number;
    sharedCount?: number;
  };
}
