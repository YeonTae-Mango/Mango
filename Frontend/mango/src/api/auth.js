import { getAccessToken, getUserInfo } from '../utils/secureStorage';

/**
 * 토큰을 가져오는 헬퍼 함수 (새로운 로그인 시스템과 호환)
 * @returns {Promise<string|null>} 인증 토큰
 */
export const getAuthToken = async () => {
  try {
    const token = await getAccessToken();
    return token;
  } catch (error) {
    console.error('토큰 가져오기 실패:', error);
    return null;
  }
};

/**
 * 현재 로그인된 사용자 ID를 가져오는 헬퍼 함수 (새로운 로그인 시스템과 호환)
 * @returns {Promise<number|null>} 사용자 ID
 */
export const getCurrentUserId = async () => {
  try {
    const userInfo = await getUserInfo();
    return userInfo?.id || null;
  } catch (error) {
    console.error('사용자 ID 가져오기 실패:', error);
    return null;
  }
};

/**
 * 특정 사용자의 정보를 조회합니다.
 * @param {number} userId - 조회할 사용자 ID
 * @returns {Promise<Object>} 사용자 정보
 */
export const getUserById = async userId => {
  try {
    // apiClient import 추가 필요
    const apiClient = (await import('./client')).default;
    const token = await getAuthToken();

    const response = await apiClient.get(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('사용자 정보 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    throw error;
  }
};

/**
 * 사용자의 매칭 거리를 업데이트합니다.
 * @param {number} userId - 사용자 ID
 * @param {number} distance - 새로운 거리 (km 단위)
 * @returns {Promise<Object>} 업데이트 결과
 */
export const updateUserDistance = async (userId, distance) => {
  try {
    // apiClient import 추가 필요
    const apiClient = (await import('./client')).default;
    const token = await getAuthToken();

    const response = await apiClient.patch(
      `/users/${userId}/distance`,
      { distance },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('사용자 거리 업데이트 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('사용자 거리 업데이트 실패:', error);
    throw error;
  }
};
