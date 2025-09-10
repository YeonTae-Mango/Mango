import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import MyPatternScreen from '../screens/profile/MyPatternScreen';
import ProfileEditScreen from '../screens/profile/ProfileEditScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Stack = createStackNavigator();

interface ProfileStackProps {
  onLogout: () => void;
}

export default function ProfileStack({ onLogout }: ProfileStackProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileMain">
        {() => <ProfileScreen onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <Stack.Screen name="MyPattern" component={MyPatternScreen} />
    </Stack.Navigator>
  );
}
