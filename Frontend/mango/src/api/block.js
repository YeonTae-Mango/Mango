import { getAuthToken } from './auth';
import apiClient from './client';

/**
 * 사용자를 차단하거나 신고합니다.
 * @param {number} requestId - 현재 접속한 사용자의 ID
 * @param {number} targetUserId - 차단/신고할 대상 사용자 ID
 * @returns {Promise<Object>} API 응답 프로미스
 */
export const blockUser = async (requestId, targetUserId) => {
  try {
    const token = await getAuthToken();
    
    const response = await apiClient.post(
      `/block/${requestId}/${targetUserId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    console.log('사용자 차단/신고 API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('사용자 차단/신고 API 오류:', error);
    throw error;
  }
};