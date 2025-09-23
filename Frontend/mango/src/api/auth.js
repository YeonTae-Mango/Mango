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
