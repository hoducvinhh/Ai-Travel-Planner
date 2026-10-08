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

export interface CommunityPostItem {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
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
