// 개발 단계에서는 AsyncStorage 사용, 배포 시에는 expo-secure-store 사용
import AsyncStorage from '@react-native-async-storage/async-storage';

// expo-secure-store는 개발 환경에서 문제가 있을 수 있으므로 조건부 import
let SecureStore: any = null;
try {
  SecureStore = require('expo-secure-store');
  console.log('✅ expo-secure-store 사용 가능');
} catch (error) {
  console.warn(
    '⚠️ expo-secure-store를 사용할 수 없습니다. AsyncStorage를 사용합니다.'
  );
}

// 저장 방식 선택: expo-secure-store가 있으면 사용, 없으면 AsyncStorage 사용
const useSecureStore = SecureStore !== null;

// 저장할 키 상수 정의
const KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_INFO: 'userInfo',
} as const;

/**
 * 안전한 데이터 저장 (SecureStore 또는 AsyncStorage)
 * @param key 저장 키
 * @param value 저장할 값
 */
const setItemAsync = async (key: string, value: string): Promise<void> => {
  if (useSecureStore) {
    await SecureStore.setItemAsync(key, value);
  } else {
    await AsyncStorage.setItem(key, value);
  }
};

/**
 * 안전한 데이터 조회 (SecureStore 또는 AsyncStorage)
 * @param key 조회 키
 * @returns 저장된 값 또는 null
 */
const getItemAsync = async (key: string): Promise<string | null> => {
  if (useSecureStore) {
    return await SecureStore.getItemAsync(key);
  } else {
    return await AsyncStorage.getItem(key);
  }
};

/**
 * 안전한 데이터 삭제 (SecureStore 또는 AsyncStorage)
 * @param key 삭제할 키
 */
const deleteItemAsync = async (key: string): Promise<void> => {
  if (useSecureStore) {
    await SecureStore.deleteItemAsync(key);
  } else {
    await AsyncStorage.removeItem(key);
  }
};

/**
 * Access Token 저장
 * @param token Access Token 문자열
 */
export const saveAccessToken = async (token: string): Promise<void> => {
  try {
    console.log(
      `🔐 Access Token 저장 시작 (${useSecureStore ? 'SecureStore' : 'AsyncStorage'})`
    );
    await setItemAsync(KEYS.ACCESS_TOKEN, token);
    console.log('✅ Access Token 저장 성공');
  } catch (error) {
    console.error('❌ Access Token 저장 실패:', error);
    throw new Error('토큰 저장에 실패했습니다.');
  }
};

/**
 * Access Token 조회
 * @returns Access Token 문자열 또는 null
 */
export const getAccessToken = async (): Promise<string | null> => {
  try {
    console.log(
      `🔐 Access Token 조회 시작 (${useSecureStore ? 'SecureStore' : 'AsyncStorage'})`
    );
    const token = await getItemAsync(KEYS.ACCESS_TOKEN);
    console.log(
      '✅ Access Token 조회 결과:',
      token ? '토큰 존재' : '토큰 없음'
    );
    return token;
  } catch (error) {
    console.error('❌ Access Token 조회 실패:', error);
    return null;
  }
};

/**
 * Refresh Token 저장
 * @param token Refresh Token 문자열
 */
export const saveRefreshToken = async (token: string): Promise<void> => {
  try {
    console.log(
      `🔐 Refresh Token 저장 시작 (${useSecureStore ? 'SecureStore' : 'AsyncStorage'})`
    );
    await setItemAsync(KEYS.REFRESH_TOKEN, token);
    console.log('✅ Refresh Token 저장 성공');
  } catch (error) {
    console.error('❌ Refresh Token 저장 실패:', error);
    throw new Error('리프레시 토큰 저장에 실패했습니다.');
  }
};

/**
 * Refresh Token 조회
 * @returns Refresh Token 문자열 또는 null
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    console.log(
      `🔐 Refresh Token 조회 시작 (${useSecureStore ? 'SecureStore' : 'AsyncStorage'})`
    );
    const token = await getItemAsync(KEYS.REFRESH_TOKEN);
    console.log(
      '✅ Refresh Token 조회 결과:',
      token ? '토큰 존재' : '토큰 없음'
    );
    return token;
  } catch (error) {
    console.error('❌ Refresh Token 조회 실패:', error);
    return null;
  }
};

/**
 * 사용자 정보 저장
 * @param userInfo 사용자 정보 객체
 */
