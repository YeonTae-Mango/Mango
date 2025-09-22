import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';

import AuthStack from './src/navigation/AuthStack';
import MainStack from './src/navigation/MainStack';

// React Query 클라이언트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분
    },
  },
});

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          {isLoggedIn ? (
            <MainStack onLogout={handleLogout} />
          ) : (
            <AuthStack onLoginSuccess={handleLoginSuccess} />
          )}
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
