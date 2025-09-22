import { getAuthToken } from './auth';
import apiClient from './client';

/**
 * 홈 화면에서 스와이프할 프로필 목록을 가져옵니다.
 * @param {number} userId - 사용자 ID
 * @param {string} category - 선택 카테고리 (optional)
 * @returns {Promise<HomeProfileResponse>} API 응답 프로미스
 */
export const getSwipeProfiles = async (userId, category = null) => {
  try {
    const token = await getAuthToken();

    const params = {
      userId: userId,
    };
    if (category) {
      params.category = category;
    } // 선택 카테고리가 제공된 경우에만 추가

    const response = await apiClient.get('/match/swipe', {
      params: params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('스와이프 프로필 목록 API 응답:', response.data.data);
    return response.data.data || [];
  } catch (error) {
    console.error('스와이프 프로필 목록 API 오류:', error);
    throw error;
  }
};

/**
 * 특정 사용자에게 망고를 보냅니다.
 * @param {number} userId - 사용자 ID
 * @param {number} requestId - 요청 ID (망고를 받는 사용자 ID)
 * @returns {Promise<MangoLikeResponse>} API 응답 프로미스
 */
export const sendMangoLike = async (userId, requestId) => {
  try {
    const token = await getAuthToken();

    const response = await apiClient.post(
      `/mango/like/${userId}`,
      {
        requestId: requestId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('망고 보내기 API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('망고 보내기 API 오류:', error);
    throw error;
  }
};

/**
 * 특정 사용자를 싫어요 합니다.
 * @param {number} userId - 사용자 ID
 * @param {number} requestId - 요청 ID (싫어요 처리할 사용자 ID)
 * @returns {Promise<MangoDislikeResponse>} API 응답 프로미스
 */
export const sendMangoDislike = async (userId, requestId) => {
  try {
    const token = await getAuthToken();

    const response = await apiClient.post(
      `/mango/dislike/${userId}`,
      {
        requestId: requestId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('싫어요 처리 API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('싫어요 처리 API 오류:', error);
    throw error;
  }
};
