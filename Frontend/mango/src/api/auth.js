import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 토큰을 가져오는 헬퍼 함수
 * @returns {Promise<string|null>} 인증 토큰
 */
export const getAuthToken = async () => {
  // 하드코딩된 테스트 토큰 사용
  const testToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMDMiLCJpYXQiOjE3NTg1Mzk4NDQsImV4cCI6MTc1ODYyNjI0NH0.5kH86B6YBrbaGXDX3u7zR5hSIaTrGC7oKxcCqxAuoJE';
  console.log('하드코딩된 토큰 사용:', testToken);
  return testToken;
  
  // 기존 AsyncStorage 코드 (주석 처리)
  // try {
  //   const token = await AsyncStorage.getItem('authToken');
  //   return token;
  // } catch (error) {
  //   console.error('토큰 가져오기 실패:', error);
  //   return null;
  // }
};

/**
 * 현재 로그인된 사용자 ID를 가져오는 헬퍼 함수
 * @returns {Promise<number|null>} 사용자 ID
 */
export const getCurrentUserId = async () => {
  // 하드코딩된 테스트 사용자 ID 사용
  const testUserId = 103;
  console.log('하드코딩된 사용자 ID 사용:', testUserId);
  return testUserId;
  
  // 기존 AsyncStorage 코드 (주석 처리)
  // try {
  //   const userId = await AsyncStorage.getItem('userId');
  //   return userId ? parseInt(userId, 10) : null;
  // } catch (error) {
  //   console.error('사용자 ID 가져오기 실패:', error);
  //   return null;
  // }
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
