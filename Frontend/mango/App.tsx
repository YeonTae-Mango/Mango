import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';

import AuthStack from './src/navigation/AuthStack';
import MainStack from './src/navigation/MainStack';
import { useAuthStore } from './src/store/authStore';

// React Query 클라이언트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 15 * 60 * 1000, // 15분 (차트 데이터는 자주 변하지 않음)
      gcTime: 30 * 60 * 1000, // 30분
      refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 리페치 비활성화
      refetchOnMount: false, // 마운트 시 자동 리페치 비활성화 (캐시된 데이터 사용)
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프
    },
  },
});

export default function App() {
  const {
    isAuthenticated,
    isLoading,
    isSignupInProgress,
    restoreAuth,
    clearAuth,
  } = useAuthStore();

  // 앱 시작 시 저장된 인증 정보 복원
  useEffect(() => {
    restoreAuth();
  }, [restoreAuth]);

  const handleLogout = async () => {
    await clearAuth();
  };

  const handleLoginSuccess = () => {
    // 로그인 성공 시 별도 처리 불필요 (authStore에서 자동 처리)
  };

  // 로딩 중일 때 스플래시 화면 표시
  if (isLoading) {
    return (
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
            }}
          >
            <ActivityIndicator size="large" color="#ff6b6b" />
          </View>
        </SafeAreaProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          {isAuthenticated && !isSignupInProgress ? (
            <MainStack onLogout={handleLogout} />
          ) : (
            <AuthStack onLoginSuccess={handleLoginSuccess} />
          )}
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
