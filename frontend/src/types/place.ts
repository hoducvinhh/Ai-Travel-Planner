export interface Place {
  id: string;
  name: string;
  description: string;
  categories: string[];
  latitude: number;
  longitude: number;
  province?: string;
  district?: string;
  priceEstimate: number;
  popularityScore: number;
  indoorOutdoor?: string;
  activityLevel?: string;
  imageUrl?: string;
  likesCount: number;
  savesCount: number;
  commentsCount: number;
  ratingAvg: number;
  ratingCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  userRating?: number | null;
  nearbyPlaces?: Place[];
}

export interface CommentItem {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name?: string;
    email: string;
  };
}
