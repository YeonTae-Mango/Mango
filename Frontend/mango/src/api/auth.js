import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 토큰을 가져오는 헬퍼 함수
 * @returns {Promise<string|null>} 인증 토큰
 */
export const getAuthToken = async () => {
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
