import axios from 'axios';
import { getAccessToken } from '../utils/secureStorage';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
  },
  timeout: 10000, // 10초 타임아웃
});

apiClient.interceptors.request.use(
  async config => {
    // 인증이 필요없는 엔드포인트 목록
    const publicEndpoints = ['/auth/login', '/auth/signup'];
    const isPublicEndpoint = publicEndpoints.some(endpoint =>
      config.url?.includes(endpoint)
    );

    // 토큰이 필요한 요청에만 자동으로 Authorization 헤더 추가
    if (!isPublicEndpoint) {
      try {
        const token = await getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn('⚠️ 토큰 조회 실패:', error);
      }
    } else {
      console.log('🔓 공개 엔드포인트 - 토큰 제외');
    }

    return config;
  },
  error => {
    console.error('❌ 요청 인터셉터 오류:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가 (토큰 만료 처리 + 디버깅)
apiClient.interceptors.response.use(
  response => {
    // console.log('📥 API 응답 성공:', {
    //   status: response.status,
    //   statusText: response.statusText,
    //   url: response.config?.url,
    //   data: response.data,
    // });
    return response;
  },
  error => {
    // console.error('📥 API 응답 오류:', {
    //   status: error.response?.status,
    //   statusText: error.response?.statusText,
    //   data: error.response?.data,
    //   url: error.config?.url,
    //   message: error.message,
    // });

    // 401 에러 (토큰 만료) 처리
    if (error.response?.status === 401) {
      console.warn('🔐 인증 토큰 만료 감지');
      // TODO: 추후 refresh token으로 토큰 갱신 로직 구현
      // 현재는 로그아웃 처리만 수행
    }

    return Promise.reject(error);
  }
);

export default apiClient;
