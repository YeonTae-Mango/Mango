import { getAuthToken } from './auth';
import apiClient from './client';

/**
 * 내가 망고한 사람들의 목록을 가져옵니다.
 * @param {number} userId - 사용자 ID
 * @param {number} page - 페이지 번호 (기본값: 0)
 * @returns {Promise<MangoFollowingResponse>} API 응답 프로미스
 */
export const getMangoFollowing = async (userId, page = 0) => {
  try {
    const token = await getAuthToken();
    const response = await apiClient.get(`/mango/${userId}/following`, {
      params: {
        page: page,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('내가 망고한 사람들 API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('내가 망고한 사람들 API 오류:', error);
    throw error;
  }
};

/**
 * 나를 망고한 사람들의 목록을 가져옵니다.
 * @param {number} userId - 사용자 ID
 * @param {number} page - 페이지 번호 (기본값: 0)
 * @returns {Promise<MangoFollowersResponse>} API 응답 프로미스
 */
export const getMangoFollowers = async (userId, page = 0) => {
  try {
    const token = await getAuthToken();
    const response = await apiClient.get(`/mango/${userId}/followers`, {
      params: {
        page: page,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('나를 망고한 사람들 API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('나를 망고한 사람들 API 오류:', error);
    throw error;
  }
};
