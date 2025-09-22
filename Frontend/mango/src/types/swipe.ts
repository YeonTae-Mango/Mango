export interface SwipeProfile {
  id: number;
  nickname: string;
  introduction: string;
  profileImageUrls: string[];
  sigungu: string;
  age: number;
  distance: number;
  theyLiked: boolean;
  mainType: string;
  keywords: string[];
  food: string;
}

export type SwipeProfilesResponse = SwipeProfile[];

export interface UseSwipeOptions {
  category?: string;
  onSwipeSuccess?: (direction: 'left' | 'right') => void;
}

export interface SwipeAction {
  requestId: number;
  action: 'like' | 'dislike';
}

export interface MangoLikeResponse {
  message: string;
  status: string;
}

export interface MangoDislikeResponse {
  message: string;
  status: string;
}
