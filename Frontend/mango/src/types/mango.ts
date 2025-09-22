// 망고 관련 타입 정의

// 망고 사용자 정보 인터페이스
export interface MangoUser {
  userId: number;
  nickname: string;
  age: number;
  profileUrl: string;
  sigungu: string;
  mainType: string;
}

// 망고 팔로잉/팔로워 API 응답 인터페이스
export interface MangoFollowingResponse {
  content: MangoUser[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  // API 응답 구조에 따라 추가 조정 필요
}

// 망고 API 요청 파라미터 인터페이스
export interface MangoApiParams {
  userId: number;
  page?: number;
}
