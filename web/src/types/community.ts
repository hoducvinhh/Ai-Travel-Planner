export interface CommunityCommentItem {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name?: string;
    email: string;
  };
}

export interface CommunityTripPlace {
  place: {
    id: string;
    name: string;
    imageUrl?: string | null;
    province?: string | null;
  };
}

export interface CommunityAttachedTrip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budgetPerPerson: number;
  groupSize: number;
  status: string;
  places?: CommunityTripPlace[];
}

export interface CommunityPostItem {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  images?: string[];
  tripId?: string | null;
  trip?: CommunityAttachedTrip | null;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt?: string;
  user: {
    id: string;
    name?: string;
    email: string;
    preferredStyles?: string[];
    budgetLevel?: string;
  };
  recentComments: CommunityCommentItem[];
}

export interface TravelBuddy {
  id: string;
  name: string;
  email: string;
  preferredStyles: string[];
  budgetLevel?: string;
  mutualStyles: string[];
  sameBudget: boolean;
  matchScore: number;
  tripsCount: number;
  postsCount: number;
}
