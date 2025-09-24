import apiClient from '../client.js';
import { useAuthStore } from '../../store/authStore';

// 회원가입 요청 타입 정의
export interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
  birthDate: string;
  gender: string;
  latitude: number;
  longitude: number;
  sido: string;
  sigungu: string;
  distance: number;
}

// 회원가입 응답 타입 정의
export interface SignupResponse {
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
export interface SignupErrorResponse {
  status: string;
  message: string;
}

/**
 * 회원가입 API 호출 함수
 * @param signupData 회원가입에 필요한 데이터
 * @returns Promise<SignupResponse>
 */
export const signupUser = async (
  signupData: SignupRequest
): Promise<SignupResponse> => {
  console.log('📝 회원가입 API 호출 시작');
  console.log('📝 전송할 데이터:', JSON.stringify(signupData, null, 2));

  try {
    console.log(
      '📝 API 요청 URL:',
      `${apiClient.defaults.baseURL}/auth/signup`
    );

    const response = await apiClient.post<SignupResponse>(
      '/auth/signup',
      signupData
    );

    console.log('✅ 회원가입 API 호출 성공');
    console.log('✅ 응답 상태:', response.status);
    console.log('✅ 응답 데이터:', JSON.stringify(response.data, null, 2));

    // 3. 회원가입 성공 시 사용자 정보 저장 (토큰이 없어도 사용자 정보는 저장)
    if (response.data) {
      console.log('�� 회원가입 응답 처리 시작');

      const userData = response.data.data;
      const user = {
        id: userData.userId,
        email: userData.email,
        nickname: userData.nickname,
        createdAt: userData.createdAt,
      };

      console.log('�� 최종 사용자 객체:', JSON.stringify(user, null, 2));
      console.log('�� 사용자 ID 확인:', user.id);

      // Zustand 스토어의 setAuth 함수 사용
      const { setAuth } = useAuthStore.getState();

      // 회원가입 시 토큰을 저장하되 회원가입 진행 상태로 설정
      if (userData?.token) {
        console.log('🔐 회원가입 완료 - 토큰 저장 및 회원가입 진행 상태 설정');
        await setAuth(user, userData.token);

        // 회원가입 진행 상태로 설정 (isAuthenticated는 true이지만 회원가입 진행 중)
        const { setSignupInProgress } = useAuthStore.getState();
        setSignupInProgress(true);

        console.log(
          '✅ 회원가입 성공 - 토큰 저장 완료, 회원가입 진행 상태 설정'
        );
      } else {
        console.log('⚠️ 토큰이 없습니다');
      }
    }

    return response.data;
  } catch (error: any) {
    console.error('❌ 회원가입 API 호출 실패');

    if (error.response) {
      // 서버에서 응답을 받았지만 에러 상태 코드
      console.error('❌ 서버 응답 에러:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
      });

      // 400 에러 (유효성 검사 실패)
      if (error.response.status === 400) {
        throw new Error(
          error.response.data?.message || '유효성 검사에 실패했습니다.'
        );
      }

      // 기타 서버 에러
      throw new Error(
        error.response.data?.message || '회원가입에 실패했습니다.'
      );
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
 * 회원가입 데이터 유효성 검사
 * @param data 검증할 회원가입 데이터
 * @returns boolean
 */
export const validateSignupData = (data: Partial<SignupRequest>): string[] => {
  console.log('🔍 회원가입 데이터 유효성 검사 시작');
  console.log('🔍 검사할 데이터:', JSON.stringify(data, null, 2));

  const errors: string[] = [];

  // 이메일 검증
  if (!data.email) {
    errors.push('이메일을 입력해주세요.');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('올바른 이메일 형식이 아닙니다.');
  }

  // 닉네임 검증 (추후 추가 가능)
  if (!data.nickname) {
    errors.push('닉네임을 입력해주세요.');
  }

  // 비밀번호 검증
  if (!data.password) {
    errors.push('비밀번호를 입력해주세요.');
  } else if (data.password.length < 6) {
    errors.push('비밀번호는 최소 6자 이상이어야 합니다.');
  }

  // 생년월일 검증 (만 19세 이상)
  if (!data.birthDate) {
    errors.push('생년월일을 입력해주세요.');
  } else {
    try {
      // 생년월일 형식 변환: "2000-09-22" → Date 객체
      const birthDate = new Date(data.birthDate);
      const today = new Date();

      // 만 19세 계산
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 19) {
        errors.push('만 19세 이상만 가입 가능합니다.');
      }
    } catch (error) {
      errors.push('올바른 생년월일 형식이 아닙니다.');
    }
  }

  // 성별 검증
  if (!data.gender) {
    errors.push('성별을 선택해주세요.');
  } else if (!['M', 'F'].includes(data.gender)) {
    errors.push('올바른 성별을 선택해주세요.');
  }

  // 위치 검증
  if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
    errors.push('위치 정보가 올바르지 않습니다.');
  }

  if (!data.sido) {
    errors.push('시/도를 선택해주세요.');
  }

  if (!data.sigungu) {
    errors.push('시/군/구를 선택해주세요.');
  }

  // 거리 검증 (킬로미터 단위)
  if (typeof data.distance !== 'number' || data.distance < 0.1) {
    errors.push('거리는 최소 100m 이상이어야 합니다.');
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
