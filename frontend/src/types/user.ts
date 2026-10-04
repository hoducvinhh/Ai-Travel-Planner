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
  stats: {
    tripsCount: number;
    likedCount: number;
    savedCount: number;
    ratedCount: number;
  };
}
