import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';

import AuthStack from './src/navigation/AuthStack';
import MainStack from './src/navigation/MainStack';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isLoggedIn ? (
          <MainStack onLogout={handleLogout} />
        ) : (
          <AuthStack onLoginSuccess={handleLoginSuccess} />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
