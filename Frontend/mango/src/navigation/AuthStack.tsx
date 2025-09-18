import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import LoginScreen from '../screens/login/LoginScreen';
import SignupCompleteScreen from '../screens/signup/SignupCompleteScreen';
import SignupScreen from '../screens/signup/SignupScreen';

const Stack = createStackNavigator();

interface AuthStackProps {
  onLoginSuccess: () => void;
}

export default function AuthStack({ onLoginSuccess }: AuthStackProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="SignupComplete">
        {() => <SignupCompleteScreen onLoginSuccess={onLoginSuccess} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
