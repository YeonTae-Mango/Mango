import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import NotificationScreen from '../screens/notification/NotificationScreen';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

interface MainStackProps {
  onLogout: () => void;
}

export default function MainStack({ onLogout }: MainStackProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main">
        {() => <TabNavigator onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="Notification" component={NotificationScreen} />
    </Stack.Navigator>
  );
}
