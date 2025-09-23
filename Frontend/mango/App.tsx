import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';

import AuthStack from './src/navigation/AuthStack';
import MainStack from './src/navigation/MainStack';
import chatService from './src/services/chatService';
import { useAuthStore } from './src/store/authStore';
import { ChatNotificationDTO } from './src/types/chat';

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

  // 사용자가 로그인된 상태일 때 자동으로 WebSocket 연결 및 개인 알림 구독
  useEffect(() => {
    if (isAuthenticated) {
      const { user } = useAuthStore.getState();
      if (user?.id) {
        console.log('🔌 사용자 로그인됨 - WebSocket 자동 연결 시도');

        chatService
          .connect()
          .then(() => {
            console.log('✅ WebSocket 연결 완료');

            // WebSocket 연결 완료 후 즉시 개인 알림 구독
            try {
              console.log('🔔 개인 알림 구독 시작 - 사용자 ID:', user.id);

              chatService.subscribeToPersonalNotifications(
                user.id!,
                (notification: ChatNotificationDTO) => {
                  console.log('� App.tsx - 기본 개인 알림 수신');
                  // ChatListScreen에서 상세 로그 처리
                }
              );
            } catch (subscribeError) {
              console.error('❌ 개인 알림 구독 실패:', subscribeError);
            }
          })
          .catch(error => {
            console.error('❌ 앱 시작 시 WebSocket 연결 실패:', error);
          });
      }
    } else {
      // 로그아웃 시 WebSocket 연결 해제
      if (chatService.isConnected) {
        console.log('🔌 사용자 로그아웃됨 - WebSocket 연결 해제');
        chatService.disconnect();
      }
    }
  }, [isAuthenticated]);

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
