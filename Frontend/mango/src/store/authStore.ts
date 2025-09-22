import { create } from 'zustand';
import {
  saveAccessToken,
  saveRefreshToken,
  saveUserInfo,
  getAccessToken,
  getRefreshToken,
  getUserInfo,
  clearAllSecureData,
  hasValidTokens,
} from '../utils/secureStorage';

// 사용자 정보 타입 (추후 서버 응답에 맞게 수정 필요)
export interface User {
  id?: number;
  email?: string;
  nickname?: string;
  profileImage?: string;
  // 추가 필드들...
}

// 인증 상태 인터페이스
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// 인증 액션 인터페이스
interface AuthActions {
  // 로그인 성공 시 호출
  setAuth: (
    user: User,
    accessToken: string,
    refreshToken?: string
  ) => Promise<void>;
  // 토큰만 업데이트 (토큰 갱신 시)
  setTokens: (accessToken: string, refreshToken?: string) => Promise<void>;
  // 사용자 정보만 업데이트
  setUser: (user: User) => Promise<void>;
  // 로그아웃
  clearAuth: () => Promise<void>;
  // 앱 시작 시 저장된 인증 정보 복원
  restoreAuth: () => Promise<void>;
  // 로딩 상태 설정
  setLoading: (loading: boolean) => void;
}

// 전체 스토어 타입
type AuthStore = AuthState & AuthActions;

/**
 * 인증 관련 전역 상태 관리 스토어
 */
export const useAuthStore = create<AuthStore>((set, get) => ({
  // 초기 상태
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,

  /**
   * 로그인 성공 시 인증 정보 설정
   * @param user 사용자 정보
   * @param accessToken 액세스 토큰
   * @param refreshToken 리프레시 토큰 (선택적)
   */
  setAuth: async (user: User, accessToken: string, refreshToken?: string) => {
    console.log('🔐 인증 정보 설정 시작');
    console.log('🔐 사용자 정보:', JSON.stringify(user, null, 2));
    console.log('🔐 액세스 토큰 존재:', !!accessToken);
    console.log('🔐 리프레시 토큰 존재:', !!refreshToken);

    try {
      // SecureStore에 저장
      await saveAccessToken(accessToken);
      await saveUserInfo(user);

      if (refreshToken) {
        await saveRefreshToken(refreshToken);
      }

      // 상태 업데이트
      set({
        user,
        accessToken,
        refreshToken: refreshToken || get().refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });

      console.log('✅ 인증 정보 설정 완료');
    } catch (error) {
      console.error('❌ 인증 정보 설정 실패:', error);
      throw error;
    }
  },

  /**
   * 토큰만 업데이트 (토큰 갱신 시 사용)
   * @param accessToken 새로운 액세스 토큰
   * @param refreshToken 새로운 리프레시 토큰 (선택적)
   */
  setTokens: async (accessToken: string, refreshToken?: string) => {
    console.log('🔄 토큰 업데이트 시작');
    console.log('🔄 새 액세스 토큰 존재:', !!accessToken);
    console.log('🔄 새 리프레시 토큰 존재:', !!refreshToken);

    try {
      await saveAccessToken(accessToken);

      if (refreshToken) {
        await saveRefreshToken(refreshToken);
      }

      set({
        accessToken,
        refreshToken: refreshToken || get().refreshToken,
      });

      console.log('✅ 토큰 업데이트 완료');
    } catch (error) {
      console.error('❌ 토큰 업데이트 실패:', error);
      throw error;
    }
  },

  /**
   * 사용자 정보만 업데이트
   * @param user 새로운 사용자 정보
   */
  setUser: async (user: User) => {
    console.log('👤 사용자 정보 업데이트 시작');
    console.log('👤 새 사용자 정보:', JSON.stringify(user, null, 2));

    try {
      await saveUserInfo(user);

      set({ user });

      console.log('✅ 사용자 정보 업데이트 완료');
    } catch (error) {
      console.error('❌ 사용자 정보 업데이트 실패:', error);
      throw error;
    }
  },

  /**
   * 로그아웃 (모든 인증 정보 삭제)
   */
  clearAuth: async () => {
    console.log('🚪 로그아웃 시작');

    try {
      // SecureStore에서 모든 데이터 삭제
      await clearAllSecureData();

      // 상태 초기화
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });

      console.log('✅ 로그아웃 완료');
    } catch (error) {
      console.error('❌ 로그아웃 실패:', error);
      throw error;
    }
  },

  /**
   * 앱 시작 시 저장된 인증 정보 복원
   */
  restoreAuth: async () => {
    console.log('🔄 저장된 인증 정보 복원 시작');

    set({ isLoading: true });

    try {
      // 토큰 존재 여부 확인
      const hasTokens = await hasValidTokens();

      if (!hasTokens) {
        console.log('ℹ️ 저장된 토큰이 없음');
        set({ isLoading: false });
        return;
      }

      // 저장된 데이터 복원
      const [accessToken, refreshToken, userInfo] = await Promise.all([
        getAccessToken(),
        getRefreshToken(),
        getUserInfo(),
      ]);

      if (accessToken && userInfo) {
        set({
          user: userInfo as User,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });

        console.log('✅ 인증 정보 복원 완료');
        console.log('✅ 복원된 사용자:', JSON.stringify(userInfo, null, 2));
      } else {
        console.log('⚠️ 불완전한 인증 정보 - 초기화');
        await get().clearAuth();
      }
    } catch (error) {
      console.error('❌ 인증 정보 복원 실패:', error);
      await get().clearAuth();
    }
  },

  /**
   * 로딩 상태 설정
   * @param loading 로딩 상태
   */
  setLoading: (loading: boolean) => {
    console.log('⏳ 로딩 상태 변경:', loading);
    set({ isLoading: loading });
  },
}));
