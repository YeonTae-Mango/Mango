import { useState, useCallback, useMemo } from 'react';
import {
  signupUser,
  validateSignupData,
  SignupRequest,
} from '../api/signup/signupApi';
import { useAuthStore } from '../store/authStore';

// 회원가입 훅의 상태 타입
interface UseSignupState {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

// 회원가입 훅의 반환 타입
interface UseSignupReturn extends UseSignupState {
  signup: (signupData: SignupRequest) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

/**
 * 회원가입 커스텀 훅
 * @returns UseSignupReturn
 */
export const useSignup = (): UseSignupReturn => {
  const [state, setState] = useState<UseSignupState>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  const { setAuth } = useAuthStore();

  // 초기화 로그는 한 번만 출력하도록 useMemo 사용
  useMemo(() => {
    console.log('🎣 useSignup 훅 초기화');
    return true;
  }, []);

  /**
   * 회원가입 실행 함수
   * @param signupData 회원가입 데이터
   */
  const signup = useCallback(
    async (signupData: SignupRequest): Promise<void> => {
      console.log('🚀 회원가입 프로세스 시작');
      console.log('🚀 입력받은 데이터:', JSON.stringify(signupData, null, 2));

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
        const validationErrors = validateSignupData(signupData);

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
        console.log('📡 서버에 회원가입 요청 전송');
        const response = await signupUser(signupData);

        console.log('🎉 회원가입 성공!');
        console.log('🎉 서버 응답:', JSON.stringify(response, null, 2));

        // 3. 회원가입 성공 - signupApi에서 토큰 저장 및 회원가입 진행 상태 설정 완료
        console.log('🎉 회원가입 성공! 완료 화면으로 이동');

        // 성공 상태 업데이트
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: null,
          isSuccess: true,
        }));
      } catch (error: any) {
        console.error('💥 회원가입 실패:', error);

        const errorMessage =
          error.message || '회원가입 중 오류가 발생했습니다.';
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
    console.log('🔄 회원가입 상태 전체 초기화');
    setState({
      isLoading: false,
      error: null,
      isSuccess: false,
    });
  }, []);

  return useMemo(
    () => ({
      ...state,
      signup,
      clearError,
      reset,
    }),
    [state, signup, clearError, reset]
  );
};

/**
 * 회원가입 폼 데이터를 API 요청 형식으로 변환하는 유틸리티 함수
 * @param formData SignupScreen에서 사용하는 폼 데이터
 * @returns SignupRequest API 요청에 맞는 형식
 */
export const transformFormDataToSignupRequest = (formData: {
  email: string;
  password: string;
  birthdate: string;
  gender: 'male' | 'female' | '';
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  radius: number;
}): SignupRequest => {
  console.log('🔄 폼 데이터를 API 요청 형식으로 변환');
  console.log('🔄 원본 폼 데이터:', JSON.stringify(formData, null, 2));

  // 닉네임은 이메일의 @ 앞부분을 기본값으로 사용 (추후 별도 입력 필드 추가 가능)
  const nickname = formData.email.split('@')[0];

  // birthdate 형식 변환: "2000 / 09 / 22" → "2000-09-22"
  const formatBirthDate = (birthdate: string): string => {
    // 공백과 슬래시를 제거하고 하이픈으로 변경
    const cleaned = birthdate.replace(/\s/g, '').replace(/\//g, '-');
    console.log(`📅 생년월일 형식 변환: "${birthdate}" → "${cleaned}"`);
    return cleaned;
  };

  const signupRequest: SignupRequest = {
    email: formData.email,
    nickname: nickname,
    password: formData.password,
    birthDate: formatBirthDate(formData.birthdate),
    gender: formData.gender,
    latitude: formData.latitude,
    longitude: formData.longitude,
    sido: formData.city,
    sigungu: formData.district,
    distance: formData.radius,
  };

  console.log(
    '🔄 변환된 API 요청 데이터:',
    JSON.stringify(signupRequest, null, 2)
  );

  return signupRequest;
};
