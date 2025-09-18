import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import SignupAccountCompleteScreen from '../screens/signup/SignupAccountCompleteScreen';
import SignupAccountScreen from '../screens/signup/SignupAccountScreen';
import SignupCompleteScreen from '../screens/signup/SignupCompleteScreen';
import SignupProfilePhotoScreen from '../screens/signup/SignupProfilePhotoScreen';
import SignupScreen from '../screens/signup/SignupScreen';
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
      <Stack.Screen name="Base">
        {() => <BaseScreen onLoginSuccess={onLoginSuccess} />}
      </Stack.Screen>
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="SignupComplete" component={SignupCompleteScreen} />
      <Stack.Screen
        name="SignupProfilePhoto"
        component={SignupProfilePhotoScreen}
      />
      <Stack.Screen name="SignupAccount" component={SignupAccountScreen} />
      <Stack.Screen name="SignupAccountComplete">
        {() => <SignupAccountCompleteScreen onLoginSuccess={onLoginSuccess} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
