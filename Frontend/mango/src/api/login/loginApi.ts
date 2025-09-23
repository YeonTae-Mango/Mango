import apiClient from '../client.js';
import { useAuthStore } from '../../store/authStore';

// 로그인 요청 타입 정의
export interface LoginRequest {
  email: string;
  password: string;
  fcmToken?: string;
}

// 로그인 응답 타입 정의
export interface LoginResponse {
  status: string;
  message: string;
  data: {
    userId: number;
    email: string;
    nickname: string;
    token: string;
    createdAt: string;
  };
}

// 에러 응답 타입 정의
export interface LoginErrorResponse {
  status: string;
  message: string;
  errorCode?: string;
}

/**
 * 로그인 API 호출 함수
 * @param loginData 로그인에 필요한 데이터
 * @returns Promise<LoginResponse>
 */
export const loginUser = async (
  loginData: LoginRequest
): Promise<LoginResponse> => {
  console.log('🔑 로그인 API 호출 시작');
  console.log('🔑 전송할 데이터:', JSON.stringify(loginData, null, 2));

  try {
    console.log('🔑 API 요청 URL:', `${apiClient.defaults.baseURL}/auth/login`);

    const response = await apiClient.post<LoginResponse>(
      '/auth/login',
      loginData
    );

    console.log('✅ 로그인 API 호출 성공');
    console.log('✅ 응답 상태:', response.status);
    console.log('✅ 응답 데이터:', JSON.stringify(response.data, null, 2));

    // 로그인 성공 시 사용자 정보와 토큰 저장
    if (response.data) {
      console.log('🔑 로그인 응답 처리 시작');

      const userData = response.data.data;
      const user = {
        id: userData.userId,
        email: userData.email,
        nickname: userData.nickname,
        createdAt: userData.createdAt,
      };

      console.log('🔑 최종 사용자 객체:', JSON.stringify(user, null, 2));
      console.log('🔑 사용자 ID 확인:', user.id);
      console.log('🔑 토큰 확인:', userData.token ? '있음' : '없음');

      // Zustand 스토어의 setAuth 함수 사용
      const { setAuth } = useAuthStore.getState();

      // 토큰과 함께 인증 정보 저장
      await setAuth(user, userData.token, '');
      console.log('✅ 로그인 완료 - 사용자 정보와 토큰 저장됨');
    }

    return response.data;
  } catch (error: any) {
    console.error('❌ 로그인 API 호출 실패');

    if (error.response) {
      // 서버에서 응답을 받았지만 에러 상태 코드
      console.error('❌ 서버 응답 에러:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
      });

      // 401 에러 (이메일/비밀번호 불일치)
      if (error.response.status === 401) {
        throw new Error(
          error.response.data?.message ||
            '이메일 또는 비밀번호가 올바르지 않습니다.'
        );
      }

      // 409 에러 (프로필 이미지 미설정)
      if (error.response.status === 409) {
        throw new Error(
          error.response.data?.message || '프로필 이미지를 설정해주세요.'
        );
      }

      // 기타 서버 에러
      throw new Error(error.response.data?.message || '로그인에 실패했습니다.');
    } else if (error.request) {
      // 요청이 전송되었지만 응답을 받지 못함
      console.error('❌ 네트워크 에러 - 응답 없음:', error.request);
      throw new Error(
        '서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.'
      );
    } else {
      // 요청 설정 중 에러 발생
      console.error('❌ 요청 설정 에러:', error.message);
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};

/**
 * 로그인 데이터 유효성 검사
 * @param data 검증할 로그인 데이터
 * @returns string[] 에러 메시지 배열
 */
export const validateLoginData = (data: Partial<LoginRequest>): string[] => {
  console.log('🔍 로그인 데이터 유효성 검사 시작');
  console.log('🔍 검사할 데이터:', JSON.stringify(data, null, 2));

  const errors: string[] = [];

  // 이메일 검증
  if (!data.email) {
    errors.push('이메일을 입력해주세요.');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('올바른 이메일 형식이 아닙니다.');
  }

  // 비밀번호 검증
  if (!data.password) {
    errors.push('비밀번호를 입력해주세요.');
  } else if (data.password.length < 6) {
    errors.push('비밀번호는 최소 6자 이상이어야 합니다.');
  }

  console.log(
    '🔍 유효성 검사 결과:',
    errors.length === 0 ? '✅ 통과' : `❌ ${errors.length}개 오류`
  );
  if (errors.length > 0) {
    console.log('🔍 오류 목록:', errors);
  }

  return errors;
};
