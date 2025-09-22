import AsyncStorage from '@react-native-async-storage/async-storage';
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

/**
 * 토큰을 가져오는 헬퍼 함수
 * @returns {Promise<string|null>} 인증 토큰
 */
const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return token;
  } catch (error) {
    console.error('토큰 가져오기 실패:', error);
    return null;
  }
};

/**
 * 현재 로그인된 사용자 ID를 가져오는 헬퍼 함수
 * @returns {Promise<number|null>} 사용자 ID
 */
export const getCurrentUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  } catch (error) {
    console.error('사용자 ID 가져오기 실패:', error);
    return null;
  }
};

/**
 * 테스트용: 사용자 ID와 토큰을 AsyncStorage에 저장
 * @param {string} token - 인증 토큰
 * @param {number} userId - 사용자 ID
 */
export const setTestCredentials = async (token, userId) => {
  try {
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('userId', userId.toString());
    console.log(`테스트 자격증명 저장 완료: 사용자 ID ${userId}`);
  } catch (error) {
    console.error('테스트 자격증명 저장 실패:', error);
  }
};
