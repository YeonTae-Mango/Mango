import apiClient from '../client';

// 대표유형 비교 차트 응답 타입
export interface TwoTypeChartResponse {
  message: string;
  data: {
    labels: string[];
    myData: number[];
    partnerData: number[];
  };
  status: string;
}

/**
 * 대표유형 비교 차트 조회 API
 * @param myUserId 내 사용자 ID
 * @param otherUserId 비교할 사용자 ID
 * @returns 대표유형 비교 차트 데이터
 */
export const getTwoTypeChart = async (myUserId: number, otherUserId: number) => {
  try {
    console.log('📊 대표유형 비교 차트 조회 요청:', { myUserId, otherUserId });
    
    const response = await apiClient.get<TwoTypeChartResponse>(`/chart/twoTypeChart/${myUserId}/${otherUserId}`);
    
    console.log('📊 대표유형 비교 차트 응답:', response.data);
    
    if (response.data.status === 'SUCCESS') {
      return response.data.data;
    } else {
      throw new Error(response.data.message || '대표유형 비교 차트 조회에 실패했습니다.');
    }
  } catch (error) {
    console.error('❌ 대표유형 비교 차트 조회 실패:', error);
    throw error;
  }
};
