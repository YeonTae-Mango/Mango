import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
  },
  timeout: 10000, // 10초 타임아웃
});

// 요청 인터셉터 추가 (디버깅용)
apiClient.interceptors.request.use(
  config => {
    console.log('API 요청:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      headers: config.headers,
      params: config.params,
    });
    return config;
  },
  error => {
    console.error('요청 인터셉터 오류:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가 (디버깅용)
apiClient.interceptors.response.use(
  response => {
    console.log('API 응답 성공:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  error => {
    console.error('API 응답 오류:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export default apiClient;
