import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

// 화면 컴포넌트들
import HomeScreen from '../screens/home/HomeScreen';
import CategoryStack from './CategoryStack';
import ChatStack from './ChatStack';
import MangoStack from './MangoStack';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

interface TabNavigatorProps {
  onLogout: () => void;
}

export default function TabNavigator({ onLogout }: TabNavigatorProps) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Category') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Mango') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6D60',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" options={{ tabBarLabel: '홈' }}>
        {() => <HomeScreen onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen name="Category" options={{ tabBarLabel: '카테고리' }}>
        {() => <CategoryStack onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen name="Mango" options={{ tabBarLabel: '망고' }}>
        {() => <MangoStack onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen name="Chat" options={{ tabBarLabel: '채팅' }}>
        {() => <ChatStack onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen name="Profile" options={{ tabBarLabel: '프로필' }}>
        {() => <ProfileStack onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
