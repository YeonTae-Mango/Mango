import { NavigationContainer } from '@react-navigation/native';
import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';

import AuthStack from './src/navigation/AuthStack';
import MainStack from './src/navigation/MainStack';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 로그인 상태

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isLoggedIn ? <MainStack onLogout={handleLogout} /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
