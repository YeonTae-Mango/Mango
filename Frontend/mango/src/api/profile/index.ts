import apiClient from '../client';

// 사용자 정보 타입 정의
export interface UserProfile {
  userId: number;
  email: string;
  nickname: string;
  birthDate: string;
  age: number;
  gender: string;
  latitude: string;
  longitude: string;
  sido: string;
  sigungu: string;
  distance: number;
  introduction: string | null;
  distanceBetweenMe: number;
  theyLiked: boolean;
  mainType: string;
  keywords: string[];
  food: string;
  profileImageUrls: string[];
}

// API 응답 타입
export interface UserProfileResponse {
  message: string;
  data: UserProfile;
  status: string;
}

/**
 * 사용자 정보 조회 API
 * @param userId 조회할 사용자 ID
 * @returns 사용자 프로필 정보
 */
export const getUserProfile = async (userId: number): Promise<UserProfile> => {
  try {
    console.log('📤 사용자 정보 조회 요청:', { userId });
    
    const response = await apiClient.get<UserProfileResponse>(`/users/${userId}`);
    
    console.log('📥 사용자 정보 조회 응답:', response.data);
    
    if (response.data.status === 'SUCCESS') {
      return response.data.data;
    } else {
      throw new Error(response.data.message || '사용자 정보 조회에 실패했습니다.');
    }
  } catch (error) {
    console.error('❌ 사용자 정보 조회 실패:', error);
    throw error;
  }
};