export const saveUserInfo = async (userInfo: object): Promise<void> => {
  try {
    console.log(
      `🔐 사용자 정보 저장 시작 (${useSecureStore ? 'SecureStore' : 'AsyncStorage'})`
    );
    console.log('🔐 저장할 사용자 정보:', JSON.stringify(userInfo, null, 2));
    await setItemAsync(KEYS.USER_INFO, JSON.stringify(userInfo));
    console.log('✅ 사용자 정보 저장 성공');
  } catch (error) {
    console.error('❌ 사용자 정보 저장 실패:', error);
    throw new Error('사용자 정보 저장에 실패했습니다.');
  }
};

/**
 * 사용자 정보 조회
 * @returns 사용자 정보 객체 또는 null
 */
export const getUserInfo = async (): Promise<object | null> => {
  try {
    console.log(
      `🔐 사용자 정보 조회 시작 (${useSecureStore ? 'SecureStore' : 'AsyncStorage'})`
    );
    const userInfoString = await getItemAsync(KEYS.USER_INFO);

    if (!userInfoString) {
      console.log('✅ 사용자 정보 조회 결과: 정보 없음');
      return null;
    }

    const userInfo = JSON.parse(userInfoString);
    console.log('✅ 사용자 정보 조회 성공:', JSON.stringify(userInfo, null, 2));
    return userInfo;
  } catch (error) {
    console.error('❌ 사용자 정보 조회 실패:', error);
    return null;
  }
};

/**
 * Access Token 삭제
 */
export const deleteAccessToken = async (): Promise<void> => {
  try {
    console.log(
      `🗑️ Access Token 삭제 시작 (${useSecureStore ? 'SecureStore' : 'AsyncStorage'})`
    );
    await deleteItemAsync(KEYS.ACCESS_TOKEN);
    console.log('✅ Access Token 삭제 성공');
  } catch (error) {
    console.error('❌ Access Token 삭제 실패:', error);
  }
};

/**
 * Refresh Token 삭제
 */
export const deleteRefreshToken = async (): Promise<void> => {
  try {
    console.log(
      `🗑️ Refresh Token 삭제 시작 (${useSecureStore ? 'SecureStore' : 'AsyncStorage'})`
    );
    await deleteItemAsync(KEYS.REFRESH_TOKEN);
    console.log('✅ Refresh Token 삭제 성공');
  } catch (error) {
    console.error('❌ Refresh Token 삭제 실패:', error);
  }
};

/**
 * 사용자 정보 삭제
 */
export const deleteUserInfo = async (): Promise<void> => {
  try {
    console.log(
      `🗑️ 사용자 정보 삭제 시작 (${useSecureStore ? 'SecureStore' : 'AsyncStorage'})`
    );
    await deleteItemAsync(KEYS.USER_INFO);
    console.log('✅ 사용자 정보 삭제 성공');
  } catch (error) {
    console.error('❌ 사용자 정보 삭제 실패:', error);
  }
};

/**
 * 모든 저장된 데이터 삭제 (로그아웃 시 사용)
 */
export const clearAllSecureData = async (): Promise<void> => {
  console.log(
    `🧹 모든 보안 데이터 삭제 시작 (${useSecureStore ? 'SecureStore' : 'AsyncStorage'})`
  );

  await Promise.all([
    deleteAccessToken(),
    deleteRefreshToken(),
    deleteUserInfo(),
  ]);

  console.log('✅ 모든 보안 데이터 삭제 완료');
};

/**
 * 토큰 존재 여부 확인 (Access Token만 있어도 유효로 판단)
 * @returns boolean
 */
export const hasValidTokens = async (): Promise<boolean> => {
  try {
    console.log(
      `🔍 토큰 유효성 확인 시작 (${useSecureStore ? 'SecureStore' : 'AsyncStorage'})`
    );

    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();

    // Access Token만 있어도 유효한 것으로 판단
    const hasTokens = !!accessToken;
    console.log(
      '🔍 토큰 유효성 확인 결과:',
      hasTokens ? '유효한 토큰 존재' : '토큰 없음'
    );
    console.log(
      `🔍 토큰 상세: Access(${accessToken ? '존재' : '없음'}), Refresh(${refreshToken ? '존재' : '없음'})`
    );

    return hasTokens;
  } catch (error) {
    console.error('❌ 토큰 유효성 확인 실패:', error);
    return false;
  }
};
