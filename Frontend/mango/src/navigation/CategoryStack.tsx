import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import CategoryScreen from '../screens/category/CategoryScreen';
import CategorySwipeScreen from '../screens/category/CategorySwipeScreen';

const Stack = createStackNavigator();

interface CategoryStackProps {
  onLogout: () => void;
}

export default function CategoryStack({ onLogout }: CategoryStackProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CategoryMain">
        {() => <CategoryScreen onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="CategorySwipe">
        {() => <CategorySwipeScreen onLogout={onLogout} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
