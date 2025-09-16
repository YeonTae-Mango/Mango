import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import LoginScreen from '../screens/login/LoginScreen';
import SignupScreen from '../screens/signup/SignupScreen';
import SignupCompleteScreen from '../screens/signup/SignupCompleteScreen';
import BaseScreen from '../screens/start/BaseScreen';

const Stack = createStackNavigator();

interface AuthStackProps {
  onLoginSuccess: () => void;
}

export default function AuthStack({ onLoginSuccess }: AuthStackProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Layout 컴포넌트에서 헤더 처리
      }}
    >
      <Stack.Screen name="Base" component={BaseScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="SignupComplete">
        {() => <SignupCompleteScreen onLoginSuccess={onLoginSuccess} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
