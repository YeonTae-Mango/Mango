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
  onMatchSuccess?: (matchedProfile: SwipeProfile) => void;
}

export interface SwipeAction {
  requestId: number;
  action: 'like' | 'dislike';
}

export interface MangoLikeResponse {
  message: string;
  status: string;
  matched?: boolean; // 매치 성공 여부
  isMatched?: boolean; // 백엔드에 따라 다를 수 있음
  match?: boolean; // 또 다른 가능한 필드명
}

export interface MangoDislikeResponse {
  message: string;
  status: string;
}
