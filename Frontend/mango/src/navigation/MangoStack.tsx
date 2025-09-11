import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import MangoScreen from '../screens/mango/MangoScreen';
import ProfileDetailScreen from '../screens/profile/ProfileDetailScreen';

const Stack = createStackNavigator();

interface MangoStackProps {
  onLogout: () => void;
}

export default function MangoStack({ onLogout }: MangoStackProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MangoHome">
        {() => <MangoScreen onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
    </Stack.Navigator>
  );
}
