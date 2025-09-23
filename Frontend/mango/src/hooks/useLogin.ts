import { useCallback, useMemo, useState } from 'react';
import {
  LoginRequest,
  loginUser,
  validateLoginData,
} from '../api/login/loginApi';
import { useAuthStore } from '../store/authStore';

// 로그인 훅의 상태 타입
interface UseLoginState {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

// 로그인 훅의 반환 타입
interface UseLoginReturn extends UseLoginState {
  login: (loginData: LoginRequest) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

/**
 * 로그인 커스텀 훅
 * @returns UseLoginReturn
 */
export const useLogin = (): UseLoginReturn => {
  const [state, setState] = useState<UseLoginState>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  const { setAuth } = useAuthStore();

  // 초기화 로그는 한 번만 출력하도록 useMemo 사용
  useMemo(() => {
    console.log('🔑 useLogin 훅 초기화');
    return true;
  }, []);

  /**
   * 로그인 실행 함수
   * @param loginData 로그인 데이터
   */
  const login = useCallback(
    async (loginData: LoginRequest): Promise<void> => {
      console.log('🚀 로그인 프로세스 시작');
      console.log('🚀 입력받은 데이터:', JSON.stringify(loginData, null, 2));

      // 로딩 상태 시작
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        isSuccess: false,
      }));

      try {
        // 1. 클라이언트 사이드 유효성 검사
        console.log('🔍 클라이언트 사이드 유효성 검사 시작');
        const validationErrors = validateLoginData(loginData);

        if (validationErrors.length > 0) {
          const errorMessage = validationErrors.join('\n');
          console.error('❌ 유효성 검사 실패:', errorMessage);

          setState(prev => ({
            ...prev,
            isLoading: false,
            error: errorMessage,
            isSuccess: false,
          }));
          return;
        }

        console.log('✅ 클라이언트 사이드 유효성 검사 통과');

        // 2. API 호출
        console.log('📡 서버에 로그인 요청 전송');
        const response = await loginUser(loginData);

        console.log('🎉 로그인 성공!');
        console.log('🎉 서버 응답:', JSON.stringify(response, null, 2));

        // 3. 로그인 성공 - loginUser 함수에서 이미 사용자 정보 저장 처리됨
        console.log('🎉 로그인 성공! 메인 화면으로 이동');

        // 성공 상태 업데이트
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: null,
          isSuccess: true,
        }));
      } catch (error: any) {
        console.error('💥 로그인 실패:', error);

        const errorMessage = error.message || '로그인 중 오류가 발생했습니다.';
        console.error('💥 에러 메시지:', errorMessage);

        // 에러 상태 업데이트
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
          isSuccess: false,
        }));
      }
    },
    [setAuth]
  );

  /**
   * 에러 상태 초기화
   */
  const clearError = useCallback((): void => {
    console.log('🧹 에러 상태 초기화');
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  /**
   * 전체 상태 초기화
   */
  const reset = useCallback((): void => {
    console.log('🔄 로그인 상태 전체 초기화');
    setState({
      isLoading: false,
      error: null,
      isSuccess: false,
    });
  }, []);

  return useMemo(
    () => ({
      ...state,
      login,
      clearError,
      reset,
    }),
    [state, login, clearError, reset]
  );
};

/**
 * 로그인 폼 데이터를 API 요청 형식으로 변환하는 유틸리티 함수
 * @param formData BaseScreen에서 사용하는 폼 데이터
 * @returns LoginRequest API 요청에 맞는 형식
 */
export const transformFormDataToLoginRequest = (formData: {
  email: string;
  password: string;
  fcmToken?: string;
}): LoginRequest => {
  console.log('🔄 폼 데이터를 API 요청 형식으로 변환');
  console.log('🔄 원본 폼 데이터:', JSON.stringify(formData, null, 2));

  const loginRequest: LoginRequest = {
    email: formData.email,
    password: formData.password,
    fcmToken: formData.fcmToken,
  };

  // console.log(
  //   '🔄 변환된 API 요청 데이터:',
  //   JSON.stringify(loginRequest, null, 2)
  // );

  return loginRequest;
};
